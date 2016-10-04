function HeartBeatResponse(playerId) {

  var type                = 'se.cygni.snake.api.response.HeartBeatResponse';
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
  return HeartBeatResponse(data.receivingPlayerId);
};

exports.new = HeartBeatResponse;
exports.create = create;
exports.type = HeartBeatResponse().type;
