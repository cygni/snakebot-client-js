function GameLinkEvent(gameId, receivingPlayerId, url) {
  var type              = 'se.cygni.snake.api.event.GameLinkEvent';
  var gameId            = gameId;
  var receivingPlayerId = receivingPlayerId;
  var url               = url;

  var toString = function(){
    return '<Type:' + type + ', gameId:' + gameId +
      ', receivingPlayerId:' + receivingPlayerId + ', url:' + url + '>';
  };

  function getGameId(){
    return gameId;
  }

  function getReceivingPlayerId(){
    return receivingPlayerId;
  }

  function getUrl(){
    return url;
  }

  var marshall = function(){
    return {
      type : type,
      gameId : gameId,
      receivingPlayerId : receivingPlayerId,
      url : url
    };
  };

  return Object.freeze({
    getGameId : getGameId,
    getReceivingPlayerId : getReceivingPlayerId,
    getUrl : getUrl,
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return GameLinkEvent(
    data.gameId,
    data.receivingPlayerId,
    data.url);
};

exports.new = GameLinkEvent;
exports.create = create;
exports.type = GameLinkEvent().type;