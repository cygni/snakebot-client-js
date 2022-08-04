import { MessageType } from "./messages";
import { GameMode, GameSettings, RawMap } from "./types";

export type Message = {
    type: MessageType;
    receivingPlayerId: string;
    timestamp: number;
  };
  
  export type HeartBeatResponseMessage = Message;
  
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
  
  export type NoActiveTournamentMessage = Message;

  export interface ArenaIsFullMessage extends Message {
    playersConnected: number;
  }