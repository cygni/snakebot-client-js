namespace CygniSnakeBot.Client.Tiles
{
    public class SnakeHeadTile : SnakePartTile, ITileContent
    {
        public const string CONTENT = "snakehead";

        public string Content => CONTENT;
        
        public string Name { get; }

        public SnakeHeadTile(string playerId, string name) : base(playerId)
        {
            Name = name;
        }
    }
}