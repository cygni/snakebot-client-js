/**
 * The MapRenderer records and prints game information to the terminal, using DoT templates.
 */

var MapUtils            = require('./mapUtils.js');
var MapUpdateEvent      = require('./mamba/mapUpdateEvent.js');
var GameEndedEvent      = require('./mamba/gameEndedEvent.js');
var SnakeDeadEvent      = require('./mamba/snakeDeadEvent.js');
var gameHeaderTemplate  = require('./templates/gameheader');
var gameStateTemplate   = require('./templates/gamestate');
var gameResultTemplate  = require('./templates/gameresult');
var rl                  = require('readline');

function MapRendererDoT(){

  var COLORS = {
    green: '\x1b[1m\x1b[33m',
    yellow : '\x1b[1m\x1b[32m',
    blue: '\x1b[1m\x1b[34m',
    magenta: '\x1b[1m\x1b[35m',
    cyan: '\x1b[1m\x1b[36m',
    red: '\x1b[1m\x1b[31m',
    green2: '\x1b[2m\x1b[33m',
    yellow2: '\x1b[2m\x1b[32m',
    blue2: '\x1b[2m\x1b[34m',
    magenta2: '\x1b[2m\x1b[35m',
    cyan2: '\x1b[2m\x1b[36m',
    red2: '\x1b[2m\x1b[31m',
    white: '\x1b[37m',
    bgred: '\x1b[41m',
    bgwhite: '\x1b[47m',
    bold: '\x1b[1m',
    reset: '\x1b[0m'
  };
  var COLORS_KEYS         = Object.keys(COLORS);
  var NEW_LINE            = '\n';
  var recordedGameStates  = {};
  var recordedGameEvents  = {};
  var recordedDebug       = {};

  function record(event, debugInfo){
    var gameTick = event.getGameTick();
    if(event.type === MapUpdateEvent.type || event.type === GameEndedEvent.type){
      recordedGameStates[gameTick] = event;
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

  function render(settings, onComplete){
    if(settings && settings.animate){
      renderAnimated(recordedGameStates, settings, onComplete);
    } else {
      renderStatic(recordedGameStates, settings, onComplete);
    }
  }

  function renderStatic(gameStates, settings, onComplete){
    var firstGameState = gameStates[0];
    var totalTicks = Object.keys(gameStates).length;
    var gameSnakes = initGameSnakes(firstGameState, settings.followPid);
    renderGameHeader(firstGameState.getGameId(), totalTicks);
    for (var tick in gameStates){
      var gameState = gameStates[tick];
      var gameEvents = recordedGameEvents[tick];
      var debugData = recordedDebug[tick];
      updateGameSnakes(tick, gameSnakes, gameState, gameEvents);
      renderGameState(gameState, gameSnakes, debugData);
    }
    renderEndOfGame(gameSnakes, gameStates[totalTicks - 1]);
    onComplete ? onComplete() : 0;
  }

  function renderAnimated(gameStates, settings, onComplete){
    rl.cursorTo(process.stdout, 0, 0);
    rl.clearScreenDown(process.stdout);
    var firstGameState = gameStates[0];
    var totalTicks = Object.keys(gameStates).length;
    var gameSnakes = initGameSnakes(firstGameState, settings.followPid);
    renderGameHeader(firstGameState.getGameId(), totalTicks);
    var renderIdx = 0;
    function renderStates() {
      setTimeout(function() {
        rl.cursorTo(process.stdout, 0, 4);
        rl.clearScreenDown(process.stdout);
        var tick = gameStates[renderIdx].getGameTick();
        var gameState = gameStates[tick];
        var gameEvents = recordedGameEvents[tick];
        var debugData = recordedDebug[tick];
        updateGameSnakes(tick, gameSnakes, gameState, gameEvents);
        renderGameState(gameState, gameSnakes, debugData);
        renderIdx++;
        if (renderIdx < totalTicks) {
          renderStates();
        }  else {
          renderEndOfGame(gameSnakes, gameStates[tick]);
          onComplete ? onComplete() : 0;
        }
      }, settings.delay);
    }
    renderStates();
  }

  function renderGameState(gameState, gameSnakes, debugData){
    var gameId = gameState.getGameId();
    var gameTick = gameState.getGameTick();
    var height = gameState.getMap().getHeight();
    var width = gameState.getMap().getWidth();
    var renderedGameMap = renderMap(gameState, gameSnakes, height, width).join('');
    var templateData = {
      colors: COLORS,
      gameId: gameId,
      gameTick: gameTick,
      gameSnakes: gameSnakes,
      gameMap: renderedGameMap,
      debugData: debugData ? JSON.stringify(debugData) : null
    };
    print(gameStateTemplate(templateData));
  }

  function renderGameHeader(gameId, gameTicks){
    var templateData = {
      gameId: gameId,
      totalGameTicks: gameTicks
    };
    print(gameHeaderTemplate(templateData));
  }

  function renderEndOfGame(gameSnakes, endGameState) {
    var results = computeResults(gameSnakes, endGameState.getPlayerWinnerId());
    var templateData = {
      colors: COLORS,
      gameId: endGameState.getGameId(),
      gameSnakes: gameSnakes,
      results: results
    };
    print(gameResultTemplate(templateData));
  }

  function initGameSnakes(mapState, followPlayerId){
    var gameSnakes = {};
    var snakeIdx = 0;
    mapState.getMap().getSnakeInfos().forEach(function(snake){
      snakeIdx++;
      gameSnakes[snake.getId()] = {
        id: snake.getId(),
        name:snake.getName(),
        label: snakeIdx,
        length: snake.getLength(),
        highlight: followPlayerId && followPlayerId == snake.getId(),
        isDead: !snake.isAlive(),
        tickOfDeath: null,
        points: snake.getPoints(),
        termColor: getColorByIdx(snakeIdx - 1)
      };
    });
    return gameSnakes;
  }

  function updateGameSnakes(tick, gameSnakes, mapState, events){
    mapState.getMap().getSnakeInfos().forEach(function(snake){
      gameSnakes[snake.getId()].length = snake.getLength();
      gameSnakes[snake.getId()].points = snake.getPoints();
    });

    // Handle snake events
    if(events){
      events.forEach(function(event){
        if(event.type === SnakeDeadEvent.type){
          gameSnakes[event.getPlayerId()].isDead = true;
          gameSnakes[event.getPlayerId()].tickOfDeath = tick;
          gameSnakes[event.getPlayerId()].deathReason = event.getDeathReason();
        }
      });
    }
    return gameSnakes;
  }

  function computeResults(gameSnakes, winnerPlayerId){
    var livingSnakes  = [];
    var deadSnakes    = [];
    for (var playerId in gameSnakes) {
      var snake = gameSnakes[playerId];
      snake.isDead ? deadSnakes.push(snake) : livingSnakes.push(snake);
    }
    livingSnakes.sort(function(a,b){ return b.points - a.points || a.id - b.id; }); // Points desc, id desc
    deadSnakes.sort(function(a,b){ return a.tickOfDeath - b.tickOfDeath; }); // Tick asc
    return {
      livingSnakesByPoints: livingSnakes,
      deadSnakesByTick: deadSnakes,
      winnerByPoints: gameSnakes[winnerPlayerId]
    };
  }

  function getMergedTiles(map){
    var tiles = new Array(map.getWidth());
    for (var i = 0; i < map.getWidth(); i++) {
      tiles[i] = new Array(map.getHeight());
    }

    map.getFoodPositions().forEach(function(position){
      var tilePos = MapUtils.translatePosition(position, map.getWidth());
      tiles[tilePos.x][tilePos.y] = {content: 'food'}
    });

    map.getObstaclePositions().forEach(function(position){
      var tilePos = MapUtils.translatePosition(position, map.getWidth());
      tiles[tilePos.x][tilePos.y] = {content: 'obstacle'}
    });

    map.getSnakeInfos().forEach(function(snakeInfo){
      if(snakeInfo.isAlive()){
        for(var i = 0; i < snakeInfo.getPositions().length; i++){
          var tilePos = MapUtils.translatePosition(snakeInfo.getPositions()[i], map.getWidth());
          tiles[tilePos.x][tilePos.y] = {content: i != 0 ? 'snakebody' : 'snakehead', playerId: snakeInfo.getId()};
        }
      }
    });
    return tiles;
  }

  function renderMap(mapState, gameSnakes, mapHeight, mapWidth){
    var renderLines = [];
    var _PIPE   = '|';
    var tiles   = getMergedTiles(mapState.getMap());
    var topLine = '<NEWLINE>' + mapWidth + _PIPE;

    var xLabel = 0;
    for(var i = 0; i < mapWidth; i++){
      topLine += '' + xLabel + '';
      xLabel < 9 ? xLabel++ : xLabel = 0;
    }
    renderLines.push(topLine + '<NEWLINE>');

    for(var y = 0; y < mapHeight ; y++) {
      var lineTxt = "";
      for(var x = 0; x < mapWidth ; x++) {
        var tile = tiles[x][y];
        if(tile){
          switch(tile.content){
            case 'snakebody':
              lineTxt += gameSnakes[tile.playerId].termColor + '▓' + COLORS.reset;
              break;
            case 'snakehead':
              lineTxt += gameSnakes[tile.playerId].label;
              break;
            case 'food':
              lineTxt += COLORS.bgred + COLORS.bold + COLORS.white + '@' + COLORS.reset;
              break;
            case 'obstacle':
              lineTxt += COLORS.bgred + COLORS.bold + COLORS.white + '!' + COLORS.reset;
              break;
            default:
              lineTxt += '?';
          }
        } else {
          lineTxt += '░';
        }
      }
      renderLines.push('' + y + (y > 9 ? '' : ' ') + _PIPE + lineTxt + _PIPE + '<NEWLINE>');
    }
    return renderLines;
  }

  function getColorByIdx(idx){
    return COLORS[COLORS_KEYS[idx]];
  }

  function print(str){
    console.log(str.replace(/<NEWLINE>/g, '\n'));
  }

  return Object.freeze({
    record      : record,
    recordDebug : recordDebug,
    render      : render
  });

};

module.exports = MapRendererDoT;