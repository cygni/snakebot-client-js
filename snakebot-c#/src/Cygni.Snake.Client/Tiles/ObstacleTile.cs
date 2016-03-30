using System;

namespace Cygni.Snake.Client.Tiles
{
    public class ObstacleTile : ITileContent
    {
        public const string CONTENT = "obstacle";

        public string Content => CONTENT;

        public void Print()
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write("*");
        }
    }
}