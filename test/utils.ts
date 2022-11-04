import { strict as assert } from 'assert';
import { Direction, RawMap, SnakeInfo, TileType, RelativeDirection, GameSettings } from '../src/types';
import { Coordinate, GameMap, Snake } from '../src/utils';

describe('Direction', () => {
  it('has the correct directions', () => {
    assert.equal(Direction.Up, 'UP');
    assert.equal(Direction.Down, 'DOWN');
    assert.equal(Direction.Left, 'LEFT');
    assert.equal(Direction.Right, 'RIGHT');
  });
});

describe('Coordinate', () => {
  it('creates a coordinate object from x and y', () => {
    const x = 1;
    const y = 2;

    const coordinate = new Coordinate(x, y);

    assert.equal(coordinate.x, x);
    assert.equal(coordinate.y, y);
  });

  it('negates the coordinate', () => {
    const x = 1;
    const y = 2;

    const coordinate = new Coordinate(x, y);
    const negatedCoordinate = coordinate.negated();

    assert.notEqual(negatedCoordinate, coordinate);
    assert.equal(negatedCoordinate.x, -x);
    assert.equal(negatedCoordinate.y, -y);
  });

  it('translates the coordinate by delta', () => {
    const x = 1;
    const y = 2;

    const coordinate = new Coordinate(x, -y);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.throws(() => coordinate.translateByDelta(undefined));

    const translatedCoordinate = coordinate.translateByDelta({ x, y });

    assert.notEqual(translatedCoordinate, coordinate);
    assert.equal(translatedCoordinate.x, 2 * x);
    assert.equal(translatedCoordinate.y, 0);
  });

  it('translates the coordinate by direction', () => {
    const coordinate = new Coordinate(0, 0);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.throws(() => coordinate.translateByDirection(undefined));

    assert.deepEqual(coordinate.translateByDirection(Direction.Up), new Coordinate(0, -1));
    assert.deepEqual(coordinate.translateByDirection(Direction.Down), new Coordinate(0, 1));
    assert.deepEqual(coordinate.translateByDirection(Direction.Left), new Coordinate(-1, 0));
    assert.deepEqual(coordinate.translateByDirection(Direction.Right), new Coordinate(1, 0));
  });

  it('computes the euclidian distance', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.equal(coordinateA.euclidianDistanceTo(coordinateB), 5);
    assert.equal(coordinateB.euclidianDistanceTo(coordinateA), 5);
  });

  it('computes the manhattan distance', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.equal(coordinateA.manhattanDistanceTo(coordinateB), 7);
    assert.equal(coordinateB.manhattanDistanceTo(coordinateA), 7);
  });

  it('computes the delta to another coordinate', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.deepEqual(coordinateA.deltaTo(coordinateB), { x: 3, y: 4 });
    assert.deepEqual(coordinateB.deltaTo(coordinateA), { x: -3, y: -4 });
  });

  it('checks if it is within square', () => {
    let northwest = new Coordinate(2, 2);
    const southeast = new Coordinate(3, 3);

    assert.equal(new Coordinate(2, 1).isWithinSquare(northwest, southeast), false);
    assert.equal(new Coordinate(2, 2).isWithinSquare(northwest, southeast), true);
    assert.equal(new Coordinate(2, 3).isWithinSquare(northwest, southeast), true);
    assert.equal(new Coordinate(2, 4).isWithinSquare(northwest, southeast), false);
    assert.equal(new Coordinate(2, -1).isWithinSquare(northwest, southeast), false);

    assert.equal(new Coordinate(1, 1).isWithinSquare(northwest, southeast), false);
    assert.equal(new Coordinate(1, 2).isWithinSquare(northwest, southeast), false);
    assert.equal(new Coordinate(1, 3).isWithinSquare(northwest, southeast), false);
    northwest = new Coordinate(1, 2);
    assert.equal(new Coordinate(1, 1).isWithinSquare(northwest, southeast), false);
    assert.equal(new Coordinate(1, 2).isWithinSquare(northwest, southeast), true);
    assert.equal(new Coordinate(1, 3).isWithinSquare(northwest, southeast), true);
  });

  it('determines if it is out of bounds', () => {
    const mapWidth = 4;
    const mapHeight = 3;

    assert.equal(new Coordinate(0, -1).isOutOfBounds(mapWidth, mapHeight), true);
    assert.equal(new Coordinate(0, 0).isOutOfBounds(mapWidth, mapHeight), false);
    assert.equal(new Coordinate(0, 1).isOutOfBounds(mapWidth, mapHeight), false);

    assert.equal(new Coordinate(-1, 0).isOutOfBounds(mapWidth, mapHeight), true);
    assert.equal(new Coordinate(0, 0).isOutOfBounds(mapWidth, mapHeight), false);
    assert.equal(new Coordinate(1, 0).isOutOfBounds(mapWidth, mapHeight), false);

    assert.equal(new Coordinate(mapWidth - 1, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), false);
    assert.equal(new Coordinate(mapWidth - 1, mapHeight + 0).isOutOfBounds(mapWidth, mapHeight), true);
    assert.equal(new Coordinate(mapWidth - 1, mapHeight + 1).isOutOfBounds(mapWidth, mapHeight), true);

    assert.equal(new Coordinate(mapWidth - 1, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), false);
    assert.equal(new Coordinate(mapWidth + 0, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), true);
    assert.equal(new Coordinate(mapWidth + 1, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), true);
  });

  it('converts to a map position', () => {
    const mapWidth = 3;
    const mapHeight = 4;

    // It throws if it's out of bounds
    assert.throws(() => new Coordinate(0, -1).toPosition(mapWidth, mapHeight));
    assert.throws(() => new Coordinate(0, mapHeight).toPosition(mapWidth, mapHeight));
    assert.throws(() => new Coordinate(-1, 0).toPosition(mapWidth, mapHeight));
    assert.throws(() => new Coordinate(mapWidth, 0).toPosition(mapWidth, mapHeight));

    assert.equal(new Coordinate(0, 0).toPosition(mapWidth, mapHeight), 0);
    assert.equal(new Coordinate(mapWidth - 1, 0).toPosition(mapWidth, mapHeight), mapWidth - 1);
    assert.equal(new Coordinate(0, 1).toPosition(mapWidth, mapHeight), mapWidth);
    assert.equal(new Coordinate(0, mapHeight - 1).toPosition(mapWidth, mapHeight), (mapHeight - 1) * mapWidth);
    assert.equal(
      new Coordinate(mapWidth - 1, mapHeight - 1).toPosition(mapWidth, mapHeight),
      mapWidth - 1 + (mapHeight - 1) * mapWidth,
    );
  });

  it('creates a coordinate object from a map position', () => {
    const mapWidth = 3;
    const mapHeight = 4;

    assert.deepEqual(Coordinate.fromPosition(0, mapWidth), new Coordinate(0, 0));
    assert.deepEqual(Coordinate.fromPosition(mapWidth - 1, mapWidth), new Coordinate(mapWidth - 1, 0));
    assert.deepEqual(Coordinate.fromPosition(mapWidth, mapWidth), new Coordinate(0, 1));
    assert.deepEqual(Coordinate.fromPosition((mapHeight - 1) * mapWidth, mapWidth), new Coordinate(0, mapHeight - 1));
    assert.deepEqual(
      Coordinate.fromPosition(mapWidth - 1 + (mapHeight - 1) * mapWidth, mapWidth),
      new Coordinate(mapWidth - 1, mapHeight - 1),
    );
  });

  it('translates a coordinate', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);
    const delta = coordinateA.deltaTo(coordinateB);
    assert.deepEqual(coordinateA.translateByDelta(delta), coordinateB);
    const coordinateBackAndForth = coordinateA.translateByDelta(coordinateB).translateByDelta(coordinateB.negated());
    assert.notEqual(coordinateBackAndForth, coordinateA); // Check that it is a new object
    assert.deepEqual(coordinateBackAndForth, coordinateA);

    assert.deepEqual(coordinateA.translateByDirection(Direction.Down), new Coordinate(0, 1));
    assert.deepEqual(coordinateA.translateByDirection(Direction.Up), new Coordinate(0, -1));
    assert.deepEqual(coordinateA.translateByDirection(Direction.Left), new Coordinate(-1, 0));
    assert.deepEqual(coordinateA.translateByDirection(Direction.Right), new Coordinate(1, 0));
  });

  it('calculates the direction to a neighbouring coordinate', () => {
    const coordinateA = new Coordinate(3, 4);

    let coordinateB = new Coordinate(4, 4);
    assert.equal(coordinateA.directionTo(coordinateB), Direction.Right);
    coordinateB = new Coordinate(3, 5);
    assert.equal(coordinateA.directionTo(coordinateB), Direction.Down);
    coordinateB = new Coordinate(2, 4);
    assert.equal(coordinateA.directionTo(coordinateB), Direction.Left);
    coordinateB = new Coordinate(3, 3);
    assert.equal(coordinateA.directionTo(coordinateB), Direction.Up);

    coordinateB = new Coordinate(4, 3);
    assert.throws(() => coordinateA.directionTo(coordinateB));
    coordinateB = new Coordinate(3, 4);
    assert.throws(() => coordinateA.directionTo(coordinateB));
    coordinateB = new Coordinate(3, 6);
    assert.throws(() => coordinateA.directionTo(coordinateB));
  });
});

