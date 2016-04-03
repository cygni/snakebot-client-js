using System;
using Cygni.Snake.Client.Communication;

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
            PrintCharacter = GetPrintCharacted(type);
            PrintColor = color;
        }

        public string PrintCharacter { get; }

        public ConsoleColor PrintColor { get; }

        public TileType Type { get; }

        private static string GetPrintCharacted(TileType type)
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
    }
}