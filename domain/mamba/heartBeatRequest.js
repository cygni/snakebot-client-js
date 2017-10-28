function HeartBeatRequest(playerId) {
    const type = 'se.cygni.snake.api.request.HeartBeatRequest';
    const receivingPlayerId = playerId;

    const toString = function () {
        return `<Type:${type}, receivingPlayerId:${receivingPlayerId}>`;
    };

    const getPlayerId = function () {
        return receivingPlayerId;
    };

    const marshall = function () {
        return {
            type,
            receivingPlayerId
        };
    };

    return Object.freeze({
        type,
        getPlayerId,
        marshall,
        toString
    });
}

function create(data) {
    return HeartBeatRequest(data.receivingPlayerId);
}

exports.new = HeartBeatRequest;
exports.create = create;
exports.type = HeartBeatRequest().type;
