import WebSocket, { MessageEvent } from 'ws';
import colors from 'colors';
import { URL } from 'url';
import {
  MessageType,
  createClientInfoMessage,
  createHeartbeatRequestMessage,
  createRegisterMoveMessage,
  createRegisterPlayerMessage,
  createStartGameMessage,
} from './messages';
import { GameMap } from './utils';

import { Direction, GameMode, GameSettings } from './types';
import type {
  Message,
  HeartBeatResponseMessage,
  PlayerRegisteredMessage,
  GameLinkEventMessage,
  GameStartingEventMessage,
  MapUpdateEventMessage,
  SnakeDeadEventMessage,
  GameEndedEventMessage,
  GameResultEventMessage,
  InvalidPlayerNameMessage,
  TournamentEndedMessage,
  NoActiveTournamentMessage,
  ArenaIsFullMessage,
  InvalidMessage,
} from './types_messages';

const HEARTBEAT_INTERVAL = 5000;
const SUPPORTED_GAME_MODES = new Set(Object.values(GameMode));
export let snakeConsole = {} as Console;

export type SnakeImplementation = {
  getNextMove: (gameMap: GameMap) => Promise<Direction>;
  onMessage?: (message: any) => void;
  trainingGameSettings: GameSettings;
}

export type ClientInfo = {
  clientVersion: string;
  operatingSystem: string;
  operatingSystemVersion: string;
}

export type ClientOptions = {
  name: string;
  host: string;
  venue: string;
  snake: SnakeImplementation;
  logger: Console;
  spoiler: boolean;
  WebSocket: typeof WebSocket;
  clientInfo: ClientInfo;
  gameSettings: GameSettings;
};

