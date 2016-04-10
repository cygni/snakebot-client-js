namespace Cygni.Snake.Client
{
    /// <summary>
    /// Represents an observer of snake games.
    /// </summary>
    public interface IGameObserver
    {
        /// <summary>
        /// Notifies this observer that the specified snake has died due to the
        /// specified reason.
        /// </summary>
        /// <param name="reason">The specified reason.</param>
        /// <param name="snakeId">The id of the snake that died.</param>
        void OnSnakeDied(string reason, string snakeId);

        /// <summary>
        /// Notifies this observer that a new game has started.
        /// </summary>
        void OnGameStart();

        /// <summary>
        /// Notifies this observer that the game has ended.
        /// </summary>
        /// <param name="map">The current map.</param>
        void OnGameEnd(Map map);

        /// <summary>
        /// Notifies this observer that the map has been updated.
        /// </summary>
        /// <param name="map">The updated map.</param>
        void OnUpdate(Map map);
    }
}