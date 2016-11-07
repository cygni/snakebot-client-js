/**
 * A command line client for Snake written in Javascript 5.
 * Uses the Mamba Client for server communication.
 */

console.log('\n*** snake-cli by Cygni ***\n');

var Colors          = {yellow: '\x1b[1m\x1b[33m', red: '\x1b[1m\x1b[31m', reset: '\x1b[0m'};
var Mamba           = require('./domain/mamba-client.js');
var GameSettings    = require('./domain/mamba/gameSettings.js');
var MapRenderer     = require('./domain/mapRenderer.js');
var Net             = require('net');
var JsonSocket      = require('json-socket');
var DateFormat      = require('dateformat');
var now             = require("performance-now");
var open            = require('open');
var argv            = require('minimist')(process.argv.slice(2));

var options         = parseOptions(argv);
var client          = Mamba(options.host, options.port, onEvent, options.mambaDebug);
var snakeBot        = null;
var gameInfo        = null;
var gameLink        = null;
var renderer        = null;

initSnakeBot(launchGame);

/**
 * Launch a new game!
 * @param theSnakeBot the bot to use
 */
function launchGame(theSnakeBot){
  snakeBot = theSnakeBot;
  client.connect(options.venue);
}

/**
 * Prepares a new game on the server.
 */
function prepareNewGame(){
  client.prepareNewGame(options.user, GameSettings.create());
}

/**
 * Notifies the the snake bot of a new game tick.
 * @param mapUpdateEvent the world state (@see MapUpdateEvent).
 * @param onResponse call back when response received
 */
function handleGameUpdate(mapUpdateEvent, onResponse){
  var start = now();
  snakeBot.gameStateChanged(mapUpdateEvent, gameInfo.getPlayerId(), function(response) {
    response.debugData.executionTime = (now()-start).toFixed(3);
    client.moveSnake(response.direction, mapUpdateEvent.getGameTick());
    onResponse(response.debugData);
  });
}

/**
 * Called when the game ends.
 * @param exit true if process should exit.
 */
function endGame(exit){
  var fProcEnd = exit ? function(){process.exit()} : 0;
  snakeBot.gameEnded();

  if(options.gamelink){
    open(gameLink.getUrl());
  } else {
    log("GameLink: " + gameLink.getUrl());
  }

  if(options.renderMode == 'norender'){
    fProcEnd();
  } else if(options.renderMode == 'animate'){
    renderer.render({animate: true, delay: 500, followPid : gameInfo.getPlayerId()}, fProcEnd);
  } else {
    renderer.render({followPid : gameInfo.getPlayerId()}, fProcEnd);
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
      renderer = MapRenderer();
      client.startGame();
      break;

    case 'GAME_MAP_UPDATED':
      log('Game map updated - gameTick:' + event.payload.getGameTick());
      handleGameUpdate(event.payload, function(debugData) {
        renderer.record(event.payload, debugData);
      });
      break;

    case 'GAME_SNAKE_DEAD':
      log('A snake died!');
      renderer.record(event.payload);
      break;

    case 'NEW_GAME_STARTED':
      log('New game started!');
      var gameStarted = event.payload;
      renderer = MapRenderer(gameStarted.getWidth(), gameStarted.getHeight());
      break;

    case 'GAME_LINK':
      log('Game link!');
      gameLink = event.payload;
      break;

    case 'GAME_ENDED':
      log('Game ended!');
      renderer.record(event.payload);
      endGame(!isTournament()); // Do not exit in tournament mode.
      break;

    case 'GAME_RESULT':
      log('Game result!');
      break;

    case 'TOURNAMENT_ENDED':
      log('Tournament ended!');
      renderer.record(event.payload);
      endGame(true);
      break;

    default:
    case 'ERROR':
      logError('Error - ' + event.payload);
      break;
  }
}

/**
 * Setup a snake bot, scripted or oiled.
 * The type is determined by options.
 * @param onSnakeInited call me back when the snake is initiated
 */
function initSnakeBot(onSnakeInited){
  if(options.snakeoil){
    setupOiledBot(options, onSnakeInited);
  } else {
    setupScriptedBot(options, onSnakeInited);
  }
}

