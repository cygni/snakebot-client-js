using System;
using System.Collections.Generic;
using System.Linq;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client
{
    public class Map : IPrintable
    {
        private readonly IReadOnlyList<int> _foodPositions;
        private readonly IReadOnlyList<int> _obstaclePositions;
        private readonly IReadOnlyList<SnakeInfo> _snakeInfos;

        public int Width { get; }

        public int Height { get; }

        public Map(int width, int height, IEnumerable<SnakeInfo> snakeInfos, IEnumerable<int> foodPositions, IEnumerable<int> obstaclePositions)
        {
            // TODO: Consider enumerating to list of MapCoordinate instances. How to do this for snake-infos? Needs map width.
            _foodPositions = foodPositions.ToList();
            _obstaclePositions = obstaclePositions.ToList();
            _snakeInfos = snakeInfos.ToList();

            Width = width;
            Height = height;
        }

        public IEnumerable<MapCoordinate> GetFoods()
        {
            return _foodPositions.Select(p => MapCoordinate.FromIndex(p, Width));
        }

        public IEnumerable<MapCoordinate> GetObstacles()
        {
            return _obstaclePositions.Select(p => MapCoordinate.FromIndex(p, Width));
        }

        public IEnumerable<MapCoordinate> GetSnakeHeads()
        {
            return _snakeInfos.Where(snake => snake.Positions.Any())
                .Select(snake => MapCoordinate.FromIndex(snake.HeadPosition, Width));
        }

        public IEnumerable<MapCoordinate> GetSnakeBodies()
        {
            return _snakeInfos.Where(s => s.Positions.Any())
                .SelectMany(s => s.Positions.Skip(1))
                .Select(p => MapCoordinate.FromIndex(p, Width));
        }

        public IEnumerable<MapCoordinate> GetSnakeParts()
        {
            return _snakeInfos.SelectMany(s => s.Positions).Select(p => MapCoordinate.FromIndex(p, Width));
        }

        public IEnumerable<MapCoordinate> GetSnakeSpread(string playerId)
        {
            var snake = _snakeInfos.FirstOrDefault(s => s.Id.Equals(playerId, StringComparison.Ordinal));
            if (snake == null)
            {
                throw new ArgumentException($"No snake with id: {playerId}");
            }

            return snake.Positions.Select(index => MapCoordinate.FromIndex(index, Width));
        }

        public DirectionalResult GetResultOfDirection(string playerId, Direction dir)
        {
            var mySnake = _snakeInfos.FirstOrDefault(snake => snake.Id.Equals(playerId, StringComparison.Ordinal));
            var myHead = MapCoordinate.FromIndex(mySnake.HeadPosition, Width);
            var target = myHead.GetDestination(dir);

            var targetTile = GetTileAt(ToIndex(target.X, target.Y));
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

        private Tile GetTileAt(int index)
        {
            foreach (var snake in _snakeInfos)
            {
                if (index == snake.HeadPosition)
                {
                    return Tile.SnakeHead(snake.Id);
                }
                if (snake.Positions.Any() && snake.Positions.Contains(index))
                {
                    return Tile.SnakeBody(snake.Id);
                }
            }

            if (_foodPositions.Contains(index))
            {
                return Tile.Food();
            }

            if (_obstaclePositions.Contains(index) || index < 0 || index >= Width * Height)
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
                    int index = ToIndex(x, y);
                    var tile = GetTileAt(index);
                    Console.ForegroundColor = tile.PrintColor;
                    Console.Write(tile.PrintCharacter);
                }

                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("| ");
                Console.Write("\n"); // end line
            }
            Console.WriteLine(new string('-', Width + 2));
        }

        private int ToIndex(int x, int y)
        {
            return x + y * Width;
        }
    }
}