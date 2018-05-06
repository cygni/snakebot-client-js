export const TileType = Object.freeze({
  Empty: Symbol('Empty'),
  Food: Symbol('Food'),
  Obstacle: Symbol('Obstacle'),
  Snake: Symbol('Snake'),
});

const emptyTile = Object.freeze({ type: TileType.Empty });
const foodTile = Object.freeze({ type: TileType.Food });
const obstactleTile = Object.freeze({ type: TileType.Obstacle });
const createSnakeTile = snake => Object.freeze({ type: TileType.Snake, snake });

export const Direction = Object.freeze({
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
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
  static fromPosition(position, mapWidth) {
    const x = position % mapWidth;
    const y = (position - x) / mapWidth;
    return new Coordinate(x, y);
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  isOutOfBounds(mapWidth, mapHeight) {
    const { x, y } = this;
    return x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
  }

  euclidianDistanceTo({ x: x1, y: y1 }) {
    const { x: x0, y: y0 } = this;
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  manhattanDistanceTo({ x: x1, y: y1 }) {
    const { x: x0, y: y0 } = this;
    return Math.abs(x1 - x0) + Math.abs(y1 - y0);
  }

  toPosition(mapWidth, mapHeight) {
    if (this.isOutOfBounds(mapWidth, mapHeight)) {
      throw new RangeError('The coordinate must be within the bounds in order to convert to position');
    }

    const { x, y } = this;
    return x + y * mapWidth;
  }

  negated() {
    const { x, y } = this;
    return new Coordinate(-x, -y);
  }

  translatedByDelta({ x: dx, y: dy }) {
    const { x, y } = this;
    return new Coordinate(x + dx, y + dy);
  }

  translatedByDirection(direction) {
    return this.translatedByDelta(directionDeltas[direction]);
  }
}

class Snake {
  get headCoordinate() {
    return this.coordinates[0];
  }

  get length() {
    return this.coordinates.length;
  }

  static fromSnakeInfo({ id, name, positions }, mapWidth) {
    return new Snake(id, name, positions.map(position => Coordinate.fromPosition(position, mapWidth)));
  }

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

  constructor(map, playerId) {
    const snakes = new Map();
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
    this._tiles = tiles;
  }

  getTile(coordinate) {
    const { width, height } = this;

    if (coordinate.isOutOfBounds(width, height)) {
      return obstactleTile;
    }

    const position = coordinate.toPosition(width, height);
    if (this._tiles.has(position)) {
      return this._tiles.get(position);
    }

    return emptyTile;
  }
}