/**
 * Sets up a new scripted snake bot.
 * @param options the options
 * @param onSnakeInited call me when the snake is initiated
 */
function setupScriptedBot(options, onSnakeInited){
  try {
    var snake = require(options.snakeScript);
    snake.bootStrap(logExt);
    snake.gameStateChanged = function(mapUpdateEvent, playerId, onResponse){
      onResponse(snake.update(mapUpdateEvent, playerId));
    };
    onSnakeInited(snake);
  } catch (e) {
    logError("Could not find or init snake bot script at : "  + options.snakeScript, e);
    throw "SnakeBotError";
  }
}

/**
 * Sets up the snakeoil server
 * @param options the options
 * @param onSnakeInited call me when snake is initiated
 */
function setupOiledBot(options, onSnakeInited){

  // A wrapper for the oiled snake
  var snake = {
    client : null,
    gameStateResponder: null,
    gameStateChanged :function update(mapUpdateEvent, playerId, onResponse) {
      this.gameStateResponder = onResponse;
      this.client.sendMessage(JSON.stringify({type: 'GAME_STATE', mapState: mapUpdateEvent.marshall(), myUserId: playerId}));
    },
    gameEnded: function(){
      this.client.sendMessage(JSON.stringify({type: 'GAME_END'}));
    },
    handleResponse : function(response){
      this.gameStateResponder(response);
    }
  };

  try {
    var server = Net.createServer();
    server.listen(4242);
    server.on('connection', function(socket) {
      log('Client connected!');
      snake.client = new JsonSocket(socket);
      snake.client.on('message', function(response) {
        snake.handleResponse(response);
      });
      onSnakeInited(snake);
    });
  } catch (e) {
    logError('Could not init SnakeOil bot bus', e);
    throw 'SnakeBotError';
  }
}

function isTournament(){
  return gameInfo.getGameMode() === 'TOURNAMENT';
}

/**
 * Parses the command line options.
 * @param argv minimist command line options
 * @returns {{help: *, snakeScript: null, user: *, host: *, port: *, venue: string, training: *, renderMode: string, silentLog: *, mambaDebug: *, gamelink: *}}
 */
function parseOptions(argv){
  var options = {
    help        : argv.h || argv.help,
    snakeScript : argv._ ? argv._[0] : null,
    user        : argv.u || argv.user,
    host        : argv.host ? argv.host : 'snake.cygni.se',
    port        : argv.port ? argv.port : 80,
    venue       : argv.venue ? argv.venue : 'training',
    training    : argv.t || argv.training,
    renderMode  : argv.norender ? 'norender' : argv.animate ? 'animate' : 'default',
    silentLog   : argv.silent,
    mambaDebug  : argv.mambadbg,
    gamelink    : argv.gamelink,
    snakeoil    : argv.snakeoil
  };

  if(options.help || !options.snakeScript && !options.snakeoil){
    printUsage(options);
  }

  if(!options.user){
    logWarning('Username not set, consider setting one `-u, --user <name>`');
  }

  return options;
}

/**
 * Prints usage information.
 * @param options
 */
function printUsage(options){
    log('Usage; node snake-cli <snake-bot.js>\n');
    console.log(' -u, --user <username> : the username');
    console.log(' --host <snake.cygni.se> : the host');
    console.log(' --port <80> : the server port');
    console.log(' --venue <training> : the game room');
    console.log(' -t --training : force training');
    console.log(' --norender : no game replay');
    console.log(' --animate : animated game replay');
    console.log(' --silent : snakebot log is silenced');
    console.log(' --mambadbg : show all mamba logs');
    console.log(' --gamelink : open GameLink');
    console.log(' --snakeoil <4242> : enable SnakeOil bot bus');
    console.log('\n');
}

function log(msg, data){
 var formattedMsg = DateFormat(new Date(), 'HH:MM:ss.l') + ' - ' + msg;
  data ? console.log(formattedMsg, data) : console.log(formattedMsg);
}

function logError(message, err){
  console.log(Colors.red + DateFormat(new Date(), 'HH:MM:ss.l') + ' - ERROR - ' + message + Colors.reset, err);
}

function logWarning(message){
  console.log(Colors.yellow + DateFormat(new Date(), 'HH:MM:ss.l') + ' - WARNING - ' + message + Colors.reset);
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