/**
 * Snake Bot script.
 */
var MapUtils = require('./../domain/mapUtils.js');
var log = null; // Injected logger

function update(mapUpdateEvent, myUserId){

  var map             =  mapUpdateEvent.getMap();
  var direction       = 'RIGHT';  // <'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>
  var snakeBrainDump  = {}; // Optional debug information about the snakes current state of mind.

  // 1. Where's what etc.
  var myCoords = MapUtils.whereIsSnake(myUserId, map);
  log('I am here:', myCoords);
  log("On my tile:", MapUtils.getAt(myCoords, map));
  log("Food:", MapUtils.findFood(myCoords, map));
  snakeBrainDump.myCoords = myCoords;

  // 2. Do some nifty planning...
  // (Tip: see MapUtils for some off-the-shelf navigation aid.



  // 3. Then shake that snake!
  return {
    direction:  direction,
    debugData : snakeBrainDump
  }
}

function bootStrap(logger){
  log = logger;
}

function gameEnded(){
  // Implement as needed.
}

exports.bootStrap = bootStrap;
exports.update    = update;
exports.gameEnded = gameEnded;