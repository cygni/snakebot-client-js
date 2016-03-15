namespace CygniSnakeBot.Client
{
    public class GameSettings
    {
        // World width
        public int Width { get; set; } = 50;

        // World height
        public int Height { get; set; } = 25;

        // Maximum noof players in this game
        public int MaxNoofPlayers { get; set; } = 5;

        // The starting length of a snake
        public int StartSnakeLength { get; set; } = 1;

        // The time clients have to respond with a new move
        public int TimeInMsPerTick { get; set; } = 250;

        // Randomly place obstacles
        public bool ObstaclesEnabled { get; set; } = false;

        // Randomly place food
        public bool FoodEnabled { get; set; } = true;

        // Traveling to the edge does not kill but moves to
        // corresponding edge on other side.
        public bool EdgeWrapsAround { get; set; } = false;

        // If a snake manages to nibble on the tail
        // of another snake it will consume that tail part.
        // I.e. the nibbling snake will grow one and
        // victim will loose one.
        public bool HeadToTailConsumes { get; set; } = false;

        // Only valid if headToTailConsumes is active.
        // When tailConsumeGrows is set to true the
        // consuming snake will grow when eating
        // another snake.
        public bool TailConsumeGrows { get; set; } = false;

        // Likelihood (in percent) that a new food will be
        // added to the world
        public int AddFoodLikelihood { get; set; } = 15;

        // Likelihood (in percent) that a
        // food will be removed from the world
        public int RemoveFoodLikelihood { get; set; } = 5;

        // Likelihood (in percent) that a new obstacle will be
        // added to the world
        public int AddObstacleLikelihood { get; set; } = 15;

        // Likelihood (in percent) that an
        // obstacle will be removed from the world
        public int RemoveObstacleLikelihood { get; set; } = 15;
    }
}