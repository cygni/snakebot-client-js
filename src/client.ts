import colors from "colors";
import type WebSocket from "ws";
import type { MessageEvent } from "ws";
import {
  createClientInfoMessage,
  createHeartbeatRequestMessage,
  createRegisterMoveMessage,
  createRegisterPlayerMessage,
  createStartGameMessage,
  MessageType,
} from "./messages.js";
import { Direction, GameMode, type GameSettings } from "./types.js";
import type { Message, MessageFor } from "./types_messages.js";
import { GameMap } from "./utils.js";

const HEARTBEAT_INTERVAL = 5000;
const SUPPORTED_GAME_MODES = new Set(Object.values(GameMode));
export let snakeConsole = {} as Console;

export type SnakeImplementation = {
  getNextMove: (gameMap: GameMap) => Promise<Direction>;
  onMessage?: (message: Message) => void;
  trainingGameSettings: GameSettings;
};

export type ClientInfo = {
  clientVersion: string;
  operatingSystem: string;
  operatingSystemVersion: string;
};

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
    throw new Error("You must specify a snake to use!");
  }

  // Update snakeConsole to use the given logger
  snakeConsole = logger;

  let apiEndpoint;
  // If the venue is an arena code, we add '/arena' to the endpoint
  if (venue.toUpperCase() !== GameMode.Tournament && venue.toUpperCase() !== GameMode.Training) {
    // Make venue uppercase to match the server's api endpoint
    venue = venue.toUpperCase();
    apiEndpoint = "arena/" + venue;
  } else {
    // Make venue lowercase to match the server's api endpoint
    venue = venue.toLowerCase();
    apiEndpoint = venue;
  }
  const ws = new WebSocket(new URL(apiEndpoint, host).href);

  logger.info("WebSocket is", colors.yellow("connecting"));

  let heartbeatTimeout: ReturnType<typeof setTimeout<[]>>;
  let gameMode: GameMode;
  let url: string;

  ws.addEventListener("open", handleOpen);
  ws.addEventListener("close", handleClose);
  ws.addEventListener("error", handleError);
  ws.addEventListener("message", handleMessage);

  function sendMessage(message: any) {
    ws.send(JSON.stringify(message));
  }

  function close() {
    if (ws.readyState !== ws.CLOSED && ws.readyState !== ws.CLOSING) {
      ws.close();
    }
  }

  function handleOpen() {
    logger.info("WebSocket is", colors.green("open"));
    sendMessage(createClientInfoMessage(clientInfo));
    logger.info("Registering player:", colors.magenta.bold(name));
    sendMessage(createRegisterPlayerMessage(name, gameSettings));
  }

  /** Dispatches received messages to respective handlers (if any)
   * and also passes the messages to the snake onMessage function as a subscription */
  function handleMessage({ data }: MessageEvent) {
    const message: Message = JSON.parse(data as string);

    switch (message.type) {
      case MessageType.PlayerRegistered:
        playerRegisteredEvent(message);
        break;
      case MessageType.HeartbeatResponse:
        heartbeatResponseEvent(message);
        break;
      case MessageType.GameLink:
        gameLinkEvent(message);
        break;
      case MessageType.GameStarting:
        gameStartingEvent(message);
        break;
      case MessageType.MapUpdate:
        mapUpdateEvent(message);
        break;
      case MessageType.SnakeDead:
        snakeDeadEvent(message);
        break;
      case MessageType.GameResult:
        gameResultEvent(message);
        break;
      case MessageType.GameEnded:
        gameEndedEvent(message);
        break;
      case MessageType.InvalidPlayerName:
        invalidPlayerNameEvent(message);
        break;
      case MessageType.TournamentEnded:
        tournamentEndedEvent(message);
        break;
      case MessageType.NoActiveTournament:
        noActiveTournamentEvent(message);
        break;
      case MessageType.InvalidArenaName:
        invalidArenaName(message);
        break;
      case MessageType.ArenaIsFull:
        arenaIsFull(message);
        break;
      case MessageType.InvalidMessage:
        invalidMessage(message);
        break;
      default:
        logger.warn(colors.bold.red("Unknown Event"), (message as any).type);
        logger.log("Message was:", data);
        break;
    }

    // If the snake implementation has an onMessage function, pass the message to it
    snake.onMessage?.(message);
  }

  function handleError({ error }: { error: Error }) {
    if (error.message != null) {
      logger.error(error.message);
    }
    logger.info(`WebSocket is closing`);
  }

  function handleClose({ code, reason, wasClean }: { code: number; reason: string; wasClean: boolean }) {
    logger.info(`WebSocket is closed`, { code, reason, wasClean });
    clearTimeout(heartbeatTimeout);
    ws.removeEventListener("open", handleOpen);
    ws.removeEventListener("close", handleClose);
    ws.removeEventListener("error", handleError);
    ws.removeEventListener("message", handleMessage);
  }

  function playerRegisteredEvent(message: MessageFor<MessageType.PlayerRegistered>) {
    gameMode = message.gameMode;
    if (!SUPPORTED_GAME_MODES.has(gameMode)) {
      logger.error(colors.red(`Unsupported game mode: ${gameMode}`));
      close();
    } else {
      logger.info(colors.green(`Player ${name} was successfully registered!`));
      logger.info("Game mode:", colors.blue.bold(gameMode));

      // Don't spoil if we are in a tournament
      if (gameMode === GameMode.Tournament && !spoiler) {
        logger.info(colors.yellow(`Disabling logs to prevent spoilers`));
        logger = {
          ...logger,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          log: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          info: () => {},
        };

        // Prevent the snake from logging
        snakeConsole = logger;
      }
      sendMessage(createHeartbeatRequestMessage(message.receivingPlayerId));
    }
  }

  function heartbeatResponseEvent(message: MessageFor<MessageType.HeartbeatResponse>) {
    heartbeatTimeout = setTimeout(
      sendMessage,
      HEARTBEAT_INTERVAL,
      createHeartbeatRequestMessage(message.receivingPlayerId),
    );
  }

  function gameLinkEvent(message: MessageFor<MessageType.GameLink>) {
    logger.info("Game is ready");
    url = message.url;

    if (gameMode === GameMode.Training) {
      sendMessage(createStartGameMessage());
    }
  }

  function gameStartingEvent(message: MessageFor<MessageType.GameStarting>) {
    logger.info(colors.rainbow("Game is starting"));
    logger.info(
      colors.blue.bold("Received updated game settings from server:"),
      colors.blue(JSON.stringify(message.gameSettings)),
    );
    gameSettings = message.gameSettings; // Update game settings with the ones from the server
  }

  async function mapUpdateEvent({
    map,
    receivingPlayerId,
    gameId,
    gameTick,
    timestamp,
  }: MessageFor<MessageType.MapUpdate>) {
    // logger.debug(`Game turn #${gameTick}`);
    const gameMap = new GameMap(map, receivingPlayerId, gameSettings, gameTick);
    const direction = await snake.getNextMove(gameMap);
    sendMessage(createRegisterMoveMessage(direction, receivingPlayerId, gameId, gameTick));
  }

  function snakeDeadEvent(message: MessageFor<MessageType.SnakeDead>) {
    if (spoiler) logger.info("Snake died because:", colors.red(message.deathReason));
  }

  function gameResultEvent(message: MessageFor<MessageType.GameResult>) {
    logger.info("Game result is in: ", colors.cyan.bold.underline(url));
  }

  function gameEndedEvent(message: MessageFor<MessageType.GameEnded>) {
    if (spoiler) logger.info("Game has ended. The winner was", colors.bgBlue(message.playerWinnerName));
    if (gameMode === GameMode.Training) {
      close();
    }
  }

  function invalidPlayerNameEvent(message: MessageFor<MessageType.InvalidPlayerName>) {
    logger.info(colors.red(`The player name ${name} was invalid, reason: ${message.reasonCode}`));
    close();
  }

  function tournamentEndedEvent(message: MessageFor<MessageType.TournamentEnded>) {
    logger.info(colors.yellow("Tournament has ended."));
    close();
  }

  function noActiveTournamentEvent(message: MessageFor<MessageType.NoActiveTournament>) {
    logger.info(colors.yellow("No active tournament. Closing..."));
    close();
  }

  function invalidArenaName(message: MessageFor<MessageType.InvalidArenaName>) {
    logger.info(colors.red(`There is no arena with the code: ${venue}`));
    close();
  }

  function arenaIsFull(message: MessageFor<MessageType.ArenaIsFull>) {
    logger.info(colors.red(`The arena ${venue} is full, players connected: ${message.playersConnected}`));
    close();
  }

  function invalidMessage(message: MessageFor<MessageType.InvalidMessage>) {
    logger.warn(colors.red(message.errorMessage));
  }

  return {
    close,
  };
}
