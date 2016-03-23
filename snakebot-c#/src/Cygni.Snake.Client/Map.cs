using System;
using System.Collections.Generic;
using System.Linq;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Tiles;

namespace Cygni.Snake.Client
{
    public class Map : IPrintable
    {
        public int Width { get; }

        public int Height { get; }

        public IEnumerable<IEnumerable<ITileContent>> Tiles { get; }

        public IEnumerable<SnakeInfo> SnakeInfos { get; }

        public Map(int width, int height, IEnumerable<IEnumerable<ITileContent>> tiles, IEnumerable<SnakeInfo> snakeInfos)
        {
            Width = width;
            Height = height;
            Tiles = tiles;
            SnakeInfos = snakeInfos;
        }

        public void Print()
        {
            Console.WriteLine(new string('-', Width + 2));
            for (var y = 0; y < Height; y++)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("|"); // end line

                for (var x = 0; x < Width; x++)
                {
                    Tiles.ElementAt(x).ElementAt(y).Print();
                }

                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("| ");
                SnakeInfos.ElementAtOrDefault(y)?.Print();
                Console.Write("\n"); // end line
            }
            Console.WriteLine(new string('-', Width + 2));
        }
    }
}