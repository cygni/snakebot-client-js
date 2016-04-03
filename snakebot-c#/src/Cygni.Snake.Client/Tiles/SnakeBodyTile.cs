using System;

namespace Cygni.Snake.Client.Tiles
{
    public class SnakeBodyTile : SnakePartTile, ITileContent
    {
        public const string CONTENT = "snakebody";

        public string Content => CONTENT;
        
        public SnakeBodyTile(string playerId) : base(playerId)
        {
        }

        public void Print()
        {
            Console.ForegroundColor = Color;
            Console.Write("#");
        }
    }
}