export function createClient({
  name,
  host,
  venue,
  snake,
  logger,
  spoiler,
  WebSocket,
  clientInfo,
  gameSettings,
}: ClientOptions) {
  if (snake == null) {
    throw new Error('You must specify a snake to use!');
  }
  
  // Update snakeConsole to use the given logger
  snakeConsole = logger;
  
  let apiEndpoint;
  // If the venue is an arena code, we add '/arena' to the endpoint
  if (venue.toUpperCase() !== GameMode.Tournament && venue.toUpperCase() !== GameMode.Training) {
    // Make venue uppercase to match the server's api endpoint
    venue = venue.toUpperCase();
    apiEndpoint = 'arena/' + venue;
  } else {
    // Make venue lowercase to match the server's api endpoint
    venue = venue.toLowerCase();
    apiEndpoint = venue;
  }
  const ws = new WebSocket(new URL(apiEndpoint, host).href);

  logger.info('WebSocket is', colors.yellow('connecting'));

  let heartbeatTimeout: NodeJS.Timeout;
  let gameMode: GameMode;
  let url: string;

  ws.addEventListener('open', handleOpen);
  ws.addEventListener('close', handleClose);
  ws.addEventListener('error', handleError);
  ws.addEventListener('message', handleMessage);

  function sendMessage(message: any) {
    ws.send(JSON.stringify(message));
  }

  function close() {
    if (ws.readyState !== ws.CLOSED && ws.readyState !== ws.CLOSING) {
      ws.close();
    }
  }

  function handleOpen() {
    logger.info('WebSocket is', colors.green('open'));
    sendMessage(createClientInfoMessage(clientInfo));
    logger.info('Registering player:', colors.magenta.bold(name));
    sendMessage(createRegisterPlayerMessage(name, gameSettings));
  }

  /** Dispatches received messages to respective handlers (if any)
   * and also passes the messages to the snake onMessage function as a subscription */
  function handleMessage({data}: MessageEvent) {
    const message: Message = JSON.parse(data as string);    
    switch (message.type) {
      case MessageType.PlayerRegistered:
        playerRegisteredEvent(message as PlayerRegisteredMessage);
        break;
      case MessageType.HeartbeatResponse:
        heartbeatResponseEvent(message as HeartBeatResponseMessage);
        break;
      case MessageType.GameLink:
        gameLinkEvent(message as GameLinkEventMessage);
        break;
      case MessageType.GameStarting:
        gameStartingEvent(message as GameStartingEventMessage);
        break;
      case MessageType.MapUpdate:
        mapUpdateEvent(message as MapUpdateEventMessage);
        break;
      case MessageType.SnakeDead:
        snakeDeadEvent(message as SnakeDeadEventMessage);
        break;
      case MessageType.GameResult:
        gameResultEvent(message as GameResultEventMessage);
        break;
      case MessageType.GameEnded:
        gameEndedEvent(message as GameEndedEventMessage);
        break;
      case MessageType.InvalidPlayerName:
        invalidPlayerNameEvent(message as InvalidPlayerNameMessage);
        break;
      case MessageType.TournamentEnded:
        tournamentEndedEvent(message as TournamentEndedMessage);
        break;
      case MessageType.NoActiveTournament:
        noActiveTournamentEvent(message as TournamentEndedMessage);
        break;
      case MessageType.InvalidArenaName:
        invalidArenaName(message as InvalidPlayerNameMessage);
        break;
      case MessageType.ArenaIsFull:
        arenaIsFull(message as ArenaIsFullMessage);
        break;
      case MessageType.InvalidMessage:
        invalidMessage(message as InvalidMessage);
        break;
      default:
        logger.warn(colors.bold.red('Unknown Event'), message.type);
        logger.log("Message was:", data);
        break;
    }
    
    // If the snake implementation has a onMessage function, pass the message to it
    if (snake.onMessage !== undefined) {
      snake.onMessage(message);
    }
  }

  function handleError({ error }: { error: Error }) {
    if (error.message != null) {
      logger.error(error.message);
    }
    logger.info(`WebSocket is closing`);
  }

  function handleClose({ code, reason, wasClean }: { code: number, reason: string, wasClean: boolean }) {
    logger.info(`WebSocket is closed`, { code, reason, wasClean });
    clearTimeout(heartbeatTimeout);
    ws.removeEventListener('open', handleOpen);
    ws.removeEventListener('close', handleClose);
    ws.removeEventListener('error', handleError);
    ws.removeEventListener('message', handleMessage);
  }

  function playerRegisteredEvent(message: PlayerRegisteredMessage) {
    gameMode = message.gameMode;
    if (!SUPPORTED_GAME_MODES.has(gameMode)) {
      logger.error(colors.red(`Unsupported game mode: ${gameMode}`));
      close();
    } else {
      logger.info(colors.green(`Player ${name} was successfully registered!`));
      logger.info('Game mode:', colors.blue.bold(gameMode));
      
      // Don't spoil if we are in a tournament
      if (gameMode === GameMode.Tournament && !spoiler) {
        logger.info(colors.yellow(`Disabling logs to prevent spoilers`));
        logger = {
          log: () => {},
          error: logger.error,
          warn: logger.warn,
          info: () => {},
        } as Console;

        // Prevent the snake from logging
        snakeConsole = logger;
      }
      sendMessage(createHeartbeatRequestMessage(message.receivingPlayerId));
    }
  }

  function heartbeatResponseEvent(message: HeartBeatResponseMessage) {
    heartbeatTimeout = setTimeout(sendMessage, HEARTBEAT_INTERVAL, createHeartbeatRequestMessage(message.receivingPlayerId));
  }

  function gameLinkEvent(message: GameLinkEventMessage) {
    logger.info('Game is ready');
    url = message.url;

    if (gameMode === GameMode.Training) {
      sendMessage(createStartGameMessage());
    }
  }

  function gameStartingEvent(message: GameStartingEventMessage) {
    logger.info(colors.rainbow('Game is starting'));
    logger.info(colors.blue.bold('Received updated game settings from server:'), colors.blue(JSON.stringify(message.gameSettings)));
    gameSettings = message.gameSettings; // Update game settings with the ones from the server
  }

  async function mapUpdateEvent({map, receivingPlayerId, gameId, gameTick, timestamp}: MapUpdateEventMessage) {
    // logger.debug(`Game turn #${gameTick}`);
    const gameMap = new GameMap(map, receivingPlayerId, gameSettings, gameTick);
    const direction = await snake.getNextMove(gameMap);
    sendMessage(createRegisterMoveMessage(direction, receivingPlayerId, gameId, gameTick));
  }

  function snakeDeadEvent(message: SnakeDeadEventMessage) {
    if (spoiler) logger.info('Snake died because:', colors.red(message.deathReason));
  }

  function gameResultEvent(message: GameResultEventMessage) {
    logger.info('Game result is in: ', colors.cyan.bold.underline(url));
  }

  function gameEndedEvent(message: GameEndedEventMessage) {
    if (spoiler) logger.info('Game has ended. The winner was', colors.bgBlue(message.playerWinnerName));
    if (gameMode === GameMode.Training) {
      close();
    }
  }

  function invalidPlayerNameEvent(message: InvalidPlayerNameMessage) {
    logger.info(colors.red(`The player name ${name} was invalid, reason: ${message.reasonCode}`));
    close();
  }

  function tournamentEndedEvent(message: TournamentEndedMessage) {
    logger.info(colors.yellow('Tournament has ended.'));
    close();
  }

  function noActiveTournamentEvent(message: NoActiveTournamentMessage) {
    logger.info(colors.yellow('No active tournament. Closing...'));
    close();
  }

  function invalidArenaName(message: InvalidPlayerNameMessage) {
    logger.info(colors.red(`There is no arena with the code: ${venue}`));
    close();
  }

  function arenaIsFull(message: ArenaIsFullMessage) {
    logger.info(colors.red(`The arena ${venue} is full, players connected: ${message.playersConnected}`));
    close();
  }

  function invalidMessage(message: InvalidMessage) {
    logger.warn(colors.red(message.errorMessage));
  }

  return {
    close,
  };
}
