import { TileType, Direction, MessageType } from '../src/index';
import { GameSettings } from '../src/types';
import type { GameMap } from '../src/utils';
import { snakeConsole as console } from '../src/client';
import { GameStartingEventMessage, Message, SnakeDeadEventMessage } from '../src/messages';

const allDirections = Object.values(Direction);

function randomItem<Type>(items: Type[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getNextMove(gameMap: GameMap, gameId: string, gameTick: number) {
  const currentCoordinate = gameMap.playerSnake.headCoordinate;

  const safeDirections = allDirections.filter(direction => {
    const nextCoordinate = currentCoordinate.translatedByDirection(direction);
    const nextTile = gameMap.getTile(nextCoordinate);

    switch (nextTile) {
      case TileType.Empty:
      case TileType.Food:
        return true;
      default:
        return false;
    }
  });

  // Bad luck!
  if (safeDirections.length === 0) {
    console.log('No safe directions!');
    return Direction.Down;
  }

  const choice = randomItem(safeDirections);
  return choice;
}

// This handler is optional
export function onMessage(message: Message) {
  switch (message.type) {
    case MessageType.GameStarting:
      message = message as GameStartingEventMessage; // Cast to correct type
      // Reset snake state here
      break;
    case MessageType.SnakeDead:
      message = message as SnakeDeadEventMessage; // Cast to correct type
      // Check how many snakes are left and switch strategy
      break;
  }
}

// Settings ommitted are set to default values from the server, change this if you want to override them
export const gameSettings: GameSettings = {
  // maxNoofPlayers: 2,
  // obstaclesEnabled: false,
  // ...
};
