function RegisterMove(gameTick, direction, playerId, gameId) {
    const type = 'se.cygni.snake.api.request.RegisterMove';
    var gameTick = gameTick;
    var direction = direction;
    let receivingPlayerId = playerId;
    var gameId = gameId;

    const toString = function () {
        return `<Type:${type}, gameTick:${gameTick}, direction:${direction
        }, receivingPlayerId:${receivingPlayerId}, gameId:${gameId}>`;
    };

    const setPlayerId = function (playerId) {
        receivingPlayerId = playerId;
    };

    const marshall = function () {
        return {
            type,
            gameTick,
            direction,
            receivingPlayerId,
            gameId
        };
    };

    return Object.freeze({
        setPlayerId,
        marshall,
        toString
    });
}

exports.new = RegisterMove;
exports.type = RegisterMove().type;
