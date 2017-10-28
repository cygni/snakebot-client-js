const SnakeInfos = require('./snakeInfos.js');

/**
 * GameMap
 *
 * @param {number} width Width of the map.
 * @param {number} height Height of the map.
 * @param {number} worldTick The current world tick.
 * @param {array<number>} foodPositions Positions of food in the map
 * @param {array<number>} obstaclePositions Positions of obstacles in the map.
 * @param {array<SnakeInfos>} snakeInfos The snakes in the map.
 * @returns {object}
 * @constructor
 */
function GameMap(width, height, worldTick, foodPositions, obstaclePositions, snakeInfos) {
    const type = 'Map';
    let _width = width;
    let _height = height;
    let _worldTick = worldTick;
    let _foodPositions = foodPositions;
    let _obstaclePositions = obstaclePositions;
    let _snakeInfos = snakeInfos;

    const toString = function () {
        return `<Type:${type}, width:${_width}, height:${_height}worldTick:${_worldTick
        }, foodPositions:${_foodPositions}, obstaclePositions:${_obstaclePositions}, snakeInfos:${_snakeInfos}>`;
    };

    /**
     * Get map width.
     *
     * @return {number} Map width.
     */
    function getWidth() {
        return _width;
    }

    /**
     * Get map height.
     *
     * @return {number} Map height.
     */
    function getHeight() {
        return _height;
    }

    /**
     * Get world tick.
     *
     * @return {number} Current world tick.
     */
    function getWorldTick() {
        return _worldTick;
    }

    /**
     * Get food positions.
     *
     * @return {array<number>} Array of food positions.
     */
    function getFoodPositions() {
        return _foodPositions;
    }

    /**
     * Get food positions.
     *
     * @return {array<number>} Array of obstacle positions.
     */
    function getObstaclePositions() {
        return _obstaclePositions;
    }

    /**
     * Get food positions.
     *
     * @return {array<snakeinfo>} Array of snake infos.
     */
    function getSnakeInfos() {
        return _snakeInfos;
    }

    /**
     * Get the snake info for a specific snake.
     *
     * @param {string} playerId The id of the snake to retreive.
     * @return {SnakeInfos} Snake info.
     */
    function getSnakeInfoForId(playerId) {
        for (let i = 0; i < _snakeInfos.length; i++) {
            if (_snakeInfos[i].getId() === playerId) {
                return _snakeInfos[i];
            }
        }

        throw new Error(`Unable to find snake width id ${playerId}`);
    }

    const marshall = function () {
        return {
            type,
            width: _width,
            height: _height,
            worldTick: _worldTick,
            foodPositions: _foodPositions,
            obstaclePositions: _obstaclePositions,
            snakeInfos: _snakeInfos.map(val => val.marshall())
        };
    };

    return Object.freeze({
        getWidth,
        getHeight,
        getWorldTick,
        getSnakeInfos,
        getSnakeInfoForId,
        getFoodPositions,
        getObstaclePositions,
        marshall,
        toString,
        type
    });
}

function create(data) {
    return GameMap(
        data.width,
        data.height,
        data.worldTick,
        data.foodPositions,
        data.obstaclePositions,
        data.snakeInfos.map(SnakeInfos.create)
    );
}

exports.new = GameMap;
exports.create = create;
exports.type = GameMap().type;
