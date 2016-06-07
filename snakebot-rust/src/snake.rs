use messages;
use maputil::{ Direction };
use util::{ translate_positions };

const LOG_TARGET: &'static str = "snake";

pub struct Snake;

impl Snake {
    pub fn get_name(&self) -> String {
        String::from("rusty-snake")
    }

    pub fn get_next_move(&self, msg: &messages::MapUpdate) -> Direction {
        info!(target: LOG_TARGET, "Game map updated, tick: {}", msg.gameTick);

        let ref map = msg.map;
        let player_id = &msg.receivingPlayerId;
        let snake = map.get_snake_by_id(player_id).unwrap();

        info!(target: LOG_TARGET, "Food can be found at {:?}", translate_positions(&map.foodPositions, map.width));
        info!(target: LOG_TARGET, "My snake positions are {:?}", translate_positions(&snake.positions, map.width));

        let direction = if map.can_snake_move_in_direction(snake, Direction::Down) {
            Direction::Down
        } else if map.can_snake_move_in_direction(snake, Direction::Left) {
            Direction::Left
        } else if map.can_snake_move_in_direction(snake, Direction::Right) {
            Direction::Right
        } else if map.can_snake_move_in_direction(snake, Direction::Up) {
            Direction::Up
        } else {
            // this is bad
            Direction::Down
        };

        debug!(target: LOG_TARGET, "Snake will move in direction {:?}", direction);
        direction
    }

    pub fn on_game_ended(&self, msg: &messages::GameEnded) {
        info!(target: LOG_TARGET, "Game ended, the winner is: {:?}", msg.playerWinnerId);
    }

    pub fn on_snake_dead(&self, msg: &messages::SnakeDead) {
        info!(target: LOG_TARGET, "The snake died, reason was: {:?}", msg.deathReason);
    }

    pub fn on_game_starting(&self, _: &messages::GameStarting) {

    }

    pub fn on_player_registered(&self, _: &messages::PlayerRegistered) {

    }

    pub fn on_invalid_playername(&self, _: &messages::InvalidPlayerName) {

    }
}
