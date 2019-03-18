import { strict as assert } from 'assert';
import { Direction, Coordinate } from './utils.js';

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

    // @ts-ignore
    assert.throws(() => coordinate.translatedByDelta(undefined));

    const translatedCoordinate = coordinate.translatedByDelta({ x, y });

    assert.notEqual(translatedCoordinate, coordinate);
    assert.equal(translatedCoordinate.x, 2 * x);
    assert.equal(translatedCoordinate.y, 0);
  });

  it('translates the coordinate by direction', () => {
    const coordinate = new Coordinate(0, 0);

    // @ts-ignore
    assert.throws(() => coordinate.translatedByDirection(undefined));

    assert.deepEqual(coordinate.translatedByDirection(Direction.Up), new Coordinate(0, -1));
    assert.deepEqual(coordinate.translatedByDirection(Direction.Down), new Coordinate(0, 1));
    assert.deepEqual(coordinate.translatedByDirection(Direction.Left), new Coordinate(-1, 0));
    assert.deepEqual(coordinate.translatedByDirection(Direction.Right), new Coordinate(1, 0));
  });

  it('computes the euclidian distance', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.equal(coordinateA.euclidianDistanceTo(coordinateB), 5);
  });

  it('computes the manhattan distance', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.equal(coordinateA.manhattanDistanceTo(coordinateB), 7);
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
});
