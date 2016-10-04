function TournamentEndedEvent(playerWinnerId, gameId, gameResult, tournamentName, tournamentId) {

  var type            = 'se.cygni.snake.api.event.TournamentEndedEvent';
  var playerWinnerId  = playerWinnerId;
  var gameId          = gameId;
  var gameResult      = gameResult;
  var tournamentName  = tournamentName;
  var tournamentId    = tournamentId;
  var gameTick        = null; // This event lacks the game tick.

  var toString = function () {
    return '<Type:' + type + ', playerWinnerId:' + playerWinnerId +
      ', gameId:' + gameId + 'gameResult:' + gameResult + ', tournamentName:' + tournamentName + ', tournamentId:' + tournamentId + '>';
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

  var marshall = function () {
    return {
      type: type,
      playerWinnerId: playerWinnerId,
      gameId: gameId,
      gameResult: gameResult,
      tournamentName: tournamentName,
      tournamentId: tournamentId
    };
  };

  return Object.freeze({
    getPlayerWinnerId: getPlayerWinnerId,
    getGameId: getGameId,
    getGameResult: getGameResult,
    getTournamentName: getTournamentName,
    getTournamentId: getTournamentId,
    getGameTick: function(){return null;},
    marshall: marshall,
    toString: toString,
    type: type
  });
}

function create(data) {
  return TournamentEndedEvent(
    data.playerWinnerId,
    data.gameId,
    data.gameResult,
    data.tournamentName,
    data.tournamentId);
};

exports.new     = TournamentEndedEvent;
exports.create  = create;
exports.type    = TournamentEndedEvent().type;