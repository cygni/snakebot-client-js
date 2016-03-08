var GameMap = require('./gameMap.js');

function MapUpdateEvent(gameId, gameTick, map) {

  var type            = 'se.cygni.snake.api.event.MapUpdateEvent';
  var gameId          = gameId;
  var gameTick        = gameTick;
  var map             = map;

  var toString = function(){
    return '<Type:' + type +
      ', gameId:' + gameId + 'gameTick:' + gameTick + ', map:' + map + '>';
  };

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
      gameId : gameId,
      gameTick : gameTick,
      map : map.marshall()
    };
  };

  return Object.freeze({
    getGameId : getGameId,
    getGameTick : getGameTick,
    getMap : getMap,
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return MapUpdateEvent(
    data.gameId,
    data.gameTick,
    GameMap.create(data.map));
};

exports.new = MapUpdateEvent;
exports.create = create;
exports.type = MapUpdateEvent().type;