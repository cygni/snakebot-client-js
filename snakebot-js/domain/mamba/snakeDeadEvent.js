function SnakeDeadEvent(deathReason, playerId, x, y, gameId, gameTick) {

  var type        = 'se.cygni.snake.api.event.SnakeDeadEvent';
  var deathReason = deathReason;
  var playerId    = playerId;
  var x           = x;
  var y           = y;
  var gameId      = gameId;
  var gameTick    = gameTick;

  var toString = function(){
    return '<Type:' + type + ', deathReason:' + deathReason + ', playerId:' + playerId + ', gameId:' + gameId +
      ', x:' + x + 'y:' + y + ', gameTick:' + gameTick + '>';
  };

  function getDeathReason(){
    return deathReason;
  }

  function getPlayerId(){
    return playerId;
  }

  function getCoords(){
    return {x : x, y: y};
  }

  function getGameId(){
    return gameId;
  }

  function getGameTick(){
    return gameTick;
  }

  var marshall = function(){
    return {
      type : type,
      deathReason : deathReason,
      playerId : playerId,
      x : x,
      y : y,
      gameTick : gameTick
    };
  };

  return Object.freeze({
    getDeathReason : getDeathReason,
    getPlayerId : getPlayerId,
    getCoords : getCoords,
    getGameId : getGameId,
    getGameTick : getGameTick,
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return SnakeDeadEvent(
    data.deathReason,
    data.playerId,
    data.x,
    data.y,
    data.gameId,
    data.gameTick);
};

exports.new = SnakeDeadEvent;
exports.create = create;
exports.type = SnakeDeadEvent().type;