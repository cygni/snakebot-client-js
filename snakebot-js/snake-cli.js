/**
 * A command line client for Snake written in Javascript 5.
 */

console.log('\n*** snake-cli by Cygni ***\n');

var Mamba           = require('./mamba-client.js');
var GameSettings    = require('./domain/mamba/gameSettings.js');
var MapUtils        = require('./domain/mapUtils.js');
var MapRenderer     = require('./domain/mapRenderer.js');
var DateFormat      = require('dateformat');
var renderer        = null;
var verboseLogging  = true;

// Connect to the Snake servers training dojo, the client log is quiet.
var client = Mamba('snake.cygni.se', 80, onEvent, false).connect("training");

// The game info is available after server registration (@see registrationComplete()).
var gameInfo = null;

/**
 * Update your username below...
 */
function prepareNewGame(){
  client.prepareNewGame('Phat3lfstone', 'red', GameSettings.create());
}

/**
 * This is where you go to work...or your snake really!
 * Analyze the current world state, make a plan and then execute your next move.
 * The function is called once per game tick.
 * @param mapState the world state (@see MapUpdateEvent).
 */
function handleGameUpdate(mapState){
  var map             =  mapState.getMap();
  var direction       = 'RIGHT';  // <'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>
  var snakeBrainDump  = {}; // Optional debug information about the snakes current state of mind.

  // 1. Where's what etc.
  var myCoords = MapUtils.whereIsSnake(gameInfo.getPlayerId(), map);
  log('I am here:', myCoords);

  // 2. Do some nifty planning...
  // (Tip: see MapUtils for some off-the-shelf navigation aid.

  // 3. Then shake that snake!
  client.moveSnake(direction, mapState.getGameTick());
  return snakeBrainDump;
}

//
// ------ INTERNAL CLIENT STUFF -----
//

// Client events are handled and responded to below.
function onEvent(event){

  switch(event.type){

    case 'CONNECTED':
      log('Server connected!');
      prepareNewGame();
      break;

    case 'REGISTERED':
      log('Ready to play!');
      gameInfo = event.payload;
      renderer = MapRenderer(gameInfo.getGameSettings().getWidth(), gameInfo.getGameSettings().getHeight());
      client.startGame();
      break;

    case 'GAME_MAP_UPDATED':
      log('Game map updated - gameTick:' + event.payload.getGameTick());
      var snakeBrainDump = handleGameUpdate(event.payload);
      renderer.record(event.payload, snakeBrainDump);
      break;

    case 'GAME_SNAKE_DEAD':
      log('A snake died!');
      renderer.record(event.payload);
      break;

    case 'GAME_ENDED':
      log('Game ended!');
      renderer.record(event.payload);
      renderer.render(function(){process.exit()}, {followPid : gameInfo.getPlayerId()});
      //renderer.render(function(){process.exit()}, {animate: true, delay: 500, followPid : gameInfo.getPlayerId()});
      break;

    default:
    case 'ERROR':
      logError('Error - ' + event.payload);
      break;
  }
}

function log(msg, data){
  if(verboseLogging) {
    var formattedMsg = DateFormat(new Date(), 'HH:MM:ss.l') + ' - ' + msg;
    data ? console.log(formattedMsg, data) : console.log(formattedMsg);
  }
}

function logError(message){
  console.log(DateFormat(new Date(), 'HH:MM:ss.l') + ' - ERROR - ' + message);
}