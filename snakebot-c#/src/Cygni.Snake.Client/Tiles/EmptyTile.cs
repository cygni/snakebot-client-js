namespace Cygni.Snake.Client.Tiles
{
    public class EmptyTile : ITileContent
    {
        public const string CONTENT = "empty";

        public string Content => CONTENT;
    }
}