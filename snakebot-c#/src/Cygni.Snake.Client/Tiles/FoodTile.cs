using System;

namespace Cygni.Snake.Client.Tiles
{
    public class FoodTile : ITileContent
    {
        public const string CONTENT = "food";

        public string Content => CONTENT;
        public void Print()
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("F");
        }
    }
}