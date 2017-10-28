
const chai = require('chai');
const expect = chai.expect;

const map = require('../domain/mamba/gameMap');
const snakeInfos = require('../domain/mamba/snakeInfos');
const mapUtils = require('../domain/mapUtils');

describe('Map utils', () => {
    beforeEach(() => {
    });

    it('canIMoveInDirection', () => {
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

        expect(mapUtils.canIMoveInDirection(
            'UP',
            { x: 0, y: 0 },
            m
        )).to.be.false;

        expect(mapUtils.canIMoveInDirection(
            'LEFT',
            { x: 0, y: 0 },
            m
        )).to.be.false;

        //Obstacle under
        expect(mapUtils.canIMoveInDirection(
            'DOWN',
            { x: 0, y: 0 },
            m
        )).to.be.false;

        expect(mapUtils.canIMoveInDirection(
            'RIGHT',
            { x: 0, y: 0 },
            m
        )).to.be.true;

        //Food to the right
        expect(mapUtils.canIMoveInDirection(
            'UP',
            { x: 1, y: 0 },
            m
        )).to.be.false;

        expect(mapUtils.canIMoveInDirection(
            'LEFT',
            { x: 1, y: 0 },
            m
        )).to.be.true;

        expect(mapUtils.canIMoveInDirection(
            'DOWN',
            { x: 1, y: 0 },
            m
        )).to.be.true;

        expect(mapUtils.canIMoveInDirection(
            'RIGHT',
            { x: 1, y: 0 },
            m
        )).to.be.true;

        //Snake under
        expect(mapUtils.canIMoveInDirection(
            'DOWN',
            { x: 5, y: 4 },
            m
        )).to.be.false;

        expect(mapUtils.canIMoveInDirection(
            'DOWN',
            { x: 6, y: 4 },
            m
        )).to.be.false;

        // Snake under but tail
        expect(mapUtils.canIMoveInDirection(
            'DOWN',
            { x: 7, y: 4 },
            m
        )).to.be.true;
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

    afterEach(() => {
    });
});
