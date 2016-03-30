using System;

namespace Cygni.Snake.Client.Tiles
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
        public void Print()
        {
            Console.ForegroundColor = Color;
            Console.Write("@");
        }
    }
}