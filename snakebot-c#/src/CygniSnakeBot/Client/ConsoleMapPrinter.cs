using System;
using System.Collections.Generic;
using System.Linq;
using CygniSnakeBot.Client.Tiles;

namespace CygniSnakeBot.Client
{
    public static class ConsoleMapPrinter
    {
        public static void Printer(Map map, IEnumerable<PlayerInfo> playerInfos = null)
        {
            Console.WriteLine(new string('-', map.Width + 2));
            for(var y = 0; y < map.Height; y++)
            {
                Console.Write("|"); // end line
                
                for (var x = 0; x < map.Width; x++)
                {
                    var tile = map.Tiles.ElementAt(x).ElementAt(y);

                    var display = GetDisplayFor(tile);
                    var color = GetConsoleColorFor(tile, playerInfos);

                    Console.ForegroundColor = color;
                    Console.Write(display);
                }

                Console.Write("|\n"); // end line
            }
            Console.WriteLine(new string('-', map.Width + 2));
        }
        
        private static ConsoleColor GetConsoleColorFor(ITileContent tile, IEnumerable<PlayerInfo> playerInfos)
        {
            var color = playerInfos?.FirstOrDefault(p => p.PlayerId.Equals((tile as SnakePartTile)?.PlayerId))?.Color;
            switch (tile.Content)
            {
                case EmptyTile.CONTENT:
                    return ConsoleColor.White;
                case FoodTile.CONTENT:
                    return ConsoleColor.Red;
                case ObstacleTile.CONTENT:
                    return ConsoleColor.Gray;
                case SnakeBodyTile.CONTENT:
                    return color ?? ConsoleColor.DarkCyan;
                case SnakeHeadTile.CONTENT:
                    return color ?? ConsoleColor.DarkCyan;
                default:
                    return ConsoleColor.White;
            }
        }

        private static string GetDisplayFor(ITileContent tile)
        {
            switch (tile.Content)
            {
                case FoodTile.CONTENT:
                    return "F";

                case ObstacleTile.CONTENT:
                    return "*";

                case SnakeBodyTile.CONTENT:
                    return "#";

                case SnakeHeadTile.CONTENT:
                    return "@";

                default:
                    return " ";
            }
        }
    }
}