describe('Map', () => {
  const snake1Info: SnakeInfo = {
    name: 'snake1-name',
    points: 7,
    positions: [0, 1],
    tailProtectedForGameTicks: 3,
    id: 'player-id',
  };

  const rawMap: RawMap = {
    width: 3,
    height: 4,
    worldTick: 0,
    snakeInfos: [snake1Info],
    foodPositions: [2, 3],
    obstaclePositions: [4, 5],
  };

  const map = new GameMap(rawMap, 'player-id', {} as GameSettings, 0);

  it('creates a map', () => {
    assert.equal(map.width, 3);
    assert.equal(map.height, 4);
    assert.equal(map.playerId, 'player-id');
    assert.equal(map.snakes.size, 1);

    // Check that the snake is correct
    const snake = Snake.fromSnakeInfo(snake1Info, map.width, map);
    assert.deepEqual(map.snakes.get(snake1Info.id), snake);
    assert.equal(map.playerSnake, map.snakes.get(snake1Info.id));
  });

  it('check tiletype', () => {
    assert.equal(map.getTileType(new Coordinate(0, 0)), TileType.Snake);
    assert.equal(map.getTileType(new Coordinate(1, 0)), TileType.Snake);
    assert.equal(map.getTileType(new Coordinate(2, 0)), TileType.Food);
    assert.equal(map.getTileType(new Coordinate(0, 1)), TileType.Food);
    assert.equal(map.getTileType(new Coordinate(1, 1)), TileType.Obstacle);
    assert.equal(map.getTileType(new Coordinate(2, 1)), TileType.Obstacle);
    assert.equal(map.getTileType(new Coordinate(0, 2)), TileType.Empty);
    assert.equal(map.getTileType(new Coordinate(1, 2)), TileType.Empty);
    assert.equal(map.getTileType(new Coordinate(2, 2)), TileType.Empty);
    assert.equal(map.getTileType(new Coordinate(0, 3)), TileType.Empty);
    assert.equal(map.getTileType(new Coordinate(1, 3)), TileType.Empty);
    assert.equal(map.getTileType(new Coordinate(2, 3)), TileType.Empty);

    // Out of bounds
    assert.equal(map.getTileType(new Coordinate(0, 4)), TileType.Obstacle);
    assert.equal(map.getTileType(new Coordinate(0, -1)), TileType.Obstacle);
    assert.equal(map.getTileType(new Coordinate(-1, 0)), TileType.Obstacle);
    assert.equal(map.getTileType(new Coordinate(3, 0)), TileType.Obstacle);
  });

  it('check tile free', () => {
    assert.equal(map.isTileFree(new Coordinate(0, 0)), false); // Snake
    assert.equal(map.isTileFree(new Coordinate(2, 0)), true); // Food
    assert.equal(map.isTileFree(new Coordinate(1, 1)), false); // Obstacle
    assert.equal(map.isTileFree(new Coordinate(0, 2)), true); // Empty
  });

  describe('Snake', () => {
    const snake = map.playerSnake;
    it('snake added to map', () => {
      assert.deepEqual(
        snake,
        new Snake(
          snake1Info.id,
          snake1Info.name,
          Direction.Left,
          snake1Info.positions.map((absPos) => Coordinate.fromPosition(absPos, map.width)),
          map,
        ),
      );

      assert.equal(snake.id, snake1Info.id);
      assert.equal(snake.name, snake1Info.name);
      assert.equal(snake.direction, Direction.Left);
      assert.deepEqual(snake.coordinates, [new Coordinate(0, 0), new Coordinate(1, 0)]);
      assert.equal(snake.map, map); // Check same map reference
      assert.equal(snake.length, 2);
    });

    it('direction calculation', () => {
      const tempSnakeInfo = { ...snake1Info };
      let tempSnake = Snake.fromSnakeInfo(tempSnakeInfo, map.width, map);
      assert.equal(tempSnake.direction, Direction.Left);

      tempSnakeInfo.positions = [1, 0];
      tempSnake = Snake.fromSnakeInfo(tempSnakeInfo, map.width, map);
      assert.equal(tempSnake.direction, Direction.Right);

      tempSnakeInfo.positions = [0, new Coordinate(0, 1).toPosition(map.width, map.height)];
      tempSnake = Snake.fromSnakeInfo(tempSnakeInfo, map.width, map);
      assert.equal(tempSnake.direction, Direction.Up);

      tempSnakeInfo.positions = [new Coordinate(0, 1).toPosition(map.width, map.height), 0];
      tempSnake = Snake.fromSnakeInfo(tempSnakeInfo, map.width, map);
      assert.equal(tempSnake.direction, Direction.Down);
    });

    it('can move in direction', () => {
      assert.equal(snake.canMoveInDirection(Direction.Down), true);
      assert.equal(snake.canMoveInDirection(Direction.Up), false);
      assert.equal(snake.canMoveInDirection(Direction.Left), false);
      assert.equal(snake.canMoveInDirection(Direction.Right), false);
    });

    it('convert relative direction to absolute', () => {
      snake.direction = Direction.Left;
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Forward), Direction.Left);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Left), Direction.Down);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Right), Direction.Up);

      snake.direction = Direction.Right;
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Forward), Direction.Right);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Left), Direction.Up);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Right), Direction.Down);

      snake.direction = Direction.Up;
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Forward), Direction.Up);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Left), Direction.Left);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Right), Direction.Right);

      snake.direction = Direction.Down;
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Forward), Direction.Down);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Left), Direction.Right);
      assert.equal(snake.relativeToAbsolute(RelativeDirection.Right), Direction.Left);

      snake.direction = Direction.Left; // Back to original direction
    });

    it('head coordinate first coordinate', () => {
      assert.equal(snake.headCoordinate, snake.coordinates[0]);
      assert.deepEqual(snake.headCoordinate, new Coordinate(0, 0));
    });

    it('tail coordinate last coordinate', () => {
      assert.equal(snake.tailCoordinate, snake.coordinates[snake.coordinates.length - 1]);
      assert.deepEqual(snake.tailCoordinate, new Coordinate(1, 0));
    });
  });
});
