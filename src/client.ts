import { GameMode, GameMap, RawMap } from './utils';
import type { Direction } from './utils';
import WebSocket from 'ws';
import { URL } from 'url';
import {
  MessageType,
  createClientInfoMessage,
  createHeartbeatRequestMessage,
  createRegisterMoveMessage,
  createRegisterPlayerMessage,
  createStartGameMessage,
} from './messages';
import colors from 'colors';
import { GameSettings } from './types';

const HEARTBEAT_INTERVAL = 5000;
const SUPPORTED_GAME_MODES = new Set(Object.values(GameMode));

export type SnakeImplementation = {
  getNextMove: (gameMap: GameMap, gameId: string, gameTick: number) => Direction;
  onMessage?: (message: any) => void;
  gameSettings: GameSettings;
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
  autoStart: boolean;
  WebSocket: typeof WebSocket;
  onGameReady: (startGame: ()=>void) => void;
  clientInfo: ClientInfo;
  gameSettings: GameSettings;
};

export function createClient({
  name,
  host,
  venue,
  snake,
  logger,
  autoStart,
  WebSocket,
  onGameReady,
  clientInfo,
  gameSettings,
}: ClientOptions) {
  if (snake == null) {
    throw new Error('You must specify a snake to use!');
  }

  const ws = new WebSocket(new URL(venue, host).href);

  logger.info('WebSocket is', colors.yellow('connecting'));

  let heartbeatTimeout: NodeJS.Timeout;
  let gameMode: GameMode;

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

  const messageHandlers: {[type: string]: any} = {
    [MessageType.HeartbeatResponse]({ receivingPlayerId }: { receivingPlayerId: string }) {
      heartbeatTimeout = setTimeout(sendMessage, HEARTBEAT_INTERVAL, createHeartbeatRequestMessage(receivingPlayerId));
    },

    [MessageType.PlayerRegistered]({ receivingPlayerId, gameMode: _gameMode, gameSettings: _gameSettings }: { receivingPlayerId: string, gameMode: GameMode, gameSettings: GameSettings }) {
      gameMode = _gameMode;
      if (!SUPPORTED_GAME_MODES.has(gameMode)) {
        logger.error(colors.red(`Unsupported game mode: ${gameMode}`));
        close();
      } else {
        logger.info(colors.green(`Player ${name} was successfully registered!`));
        logger.info('Game mode:', colors.blue.bold(gameMode));
        logger.info('Updated game settings from server');
        gameSettings = _gameSettings; // Update game settings with the ones from the server
        snake.gameSettings = gameSettings; // Update the snake's local game settings
        sendMessage(createHeartbeatRequestMessage(receivingPlayerId));
      }
    },

    [MessageType.InvalidPlayerName]() {
      logger.info(colors.red(`The player name ${name} was invalid`));
      close();
    },

    [MessageType.GameLink]({ url }: { url: string }) {
      logger.info('Game is ready:', colors.cyan.bold.underline(url));
      if (autoStart && gameMode === GameMode.Training) {
        sendMessage(createStartGameMessage());
      } else {
        onGameReady(() => {
          sendMessage(createStartGameMessage());
        });
      }
    },

    [MessageType.GameStarting]() {
      logger.info(colors.rainbow('Game is starting'));
    },

    [MessageType.GameResult]() {
      logger.info('Game result is in');
    },

    [MessageType.GameEnded]({ playerWinnerName }: { playerWinnerName: string }) {
      logger.info('Game has ended. The winner was', colors.bgBlue(playerWinnerName));
      if (gameMode === GameMode.Training) {
        close();
      }
    },

    [MessageType.TournamentEnded]({ playerWinnerName }: { playerWinnerName: string }) {
      logger.info('Tournament has ended. The winner was', colors.bgYellow(playerWinnerName));
      close();
    },

    async [MessageType.MapUpdate]({ map, receivingPlayerId, gameId, gameTick }: { map: RawMap, receivingPlayerId: string, gameId: string, gameTick: number }) {
      // logger.debug(`Game turn #${gameTick}`);
      const gameMap = new GameMap(map, receivingPlayerId);
      const direction = await snake.getNextMove(gameMap, gameId, gameTick);
      sendMessage(createRegisterMoveMessage(direction, receivingPlayerId, gameId, gameTick));
    },
  };

  function handleMessage({ data }: { data: string }) {
    const message = JSON.parse(data);
    const messageType: MessageType = message.type;
    const messageHandler = messageHandlers[messageType];

    if (messageHandler !== undefined) {
      messageHandler(message);
    }

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

  return {
    close,
  };
}
