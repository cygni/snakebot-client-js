/**
 * A command line client for Snake written in Javascript 5.
 * Uses the Mamba Client for server communication.
 */

console.log('\n*** snake-cli by Cygni ***\n');

var Mamba           = require('./domain/mamba-client.js');
var GameSettings    = require('./domain/mamba/gameSettings.js');
var MapRenderer     = require('./domain/mapRenderer.js');
var DateFormat      = require('dateformat');
var argv            = require('minimist')(process.argv.slice(2));
var options         = parseOptions(argv);

printUsage(options);

var snakeBot        = setupSnake(options);
var gameInfo        = null;
var renderer        = null;
var client          = Mamba(options.host, options.port, onEvent, options.mambaDebug).connect(options.venue);

/**
 * Prepares a new game on the server.
 */
function prepareNewGame(){
  client.prepareNewGame(options.user, GameSettings.create());
}

/**
 * Notifies the the snake bot of a new game tick.
 * @param mapUpdateEvent the world state (@see MapUpdateEvent).
 */
function handleGameUpdate(mapUpdateEvent){
  var response = snakeBot.update(mapUpdateEvent, gameInfo.getPlayerId());
  client.moveSnake(response.direction, mapUpdateEvent.getGameTick());
  return response.debugData;
}

/**
 * Called when the game ends.
 */
function endGame(){
  snakeBot.gameEnded();
  if(options.renderMode == 'animate'){
    renderer.render(function(){process.exit()}, {animate: true, delay: 500, followPid : gameInfo.getPlayerId()});
  } else {
    renderer.render(function(){process.exit()}, {followPid : gameInfo.getPlayerId()});
  }
}

// Mamba client events are handled and responded to below.
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
      endGame();
      break;

    default:
    case 'ERROR':
      logError('Error - ' + event.payload);
      break;
  }
}

/**
 * Sets up a new snake bot.
 * @param options
 * @returns the snake bot
 */
function setupSnake(options){
  try {
    var snake = require(options.snakeScript);
    snake.bootStrap(logExt);
    return snake;
  } catch (e) {
    logError("Could not find or init snake bot script at : "  + options.snakeScript, e);
    throw "SnakeBotError";
  }
}

/**
 * Parses the command line options.
 * @param argv minimist command line options
 * @returns {{help: *, snakeScript: null, user: *, host: *, port: *, venue: string, renderMode: string, silentLog: *, mambaDebug: *}}
 */
function parseOptions(argv){
  var opts = {
    help        : argv.h || argv.help,
    snakeScript : argv._ ? argv._[0] : null,
    user        : argv.u || argv.user,
    host        : argv.host ? argv.host : 'snake.cygni.se',
    port        : argv.port ? argv.port : 80,
    venue       : argv.venue ? argv.venue : 'training',
    renderMode  : argv.animate ? 'animate' : 'default',
    silentLog   : argv.silent,
    mambaDebug  : argv.mambadbg
  };
  if(!opts.user){
    log('WARN: Username not set, consider setting one `-u, --user <name>`')
  }
  return opts;
}

/**
 * Prints usage information.
 * @param options
 */
function printUsage(options){
  if(options.help || !options.snakeScript){
    console.log('Usage; node snake-cli <snake-bot.js>\n');
    console.log(' -u, --user <username> : the username');
    console.log(' --host <snake.cygni.se> : the host');
    console.log(' --port <80> : the server port');
    console.log(' --venue <training> : the game room');
    console.log(' --animate : animated game replay');
    console.log(' --silent : keep logs to minimum');
    console.log(' --mambadbg : show all mamba logs');
    console.log('\n');
    process.exit();
  }
}

function log(msg, data){
 var formattedMsg = DateFormat(new Date(), 'HH:MM:ss.l') + ' - ' + msg;
  data ? console.log(formattedMsg, data) : console.log(formattedMsg);
}

function logError(message, err){
  console.log(DateFormat(new Date(), 'HH:MM:ss.l') + ' - ERROR - ' + message, err);
}

/**
 * Logger function injected into the snake bot.
 * @param msg the message
 * @param data the data
 */
function logExt(msg, data){
  if(!options.silentLog){
    log(msg, data);
  }
}