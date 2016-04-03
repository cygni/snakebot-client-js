using System;
using System.Collections.Generic;
using System.Linq;

namespace Cygni.Snake.Client
{
    public class Tile
    {
        private static readonly Tile ObstacleTile = new Tile(TileType.Obstacle, ConsoleColor.Yellow);
        private static readonly Tile FoodTile = new Tile(TileType.Food, ConsoleColor.Red);
        private static readonly Tile EmptyTile = new Tile(TileType.Empty, ConsoleColor.White);

        private Tile(TileType type, ConsoleColor color)
        {
            Type = type;
            PrintCharacter = GetPrintCharacter(type);
            PrintColor = color;
        }

        public string PrintCharacter { get; }

        public ConsoleColor PrintColor { get; }

        public TileType Type { get; }

        private static string GetPrintCharacter(TileType type)
        {
            switch (type)
            {
                case TileType.Obstacle:
                    return "*";
                case TileType.Food:
                    return "F";
                case TileType.SnakeHead:
                    return "@";
                case TileType.SnakeBody:
                    return "#";
                case TileType.Empty:
                    return " ";
                default:
                    return String.Empty;
            }
        }

        public static Tile Obstacle() => ObstacleTile;

        public static Tile Food() => FoodTile;

        public static Tile Empty() => EmptyTile;

        public static Tile SnakeHead(string id) => new Tile(TileType.SnakeHead, PlayerColors.GetColor(id));

        public static Tile SnakeBody(string id) => new Tile(TileType.SnakeBody, PlayerColors.GetColor(id));

        private static class PlayerColors
        {
            private static readonly IDictionary<string, ConsoleColor> AssignedColors = new Dictionary<string, ConsoleColor>();
            private static readonly IReadOnlyList<ConsoleColor> AvailableColors = Enum.GetValues(typeof(ConsoleColor)).OfType<ConsoleColor>().ToList();

            public static ConsoleColor GetColor(string id)
            {
                lock (AssignedColors)
                {
                    ConsoleColor color;
                    if (AssignedColors.TryGetValue(id, out color))
                    {
                        return color;
                    }

                    color = GetUnassignedColor();
                    AssignedColors[id] = color;
                    return color;
                }
            }

            private static ConsoleColor GetUnassignedColor()
            {
                var assigned = AssignedColors.Values;
                return AvailableColors.FirstOrDefault(c => !assigned.Contains(c));
            }
        }
    }
}