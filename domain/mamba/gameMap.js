const SnakeInfos = require('./snakeInfos.js');

function GameMap(width, height, worldTick, foodPositions, obstaclePositions, snakeInfos) {
    const type = 'Map';
    var width = width;
    var height = height;
    var worldTick = worldTick;
    var foodPositions = foodPositions;
    var obstaclePositions = obstaclePositions;
    var snakeInfos = snakeInfos;

    const toString = function () {
        return `<Type:${type}, width:${width}, height:${height}worldTick:${worldTick
        }, foodPositions:${foodPositions}, obstaclePositions:${obstaclePositions}, snakeInfos:${snakeInfos}>`;
    };

    function getWidth() {
        return width;
    }

    function getHeight() {
        return height;
    }

    function getWorldTick() {
        return worldTick;
    }

    function getFoodPositions() {
        return foodPositions;
    }

    function getObstaclePositions() {
        return obstaclePositions;
    }

    function getSnakeInfos() {
        return snakeInfos;
    }

    function getSnakeInfoForId(playerId) {
        for (let i = 0; i < snakeInfos.length; i++) {
            if (snakeInfos[i].getId() === playerId) {
                return snakeInfos[i];
            }
        }
    }

    const marshall = function () {
        return {
            type,
            width,
            height,
            worldTick,
            foodPositions,
            obstaclePositions,
            snakeInfos: snakeInfos.map(val => val.marshall())
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
