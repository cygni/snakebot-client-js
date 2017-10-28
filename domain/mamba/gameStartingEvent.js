function GameStartingEvent(gameId, noOfPlayers, width, height, receivingPlayerId) {
    const type = 'se.cygni.snake.api.event.GameStartingEvent';
    var gameId = gameId;
    var noOfPlayers = noOfPlayers;
    var width = width;
    var height = height;
    var receivingPlayerId = receivingPlayerId;

    const toString = function () {
        return `<Type:${type}, gameId:${gameId
        }, noOfPlayers:${noOfPlayers}, width:${width}, height:${height}, receivingPlayerId:${receivingPlayerId}>`;
    };

    function getGameId() {
        return gameId;
    }

    function getNoOfPlayers() {
        return noOfPlayers;
    }

    function getWidth() {
        return width;
    }

    function getHeight() {
        return height;
    }

    function getReceivingPlayerId() {
        return receivingPlayerId;
    }

    const marshall = function () {
        return {
            type,
            gameId,
            noofPlayers: noOfPlayers, // sic!
            width,
            height,
            receivingPlayerId
        };
    };

    return Object.freeze({
        getGameId,
        getNoOfPlayers,
        getReceivingPlayerId,
        getWidth,
        getHeight,
        marshall,
        toString,
        type
    });
}

function create(data) {
    return GameStartingEvent(
        data.gameId,
        data.noofPlayers, // sic!
        data.width,
        data.height,
        data.receivingPlayerId
    );
}

exports.new = GameStartingEvent;
exports.create = create;
exports.type = GameStartingEvent().type;
