function RegisterPlayer(name, color, settings) {

  var type        = "se.cygni.snake.api.request.RegisterPlayer";
  var playerName  = name || 'Viper-' + new Date().getMilliseconds();
  var color       = color || 'red';
  var settings    = settings || {};

  var toString = function(){
       return "<Type:" + type + ", playerName:" + playerName + ", color:" + color + ", settings:" + settings.toString() + ">";
  };

  var marshall = function(){
     return {
       type : type,
       playerName : playerName,
       color: color,
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