function SnakeDeadEvent(deathReason, playerId, x, y, gameId, gameTick) {
    const type = 'se.cygni.snake.api.event.SnakeDeadEvent';
    var deathReason = deathReason;
    var playerId = playerId;
    var x = x;
    var y = y;
    var gameId = gameId;
    var gameTick = gameTick;

    const toString = function () {
        return `<Type:${type}, deathReason:${deathReason}, playerId:${playerId}, gameId:${gameId
        }, x:${x}y:${y}, gameTick:${gameTick}>`;
    };

    function getDeathReason() {
        return deathReason;
    }

    function getPlayerId() {
        return playerId;
    }

    function getCoords() {
        return { x, y };
    }

    function getGameId() {
        return gameId;
    }

    function getGameTick() {
        return gameTick;
    }

    const marshall = function () {
        return {
            type,
            deathReason,
            playerId,
            x,
            y,
            gameTick
        };
    };

    return Object.freeze({
        getDeathReason,
        getPlayerId,
        getCoords,
        getGameId,
        getGameTick,
        marshall,
        toString,
        type
    });
}

function create(data) {
    return SnakeDeadEvent(
        data.deathReason,
        data.playerId,
        data.x,
        data.y,
        data.gameId,
        data.gameTick
    );
}

exports.new = SnakeDeadEvent;
exports.create = create;
exports.type = SnakeDeadEvent().type;
