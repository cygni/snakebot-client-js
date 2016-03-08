function GameStartingEvent(gameId, noOfPlayer, width, height, receivingPlayerId) {

  var type              = 'se.cygni.snake.api.event.GameStartingEvent';
  var gameId            = gameId;
  var noOfPlayers       = noOfPlayers;
  var width             = width;
  var height            = height;
  var receivingPlayerId = receivingPlayerId;

  var toString = function(){
    return '<Type:' + type + ', gameId:' + gameId +
      ', noOfPlayers:' + noOfPlayers + 'width:' + width + ', height:' + height + ', receivingPlayerId:' + receivingPlayerId + '>';
  };

  var marshall = function(){
    return {
      type : type,
      gameId : gameId,
      noofPlayers : noOfPlayers,
      width : width,
      height : height,
      receivingPlayerId : receivingPlayerId
    };
  };

  return Object.freeze({
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return GameStartingEvent(
    data.gameId,
    data.noofPlayers,
    data.width,
    data.height,
    data.receivingPlayerId);
};


exports.new = GameStartingEvent;
exports.create = create;
exports.type = GameStartingEvent().type;