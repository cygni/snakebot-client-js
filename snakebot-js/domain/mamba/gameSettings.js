var GameSettings = function(settings) {

  var maxNoofPlayers            = settings && settings.maxNoofPlayers || 5;
  var startSnakeLength          = settings && settings.startSnakeLength || 1;
  var timeInMsPerTick           = settings && settings.timeInMsPerTick || 250;
  var obstaclesEnabled          = settings && settings.obstaclesEnabled || false;
  var foodEnabled               = settings && settings.foodEnabled || true;
  var headToTailConsumes        = settings && settings.headToTailConsumes || true;
  var tailConsumeGrows          = settings && settings.tailConsumeGrows || false;
  var addFoodLikelihood         = settings && settings.addFoodLikelihood || 15;
  var removeFoodLikelihood      = settings && settings.removeFoodLikelihood || 5;
  var obstacleIntensity         = settings && settings.obstacleIntensity || 5;
  var trainingGame              = settings && settings.trainingGame || false;

  var marshall = function(){
    return {
      maxNoofPlayers: maxNoofPlayers,
      startSnakeLength : startSnakeLength,
      timeInMsPerTick : timeInMsPerTick,
      obstaclesEnabled : obstaclesEnabled,
      foodEnabled : foodEnabled,
      headToTailConsumes : headToTailConsumes,
      tailConsumeGrows : tailConsumeGrows,
      addFoodLikelihood : addFoodLikelihood,
      removeFoodLikelihood : removeFoodLikelihood,
      obstacleIntensity : obstacleIntensity,
      trainingGame : trainingGame
    }
  };

  var toString = function(){
    return '< maxNoofPlayers:' + maxNoofPlayers + ', startSnakeLength:' + startSnakeLength + '>';
  };

  return Object.freeze({
    marshall  : marshall,
    toString  : toString
  });

};

exports.create = GameSettings;