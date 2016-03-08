var Food = require('./food.js');

function GameMap(width, height, worldTick, tiles, snakeInfos) {

  var type        = 'Map';
  var width       = width;
  var height      = height;
  var worldTick   = worldTick;
  var tiles       = tiles;
  var snakeInfos  = snakeInfos;

  var toString = function(){
    return '<Type:' + type + ', width:' + width +
      ', height:' + height + 'worldTick:' + worldTick + ', tiles:' + tiles + ', snakeInfos:' + snakeInfos + '>';
  };

  function getWidth(){
   return width;
  }

  function getHeight(){
   return height;
  }

  function getWorldTick(){
   return worldTick;
  }

  function getTiles(){
   return tiles;
  }

  function getTile(x, y){
    return tiles[x][y];
  }

  function findFood(){
    var food = [];
    for(var x = 0; x < width; x++){
      for(var y = 0; y < height; y++){
         if(getTile(x,y).content === 'food'){
           food.push(Food.new(x, y));
        }
      }
    }
    return food;
  }

  function getSnakeInfos(){
   return snakeInfos;
  }

  function getSnakeInfoForId(playerId){
    for(var i = 0; i < snakeInfos.length; i++){
      if (snakeInfos[i].id === playerId){
        return snakeInfos[i];
      }
    }
  }

  var marshall = function(){
    return {
      type : type,
      width : width,
      height : height,
      worldTick : worldTick,
      tiles : JSON.stringify(tiles),
      snakeInfos : JSON.stringify(snakeInfos)
    };
  };

  return Object.freeze({
    getWidth          : getWidth,
    getHeight         : getHeight,
    getWorldTick      : getWorldTick,
    getTiles          : getTiles,
    getTile           : getTile,
    getSnakeInfos     : getSnakeInfos,
    getSnakeInfoForId : getSnakeInfoForId,
    findFood          : findFood,
    marshall          : marshall,
    toString          : toString,
    type              : type
  });

};

function create(data){
  return GameMap(
    data.width,
    data.height,
    data.worldTick,
    data.tiles,
    data.snakeInfos);
};

exports.new = GameMap;
exports.create = create;
exports.type = GameMap().type;