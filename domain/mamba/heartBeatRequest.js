function HeartBeatRequest(playerId) {

  var type                = 'se.cygni.snake.api.request.HeartBeatRequest';
  var receivingPlayerId   = playerId;

  var toString = function(){
    return '<Type:' + type + ', receivingPlayerId:' + receivingPlayerId + '>';
  };

  var getPlayerId = function(){
    return receivingPlayerId;
  }

  var marshall = function(){
    return {
      type : type,
      receivingPlayerId : receivingPlayerId
    };
  };

  return Object.freeze({
    type : type,
    getPlayerId : getPlayerId,
    marshall : marshall,
    toString : toString
  });

};

function create(data){
  return HeartBeatRequest(data.receivingPlayerId);
};

exports.new = HeartBeatRequest;
exports.create = create;
exports.type = HeartBeatRequest().type;
