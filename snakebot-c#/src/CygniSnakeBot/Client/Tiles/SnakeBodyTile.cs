namespace CygniSnakeBot.Client.Tiles
{
    public class SnakeBodyTile : SnakePartTile, ITileContent
    {
        public const string CONTENT = "snakebody";

        public string Content => CONTENT;
        
        public int Order { get; }

        public bool Tail { get; }

        public SnakeBodyTile(string playerId, int order, bool tail) : base(playerId)
        {
            Order = order;
            Tail = tail;
        }
    }
}