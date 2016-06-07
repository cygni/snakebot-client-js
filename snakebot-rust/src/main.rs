#![feature(custom_derive, plugin)]
#![plugin(serde_macros)]

extern crate serde_json;
extern crate ws;
extern crate serde;
#[macro_use] extern crate quick_error;
#[macro_use] extern crate log;
extern crate log4rs;

mod messages;
mod snake;
mod util;
mod maputil;

use snake::{ Snake };
use std::string::{ String };
use std::thread;
use std::time::Duration;
use std::sync::mpsc;
use std::sync::Arc;

const HOST: &'static str = "snake.cygni.se";
const PORT: i32 = 80;

const HEART_BEAT_S: u64 = 20;
const LOG_TARGET: &'static str = "client";

quick_error! {
    #[derive(Debug)]
    pub enum ClientError {
        Message(err: serde_json::Error) {
            from()
        }

        Websocket(err: ws::Error) {
            from()
        }

        StringChannel(err: mpsc::SendError<String>) {
            from()
        }

        WebsocketChannel(err: mpsc::SendError<Arc<ws::Sender>>) {
            from()
        }
    }
}

pub fn is_training_mode() -> bool{
    snake::TRAINING_VENUE == snake::get_venue()
}

struct Client {
    out: Arc<ws::Sender>,
    snake: Snake,
    out_sender: mpsc::Sender<Arc<ws::Sender>>,
    id_sender: mpsc::Sender<String>
}

fn route_msg(client: &mut Client, msg: &String) -> Result<(), ClientError> {
    let snake = &mut client.snake;

    if msg.contains(messages::GAME_ENDED) {
        let json_msg: messages::GameEnded = try!(serde_json::from_str(msg));
        snake.on_game_ended(&json_msg);

        if is_training_mode() {
            try!(client.out.close(ws::CloseCode::Normal));
        }
    } else if msg.contains(messages::TOURNAMENT_ENDED) {
        let json_msg: messages::TournamentEnded = try!(serde_json::from_str(msg));
        snake.on_tournament_ended(&json_msg);
        try!(client.out.close(ws::CloseCode::Normal));
    } else if msg.contains(messages::MAP_UPDATE) {
        let json_msg: messages::MapUpdate = try!(serde_json::from_str(msg));
        let direction = snake.get_next_move(&json_msg);

        let response = messages::RegisterMove {
            type_: String::from(messages::REGISTER_MOVE),
            direction: maputil::direction_as_string(&direction),
            gameTick: json_msg.gameTick,
            receivingPlayerId: json_msg.receivingPlayerId,
            gameId: json_msg.gameId
        };
        debug!(target: LOG_TARGET, "Responding with RegisterMove {:?}", response);

        let response = try!(serde_json::to_string(&response));
        try!(client.out.send(response));
    } else if msg.contains(messages::SNAKE_DEAD) {
        let json_msg: messages::SnakeDead = try!(serde_json::from_str(msg));
        snake.on_snake_dead(&json_msg);
    } else if msg.contains(messages::GAME_STARTING) {
        let json_msg: messages::GameStarting = try!(serde_json::from_str(msg));
        snake.on_game_starting(&json_msg);
    } else if msg.contains(messages::PLAYER_REGISTERED) {
        let json_msg: messages::PlayerRegistered = try!(serde_json::from_str(msg));
        info!(target: LOG_TARGET, "Successfully registered player");

        snake.on_player_registered(&json_msg);

        if json_msg.gameMode == "TRAINING" {
            let start_msg = messages::StartGame {
                type_: String::from(messages::START_GAME)
            };
            debug!(target: LOG_TARGET, "Requesting a game start {:?}", start_msg);

            let response = try!(serde_json::to_string(&start_msg));
            try!(client.out.send(response));
        };

        try!(client.out_sender.send(client.out.clone()));
        try!(client.id_sender.send(json_msg.receivingPlayerId));
    } else if msg.contains(messages::INVALID_PLAYER_NAME) {
        let json_msg: messages::InvalidPlayerName = try!(serde_json::from_str(msg));
        snake.on_invalid_playername(&json_msg);
    } else if msg.contains(messages::HEART_BEAT_RESPONSE) {
        // do nothing
        let _: messages::InvalidPlayerName = try!(serde_json::from_str(msg));
    }

    Ok(())
}


