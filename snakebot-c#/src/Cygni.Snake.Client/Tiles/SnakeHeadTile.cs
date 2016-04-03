using System;

namespace Cygni.Snake.Client.Tiles
{
    public class SnakeHeadTile : SnakePartTile, ITileContent
    {
        public const string CONTENT = "snakehead";

        public string Content => CONTENT;
        
        public SnakeHeadTile(string playerId) : base(playerId)
        {
        }
        public void Print()
        {
            Console.ForegroundColor = Color;
            Console.Write("@");
        }
    }
}