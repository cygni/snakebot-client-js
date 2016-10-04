function StartGame(playerId) {

  var type      = 'se.cygni.snake.api.request.StartGame';
  var playerId  = playerId;

  var toString = function(){
    return '<Type:' + type + ', playerId:' + playerId + '>';
  };

  var marshall = function(){
    return {
      type : type,
      receivingPlayerId : playerId
    };
  };

  return Object.freeze({
    marshall : marshall,
    toString : toString,
    type: type
  });

};

exports.new = StartGame;
exports.type = StartGame().type;