function GameStartingEvent(gameId, noOfPlayers, width, height, receivingPlayerId) {

  var type              = 'se.cygni.snake.api.event.GameStartingEvent';
  var gameId            = gameId;
  var noOfPlayers       = noOfPlayers;
  var width             = width;
  var height            = height;
  var receivingPlayerId = receivingPlayerId;

  var toString = function(){
    return '<Type:' + type + ', gameId:' + gameId +
      ', noOfPlayers:' + noOfPlayers + ', width:' + width + ', height:' + height + ', receivingPlayerId:' + receivingPlayerId + '>';
  };

  function getGameId(){
    return gameId;
  }

  function getNoOfPlayers(){
    return noOfPlayers;
  }

  function getWidth(){
    return width;
  }

  function getHeight(){
    return height;
  }

  function getReceivingPlayerId(){
    return receivingPlayerId;
  }

  var marshall = function(){
    return {
      type : type,
      gameId : gameId,
      noofPlayers : noOfPlayers, // sic!
      width : width,
      height : height,
      receivingPlayerId : receivingPlayerId
    };
  };

  return Object.freeze({
    getGameId : getGameId,
    getNoOfPlayers : getNoOfPlayers,
    getReceivingPlayerId : getReceivingPlayerId,
    getWidth : getWidth,
    getHeight : getHeight,
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return GameStartingEvent(
    data.gameId,
    data.noofPlayers, // sic!
    data.width,
    data.height,
    data.receivingPlayerId);
};

exports.new = GameStartingEvent;
exports.create = create;
exports.type = GameStartingEvent().type;