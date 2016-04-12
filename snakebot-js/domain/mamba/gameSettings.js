var GameSettings = function(settings) {

  var width                     = settings && settings.width || 'MEDIUM';
  var height                    = settings && settings.height || 'MEDIUM';
  var maxNoofPlayers            = settings && settings.maxNoofPlayers || 5;
  var startSnakeLength          = settings && settings.startSnakeLength || 1;
  var timeInMsPerTick           = settings && settings.timeInMsPerTick || 250;
  var obstaclesEnabled          = settings && settings.obstaclesEnabled || false;
  var foodEnabled               = settings && settings.foodEnabled || true;
  var edgeWrapsAround           = settings && settings.edgeWrapsAround || false;
  var headToTailConsumes        = settings && settings.headToTailConsumes || false;
  var tailConsumeGrows          = settings && settings.tailConsumeGrows || false;
  var addFoodLikelihood         = settings && settings.addFoodLikelihood || 100;
  var removeFoodLikelihood      = settings && settings.removeFoodLikelihood || 5;
  var addObstacleLikelihood     = settings && settings.addObstacleLikelihood || 15;
  var removeObstacleLikelihood  = settings && settings.removeObstacleLikelihood || 15;

  function getWidth(){
   return width;
  }

  function getHeight(){
   return height;
  }

  var marshall = function(){
    return {
      width : width,
      height : height,
      maxNoofPlayers: maxNoofPlayers,
      startSnakeLength : startSnakeLength,
      timeInMsPerTick : timeInMsPerTick,
      obstaclesEnabled : obstaclesEnabled,
      foodEnabled : foodEnabled,
      edgeWrapsAround : edgeWrapsAround,
      headToTailConsumes : headToTailConsumes,
      tailConsumeGrows : tailConsumeGrows,
      addFoodLikelihood : addFoodLikelihood,
      removeFoodLikelihood : removeFoodLikelihood,
      addObstacleLikelihood : addObstacleLikelihood,
      removeObstacleLikelihood : removeObstacleLikelihood
    }
  };

  var toString = function(){
    return "<width:" + width + ", height:" + height + ", " +
      "maxNoofPlayers:" + maxNoofPlayers + ", startSnakeLength:" + startSnakeLength + ">";
  };

  return Object.freeze({
    getWidth  : getWidth,
    getHeight : getHeight,
    marshall  : marshall,
    toString  : toString
  });

};

exports.create = GameSettings;