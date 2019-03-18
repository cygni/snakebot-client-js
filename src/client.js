import { GameMode, GameMap } from './utils.js';
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
  host = 'snake.cygni.se',
  venue = 'training',
  protocol = 'ws:',
  snake,
  logger = console,
  autoStart = true,
  WebSocket: WebSocketImpl = WebSocket,
  clientInfo,
  gameSettings,
}) {
  if (snake == null) {
    throw new Error('You must specify a snake to use!');
  }

  const ws = new WebSocketImpl(`${protocol}//${host}/${venue}`);

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

  function closeSocket() {
    if (ws.readyState !== ws.CLOSED || ws.readyState !== ws.CLOSING) {
      ws.close();
    }
  }

  function handleOpen() {
    logger.info(`WebSocket is open`);
    sendMessage(createClientInfoMessage(clientInfo));
    logger.info(`Registering player ${snake.name}`);
    sendMessage(createRegisterPlayerMessage(snake.name, gameSettings));
  }

  const messageHandlers = {
    [MessageType.HeartbeatResponse]({ receivingPlayerId }) {
      heartbeatTimeout = setTimeout(sendMessage, HEARTBEAT_INTERVAL, createHeartbeatRequestMessage(receivingPlayerId));
    },

    [MessageType.PlayerRegistered]({ receivingPlayerId, gameMode: _gameMode }) {
      gameMode = _gameMode;
      if (!SUPPORTED_GAME_MODES.has(gameMode)) {
        logger.error(`Unsupported game mode: ${gameMode}`);
        closeSocket();
      } else {
        logger.info(`Player ${snake.name} was successfully registered!`);
        logger.info(`Game mode: ${gameMode}`);
        sendMessage(createHeartbeatRequestMessage(receivingPlayerId));
      }
    },

    [MessageType.InvalidPlayerName]() {
      logger.info(`The player name ${snake.name} was invalid`);
      closeSocket();
    },

    [MessageType.GameLink]({ url }) {
      logger.info(`Game is ready:`, url);
      if (autoStart && gameMode === GameMode.Training) {
        sendMessage(createStartGameMessage());
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
        closeSocket();
      }
    },

    [MessageType.TournamentEnded]({ playerWinnerName }) {
      logger.info(`Tournament has ended. The winner was ${playerWinnerName}!`);
      closeSocket();
    },

    [MessageType.MapUpdate]({ map, receivingPlayerId, gameId, gameTick }) {
      // logger.debug(`Game turn #${gameTick}`);
      const gameMap = new GameMap(map, receivingPlayerId);
      const direction = snake.getNextMove(gameMap, gameId, gameTick);
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
    if (error.message) {
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
    ws,
    startGame() {
      sendMessage(createStartGameMessage());
    },
  };
}
