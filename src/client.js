import { GameMode, GameMap } from './utils';
import {
  MessageType,
  createClientInfoMessage,
  createHeartbeatRequestMessage,
  createRegisterMoveMessage,
  createRegisterPlayerMessage,
  createStartGameMessage,
} from './messages.js';

const HEARTBEAT_INTERVAL = 5000;
const SUPPORTED_GAME_MODES = new Set(Object.values(GameMode));

export function createClient({
  host = 'ws://snake.cygni.se',
  venue = 'training',
  snake,
  logger = console,
  autoStart = true,
  WebSocket: WebSocketImpl = WebSocket,
  onGameReady,
  clientInfo,
  gameSettings,
}) {
  if (snake == null) {
    throw new Error('You must specify a snake to use!');
  }

  const ws = new WebSocketImpl(new URL(venue, host).href);

  logger.info(`WebSocket is connecting`);

  let heartbeatTimeout;
  let gameMode;

  ws.addEventListener('open', handleOpen);
  ws.addEventListener('close', handleClose);
  ws.addEventListener('error', handleError);
  ws.addEventListener('message', handleMessage);

  function sendMessage(message) {
    ws.send(JSON.stringify(message));
  }

  function close() {
    if (ws.readyState !== ws.CLOSED && ws.readyState !== ws.CLOSING) {
      ws.close();
    }
  }

  function handleOpen() {
    logger.info(`WebSocket is open`);
    sendMessage(createClientInfoMessage(clientInfo));
    logger.info(`Registering player ${snake.SNAKE_NAME}`);
    sendMessage(createRegisterPlayerMessage(snake.SNAKE_NAME, gameSettings));
  }

  const messageHandlers = {
    [MessageType.HeartbeatResponse]({ receivingPlayerId }) {
      heartbeatTimeout = setTimeout(sendMessage, HEARTBEAT_INTERVAL, createHeartbeatRequestMessage(receivingPlayerId));
    },

    [MessageType.PlayerRegistered]({ receivingPlayerId, gameMode: _gameMode }) {
      gameMode = _gameMode;
      if (!SUPPORTED_GAME_MODES.has(gameMode)) {
        logger.error(`Unsupported game mode: ${gameMode}`);
        close();
      } else {
        logger.info(`Player ${snake.SNAKE_NAME} was successfully registered!`);
        logger.info(`Game mode: ${gameMode}`);
        sendMessage(createHeartbeatRequestMessage(receivingPlayerId));
      }
    },

    [MessageType.InvalidPlayerName]() {
      logger.info(`The player name ${snake.SNAKE_NAME} was invalid`);
      close();
    },

    [MessageType.GameLink]({ url }) {
      logger.info(`Game is ready:`, url);
      if (autoStart && gameMode === GameMode.Training) {
        sendMessage(createStartGameMessage());
      } else {
        onGameReady(() => {
          sendMessage(createStartGameMessage());
        });
      }
    },

    [MessageType.GameStarting]() {
      logger.info(`Game is starting`);
    },

    [MessageType.GameResult]() {
      logger.info(`Game result is in`);
    },

    [MessageType.GameEnded]({ playerWinnerName }) {
      logger.info(`Game has ended. The winner was ${playerWinnerName}!`);
      if (gameMode === GameMode.Training) {
        close();
      }
    },

    [MessageType.TournamentEnded]({ playerWinnerName }) {
      logger.info(`Tournament has ended. The winner was ${playerWinnerName}!`);
      close();
    },

    async [MessageType.MapUpdate]({ map, receivingPlayerId, gameId, gameTick }) {
      // logger.debug(`Game turn #${gameTick}`);
      const gameMap = new GameMap(map, receivingPlayerId);
      const direction = await snake.getNextMove(gameMap, gameId, gameTick);
      sendMessage(createRegisterMoveMessage(direction, receivingPlayerId, gameId, gameTick));
    },
  };

  function handleMessage({ data }) {
    const message = JSON.parse(data);
    const messageHandler = messageHandlers[message.type];

    if (messageHandler !== undefined) {
      messageHandler(message);
    }

    if (snake.onMessage !== undefined) {
      snake.onMessage(message);
    }
  }

  function handleError(error) {
    if (error.message != null) {
      logger.error(error.message);
    }
    logger.info(`WebSocket is closing`);
  }

  function handleClose({ code, reason, wasClean }) {
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
