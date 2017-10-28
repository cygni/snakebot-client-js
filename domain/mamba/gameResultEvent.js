function GameResultEvent(gameId, receivingPlayerId, timestamp, playerRanks) {
    const type = 'se.cygni.snake.api.event.GameResultEvent';
    var gameId = gameId;
    var receivingPlayerId = receivingPlayerId;
    var timestamp = timestamp;
    var playerRanks = playerRanks;

    const toString = function () {
        return `<Type:${type}, gameId:${gameId
        }, receivingPlayerId:${receivingPlayerId}timestamp:${timestamp}, playerRanks:${playerRanks}>`;
    };

    function getGameId() {
        return gameId;
    }

    function getReceivingPlayerId() {
        return receivingPlayerId;
    }

    function getTimestamp() {
        return timestamp;
    }

    function getPlayerRanks() {
        return playerRanks;
    }

    const marshall = function () {
        return {
            type,
            gameId,
            receivingPlayerId,
            timestamp,
            playerRanks
        };
    };

    return Object.freeze({
        type,
        gameId,
        receivingPlayerId,
        timestamp,
        playerRanks,
        marshall,
        toString
    });
}

function create(data) {
    return GameResultEvent(
        data.gameId,
        data.receivingPlayerId,
        data.timestamp,
        data.playerRanks
    );
}

exports.new = GameResultEvent;
exports.create = create;
exports.type = GameResultEvent().type;
