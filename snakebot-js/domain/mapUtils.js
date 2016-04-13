var SearchAStar = require('./searchAStar.js')();

/**
 * Calculates the path to the goal using the A-star algorithm.
 * @param startCoord      the start coordinate {x: xn, y: yn}
 * @param goalCoord       the goal coordinate {x: xn, y: yn}
 * @param mapWidth        the maps width
 * @param mapHeight       the maps height
 * @param fCalculateCost  optional function that calculates the cost (heuristic value) for moving from current node to the goal.
 *                        <h value> = f(<node coordinate>={x: xn, y: yn}, <goal coordinate> = {x: xg, y: yg})
 * @returns the path to the goal as an array [{coord:{x:11,y:10}, direction:'UP'}}, {...}, ...]
 */
function findPathAS(startCoord, goalCoord, mapWidth, mapHeight, fCalculateCost){
  return SearchAStar.findPath(startCoord, goalCoord, mapWidth, mapHeight, fCalculateCost);
}
/**
 * Calculates the Manhattan (or cab/grid) distance from point a to point b.
 * Note that Manhattan distance will not walk diagonally.
 * @param startCoord
 * @param goalCoord
 * @returns {number}
 */
function getManhattanDistance(startCoord, goalCoord){
  var x = Math.abs(startCoord.x - goalCoord.x);
  var y = Math.abs(startCoord.y - goalCoord.y);
  return x+y;
}

/**
 * Calculates the euclidian distance from point a to point b.
 * Note that eculidan distance will walk diagonally.
 * @param startCoord
 * @param goalCoord
 * @returns {number}
 */
function getEuclidianDistance(startCoord, goalCoord){
  var xd = Math.abs(startCoord.x - goalCoord.x);
  var yd = Math.abs(startCoord.y - goalCoord.y);
  return Math.floor(Math.sqrt(xd * xd + yd * yd));
}

/**
 * Find where the head of the snake is on the map.
 * @param playerId the snakes player id
 * @param map the map
 * @returns {{x: (Number), y: (Number), alive: (Boolean)}}
 *          If the snake is dead, then x and y is coerced to 0.
 */
function whereIsSnake(playerId, map){
  var snake = map.getSnakeInfoForId(playerId);
  if(snake.isAlive()){
    var pos = translatePosition(snake.getPositions()[0], map.getWidth());
    return {x: pos.x, y: pos.y, alive: snake.isAlive()};
  }
  return {x: 0, y:0, alive: false};
}

/**
 * Get the tile content at the given coordinate [food | obstacle | snakehead | snakebody].
 * @param coords the coordinate
 * @param map the map
 * @returns {{content: String}} or null
 */
function getAt(coords, map){
  var point = translateCoordinate(coords, map.getWidth());
  return getOccupiedMapTiles(map)[point];
}

/**
 * Get all occupied map tiles and the content [food | obstacle | snakehead | snakebody]
 * @param map the map
 * @returns {{content: String}}
 */
function getOccupiedMapTiles(map){
  var tiles = {};
  map.getFoodPositions().map(function(pos){tiles[pos] = {content: 'food'}});
  map.getObstaclePositions().map(function(pos){tiles[pos] = {content: 'obstacle'}});
  map.getSnakeInfos().map(function(snakeInfo){snakeInfo.getPositions().map(function(pos, index){tiles[pos] = {content: 0 == index ? 'snakehead' : 'snakebody'}})});
  return tiles;
}

/**
 * Get all food on the map sorted by distance to the coordinate.
 * @param coords the coordinate
 * @param map the map
 * @returns {Array} of food coordinates
 */
function findFood(coords, map){
  return sortByClosestTo(
    positionsToCoords(map.getFoodPositions(), map.getWidth()), coords);
}

/**
 * Get the coordinates of all snakes.
 * Note: You probably want to filter out your own snake.
 * @param map
 * @returns {Array}
 */
function getSnakeCoords(map, excludeIds){
  var snakeInfos = map.getSnakeInfos();
  var snakeCoords = [];
  snakeInfos.forEach(function(snakeInfo){
    if(!excludeIds || excludeIds.indexOf(snakeInfo.getId()) == -1){
      var coords = positionsToCoords(snakeInfo.getPositions(), map.getWidth());
      snakeCoords[snakeInfo.getId()] = coords;
    }
  });
  return snakeCoords;
}

/**
 * Sorts the items in the array from closest to farthest
 * in relation to the given coordinate using Manhattan distance.
 * @param items the items (must expose ::getX() and ::getY();
 * @param coords
 * @returns {Array} the ordered array with the closest item at the end.
 */
function sortByClosestTo(items, coords){
  var distanceItem = [];
  items.forEach(function(item){
    distanceItem.push({
      d: getManhattanDistance(coords, {x: item.x, y: item.y}),
      item: item
    });
  });
  distanceItem.sort(function(a,b) { return b.d - a.d; });
  return distanceItem.map(function(di){return di.item});
}

/**
 * Converts an array of positions to an array of coordinates.
 * @param points the positions to convert
 * @param mapWidth the width of the map
 * @returns {{x: (Number), y: (Number)}}
 */
function positionsToCoords(positions, mapWidth){
  return positions.map(function(pos){return translatePosition(pos, mapWidth)});
}

/**
 * Converts a position in the flattened single array representation
 * of the Map to a MapCoordinate.
 *
 * @param position
 * @return
 */
function translatePosition(position, mapWidth) {
  var y = Math.floor(position / mapWidth);
  var x = Math.abs(position - y * mapWidth);
  return {x: x, y: y}
}

/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param coordinate
 * @return
 */
function translateCoordinate(coords, mapWidth) {
  return coords.x + coords.y * mapWidth;
}

exports.sortByClosestTo       = sortByClosestTo;
exports.getManhattanDistance  = getManhattanDistance;
exports.getEuclidianDistance  = getEuclidianDistance;
exports.whereIsSnake          = whereIsSnake;
exports.translatePosition     = translatePosition;
exports.findPathAS            = findPathAS;
exports.getAt                 = getAt;
exports.positionsToCoords     = positionsToCoords;
exports.findFood              = findFood;
exports.getSnakeCoords        = getSnakeCoords;