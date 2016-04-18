function RegisterMove(gameTick, direction, playerId, gameId) {

  var type                = 'se.cygni.snake.api.request.RegisterMove';
  var gameTick            = gameTick;
  var direction           = direction;
  var receivingPlayerId   = playerId;
  var gameId              = gameId;

  var toString = function(){
    return '<Type:' + type + ', gameTick:' + gameTick + ', direction:' + direction +
      ', receivingPlayerId:' + receivingPlayerId + ', gameId:' + gameId +'>';
  };

  var setPlayerId = function(playerId){
    receivingPlayerId = playerId;
  }

  var marshall = function(){
    return {
      type : type,
      gameTick : gameTick,
      direction : direction,
      receivingPlayerId : receivingPlayerId,
      gameId : gameId
    };
  };

  return Object.freeze({
    setPlayerId : setPlayerId,
    marshall : marshall,
    toString : toString
  });

};

module.exports = RegisterMove;
exports.type   = RegisterMove().type;