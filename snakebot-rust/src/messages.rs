#![allow(non_snake_case)]
//inbound messages
pub const GAME_ENDED: &'static str =
    "se.cygni.snake.api.event.GameEndedEvent";
pub const TOURNAMENT_ENDED: &'static str =
    "se.cygni.snake.api.event.TournamentEndedEvent";
pub const MAP_UPDATE: &'static str =
    "se.cygni.snake.api.event.MapUpdateEvent";
pub const SNAKE_DEAD: &'static str =
    "se.cygni.snake.api.event.SnakeDeadEvent";
pub const GAME_STARTING: &'static str =
    "se.cygni.snake.api.event.GameStartingEvent";
pub const PLAYER_REGISTERED: &'static str =
    "se.cygni.snake.api.response.PlayerRegistered";
pub const INVALID_PLAYER_NAME: &'static str =
    "se.cygni.snake.api.exception.InvalidPlayerName";
pub const HEART_BEAT_RESPONSE: &'static str =
    "se.cygni.snake.api.request.HeartBeatResponse";

//outbound messages
pub const REGISTER_PLAYER_MESSAGE_TYPE: &'static str =
    "se.cygni.snake.api.request.RegisterPlayer";
pub const START_GAME: &'static str =
    "se.cygni.snake.api.request.StartGame";
pub const REGISTER_MOVE: &'static str =
    "se.cygni.snake.api.request.RegisterMove";
pub const HEART_BEAT_REQUEST: &'static str =
    "se.cygni.snake.api.request.HeartBeatRequest";

// Outbound messages
#[derive(Serialize, Deserialize, Debug)]
pub struct GameSettings {
    pub width: String,
    pub height: String,
    pub maxNoofPlayers: u32,
    pub startSnakeLength: u32,
    pub timeInMsPerTick: u32,
    pub obstaclesEnabled: bool,
    pub foodEnabled: bool,
    pub edgeWrapsAround: bool,
    pub headToTailConsumes: bool,
    pub tailConsumeGrows: bool,
    pub addFoodLikelihood: u32,
    pub removeFoodLikelihood: u32,
    pub addObstacleLikelihood: u32,
    pub removeObstacleLikelihood: u32,
    pub spontaneousGrowthEveryNWorldTick: u32,
    pub trainingGame: bool,
    pub pointsPerLength: u32,
    pub pointsPerFood: u32,
    pub pointsPerCausedDeath: u32,
    pub pointsPerNibble: u32,
    pub pointsLastSnakeLiving: u32,
    pub noofRoundsTailProtectedAfterNibble: u32,
    pub pointsSuicide: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PlayRegistration {
    #[serde(rename="type")]
    pub type_: String,
    pub playerName: String,
    pub gameSettings: GameSettings,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RegisterMove {
    #[serde(rename="type")]
    pub type_: String,
    pub direction: String,
    pub gameTick: u32,
    pub receivingPlayerId: String,
    pub gameId: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StartGame {
    #[serde(rename="type")]
    pub type_: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HeartBeatRequest {
    #[serde(rename="type")]
    pub type_: String,
    pub receivingPlayerId: String
}

//Inbound messages
#[derive(Serialize, Deserialize, Debug)]
pub struct PlayerRegistered {
    #[serde(rename="type")]
    pub type_: String,
    pub gameId: String,
    pub gameMode: String,
    pub receivingPlayerId: String,
    pub name: String,
    pub gameSettings: GameSettings
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MapUpdate {
    #[serde(rename="type")]
    pub type_: String,
    pub receivingPlayerId: String,
    pub gameId: String,
    pub gameTick: u32,
    pub map: Map,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InvalidPlayerName {
    #[serde(rename="type")]
    pub type_: String,
    pub reasonCode: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GameEnded {
    #[serde(rename="type")]
    pub type_: String,
    pub receivingPlayerId: String,
    pub playerWinnerId: String,
    pub gameId: String,
    pub gameTick: u32,
    pub map: Map,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SnakeDead {
    #[serde(rename="type")]
    pub type_: String,
    pub playerId: String,
    pub x: u32,
    pub y: u32,
    pub gameId: String,
    pub gameTick: u32,
    pub deathReason: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GameStarting {
    #[serde(rename="type")]
    pub type_: String,
    pub receivingPlayerId: String,
    pub gameId: String,
    pub noofPlayers: u32,
    pub width: u32,
    pub height: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HeartBeatResponse {
    #[serde(rename="type")]
    pub type_: String,
    pub receivingPlayerId: Option<String>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TournamentEnded {
    #[serde(rename="type")]
    pub type_: String,
    pub playerWinnerId: String,
    pub gameId: String,
    pub gameResult: String,
    pub tournamentName: String,
    pub tournamentId: String,
    pub gameTick: Option<i32>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Map {
    #[serde(rename="type")]
    pub type_: String,
    pub width: i32,
    pub height: i32,
    pub worldTick: u32,
    pub snakeInfos: Vec<SnakeInfo>,
    pub foodPositions: Vec<i32>,
    pub obstaclePositions: Vec<i32>,
    pub receivingPlayerId: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct SnakeInfo {
    pub name: String,
    pub points: i32,
    pub positions: Vec<i32>,
    pub tailProtectedForGameTicks: u32,
    pub id: String
}

pub fn default_gamesettings() -> GameSettings {
    GameSettings {
        width: String::from("MEDIUM"),
        height: String::from("MEDIUM"),
        maxNoofPlayers: 5,
        startSnakeLength: 1,
        timeInMsPerTick: 250,
        obstaclesEnabled: true,
        foodEnabled: true,
        edgeWrapsAround: false,
        headToTailConsumes: true,
        tailConsumeGrows: false,
        addFoodLikelihood: 15,
        removeFoodLikelihood: 5,
        addObstacleLikelihood: 15,
        removeObstacleLikelihood: 15,
        spontaneousGrowthEveryNWorldTick: 3,
        trainingGame: false,
        pointsPerLength: 1,
        pointsPerFood: 2,
        pointsPerCausedDeath: 5,
        pointsPerNibble: 10,
        pointsLastSnakeLiving: 10,
        noofRoundsTailProtectedAfterNibble: 3,
        pointsSuicide: -10,
    }
}
