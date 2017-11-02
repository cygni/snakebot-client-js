
const chai = require('chai');
const expect = chai.expect;

const map = require('../domain/mamba/gameMap');
const snakeInfos = require('../domain/mamba/snakeInfos');
const mapUtils = require('../domain/mapUtils');

describe('Map utils', () => {
    beforeEach(() => {
    });

    it('canSnakeMoveInDirection', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            '1');
        const snakes = [snake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        expect(mapUtils.canSnakeMoveInDirection(
            'UP',
            { x: 0, y: 0 },
            m
        )).to.be.false;

        expect(mapUtils.canSnakeMoveInDirection(
            'LEFT',
            { x: 0, y: 0 },
            m
        )).to.be.false;

        //Obstacle under
        expect(mapUtils.canSnakeMoveInDirection(
            'DOWN',
            { x: 0, y: 0 },
            m
        )).to.be.false;

        expect(mapUtils.canSnakeMoveInDirection(
            'RIGHT',
            { x: 0, y: 0 },
            m
        )).to.be.true;

        //Food to the right
        expect(mapUtils.canSnakeMoveInDirection(
            'UP',
            { x: 1, y: 0 },
            m
        )).to.be.false;

        expect(mapUtils.canSnakeMoveInDirection(
            'LEFT',
            { x: 1, y: 0 },
            m
        )).to.be.true;

        expect(mapUtils.canSnakeMoveInDirection(
            'DOWN',
            { x: 1, y: 0 },
            m
        )).to.be.true;

        expect(mapUtils.canSnakeMoveInDirection(
            'RIGHT',
            { x: 1, y: 0 },
            m
        )).to.be.true;

        //Snake under
        expect(mapUtils.canSnakeMoveInDirection(
            'DOWN',
            { x: 5, y: 4 },
            m
        )).to.be.false;

        expect(mapUtils.canSnakeMoveInDirection(
            'DOWN',
            { x: 6, y: 4 },
            m
        )).to.be.false;

        // Snake under but tail
        expect(mapUtils.canSnakeMoveInDirection(
            'DOWN',
            { x: 7, y: 4 },
            m
        )).to.be.false;
    });

    it('getTileAt', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            '1');
        const snakes = [snake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        expect(mapUtils.getTileAt(
            {
                x: -1,
                y: 0
            },
            m)).to.deep.equal({
                content: 'outofbounds'
            });

        expect(mapUtils.getTileAt(
            {
                x: 0,
                y: -1
            },
            m)).to.deep.equal({
                content: 'outofbounds'
            });

        expect(mapUtils.getTileAt(
            {
                x: 10,
                y: 0
            },
            m)).to.deep.equal({
                content: 'outofbounds'
            });

        expect(mapUtils.getTileAt(
            {
                x: 0,
                y: 10
            },
            m)).to.deep.equal({
                content: 'outofbounds'
            });

        expect(mapUtils.getTileAt(
            {
                x: 0,
                y: 1
            },
            m)).to.deep.equal({
                content: 'obstacle'
            });

        expect(mapUtils.getTileAt(
            {
                x: 2,
                y: 0
            },
            m)).to.deep.equal({
                content: 'food'
            });

        expect(mapUtils.getTileAt(
            {
                x: 5,
                y: 5
            },
            m)).to.deep.equal({
                content: 'snakehead'
            });


        expect(mapUtils.getTileAt(
            {
                x: 6,
                y: 5
            },
            m)).to.deep.equal({
                content: 'snakebody'
            });


        expect(mapUtils.getTileAt(
            {
                x: 7,
                y: 5
            },
            m)).to.deep.equal({
                content: 'snaketail'
            });
    });

    it('Get tile in direction should throw with bad direction', () => {
        expect(() => mapUtils.getTileInDirection('hej')).to.throw();
    });

    it('isTileAvaliableForMovementTo', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            '1');
        const snakes = [snake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 0,
                y: 0
            },
            m)).to.be.true;

        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 0,
                y: 10
            },
            m)).to.be.false;

        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 0,
                y: 1
            },
            m)).to.be.false;

        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 2,
                y: 0
            },
            m)).to.be.true;

        //head
        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 5,
                y: 5
            },
            m)).to.be.false;

        //body
        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 6,
                y: 5
            },
            m)).to.be.false;

        //tail
        expect(mapUtils.isTileAvailableForMovementTo(
            {
                x: 7,
                y: 5
            },
            m)).to.be.false;
    });


    it('isWithinSquare', () => {
        expect(mapUtils.isWithinSquare(
            {
                x: 3,
                y: 3
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.true;

        expect(mapUtils.isWithinSquare(
            {
                x: 0,
                y: 0
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.true;

        expect(mapUtils.isWithinSquare(
            {
                x: 6,
                y: 6
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.true;

        expect(mapUtils.isWithinSquare(
            {
                x: 6,
                y: -1
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.false;

        expect(mapUtils.isWithinSquare(
            {
                x: -1,
                y: 6
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.false;

        expect(mapUtils.isWithinSquare(
            {
                x: 6,
                y: 7
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.false;

        expect(mapUtils.isWithinSquare(
            {
                x: 7,
                y: 6
            },
            {
                x: 0,
                y: 0
            },
            {
                x: 6,
                y: 6
            }
        )).to.be.false;
    });


    it('getSnakesCoordinates', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            'snakeId');

        const otherSnake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            'otherSnakeId');

        const snakes = [snake, otherSnake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        const snakeCoords = mapUtils.getSnakesCoordinates(m, ['otherSnakeId']);

        expect(Object.keys(snakeCoords).length).to.be.equal(1);
        expect(snakeCoords['snakeId'].length).to.be.equal(3);
    });

    it('sortByClosestTo', () => {
        const sorted = mapUtils.sortByClosestTo(
            [
                {
                    x: 0,
                    y: 0
                },
                {
                    x: 10,
                    y: 10
                },
                {
                    x: 9,
                    y: 9
                }
            ],
            {
                x: 0,
                y: 0
            });

        expect(sorted[0]).to.deep.equal({x:0,y:0});
        expect(sorted[1]).to.deep.equal({x:9,y:9});
        expect(sorted[2]).to.deep.equal({x:10,y:10});
    });

    it('getSnakeLength', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            'snakeId');
        const snakes = [snake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        expect(mapUtils.getSnakeLength('snakeId', m)).to.be.equal(3);
    });

    it('listCoordinatesContainingFood', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            'snakeId');
        const snakes = [snake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        const f = mapUtils.listCoordinatesContainingFood('snakeId', m);
        expect(f.length).to.be.equal(1);
        expect(f[0]).to.deep.equal({x:2, y:0});
    });

    it('listCoordinatesContainingObstacle', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            'snakeId');
        const snakes = [snake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        const o= mapUtils.listCoordinatesContainingObstacle('snakeId', m);
        expect(o.length).to.be.equal(1);
        expect(o[0]).to.deep.equal({x:0, y:1});
    });

    it('getSnakePosition', () => {
        const food = [2];
        const obstacles = [10];
        const snake = snakeInfos.new(
            's1',
            0,
            mapUtils.translateCoordinates([
                { x: 5, y: 5},
                { x: 6, y: 5},
                { x: 7, y: 5}
            ], 10),
            'snakeId');

        const deadSnake= snakeInfos.new(
            's1',
            0,
            [],
            'deadSnakeId');

        const snakes = [snake, deadSnake];
        const m = map.new(10, 10, 1, food, obstacles, snakes);

        const snakePosition = mapUtils.getSnakePosition('snakeId', m);
        const deadSnakePosition = mapUtils.getSnakePosition('deadSnakeId', m);

        expect(snakePosition).to.deep.equal({x: 5, y: 5, alive: true});
        expect(deadSnakePosition).to.deep.equal({x: 0, y: 0, alive: false});
    });

    it('translatePositions', () => {
        expect(mapUtils.translatePositions([9, 10, 11], 10)).to.deep.equal([
            {
                x: 9,
                y: 0
            },
            {
                x: 0,
                y: 1
            },
            {
                x: 1,
                y: 1
            }
        ]);
    });

    it('eucleudian distance', () => {
        expect(mapUtils.getEuclidianDistance(
            {
                x: 0,
                y: 0
            },
            {
                x: 4,
                y: 3
            })).to.be.equal(5);
    });

    afterEach(() => {
    });
});
