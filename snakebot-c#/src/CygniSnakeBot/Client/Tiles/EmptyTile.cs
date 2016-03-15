namespace CygniSnakeBot.Client.Tiles
{
    public class EmptyTile : ITileContent
    {
        public const string CONTENT = "empty";

        public string Content => CONTENT;
    }
}