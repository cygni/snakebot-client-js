import { GameMap } from './utils.mjs';
import { createSnake } from './snake.mjs';
import {
  MessageType,
  createClientInfoMessage,
  createHeartbeatRequestMessage,
  createRegisterMoveMessage,
  createRegisterPlayerMessage,
  createStartGameMessage,
} from './messages.mjs';

const supportedGameModes = new Set(['TRAINING', 'TOURNAMENT']);

export function createClient({
  host = 'snake.cygni.se',
  venue = 'training',
  protocol = 'ws',
  snake = createSnake(),
  logger = console,
  autoStart = true,
  WebSocket: WebSocketImpl = WebSocket,
  clientInfo,
  gameSettings,
} = {}) {
  let timeout;
  let gameMode;

  const ws = new WebSocketImpl(`${protocol}://${host}/${venue}`);

  logger.info(`WebSocket is connecting`);

  ws.addEventListener('open', handleOpen);
  ws.addEventListener('close', handleClose);
  ws.addEventListener('error', handleError);
  ws.addEventListener('message', handleMessage);

  function sendMessage(message) {
    ws.send(JSON.stringify(message));
  }

  function handleOpen() {
    logger.info(`WebSocket is open`);
    sendMessage(createClientInfoMessage(clientInfo));
    logger.info(`Registering ${snake.name}`);
    sendMessage(createRegisterPlayerMessage(snake.name, gameSettings));
  }

  const messageHandlers = {
    [MessageType.HeartbeatResponse]({ receivingPlayerId }) {
      timeout = setTimeout(() => {
        sendMessage(createHeartbeatRequestMessage(receivingPlayerId));
      }, 5000);
    },

    [MessageType.PlayerRegistered]({ receivingPlayerId, gameMode: _gameMode }) {
      gameMode = _gameMode;
      if (!supportedGameModes.has(gameMode)) {
        logger.error(`Unsupported gameMode: ${gameMode}`);
        ws.close();
      } else {
        logger.info(`Player ${snake.name} was successfully registered`);
        logger.info(`Game mode: ${gameMode}`);
        sendMessage(createHeartbeatRequestMessage(receivingPlayerId));
      }
    },

    [MessageType.InvalidPlayerName]() {
      logger.info(`The player name ${snake.name} was invalid`);
    },

    [MessageType.GameLink]({ url }) {
      logger.info(`Game is ready`, { url });
      if (autoStart && gameMode === 'TRAINING') {
        sendMessage(createStartGameMessage());
      }
    },

    [MessageType.GameStarting]() {
      logger.info(`Game is starting.`);
    },

    [MessageType.GameResult]() {
      logger.info(`Game result is in.`);
    },

    [MessageType.GameEnded]({ playerWinnerName }) {
      logger.info(`Game has ended. The winner is ${playerWinnerName}!`);
      if (gameMode === 'TRAINING') {
        ws.close();
      }
    },

    [MessageType.TournamentEnded]({ playerWinnerName }) {
      logger.info(`Tournament has ended. The winner is ${playerWinnerName}!`);
      ws.close();
    },

    async [MessageType.MapUpdate]({ map, receivingPlayerId, gameId, gameTick }) {
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
    if (error.message) {
      logger.error(error.message);
    }
    logger.info(`WebSocket is closing`);
  }

  function handleClose({ code, reason, wasClean }) {
    logger.info(`WebSocket is closed`, { code, reason, wasClean });
    clearTimeout(timeout);
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
