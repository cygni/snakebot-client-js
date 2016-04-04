using Newtonsoft.Json;

namespace Cygni.Snake.Client
{
    public class GameSettings
    {
        /// <summary>
        /// Gets or sets the map width.
        /// </summary>
        [JsonProperty("width")]
        public int Width { get; set; } = 50;

        /// <summary>
        /// Gets or sets the world height.
        /// </summary>
        [JsonProperty("height")]
        public int Height { get; set; } = 25;

        /// <summary>
        /// Gets or sets the maximum number of players in a game.
        /// </summary> 
        [JsonProperty("maxNoofPlayers")]
        public int MaxNoofPlayers { get; set; } = 5;

        /// <summary>
        /// Gets or sets the starting length of a snake.
        /// </summary> 
        [JsonProperty("startSnakeLength")]
        public int StartSnakeLength { get; set; } = 1;

        /// <summary>
        /// Gets or sets the maximum time, in millisseconds, that 
        /// the clients have got to figure out and respond with a new move.
        /// </summary>
        [JsonProperty("timeInMsPerTick")]
        public int TimeInMsPerTick { get; set; } = 250;

        /// <summary>
        /// Gets or sets a value indicating if there will be randomly placed obstacles in the world.
        /// </summary>
        [JsonProperty("obstaclesEnabled")]
        public bool ObstaclesEnabled { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating if randomly placed snake-food is enabled.
        /// </summary>
        [JsonProperty("foodEnabled")]
        public bool FoodEnabled { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating if edges wraps around. I.e.,
        /// hitting an edge does not kill a snake. Instead, it will continue on
        /// the corresponding edge on the other side.
        /// </summary>
        [JsonProperty("edgeWrapsAround")]
        public bool EdgeWrapsAround { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating if tail-eating is enabled. I.e.,
        /// if one snake manages to nibble on the tail of another snake it 
        /// will consume that tail part and the victim snake will loose that
        /// body part. Also, if <see cref="TailConsumeGrows"/> is true, 
        /// </summary>
        [JsonProperty("headToTailConsumes")]
        public bool HeadToTailConsumes { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating if eating the tail of another
        /// snake will make the snake grow. Only valid if <see cref="HeadToTailConsumes"/> is true.
        /// </summary>
        [JsonProperty("tailConsumeGrows")]
        public bool TailConsumeGrows { get; set; } = false;

        /// <summary>
        /// Gets or sets the likelihood (in percent) that a new food will be
        /// added to the world.
        /// </summary>
        [JsonProperty("addFoodLikelihood")]
        public int AddFoodLikelihood { get; set; } = 15;

        /// <summary>
        /// Gets or sets the likelihood (in percent) that a
        /// food will be removed from the world
        /// </summary>
        [JsonProperty("removeFoodLikelihood")]
        public int RemoveFoodLikelihood { get; set; } = 5;

        /// <summary>
        /// Gets or sets the likelihood (in percent) that a new obstacle will be
        /// added to the world.
        /// </summary>
        [JsonProperty("addObstacleLikelihood")]
        public int AddObstacleLikelihood { get; set; } = 15;

        /// <summary>
        /// Gets or sets the likelihood (in percent) that an
        /// obstacle will be removed from the world
        /// </summary>
        [JsonProperty("removeObstacleLikelihood")]
        public int RemoveObstacleLikelihood { get; set; } = 15;
    }
}