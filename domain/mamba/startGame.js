function StartGame(playerId) {
    const type = 'se.cygni.snake.api.request.StartGame';
    var playerId = playerId;

    const toString = function () {
        return `<Type:${type}, playerId:${playerId}>`;
    };

    const marshall = function () {
        return {
            type,
            receivingPlayerId: playerId
        };
    };

    return Object.freeze({
        marshall,
        toString,
        type
    });
}

exports.new = StartGame;
exports.type = StartGame().type;
