import { Direction, RawMap, RelativeDirection, SnakeInfo, TileType } from "./types";
import { GameSettings } from "./types";

/**
 * Converts a direction to a representation in coordinates.
 * @param direction A direction to convert to corresponding delta coordinates
 * @returns An object containing x and y coordinates.
 */
function getDirectionDelta(direction: Direction): { x: number; y: number } {
  switch (direction) {
    case Direction.Up:
      return { x: 0, y: -1 };
    case Direction.Down:
      return { x: 0, y: 1 };
    case Direction.Left:
      return { x: -1, y: 0 };
    case Direction.Right:
      return { x: 1, y: 0 };
    default:
      throw new Error(`Unknown direction: ${direction}`);
  }
}

/**
 * A 2D coordinate in the game map.
 * @param x The x coordinate.
 * @param y The y coordinate.
 */
export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Converts a position in the flattened single array representation
   * of the Map to a 2D Coordinate.
   * @param position The position in the flattened array.
   * @param mapWidth The width of the map.
   * @returns A new Coordinate of the position.
   */
  static fromPosition(position: number, mapWidth: number) {
    const x = position % mapWidth;
    const y = (position - x) / mapWidth;
    return new Coordinate(x, y);
  }

  /**
   * Checks if this coordinate is within a square defined by northwest and southeast coordinates.
   * @param northwest Coordinate of the northwest corner.
   * @param southeast Coordinate of the southeast corner.
   * @returns True if this coordinate is within the square.
   */
  isWithinSquare(northwest: { x: number; y: number }, southeast: { x: number; y: number }) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = northwest;
    const { x: x2, y: y2 } = southeast;
    return x0 >= x1 && x0 <= x2 && y0 >= y1 && y0 <= y2;
  }

  /**
   * Check if a coordinate is outside of the game map.
   * @param mapHeight Height of the map.
   * @param mapWidth Width of the map.
   * @return True if coordinate is out of bounds.
   */
  isOutOfBounds(mapWidth: number, mapHeight: number) {
    const { x, y } = this;
    return x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
  }

  /**
   * Calculates the euclidian distance from this point to another point.
   * Note that eculidan distance will walk diagonally.
   * @param otherCoordinate Goal coordinate.
   * @return Distance in map units.
   */
  euclidianDistanceTo(otherCoordinate: Coordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  /**
   * Calculates the Manhattan (or cab/grid) distance from this point to another point.
   * Note that Manhattan distance will not walk diagonally.
   * @param otherCoordinate Coordinate of the position.
   * @return Distance in map units.
   */
  manhattanDistanceTo(otherCoordinate: Coordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return Math.abs(x1 - x0) + Math.abs(y1 - y0);
  }
  /**
   * Calculates the difference between another coordinate and this coordinate. Like manhattanDistanceTo,
   * but values can be negative to represent a direction. Positive values represent right or down.
   * Negative values represent left or up.
   * @param otherCoordinate Coordinate to compare to.
   * @return An object containing x and y coordinates.
   */
  deltaTo(otherCoordinate: Coordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return { x: x1 - x0, y: y1 - y0 };
  }

  /**
   * Calculates this coordinate's position in the flattened
   * single array representation of the Map.
   * @param mapWidth The width of the map.
   * @param mapHeight The height of the map.
   * @returns Position in the flattened array.
   */
  toPosition(mapWidth: number, mapHeight: number) {
    if (this.isOutOfBounds(mapWidth, mapHeight)) {
      throw new RangeError('The coordinate must be within the bounds in order to convert to position');
    }

    const { x, y } = this;
    return x + y * mapWidth;
  }
  /**
   * @return Negated coordinate
   */
  negated() {
    const { x, y } = this;
    return new Coordinate(-x, -y);
  }

  /**
   * @param delta Delta to add to this coordinate. Positive values represent right or down. Negative values represent left or up.
   * @returns A new coordinate that is moved by the given delta.
   */
  translateByDelta(delta: { x: number; y: number }) {
    const { x, y } = this;
    const { x: dx, y: dy } = delta;
    return new Coordinate(x + dx, y + dy);
  }

  /**
   * @param direction Direction to move in.
   * @returns A new coordinate that is moved by the given direction.
   */
  translateByDirection(direction: Direction) {
    const directionDelta = getDirectionDelta(direction);
    return this.translateByDelta(directionDelta);
  }
}

export class Snake {
  id: string;
  name: string;
  direction: Direction;
  coordinates: Coordinate[];
  map: GameMap;

