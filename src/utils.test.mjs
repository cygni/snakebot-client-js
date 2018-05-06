/* eslint-env mocha */
/* eslint-disable import/no-nodejs-modules */
import assert from 'assert';
import { Direction, Coordinate } from './utils.mjs';

describe('Direction', () => {
  it('has the correct directions', () => {
    assert.strictEqual(Direction.Up, 'UP');
    assert.strictEqual(Direction.Down, 'DOWN');
    assert.strictEqual(Direction.Left, 'LEFT');
    assert.strictEqual(Direction.Right, 'RIGHT');
  });
});

describe('Coordinate', () => {
  it('creates a coordinate object from x and y', () => {
    const x = 1;
    const y = 2;

    const coordinate = new Coordinate(x, y);

    assert.strictEqual(coordinate.x, x);
    assert.strictEqual(coordinate.y, y);
  });

  it('negates the coordinate', () => {
    const x = 1;
    const y = 2;

    const coordinate = new Coordinate(x, y);
    const negatedCoordinate = coordinate.negated();

    assert.notStrictEqual(negatedCoordinate, coordinate);
    assert.strictEqual(negatedCoordinate.x, -x);
    assert.strictEqual(negatedCoordinate.y, -y);
  });

  it('translates the coordinate by delta', () => {
    const x = 1;
    const y = 2;

    const coordinate = new Coordinate(x, -y);

    assert.throws(() => coordinate.translatedByDelta(undefined));

    const translatedCoordinate = coordinate.translatedByDelta({ x, y });

    assert.notStrictEqual(translatedCoordinate, coordinate);
    assert.strictEqual(translatedCoordinate.x, 2 * x);
    assert.strictEqual(translatedCoordinate.y, 0);
  });

  it('translates the coordinate by direction', () => {
    const coordinate = new Coordinate(0, 0);

    assert.throws(() => coordinate.translatedByDirection(undefined));

    assert.deepStrictEqual(coordinate.translatedByDirection(Direction.Up), new Coordinate(0, -1));
    assert.deepStrictEqual(coordinate.translatedByDirection(Direction.Down), new Coordinate(0, 1));
    assert.deepStrictEqual(coordinate.translatedByDirection(Direction.Left), new Coordinate(-1, 0));
    assert.deepStrictEqual(coordinate.translatedByDirection(Direction.Right), new Coordinate(1, 0));
  });

  it('computes the euclidian distance', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.strictEqual(coordinateA.euclidianDistanceTo(coordinateB), 5);
  });

  it('computes the manhattan distance', () => {
    const coordinateA = new Coordinate(0, 0);
    const coordinateB = new Coordinate(3, 4);

    assert.strictEqual(coordinateA.manhattanDistanceTo(coordinateB), 7);
  });

  it('determines if it is out of bounds', () => {
    const mapWidth = 4;
    const mapHeight = 3;

    assert.strictEqual(new Coordinate(0, -1).isOutOfBounds(mapWidth, mapHeight), true);
    assert.strictEqual(new Coordinate(0, 0).isOutOfBounds(mapWidth, mapHeight), false);
    assert.strictEqual(new Coordinate(0, 1).isOutOfBounds(mapWidth, mapHeight), false);

    assert.strictEqual(new Coordinate(-1, 0).isOutOfBounds(mapWidth, mapHeight), true);
    assert.strictEqual(new Coordinate(0, 0).isOutOfBounds(mapWidth, mapHeight), false);
    assert.strictEqual(new Coordinate(1, 0).isOutOfBounds(mapWidth, mapHeight), false);

    assert.strictEqual(new Coordinate(mapWidth - 1, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), false);
    assert.strictEqual(new Coordinate(mapWidth - 1, mapHeight + 0).isOutOfBounds(mapWidth, mapHeight), true);
    assert.strictEqual(new Coordinate(mapWidth - 1, mapHeight + 1).isOutOfBounds(mapWidth, mapHeight), true);

    assert.strictEqual(new Coordinate(mapWidth - 1, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), false);
    assert.strictEqual(new Coordinate(mapWidth + 0, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), true);
    assert.strictEqual(new Coordinate(mapWidth + 1, mapHeight - 1).isOutOfBounds(mapWidth, mapHeight), true);
  });

  it('converts to a map position', () => {
    const mapWidth = 3;
    const mapHeight = 4;

    // It throws if it's out of bounds
    assert.throws(() => new Coordinate(0, -1).toPosition(mapWidth, mapHeight));
    assert.throws(() => new Coordinate(0, mapHeight).toPosition(mapWidth, mapHeight));
    assert.throws(() => new Coordinate(-1, 0).toPosition(mapWidth, mapHeight));
    assert.throws(() => new Coordinate(mapWidth, 0).toPosition(mapWidth, mapHeight));

    assert.strictEqual(new Coordinate(0, 0).toPosition(mapWidth, mapHeight), 0);
    assert.strictEqual(new Coordinate(mapWidth - 1, 0).toPosition(mapWidth, mapHeight), mapWidth - 1);
    assert.strictEqual(new Coordinate(0, 1).toPosition(mapWidth, mapHeight), mapWidth);
    assert.strictEqual(new Coordinate(0, mapHeight - 1).toPosition(mapWidth, mapHeight), (mapHeight - 1) * mapWidth);
    assert.strictEqual(
      new Coordinate(mapWidth - 1, mapHeight - 1).toPosition(mapWidth, mapHeight),
      mapWidth - 1 + (mapHeight - 1) * mapWidth,
    );
  });

  it('creates a coordinate object from a map position', () => {
    const mapWidth = 3;
    const mapHeight = 4;

    assert.deepStrictEqual(Coordinate.fromPosition(0, mapWidth), new Coordinate(0, 0));
    assert.deepStrictEqual(Coordinate.fromPosition(mapWidth - 1, mapWidth), new Coordinate(mapWidth - 1, 0));
    assert.deepStrictEqual(Coordinate.fromPosition(mapWidth, mapWidth), new Coordinate(0, 1));
    assert.deepStrictEqual(
      Coordinate.fromPosition((mapHeight - 1) * mapWidth, mapWidth),
      new Coordinate(0, mapHeight - 1),
    );
    assert.deepStrictEqual(
      Coordinate.fromPosition(mapWidth - 1 + (mapHeight - 1) * mapWidth, mapWidth),
      new Coordinate(mapWidth - 1, mapHeight - 1),
    );
  });
});
