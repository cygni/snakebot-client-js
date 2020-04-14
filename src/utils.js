/**
 * @typedef {{ type: TileType, snake?: Snake }} Tile
 * @typedef {{ id: string, name: string, positions: number[] }} SnakeInfo
 * @typedef {{ width: number, height: number, foodPositions: number[], obstaclePositions: number[], snakeInfos: SnakeInfo[] }} RawMap
 */

/** @enum {symbol} */
export const TileType = Object.freeze({
  Empty: Symbol('Empty'),
  Food: Symbol('Food'),
  Obstacle: Symbol('Obstacle'),
  Snake: Symbol('Snake'),
});

const emptyTile = Object.freeze({ type: TileType.Empty });
const foodTile = Object.freeze({ type: TileType.Food });
const obstactleTile = Object.freeze({ type: TileType.Obstacle });

/** @param {Snake} snake */
const createSnakeTile = snake => Object.freeze({ type: TileType.Snake, snake });

/** @enum {string} */
export const Direction = Object.freeze({
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
});

/** @enum {string} */
export const GameMode = Object.freeze({
  Training: 'TRAINING',
  Tournament: 'TOURNAMENT',
});

export function noop() {
  // Nothing to see here
}

const directionDeltas = Object.freeze({
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
  [Direction.Right]: { x: 1, y: 0 },
});

export class Coordinate {
  /**
   * @param {number} position
   * @param {number} mapWidth
   * @returns {Coordinate}
   */
  static fromPosition(position, mapWidth) {
    const x = position % mapWidth;
    const y = (position - x) / mapWidth;
    return new Coordinate(x, y);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Whether this coordinate is out of bounds
   * @param {number} mapWidth
   * @param {number} mapHeight
   * @returns {boolean}
   */
  isOutOfBounds(mapWidth, mapHeight) {
    const { x, y } = this;
    return x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
  }

  /**
   * @param {Coordinate} otherCoordinate
   * @returns {number}
   */
  euclidianDistanceTo(otherCoordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  /**
   * @param {Coordinate} otherCoordinate
   * @returns {number}
   */
  manhattanDistanceTo(otherCoordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return Math.abs(x1 - x0) + Math.abs(y1 - y0);
  }

  /**
   * Convert this Coordinate to an integer position
   * @param {number} mapWidth
   * @param {number} mapHeight
   * @returns {number}
   */
  toPosition(mapWidth, mapHeight) {
    if (this.isOutOfBounds(mapWidth, mapHeight)) {
      throw new RangeError('The coordinate must be within the bounds in order to convert to position');
    }

    const { x, y } = this;
    return x + y * mapWidth;
  }

  /**
   * Returns the
   * @returns {Coordinate}
   */
  negated() {
    const { x, y } = this;
    return new Coordinate(-x, -y);
  }

  /**
   * Returns a new coordinate translated by the provided delta
   * @param {{ x: number, y: number }} delta
   * @returns {Coordinate}
   */
  translatedByDelta(delta) {
    const { x, y } = this;
    const { x: dx, y: dy } = delta;
    return new Coordinate(x + dx, y + dy);
  }

  /**
   * Returns a new coordinate translated by the provided direction
   * @param {Direction} direction
   * @returns {Coordinate}
   */
  translatedByDirection(direction) {
    const directionDelta = directionDeltas[direction];

    if (directionDelta === undefined) {
      throw new TypeError(`The direction "${direction}" is invalid`);
    }

    return this.translatedByDelta(directionDelta);
  }
}

class Snake {
  get headCoordinate() {
    return this.coordinates[0];
  }

  get length() {
    return this.coordinates.length;
  }

  /**
   * @param {SnakeInfo} snakeInfo
   * @param {number} mapWidth
   */
  static fromSnakeInfo({ id, name, positions }, mapWidth) {
    const coordinates = positions.map(position => Coordinate.fromPosition(position, mapWidth));
    return new Snake(id, name, coordinates);
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {Coordinate[]} coordinates
   */
  constructor(id, name, coordinates) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
  }
}

export class GameMap {
  get playerSnake() {
    return this.snakes.get(this.playerId);
  }

  /**
   * @param {RawMap} map
   * @param {string} playerId
   */
  constructor(map, playerId) {
    /** @type {Map<string, Snake>} */
    const snakes = new Map();
    /** @type {Map<number, Tile>} */
    const tiles = new Map();

    for (const foodPosition of map.foodPositions) {
      tiles.set(foodPosition, foodTile);
    }

    for (const obstaclePosition of map.obstaclePositions) {
      tiles.set(obstaclePosition, obstactleTile);
    }

    for (const snakeInfo of map.snakeInfos) {
      const snake = Snake.fromSnakeInfo(snakeInfo, map.width);
      snakes.set(snakeInfo.id, snake);
      const snakeTile = createSnakeTile(snake);
      for (const snakePosition of snakeInfo.positions) {
        tiles.set(snakePosition, snakeTile);
      }
    }

    this.playerId = playerId;
    this.width = map.width;
    this.height = map.height;
    this.snakes = snakes;
    this.tiles = tiles;
  }

  /**
   * @param {Coordinate} coordinate
   * @returns {Tile}
   */
  getTile(coordinate) {
    const { width, height } = this;

    if (coordinate.isOutOfBounds(width, height)) {
      return obstactleTile;
    }

    const position = coordinate.toPosition(width, height);
    const tile = this.tiles.get(position);

    if (tile === undefined) {
      return emptyTile;
    }

    return tile;
  }
}