impl ws::Handler for Client {
    fn on_open(&mut self, _: ws::Handshake) -> ws::Result<()> {
        debug!(target: LOG_TARGET, "Connection to Websocket opened");

        let message = messages::PlayRegistration {
            type_: String::from(messages::REGISTER_PLAYER_MESSAGE_TYPE),
            playerName: self.snake.get_name(),
            gameSettings: messages::default_gamesettings()
        };

        info!(target: LOG_TARGET, "Registering player with message: {:?}", message);

        let encoded_message = serde_json::to_string(&message).unwrap();
        self.out.send(encoded_message)
    }

    fn on_message(&mut self, msg: ws::Message) -> ws::Result<()> {
        if let ws::Message::Text(text) = msg {
            let route_result = route_msg(self, &text);
            match route_result {
                Err(e) => error!(target: LOG_TARGET, "Got error {} when routing message: {}", e, text),
                Ok(_) => debug!(target: LOG_TARGET, "Succeeded in routing message {}", text)
            }
        } else {
            warn!(target: LOG_TARGET, "Unexpectedly received non-string message: {}", msg)
        }

        Ok(())
    }
}

fn start_websocket_thread(id_sender: mpsc::Sender<String>,
                          out_sender: mpsc::Sender<Arc<ws::Sender>>) -> thread::JoinHandle<()> {

    thread::spawn(move || {
        let connection_url = format!("ws://{}:{}/{}", HOST, PORT, snake::get_venue());

        info!(target: LOG_TARGET, "Connecting to {:?}", connection_url);
        let result = ws::connect(connection_url, |out| {
            Client {
                out: Arc::from(out),
                snake: snake::Snake,
                out_sender: out_sender.clone(),
                id_sender: id_sender.clone()
            }
        });
        debug!(target: LOG_TARGET, "Websocket is done, result {:?}", result);
    })
}

fn start_heart_beat_thread(id_receiver: mpsc::Receiver<String>,
                           out_receiver: mpsc::Receiver<Arc<ws::Sender>>,
                           done_receiver: mpsc::Receiver<()>) -> thread::JoinHandle<()> {
    thread::spawn(move || {
        let id = id_receiver.recv().unwrap();
        let out = out_receiver.recv().unwrap();

        debug!(target: LOG_TARGET, "Starting heartbeat");

        loop {
            thread::sleep(Duration::from_secs(HEART_BEAT_S));
            let rec = done_receiver.try_recv();

            // if the channel is disconnected or a done message is sent, break the loop
            if let Err(e) = rec {
                if e == mpsc::TryRecvError::Disconnected {
                    debug!(target: LOG_TARGET, "Stopping heartbeat due to channel disconnecting");
                    break;
                }
            } else {
                debug!(target: LOG_TARGET, "Stopping heartbeat due to finished execution");
                break;
            }

            let id = id.clone();
            let heart_beat = messages::HeartBeatRequest {
                type_: String::from( messages::HEART_BEAT_REQUEST ),
                receivingPlayerId: id
            };

            debug!(target: LOG_TARGET, "Sending heartbeat request");
            let request = serde_json::to_string(&heart_beat).unwrap();
            let send_result = out.send(request);
            if let Err(e) = send_result {
                error!(target: LOG_TARGET, "Unable to send heartbeat, got error {:?}", e);
            }
        }
    })
}

fn start_client() {
    let (id_sender,id_receiver) = mpsc::channel();
    let (out_sender,out_receiver) = mpsc::channel();
    let (done_sender,done_receiver) = mpsc::channel();

    let websocket = start_websocket_thread(id_sender, out_sender);
    let heartbeat = start_heart_beat_thread(id_receiver, out_receiver, done_receiver);

    let websocket_res = websocket.join();
    debug!(target: LOG_TARGET, "Joining Websocket thread gave result {:?}", websocket_res);

    let send_res = done_sender.send(());
    if let Err(e) = send_res {
        error!(target: LOG_TARGET, "Unable to send done message, got error {:?}", e);
    }

    let heartbeat_res = heartbeat.join();
    debug!(target: LOG_TARGET, "Joining heartbeat thread gave result {:?}", heartbeat_res);

}

fn main() {
    if let Err(_) = log4rs::init_file("log4rs.toml", Default::default()) {
        log4rs::init_file("../log4rs.toml", Default::default()).unwrap();
    }
    start_client();
}
