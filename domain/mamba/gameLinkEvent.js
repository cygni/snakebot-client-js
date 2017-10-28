function GameLinkEvent(gameId, receivingPlayerId, url) {
    const type = 'se.cygni.snake.api.event.GameLinkEvent';
    var gameId = gameId;
    var receivingPlayerId = receivingPlayerId;
    var url = url;

    const toString = function () {
        return `<Type:${type}, gameId:${gameId
        }, receivingPlayerId:${receivingPlayerId}, url:${url}>`;
    };

    function getGameId() {
        return gameId;
    }

    function getReceivingPlayerId() {
        return receivingPlayerId;
    }

    function getUrl() {
        return url;
    }

    const marshall = function () {
        return {
            type,
            gameId,
            receivingPlayerId,
            url
        };
    };

    return Object.freeze({
        getGameId,
        getReceivingPlayerId,
        getUrl,
        marshall,
        toString,
        type
    });
}

function create(data) {
    return GameLinkEvent(
        data.gameId,
        data.receivingPlayerId,
        data.url
    );
}

exports.new = GameLinkEvent;
exports.create = create;
exports.type = GameLinkEvent().type;
