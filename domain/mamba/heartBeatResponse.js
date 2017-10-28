function HeartBeatResponse(playerId) {
    const type = 'se.cygni.snake.api.response.HeartBeatResponse';
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
    return HeartBeatResponse(data.receivingPlayerId);
}

exports.new = HeartBeatResponse;
exports.create = create;
exports.type = HeartBeatResponse().type;
