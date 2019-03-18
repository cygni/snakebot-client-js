import { MessageType } from '../messages.js';
import { TileType, Direction } from '../utils.js';

const allDirections = Object.values(Direction);

/**
 * @template T
 * @param {ArrayLike<T>} items
 * @returns {T}
 */
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export default class Slither {
  constructor() {
    // The snake must have a name
    this.name = 'Slither';
  }

  // This method is required
  /**
   * @param {import('../utils').GameMap} gameMap
   * @returns {Direction}
   */
  getNextMove(gameMap) {
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

  // This method is optional
  onMessage(message) {
    switch (message.type) {
      case MessageType.GameStarting:
        // Reset snake state here
        break;
    }
  }
}
