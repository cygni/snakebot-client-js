function TournamentEndedEvent(playerWinnerId, gameId, gameResult, tournamentName, tournamentId) {
    const type = 'se.cygni.snake.api.event.TournamentEndedEvent';
    var playerWinnerId = playerWinnerId;
    var gameId = gameId;
    var gameResult = gameResult;
    var tournamentName = tournamentName;
    var tournamentId = tournamentId;
    const gameTick = null; // This event lacks the game tick.

    const toString = function () {
        return `<Type:${type}, playerWinnerId:${playerWinnerId
        }, gameId:${gameId}gameResult:${gameResult}, tournamentName:${tournamentName}, tournamentId:${tournamentId}>`;
    };

    function getPlayerWinnerId() {
        return playerWinnerId;
    }

    function getGameId() {
        return gameId;
    }

    function getGameResult() {
        return gameResult;
    }

    function getTournamentName() {
        return tournamentName;
    }

    function getTournamentId() {
        return tournamentId;
    }

    const marshall = function () {
        return {
            type,
            playerWinnerId,
            gameId,
            gameResult,
            tournamentName,
            tournamentId
        };
    };

    return Object.freeze({
        getPlayerWinnerId,
        getGameId,
        getGameResult,
        getTournamentName,
        getTournamentId,
        getGameTick() { return null; },
        marshall,
        toString,
        type
    });
}

function create(data) {
    return TournamentEndedEvent(
        data.playerWinnerId,
        data.gameId,
        data.gameResult,
        data.tournamentName,
        data.tournamentId
    );
}

exports.new = TournamentEndedEvent;
exports.create = create;
exports.type = TournamentEndedEvent().type;
