import { ClientInfo } from "./client";
import { GameSettings } from "./types";
import type { Direction, GameMode, RawMap } from "./utils";

export enum MessageType {
  // Exceptions
  InvalidMessage = 'se.cygni.snake.api.exception.InvalidMessage',
  InvalidPlayerName = 'se.cygni.snake.api.exception.InvalidPlayerName',
  NoActiveTournament = 'se.cygni.snake.api.exception.NoActiveTournament',

  // Responses
  HeartbeatResponse = 'se.cygni.snake.api.response.HeartBeatResponse',
  PlayerRegistered = 'se.cygni.snake.api.response.PlayerRegistered',

  // Events
  GameLink = 'se.cygni.snake.api.event.GameLinkEvent',
  GameStarting = 'se.cygni.snake.api.event.GameStartingEvent',
  MapUpdate = 'se.cygni.snake.api.event.MapUpdateEvent',
  SnakeDead = 'se.cygni.snake.api.event.SnakeDeadEvent',
  GameResult = 'se.cygni.snake.api.event.GameResultEvent',
  GameEnded = 'se.cygni.snake.api.event.GameEndedEvent',
  TournamentEnded = 'se.cygni.snake.api.event.TournamentEndedEvent',

  // Requests
  ClientInfo = 'se.cygni.snake.api.request.ClientInfo',
  StartGame = 'se.cygni.snake.api.request.StartGame',
  RegisterPlayer = 'se.cygni.snake.api.request.RegisterPlayer',
  RegisterMove = 'se.cygni.snake.api.request.RegisterMove',
  HeartbeatRequest = 'se.cygni.snake.api.request.HeartBeatRequest',
};

export function createClientInfoMessage({
  clientVersion,
  operatingSystem,
  operatingSystemVersion,
}: ClientInfo) {
  return {
    type: MessageType.ClientInfo,
    language: 'JavaScript',
    languageVersion: 'ES2020',
    clientVersion,
    operatingSystem,
    operatingSystemVersion,
  };
}

// Update these functions to use types
export function createHeartbeatRequestMessage(receivingPlayerId: string) {
  return { type: MessageType.HeartbeatRequest, receivingPlayerId };
}

export function createRegisterMoveMessage(direction: Direction, receivingPlayerId: string, gameId: string, gameTick: number) {
  return { type: MessageType.RegisterMove, direction, receivingPlayerId, gameId, gameTick };
}

export function createRegisterPlayerMessage(playerName: string, gameSettings: GameSettings = {}) {
  return { type: MessageType.RegisterPlayer, playerName, gameSettings };
}

export function createStartGameMessage() {
  return { type: MessageType.StartGame };
}

/** Message type definitions */
export type Message = {
  type: MessageType;
  receivingPlayerId: string;
  timestamp: number;
};

export interface HeartBeatResponseMessage extends Message {
  type: MessageType.HeartbeatResponse;
}

export interface PlayerRegisteredMessage extends Message {
  type: MessageType.PlayerRegistered;
  gameId: string;
  name: string;
  gameSettings: GameSettings;
  gameMode: GameMode;
}

export interface GameLinkEventMessage extends Message {
  type: MessageType.GameLink;
  url: string;
};

export interface GameStartingEventMessage extends Message {
  type: MessageType.GameStarting;
  gameId: string;
  noofPlayers: number;
  width: number;
  height: number;
  gameSettings: GameSettings;
}

export interface MapUpdateEventMessage extends Message {
  type: MessageType.MapUpdate;
  gameTick: number;
  gameId: string;
  map: RawMap;
}

export interface SnakeDeadEventMessage extends Message {
  type: MessageType.SnakeDead;
  deathReason: string;
  playerId: string;
  x: number;
  y: number;
  gameId: string;
  gameTick: number;
}

export type PlayerRank = {
  playerName: string;
  playerId: string;
  rank: number;
  points: number;
  alive: boolean;
}

export interface GameResultEventMessage extends Message {
  type: MessageType.GameResult;
  gameId: string;
  playerRanks: PlayerRank[];
}

export interface GameEndedEventMessage extends Message {
  type: MessageType.GameEnded;
  playerWinnerId: string;
  playerWinnerName: string;
  gameId: string;
  gameTick: number;
  map: RawMap;
}

export interface InvalidPlayerNameMessage extends Message {
  type: MessageType.InvalidPlayerName;
  reasonCode: string;
}

export type GameResult = {
  name: string;
  playerId: string;
  points: number;
}

export interface TournamentEndedMessage extends Message {
  type: MessageType.TournamentEnded;
  playerWinnerId: string;
  gameId: string;
  gameResult: GameResult;
  tournamentName: string;
  tournamentId: string;
};