  constructor(id: string, name: string, direction: Direction, coordinates: Coordinate[], map: GameMap) {
    this.id = id;
    this.name = name;
    this.direction = direction;
    this.coordinates = coordinates;
    this.map = map;
  }
  /**
   * @param direction Desired direction to check
   * @return True if the snake can move in the given direction.
   */
  canMoveInDirection(direction: Direction) {
    const snakeHead = this.coordinates[0];
    const nextCoord = snakeHead.translateByDirection(direction);
    return this.map.isTileFree(nextCoord);
  }

  /** Returns an absolute direction based on a relative direction
   * @param relativeDirection Relative direction to convert
   * @returns Absolute map direction
   */
  relativeToAbsolute(relativeDirection: RelativeDirection) {
    switch (relativeDirection) {
      case RelativeDirection.Forward:
        return this.direction;
      case RelativeDirection.Left:
        switch (this.direction) {
          case Direction.Up:
            return Direction.Left;
          case Direction.Down:
            return Direction.Right;
          case Direction.Left:
            return Direction.Down;
          case Direction.Right:
            return Direction.Up;
          default:
            throw new Error(`Unknown direction: ${this.direction}`);
        }
      case RelativeDirection.Right:
        switch (this.direction) {
          case Direction.Up:
            return Direction.Right;
          case Direction.Down:
            return Direction.Left;
          case Direction.Left:
            return Direction.Up;
          case Direction.Right:
            return Direction.Down;
          default:
            throw new Error(`Unknown direction: ${this.direction}`);
        }
    }
  }

  get headCoordinate() {
    return this.coordinates[0];
  }

  get tailCoordinate() {
    return this.coordinates[this.coordinates.length - 1];
  }

  get length() {
    return this.coordinates.length;
  }

  static fromSnakeInfo(snakeInfo: SnakeInfo, mapWidth: number, map: GameMap) {
    const { id, name, positions } = snakeInfo;
    const coordinates = positions.map(position => Coordinate.fromPosition(position, mapWidth));
    // Calculate the direction of the snake
    let direction = Direction.Up;
    if (coordinates.length > 1) {
      const delta = coordinates[1].deltaTo(coordinates[0]);
      if (delta.x === 1) {
        direction = Direction.Right;
      } else if (delta.x === -1) {
        direction = Direction.Left;
      } else if (delta.y === 1) {
        direction = Direction.Down;
      } else if (delta.y === -1) {
        direction = Direction.Up;
      }
    }
    return new Snake(id, name, direction, coordinates, map);
  }
}

export class GameMap {
  playerId: string;
  width: number;
  height: number;
  snakes: Map<string, Snake>;
  tiles: Map<number, TileType>;
  gameSettings: GameSettings;
  gameTick: number;

  constructor(map: RawMap, playerId: string, gameSettings: GameSettings, gameTick: number) {
    const snakes = new Map<string, Snake>();
    const tiles = new Map<number, TileType>();

    for (const foodPosition of map.foodPositions) {
      tiles.set(foodPosition, TileType.Food);
    }

    for (const obstaclePosition of map.obstaclePositions) {
      tiles.set(obstaclePosition, TileType.Obstacle);
    }

    for (const snakeInfo of map.snakeInfos) {
      const snake = Snake.fromSnakeInfo(snakeInfo, map.width, this);
      snakes.set(snakeInfo.id, snake);
      for (const snakePosition of snakeInfo.positions) {
        tiles.set(snakePosition, TileType.Snake);
      }
    }

    this.playerId = playerId;
    this.width = map.width;
    this.height = map.height;
    this.snakes = snakes;
    this.tiles = tiles;
    this.gameSettings = gameSettings;
    this.gameTick = gameTick;
  }

  get playerSnake() {
    return this.snakes.get(this.playerId)!;
  }

  /**
   * @param coordinate Coordinate to check
   * @return Type of tile
   */
  getTileType(coordinate: Coordinate) {
    const { width, height } = this;

    if (coordinate.isOutOfBounds(width, height)) {
      return TileType.Obstacle;
    }

    const position = coordinate.toPosition(width, height);
    const tileType = this.tiles.get(position);

    if (tileType === undefined) {
      // console.error(`No tile found at position ${position}`);
      return TileType.Empty;
    }

    return tileType;
  }
  /**
   * @param coordinate Coordinate to check
   * @return True if coordinate is empty or food
   */
  isTileFree(coordinate: Coordinate) {
    return this.getTileType(coordinate) === TileType.Empty || this.getTileType(coordinate) === TileType.Food;
  }
}
