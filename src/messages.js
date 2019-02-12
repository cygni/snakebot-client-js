export const MessageType = Object.freeze({
  // Exceptions
  InvalidMessage: 'se.cygni.snake.api.exception.InvalidMessage',
  InvalidPlayerName: 'se.cygni.snake.api.exception.InvalidPlayerName',
  NoActiveTournament: 'se.cygni.snake.api.exception.NoActiveTournament',

  // Responses
  HeartbeatResponse: 'se.cygni.snake.api.response.HeartBeatResponse',
  PlayerRegistered: 'se.cygni.snake.api.response.PlayerRegistered',

  // Events
  GameLink: 'se.cygni.snake.api.event.GameLinkEvent',
  GameStarting: 'se.cygni.snake.api.event.GameStartingEvent',
  MapUpdate: 'se.cygni.snake.api.event.MapUpdateEvent',
  SnakeDead: 'se.cygni.snake.api.event.SnakeDeadEvent',
  GameResult: 'se.cygni.snake.api.event.GameResultEvent',
  GameEnded: 'se.cygni.snake.api.event.GameEndedEvent',
  TournamentEnded: 'se.cygni.snake.api.event.TournamentEndedEvent',

  // Requests
  ClientInfo: 'se.cygni.snake.api.request.ClientInfo',
  StartGame: 'se.cygni.snake.api.request.StartGame',
  RegisterPlayer: 'se.cygni.snake.api.request.RegisterPlayer',
  RegisterMove: 'se.cygni.snake.api.request.RegisterMove',
  HeartbeatRequest: 'se.cygni.snake.api.request.HeartBeatRequest',
});

export function createClientInfoMessage({
  clientVersion = null,
  operatingSystem = null,
  operatingSystemVersion = null,
} = {}) {
  return {
    type: MessageType.ClientInfo,
    language: 'JavaScript',
    languageVersion: 'ES2018',
    clientVersion,
    operatingSystem,
    operatingSystemVersion,
  };
}

export function createHeartbeatRequestMessage(receivingPlayerId) {
  return { type: MessageType.HeartbeatRequest, receivingPlayerId };
}

export function createRegisterMoveMessage(direction, receivingPlayerId, gameId, gameTick) {
  return { type: MessageType.RegisterMove, direction, receivingPlayerId, gameId, gameTick };
}

export function createRegisterPlayerMessage(playerName, gameSettings = {}) {
  return { type: MessageType.RegisterPlayer, playerName, gameSettings };
}

export function createStartGameMessage() {
  return { type: MessageType.StartGame };
}
