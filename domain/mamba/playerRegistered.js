var GameSettings = require('./gameSettings.js');

function PlayerRegistered(gameId, gameMode, receivingPlayerId, name, settings) {

  var type              = 'se.cygni.snake.api.response.PlayerRegisteredEvent';
  var gameId            = gameId;
  var gameMode          = gameMode;
  var receivingPlayerId = receivingPlayerId;
  var playerName        = name;
  var settings          = settings;

  var toString = function(){
       return '<Type:' + type + 'gameId:' + gameId + ', gameMode:' + gameMode + ', receivingPlayerId:' + receivingPlayerId
         + 'playerName:' + playerName + ', settings:' + settings +'>';
  };

  function getReceivingPlayerId(){
    return receivingPlayerId;
  }

  function getGameId(){
    return gameId;
  }

  function updateGameId(theGameId){
    gameId = theGameId;
  }

  function getGameMode(){
    return gameMode;
  }

  function getPlayerName(){
    return playerName;
  }

  function getSettings(){
    return settings;
  }

  return Object.freeze({
    type: type,
    toString : toString,
    getPlayerId : getReceivingPlayerId,
    getGameId: getGameId,
    getGameMode : getGameMode,
    getPlayerName: getPlayerName,
    getGameSettings: getSettings,
    updateGameId: updateGameId
  });

};

function create(data){
  return PlayerRegistered(
    data.gameId,
    data.gameMode,
    data.receivingPlayerId,
    data.name,
    GameSettings.create(data.gameSettings));
};

exports.new = PlayerRegistered;
exports.create = create;
exports.type = PlayerRegistered().type;