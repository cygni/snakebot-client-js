import type { MessageType } from "./messages.js";
import type { GameMode, GameSettings, RawMap } from "./types.js";

interface MessageBase<Type extends MessageType> {
  type: Type;
  receivingPlayerId: string;
  timestamp: number;
}

type HeartBeatResponseMessage = MessageBase<MessageType.HeartbeatResponse>;

interface PlayerRegisteredMessage extends MessageBase<MessageType.PlayerRegistered> {
  gameId: string;
  name: string;
  gameSettings: GameSettings;
  gameMode: GameMode;
}

interface GameLinkEventMessage extends MessageBase<MessageType.GameLink> {
  url: string;
}

interface GameStartingEventMessage extends MessageBase<MessageType.GameStarting> {
  gameId: string;
  noofPlayers: number;
  width: number;
  height: number;
  gameSettings: GameSettings;
}

interface MapUpdateEventMessage extends MessageBase<MessageType.MapUpdate> {
  gameTick: number;
  gameId: string;
  map: RawMap;
}

interface SnakeDeadEventMessage extends MessageBase<MessageType.SnakeDead> {
  deathReason: string;
  playerId: string;
  x: number;
  y: number;
  gameId: string;
  gameTick: number;
}

interface PlayerRank {
  playerName: string;
  playerId: string;
  rank: number;
  points: number;
  alive: boolean;
}

interface GameResultEventMessage extends MessageBase<MessageType.GameResult> {
  gameId: string;
  playerRanks: PlayerRank[];
}

interface GameEndedEventMessage extends MessageBase<MessageType.GameEnded> {
  playerWinnerId: string;
  playerWinnerName: string;
  gameId: string;
  gameTick: number;
  map: RawMap;
}

interface InvalidPlayerNameMessage extends MessageBase<MessageType.InvalidPlayerName> {
  reasonCode: string;
}

interface GameResult {
  name: string;
  playerId: string;
  points: number;
}

interface TournamentEndedMessage extends MessageBase<MessageType.TournamentEnded> {
  playerWinnerId: string;
  gameId: string;
  gameResult: GameResult;
  tournamentName: string;
  tournamentId: string;
}

type NoActiveTournamentMessage = MessageBase<MessageType.NoActiveTournament>;

interface ArenaIsFullMessage extends MessageBase<MessageType.ArenaIsFull> {
  playersConnected: number;
}

interface InvalidMessage extends MessageBase<MessageType.InvalidMessage> {
  errorMessage: string;
  receivedMessage: string;
}

type InvalidArenaNameMessage = MessageBase<MessageType.InvalidArenaName>;

export type Message =
  | HeartBeatResponseMessage
  | PlayerRegisteredMessage
  | GameLinkEventMessage
  | GameStartingEventMessage
  | MapUpdateEventMessage
  | SnakeDeadEventMessage
  | GameResultEventMessage
  | GameEndedEventMessage
  | InvalidPlayerNameMessage
  | InvalidArenaNameMessage
  | TournamentEndedMessage
  | NoActiveTournamentMessage
  | ArenaIsFullMessage
  | InvalidMessage;

export type MessageFor<Type extends MessageType> = Extract<Message, { type: Type }>;
