#![allow(non_snake_case)]

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
