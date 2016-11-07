function GameResultEvent(gameId, receivingPlayerId, timestamp, playerRanks) {

  var type              = 'se.cygni.snake.api.event.GameResultEvent';
  var gameId            = gameId;
  var receivingPlayerId = receivingPlayerId;
  var timestamp         = timestamp;
  var playerRanks       = playerRanks;

  var toString = function(){
    return '<Type:' + type + ', gameId:' + gameId +
      ', receivingPlayerId:' + receivingPlayerId + 'timestamp:' + timestamp + ', playerRanks:' + playerRanks + '>';
  };

  function getGameId(){
    return gameId;
  }

  function getReceivingPlayerId(){
    return receivingPlayerId;
  }

  function getTimestamp(){
    return timestamp;
  }

  function getPlayerRanks(){
    return playerRanks;
  }

  var marshall = function(){
    return {
      type : type,
      gameId : gameId,
      receivingPlayerId : receivingPlayerId,
      timestamp : timestamp,
      playerRanks : playerRanks
    };
  };

  return Object.freeze({
    type: type,
    gameId: gameId,
    receivingPlayerId : receivingPlayerId,
    timestamp : timestamp,
    playerRanks : playerRanks,
    marshall : marshall,
    toString : toString
  });

};

function create(data){
  return GameResultEvent(
    data.gameId,
    data.receivingPlayerId,
    data.timestamp,
    data.playerRanks);
};

exports.new = GameResultEvent;
exports.create = create;
exports.type = GameResultEvent().type;