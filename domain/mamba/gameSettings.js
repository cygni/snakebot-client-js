const GameSettings = function (settings) {
    const maxNoofPlayers = settings && settings.maxNoofPlayers || 5;
    const startSnakeLength = settings && settings.startSnakeLength || 1;
    const timeInMsPerTick = settings && settings.timeInMsPerTick || 250;
    const obstaclesEnabled = settings && settings.obstaclesEnabled || false;
    const foodEnabled = settings && settings.foodEnabled || true;
    const headToTailConsumes = settings && settings.headToTailConsumes || true;
    const tailConsumeGrows = settings && settings.tailConsumeGrows || false;
    const addFoodLikelihood = settings && settings.addFoodLikelihood || 15;
    const removeFoodLikelihood = settings && settings.removeFoodLikelihood || 5;
    const obstacleIntensity = settings && settings.obstacleIntensity || 5;
    const trainingGame = settings && settings.trainingGame || false;

    const marshall = function () {
        return {
            maxNoofPlayers,
            startSnakeLength,
            timeInMsPerTick,
            obstaclesEnabled,
            foodEnabled,
            headToTailConsumes,
            tailConsumeGrows,
            addFoodLikelihood,
            removeFoodLikelihood,
            obstacleIntensity,
            trainingGame
        };
    };

    const toString = function () {
        return `< maxNoofPlayers:${maxNoofPlayers}, startSnakeLength:${startSnakeLength}>`;
    };

    return Object.freeze({
        marshall,
        toString
    });
};

exports.create = GameSettings;
