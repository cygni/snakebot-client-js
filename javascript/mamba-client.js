function Mamba(host, port, eventListener, verboseLogging) {

  var WebSocket           = require('ws');
  var StringDecoder       = require('string_decoder').StringDecoder;
  var EventBus            = require('./domain/mamba/eventBus.js');
  var RegisterPlayer      = require('./domain/mamba/registerPlayer.js');
  var PlayerRegistered    = require('./domain/mamba/playerRegistered.js');
  var StartGame           = require('./domain/mamba/startGame.js');
  var GameStartingEvent   = require('./domain/mamba/gameStartingEvent.js');
  var GameEndedEvent      = require('./domain/mamba/gameEndedEvent.js');
  var SnakeDeadEvent      = require('./domain/mamba/snakeDeadEvent.js');
  var MapUpdateEvent      = require('./domain/mamba/mapUpdateEvent.js');
  var RegisterMove        = require('./domain/mamba/registerMove.js');

  // States
  var STATE_INIT          = 'app_init';
  var STATE_REGISTER      = 'game_register';
  var STATE_GAME_READY    = 'game_ready';
  var STATE_GAME_STARTED  = 'game_started';

  var decoder       = new StringDecoder('utf8');
  var eventBus      = EventBus.new();
  var ws            = null;
  var player        = null;
  var currentState  = STATE_INIT;

  if (!host){
    logError("No host you say? That's just plain rude you scurvy rebel!");
    return;
  }

  if(!port){
    logError("No port given, you sure are optimistic! I'm not.");
    return;
  }

  if(!eventListener){
    logError('Missing event listener...so I\'m supposed to talk to the hand yeah?');
    return;
  }

  // Subscribe caller to the event bus
  eventBus.subscribe(eventListener);

  function connect(venue){

    ws = new WebSocket('ws://' + host + (port ? ':' + port : '') + '/' + venue);

    ws.on('open', function open() {
      postConnect();
    });

    ws.on('onerror', function onerror() {
      errorConnect();
    });

    ws.on('onclose', function onerror(err) {
      console.log(err);
      errorConnect();
    });

    ws.on('message', function (data, flags) {
      switch (getCurrentState()) {
        case STATE_REGISTER:
          handleRegistrationDone(flags);
          break;
        case STATE_GAME_READY:
          handleGameStart(flags);
          break;
        case STATE_GAME_STARTED:
          handleGameEvent(flags);
          break;
        default:
          break;
      }
    });

    return this;
  }

  function postConnect(){
    nextState();
    log('Sssss...Connected to Snake Server on' + host + ' [' + port + ']');
    eventBus.publish({type: "CONNECTED", payload: null});
  }

  function errorConnect(){
    eventBus.publish({type: 'ERROR', payload: 'WS connection error'});
  }

  function registerPlayer(userName, snakeColor, gameSettings) {
    checkState(STATE_REGISTER);
    var regPlayer = RegisterPlayer.new(userName, snakeColor, gameSettings);
    sendSocket(regPlayer.marshall());
  }

  function startGame() {
    checkState(STATE_GAME_READY);
    var starGameEvt = StartGame.new(player.getPlayerId());
    sendSocket(starGameEvt.marshall());
  }

  function moveSnake(direction, gameTick){
    checkState(STATE_GAME_STARTED);
    sendSocket(new RegisterMove(gameTick, direction, player.getPlayerId()).marshall());
  }

  function handleRegistrationDone(data) {
    player = PlayerRegistered.create(decodeJson(data));
    log('Registration complete - ' + player.getPlayerName() + ' (id:' + player.getPlayerId() + ') is now registered on ' + player.getGameId());
    nextState();
    eventBus.publish({type: "REGISTERED", payload: player});
  }

  function handleGameStart(data) {
    var gameStart = GameStartingEvent.create(decodeJson(data));
    log("Game starting: " + gameStart.toString());
    nextState();
  }

  function handleGameEvent(data) {
    var json = decodeJson(data);
    if(json.type === MapUpdateEvent.type){
      eventBus.publish({type: "GAME_MAP_UPDATED", payload: MapUpdateEvent.create(json)});
    } else if(json.type === GameEndedEvent.type){
      eventBus.publish({type: "GAME_ENDED", payload: GameEndedEvent.create(json)});
    } else if(json.type === SnakeDeadEvent.type){
      eventBus.publish({type: "GAME_SNAKE_DEAD", payload: SnakeDeadEvent.create(json)});
    } else {
      eventBus.publish({type: "ERROR", payload: 'Unknown game event'});
    }
  }

  function getCurrentState() {
    log("Current state: " + currentState);
    return currentState;
  }

  function checkState(state) {
    if (getCurrentState() != state){
      throw new Error("Illegal state for requested action");
    }
  }

  function nextState() {
    switch (getCurrentState()) {
      case STATE_INIT:
        currentState = STATE_REGISTER;
        break;
      case STATE_REGISTER:
        currentState = STATE_GAME_READY;
        break;
      case STATE_GAME_READY:
        currentState = STATE_GAME_STARTED;
        break;
    }
    return getCurrentState();
  }

  function decodeJson(payload) {
    var json = JSON.parse(decoder.write(payload.buffer));
    log(json);
    return json;
  }

  function sendSocket(payload) {
    var json = JSON.stringify(payload);
    log("Sending >> " + json);
    ws.send(json);
  }

  function log(message){
    if(verboseLogging){
      console.log(new Date() + ' - MAMBA INFO - ' + message);
    }
  }

  function logError(message){
    console.log(new Date() + ' - MAMBA ERROR - ' + message);
  }

  return {
    prepareNewGame : registerPlayer,
    startGame : startGame,
    moveSnake : moveSnake,
    connect : connect
  }

}

module.exports = Mamba;