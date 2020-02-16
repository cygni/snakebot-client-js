import { MessageType } from '../messages.js';
import { TileType, Direction } from '../utils.js';

const allDirections = Object.values(Direction);

/**
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export const SNAKE_NAME = 'Slither';

/**
 * @param {import('../utils').GameMap} gameMap
 * @returns {Direction}
 */
export function getNextMove(gameMap) {
  const currentCoordinate = gameMap.playerSnake.headCoordinate;

  const safeDirections = allDirections.filter(direction => {
    const nextCoordinate = currentCoordinate.translatedByDirection(direction);
    const nextTile = gameMap.getTile(nextCoordinate);

    switch (nextTile.type) {
      case TileType.Empty:
      case TileType.Food:
        return true;
      default:
        return false;
    }
  });

  // Bad luck!
  if (safeDirections.length === 0) {
    return Direction.Down;
  }

  return randomItem(safeDirections);
}

// This handler is optional
export function onMessage(message) {
  switch (message.type) {
    case MessageType.GameStarting:
      // Reset snake state here
      break;
  }
}
