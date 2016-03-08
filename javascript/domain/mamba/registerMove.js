function RegisterMove(gameTick, direction, playerId) {

  var type                = 'se.cygni.snake.api.request.RegisterMove';
  var gameTick            = gameTick;
  var direction           = direction;
  var receivingPlayerId   = playerId;

  var toString = function(){
    return '<Type:' + type + ', gameTick:' + gameTick + ', direction:' + direction + ', receivingPlayerId:' + receivingPlayerId + '>';
  };

  var setPlayerId = function(playerId){
    receivingPlayerId = playerId;
  }

  var marshall = function(){
    return {
      type : type,
      gameTick : gameTick,
      direction : direction,
      receivingPlayerId : receivingPlayerId
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