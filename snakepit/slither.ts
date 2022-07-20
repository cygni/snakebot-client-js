import { TileType, Direction, MessageType } from '../src/index.js';
import type { GameMap } from '../src/utils.js';

const allDirections = Object.values(Direction);

function randomItem<Type>(items: Type[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export const SNAKE_NAME = 'Slither';

export function getNextMove(gameMap: GameMap) {
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
export function onMessage(message: any) {
  switch (message.type) {
    case MessageType.GameStarting:
      // Reset snake state here
      break;
  }
}