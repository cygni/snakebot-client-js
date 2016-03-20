namespace Cygni.Snake.Client.Tiles
{
    public abstract class SnakePartTile
    {
        protected SnakePartTile(string playerId)
        {
            PlayerId = playerId;
        }

        public string PlayerId { get; }
    }
}