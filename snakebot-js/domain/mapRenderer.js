/**
 * The MapRenderer prints game information to the terminal.
 */

var MapUpdateEvent  = require('./mamba/mapUpdateEvent.js');
var GameEndedEvent  = require('./mamba/gameEndedEvent.js');
var SnakeDeadEvent  = require('./mamba/snakeDeadEvent.js');
var rl = require('readline');

function MapRenderer(width, height){

  // Mac colors...
  var COLORS              = ['\x1b[1m\x1b[33m', '\x1b[1m\x1b[32m', '\x1b[1m\x1b[34m', '\x1b[1m\x1b[35m', '\x1b[1m\x1b[36m', '\x1b[1m\x1b[31m', //bright: green, yellow, blue, magenta, cyan, red
                            '\x1b[2m\x1b[33m', '\x1b[2m\x1b[32m', '\x1b[2m\x1b[34m', '\x1b[2m\x1b[35m', '\x1b[2m\x1b[36m', '\x1b[2m\x1b[31m']; //dim: green, yellow, blue, magenta, cyan, red
  var COLOR_BG_RED        = '\x1b[41m';
  var COLOR_BG_WHITE      = '\x1b[47m';
  var COLOR_RESET         = '\x1b[0m';
  var NEW_LINE            = '\n';
  var recordedMapStates   = {};
  var recordedGameEvents  = {};
  var recordedDebug       = {};
  var gameSnakes          = {};
  var mapWidth            = width;
  var mapHeight           = height;

  function record(event, debugInfo){
    var gameTick = event.getGameTick();
    if(event.type === MapUpdateEvent.type || event.type === GameEndedEvent.type){
      recordedMapStates[gameTick] = event;
    } else {
      if (!recordedGameEvents[gameTick]) {
        recordedGameEvents[gameTick] = [];
      }
      recordedGameEvents[gameTick].push(event);
    }
    recordDebug(debugInfo, gameTick);
  }

  function recordDebug(data, gameTick) {
    if(data) {
      recordedDebug[gameTick] = data;
    }
  }

  function render(onComplete, settings){
    if(settings && settings.animate){
      renderAnimated(settings, onComplete);
    } else {
      renderStatic(settings, onComplete);
    }
  }

  function renderStatic(settings, onComplete){
    var gameId    = recordedMapStates[0].getGameId();
    var gameTicks = Object.keys(recordedMapStates).length;
    renderGameHeader(gameId, gameTicks);
    for (var tick in recordedMapStates){
      renderMapState(recordedMapStates[tick], settings.followPid);
      renderDebug(recordedDebug[tick]);
    }
    renderEndOfGame(recordedMapStates[gameTicks - 1]);
    onComplete ? onComplete() : 0;
  }

  function renderAnimated(settings, onComplete){
    rl.cursorTo(process.stdout, 0, 0);
    rl.clearScreenDown(process.stdout);
    var gameId = recordedMapStates[0].getGameId();
    var gameTicks = Object.keys(recordedMapStates).length;
    renderGameHeader(gameId, gameTicks);
    var i = 0;
    function renderStates() {
      var tick = 0;
      setTimeout(function() {
        rl.cursorTo(process.stdout, 0, 4);
        rl.clearScreenDown(process.stdout);
        tick = recordedMapStates[i].getGameTick();
        renderMapState(recordedMapStates[tick], settings.followPid);
        renderDebug(recordedDebug[tick]);
        i++;
        if (i < gameTicks) {
          renderStates();
        }  else {
          renderEndOfGame(recordedMapStates[tick]);
          onComplete ? onComplete() : 0;
        }
      }, settings.delay);
    }
    renderStates();
  }

  function updateSnakesInfo(mapState, followPid){
    var isNewGame = (0 == Object.keys(gameSnakes).length);
    var snakeCounter = 1;
    mapState.getMap().getSnakeInfos().forEach(function(snake){
      if(isNewGame){
        gameSnakes[snake.id] = {name:snake.name, label: snakeCounter, length: snake.length, highlight: followPid && followPid == snake.id, isDead: false, tickOfDeath: null, termColor: COLORS[snakeCounter - 1]};
        snakeCounter++;
      } else {
        gameSnakes[snake.id].length = snake.length;
      }
    });

    // Handle snake events
    if(recordedGameEvents[mapState.getGameTick()]){
      var events = recordedGameEvents[mapState.getGameTick()];
      events.forEach(function(event){
        if(event.type === SnakeDeadEvent.type){
          gameSnakes[event.getPlayerId()].isDead = true;
          gameSnakes[event.getPlayerId()].tickOfDeath = mapState.getGameTick();
          gameSnakes[event.getPlayerId()].deathReason = event.getDeathReason();
        }
      });
    }
  }

  function renderGameHeader(gameId, gameTicks){
    print(NEW_LINE + '==========================================================================');
    print('Playback of game id: ' + gameId + ' (' + gameTicks +' game ticks)');
    print('==========================================================================');
  }

  function renderMapState(mapState, followPid){
    print("\n*** GAME STATE (tick: " + mapState.getMap().getWorldTick() + ") ***");
    updateSnakesInfo(mapState, followPid);
    renderSnakesInfo(gameSnakes, mapState);
    renderMap(mapState);
  }

  function renderMap(mapState){
    var _PIPE   = '|';
    var tiles   = mapState.getMap().getTiles();
    var topLine = '\n' + mapWidth + _PIPE;

    var xLabel = 0;
    for(var i = 0; i < mapWidth; i++){
      topLine += '' + xLabel + '';
      xLabel < 9 ? xLabel++ : xLabel = 0;
    }
    print(topLine);

    for(var y = 0; y < mapHeight ; y++) {
      var lineTxt = "";
      for(var x = 0; x < mapWidth ; x++) {
        var tile = tiles[x][y];
        switch(tile.content){
          case 'snakebody':
            lineTxt += gameSnakes[tile.playerId].termColor + '▓' + COLOR_RESET;
            break;
          case 'snakehead':
            lineTxt += gameSnakes[tile.playerId].label;
            break;
          case 'food':
            lineTxt += '\x1b[41m\x1b[1m\x1b[37m' + '@' + COLOR_RESET;
            break;
          case 'obstacle':
            lineTxt += '\x1b[41m\x1b[1m\x1b[37m' + '!' + COLOR_RESET;
            break;
          default:
            lineTxt += '░';
        }
      }
      print('' + y + (y > 9 ? '' : ' ') + _PIPE + lineTxt + _PIPE);
    }
  }

  function renderDebug(data){
    if(data && 0 != Object.keys(data).length){
      print(NEW_LINE + 'Debug data:');
      print(JSON.stringify(data));
    }
  }

  function renderSnakesInfo(gameSnakes){
    var snakesTxt = 'Snakes: ';
    for (var playerId in gameSnakes) {
      var snake       = gameSnakes[playerId];
      var snakeName   = getHighLightToken(snake) + snake.label + '->' + snake.name;
      var snakeLength = '[' + snake.length + ']';
      var snakeDead   = (snake.isDead ? ' ' + COLOR_BG_RED + '┼' +  ' ' + snake.tickOfDeath  + COLOR_RESET: '');
      snakesTxt += snakeName + snakeLength + snakeDead + ', ';
    }
    print(snakesTxt);
  }

  function renderEndOfGame(endState){
    print(NEW_LINE + '-------------------------------------------------');
    print('End of game: ' + endState.getGameId());

    var livingSnakes = [];
    var deadSnakes = [];
    for (var playerId in gameSnakes) {
      var snake = gameSnakes[playerId];
      snake.isDead ? deadSnakes.push(snake) : livingSnakes.push(snake);
    }

    livingSnakes.sort(compareLength);
    deadSnakes.sort(compareTickOfDeath);

    var winnerSnake = gameSnakes[endState.getPlayerWinnerId()];
    print(NEW_LINE + 'Winner: ' + (winnerSnake ? getHighLightToken(snake) + winnerSnake.label + '->' + snake.name + '[' + winnerSnake.length + ']' : '<none>'));

    print(NEW_LINE + 'Heroes:');
    var place = 1;
    livingSnakes.forEach(function(snake){
      print('' + place + '. ' + snake.label + '->' + snake.name + '[' + snake.length + ']');
      place++;
    });

    print(NEW_LINE + 'Killed-in-action: ' + (deadSnakes.length == 0 ? '<none>' : ''));
    deadSnakes.forEach(function(snake){
      print('┼' + snake.tickOfDeath + '. ' + getHighLightToken(snake) + snake.label + '->' + snake.name + ' (' + snake.deathReason + ')');
    });

    print("-------------------------------------------------\n");

    function compareLength(a,b) {
      if (a.length < b.length)
        return -1;
      else if (a.length > b.length)
        return 1;
      else
        return 0;
    }

    function compareTickOfDeath(a,b) {
      if (a.tickOfDeath < b.tickOfDeath)
        return -1;
      else if (a.tickOfDeath > b.tickOfDeath)
        return 1;
      else
        return 0;
    }

  }

  function getHighLightToken(snake){
    return snake.highlight ? snake.termColor + '█ ' + COLOR_RESET : '';
  }

  function print(text){
    console.log(text);
  }

  return Object.freeze({
    record      : record,
    recordDebug : recordDebug,
    render      : render
  });

};

module.exports = MapRenderer;