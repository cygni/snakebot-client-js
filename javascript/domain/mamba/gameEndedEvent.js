var GameMap = require('./gameMap.js');

function GameEndedEvent(playerWinnerId, gameId, gameTick, map) {

  var type            = 'se.cygni.snake.api.event.GameEndedEvent';
  var playerWinnerId  = playerWinnerId;
  var gameId          = gameId;
  var gameTick        = gameTick;
  var map             = map;

  var toString = function(){
    return '<Type:' + type + ', playerWinnerId:' + playerWinnerId +
      ', gameId:' + gameId + 'gameTick:' + gameTick + ', map:' + map + '>';
  };

  function getPlayerWinnerId(){
    return playerWinnerId;
  }

  function getGameId(){
    return gameId;
  }

  function getGameTick(){
    return gameTick;
  }

  function getMap(){
    return map;
  }

  var marshall = function(){
    return {
      type : type,
      playerWinnerId : playerWinnerId,
      gameId : gameId,
      gameTick : gameTick,
      map : map.marshall()
    };
  };

  return Object.freeze({
    getPlayerWinnerId: getPlayerWinnerId,
    getGameId : getGameId,
    getGameTick : getGameTick,
    getMap : getMap,
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return GameEndedEvent(
    data.playerWinnerId,
    data.gameId,
    data.gameTick,
    GameMap.create(data.map));
};

exports.new = GameEndedEvent;
exports.create = create;
exports.type = GameEndedEvent().type;