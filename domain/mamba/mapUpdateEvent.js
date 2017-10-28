const GameMap = require('./gameMap.js');

function MapUpdateEvent(gameId, gameTick, map) {
    const type = 'se.cygni.snake.api.event.MapUpdateEvent';
    var gameId = gameId;
    var gameTick = gameTick;
    var map = map;

    const toString = function () {
        return `<Type:${type
        }, gameId:${gameId}gameTick:${gameTick}, map:${map}>`;
    };

    function getGameId() {
        return gameId;
    }

    function getGameTick() {
        return gameTick;
    }

    function getMap() {
        return map;
    }

    const marshall = function () {
        return {
            type,
            gameId,
            gameTick,
            map: map.marshall()
        };
    };

    return Object.freeze({
        getGameId,
        getGameTick,
        getMap,
        marshall,
        toString,
        type
    });
}

function create(data) {
    return MapUpdateEvent(
        data.gameId,
        data.gameTick,
        GameMap.create(data.map)
    );
}

exports.new = MapUpdateEvent;
exports.create = create;
exports.type = MapUpdateEvent().type;
