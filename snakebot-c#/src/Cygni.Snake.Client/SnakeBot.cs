namespace Cygni.Snake.Client
{
    /// <summary>
    /// Represents an object that contains logic for choosing which 
    /// direction a <see cref="SnakePlayer"/> should move given the
    /// state of the world.
    /// </summary>
    public abstract class SnakeBot
    {
        /// <summary>
        /// Initializes a new instanse of the <see cref="SnakeBot"/> class
        /// with the specified name.
        /// </summary>
        /// <param name="name">The specified name.</param>
        protected SnakeBot(string name)
        {
            Name = name;
        }

        /// <summary>
        /// Gets the name of this <see cref="SnakeBot"/> instance.
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// When overriden in a derived class, gets the <see cref="Direction"/>
        /// in which this bot wants to move based on the specified <see cref="Map"/>.
        /// </summary>
        /// <param name="map">The specified <see cref="Map"/>, represents the current state of the game.</param>
        /// <returns>The desired direction.</returns>
        public abstract Direction GetNextMove(Map map);
    }
}