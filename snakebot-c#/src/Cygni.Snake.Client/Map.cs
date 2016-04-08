using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client
{
    public class Map : IPrintable
    {
        private readonly IReadOnlyList<SnakeInfo> _snakeInfos;

        public int Width { get; }

        public int Height { get; }

        public int Tick { get; }

        public Map(int width, int height, int worldTick, IEnumerable<SnakeInfo> snakeInfos, IEnumerable<MapCoordinate> foodPositions, IEnumerable<MapCoordinate> obstaclePositions)
        {
            Tick = worldTick;
            FoodPositions = foodPositions.ToList();
            ObstaclePositions = obstaclePositions.ToList();
            _snakeInfos = snakeInfos.ToList();

            Width = width;
            Height = height;
        }

        public IReadOnlyList<SnakeInfo> Players => _snakeInfos;

        public SnakeInfo GetSnake(string id)
        {
            return _snakeInfos.FirstOrDefault(s => s.Id.Equals(id, StringComparison.Ordinal));
        }

        public IReadOnlyList<MapCoordinate> FoodPositions { get; }

        public IReadOnlyList<MapCoordinate> ObstaclePositions { get; }

        public IEnumerable<MapCoordinate> SnakeHeads
        {
            get
            {
                return _snakeInfos.Where(snake => snake.Positions.Any())
                    .Select(snake => snake.Positions.First());
            }
        }

        public IEnumerable<MapCoordinate> SnakeBodies
        {
            get
            {
                return _snakeInfos.Where(s => s.Positions.Any())
                    .SelectMany(s => s.Positions.Skip(1));
            }
        }

        public IEnumerable<MapCoordinate> SnakeParts
        {
            get
            {
                return _snakeInfos.SelectMany(s => s.Positions);
            }
        }

        public DirectionalResult GetResultOfDirection(string playerId, Direction dir)
        {
            var mySnake = GetSnake(playerId);
            if (mySnake == null)
            {
                throw new ArgumentException($"No snake with id: {playerId}");
            }

            var myHead = mySnake.Positions.First();
            var target = myHead.GetDestination(dir);

            var targetTile = GetTileAt(target);
            switch (targetTile.Type)
            {
                case TileType.SnakeHead:
                case TileType.SnakeBody:
                case TileType.Obstacle:
                    return DirectionalResult.Death;
                case TileType.Food:
                    return DirectionalResult.Points;
                case TileType.Empty:
                    return DirectionalResult.Nothing;
            }

            return DirectionalResult.Death;
        }

        public bool AbleToUseDirection(string playerId, Direction dir)
        {
            return GetResultOfDirection(playerId, dir).Equals(DirectionalResult.Death) == false;
        }

        public Tile GetTileAt(int x, int y)
        {
            return GetTileAt(new MapCoordinate(x, y));
        }

        private Tile GetTileAt(MapCoordinate coordinate)
        {
            if(!coordinate.IsInsideMap(Width, Height))
            {
                return Tile.Obstacle();
            }

            foreach (var snake in _snakeInfos)
            {
                if (Equals(coordinate, snake.Positions.FirstOrDefault()))
                {
                    return Tile.SnakeHead(snake.Id);
                }
                if (snake.Positions.Any() && snake.Positions.Contains(coordinate))
                {
                    return Tile.SnakeBody(snake.Id);
                }
            }

            if (FoodPositions.Contains(coordinate))
            {
                return Tile.Food();
            }

            if (ObstaclePositions.Contains(coordinate))
            {
                return Tile.Obstacle();
            }

            return Tile.Empty();
        }

        public void Print()
        {
            Console.WriteLine(new string('-', Width + 2));
            for (var y = 0; y < Height; y++)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("|"); // end line

                for (var x = 0; x < Width; ++x)
                {
                    var tile = GetTileAt(x, y);
                    Console.ForegroundColor = tile.PrintColor;
                    Console.Write(tile.PrintCharacter);
                }

                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("| ");
                Console.Write("\n"); // end line
            }
            Console.WriteLine(new string('-', Width + 2));
        }

        public static Map FromJson(string json)
        {
            return FromJson(JObject.Parse(json));
        }

        public static Map FromJson(JObject json)
        {
            int width = (int)json["width"];
            int height = (int)json["height"];
            int tick = (int)json["worldTick"];

            var snakes = json["snakeInfos"].Select(token =>
            {
                string name = (string) token["name"];
                string id = (string) token["id"];
                int points = (int) token["points"];
                var positions = token["positions"].Select(i => MapCoordinate.FromIndex((int) i, width));
                return new SnakeInfo(id, name, points, positions);
            });

            var foods = json["foodPositions"]?.Select(i => MapCoordinate.FromIndex((int) i, width));
            var obstacles = json["foodPositions"]?.Select(i => MapCoordinate.FromIndex((int) i, width));
            return new Map(width, height, tick, snakes, foods, obstacles);
        }
    }
}