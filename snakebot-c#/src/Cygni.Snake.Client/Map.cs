using System;
using System.Collections.Generic;
using System.Linq;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Tiles;

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

        public DirectionalResult GetResultOfDirection(string playerId, MovementDirection dir)
        {
            var mySnake = _snakeInfos.FirstOrDefault(snake => snake.Id.Equals(playerId, StringComparison.Ordinal));
            var myHead = MapCoordinate.FromIndex(mySnake.HeadPosition, Width);

            var tx = myHead.X;
            var ty = myHead.Y;

            switch (dir)
            {
                case MovementDirection.Up:
                    ty--;
                    break;
                case MovementDirection.Down:
                    ty++;
                    break;
                case MovementDirection.Left:
                    tx--;
                    break;
                case MovementDirection.Right:
                    tx++;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(dir), dir, null);
            }

            var targetTile = GetTileAt(ToIndex(tx, ty));
            switch (targetTile?.Content)
            {
                case SnakeBodyTile.CONTENT:
                case SnakeHeadTile.CONTENT:
                case ObstacleTile.CONTENT:
                    return DirectionalResult.Death;
                case FoodTile.CONTENT:
                    return DirectionalResult.Points;
                case EmptyTile.CONTENT:
                    return DirectionalResult.Nothing;
            }

            return DirectionalResult.Death;
        }

        public bool AbleToUseDirection(string playerId, MovementDirection dir)
        {
            return GetResultOfDirection(playerId, dir).Equals(DirectionalResult.Death) == false;
        }

        private ITileContent GetTileAt(int index)
        {
            foreach (var snake in _snakeInfos)
            {
                if (index == snake.HeadPosition)
                {
                    return new SnakeHeadTile(snake.Id);
                }
                if (snake.Positions.Any() && snake.Positions.Contains(index))
                {
                    return new SnakeBodyTile(snake.Id);
                }
            }

            if (_foodPositions.Contains(index))
            {
                return new FoodTile();
            }

            if (_obstaclePositions.Contains(index) || index < 0 || index >= Width * Height)
            {
                return new ObstacleTile();
            }
            return new EmptyTile();
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
                    tile.Print();
                }

                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("| ");
                _snakeInfos.ElementAtOrDefault(y)?.Print();
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