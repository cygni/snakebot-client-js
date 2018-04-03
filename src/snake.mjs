import { MessageType } from './messages.mjs';
import { TileType, Direction } from './utils.mjs';

const allDirections = Object.values(Direction);

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

class MySnake {
  constructor() {
    // The snake must have a name
    this.name = 'snoken';
  }

  // This method is required
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

export function createSnake() {
  return new MySnake();
}
