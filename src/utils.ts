export type Tile = {
  type: TileType;
  snake?: Snake;
};

export type SnakeInfo = {
  id: string;
  name: string;
  positions: number[];
};

export type RawMap = {
  width: number;
  height: number;
  foodPositions: number[];
  obstaclePositions: number[];
  snakeInfos: SnakeInfo[];
};

export enum TileType {
  Empty = 'Empty',
  Food = 'Food',
  Obstacle = 'Obstacle',
  Snake = 'Snake',
}

export enum GameMode {
  Training = 'TRAINING',
  Tournament = 'TOURNAMENT',
}

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

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

export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromPosition(position: number, mapWidth: number) {
    const x = position % mapWidth;
    const y = (position - x) / mapWidth;
    return new Coordinate(x, y);
  }

  isOutOfBounds(mapWidth: number, mapHeight: number) {
    const { x, y } = this;
    return x < 0 || y < 0 || x >= mapWidth || y >= mapHeight;
  }

  euclidianDistanceTo(otherCoordinate: Coordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  manhattanDistanceTo(otherCoordinate: Coordinate) {
    const { x: x0, y: y0 } = this;
    const { x: x1, y: y1 } = otherCoordinate;
    return Math.abs(x1 - x0) + Math.abs(y1 - y0);
  }

  toPosition(mapWidth: number, mapHeight: number) {
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

  translatedByDelta(delta: { x: number; y: number }) {
    const { x, y } = this;
    const { x: dx, y: dy } = delta;
    return new Coordinate(x + dx, y + dy);
  }

  translatedByDirection(direction: Direction) {
    const directionDelta = getDirectionDelta(direction);
    return this.translatedByDelta(directionDelta);
  }
}

class Snake {
  id: string;
  name: string;
  coordinates: Coordinate[];

  constructor(id: string, name: string, coordinates: Coordinate[]) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
  }

  get headCoordinate() {
    return this.coordinates[0];
  }

  get length() {
    return this.coordinates.length;
  }

  static fromSnakeInfo(snakeInfo: SnakeInfo, mapWidth: number) {
    const { id, name, positions } = snakeInfo;
    const coordinates = positions.map(position => Coordinate.fromPosition(position, mapWidth));
    return new Snake(id, name, coordinates);
  }
}

export class GameMap {
  playerId: string;
  width: number;
  height: number;
  snakes: Map<string, Snake>;
  tiles: Map<number, TileType>;

  constructor(map: RawMap, playerId: string) {
    const snakes = new Map<string, Snake>();
    const tiles = new Map<number, TileType>();

    for (const foodPosition of map.foodPositions) {
      tiles.set(foodPosition, TileType.Food);
    }

    for (const obstaclePosition of map.obstaclePositions) {
      tiles.set(obstaclePosition, TileType.Obstacle);
    }

    for (const snakeInfo of map.snakeInfos) {
      const snake = Snake.fromSnakeInfo(snakeInfo, map.width);
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
  }

  get playerSnake() {
    return this.snakes.get(this.playerId);
  }

  getTile(coordinate: Coordinate) {
    const { width, height } = this;

    if (coordinate.isOutOfBounds(width, height)) {
      return TileType.Obstacle;
    }

    const position = coordinate.toPosition(width, height);
    const tile = this.tiles.get(position);

    if (tile === undefined) {
      // console.error(`No tile found at position ${position}`);
      return TileType.Empty;
    }

    return tile;
  }
}
