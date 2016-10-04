function RegisterPlayer(name, settings) {

  var type        = 'se.cygni.snake.api.request.RegisterPlayer';
  var playerName  = name || 'Viper-' + new Date().getMilliseconds();
  var settings    = settings || {};

  var toString = function(){
       return '<Type:' + type + ', playerName:' + playerName + ', settings:' + settings.toString() + '>';
  };

  var marshall = function(){
     return {
       type : type,
       playerName : playerName,
       gameSettings : settings.marshall()
     };
  };

  return Object.freeze({
    marshall : marshall,
    toString : toString,
    type: type
  });

};

exports.new = RegisterPlayer;
exports.type = RegisterPlayer().type;