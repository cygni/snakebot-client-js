using System;
using System.Collections.Generic;
using System.Linq;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Tiles;

namespace Cygni.Snake.Client
{
    public class Map : IPrintable
    {
        private readonly IEnumerable<IndexedTile> _tiles;

        public int Width { get; }

        public int Height { get; }

        public IEnumerable<SnakeInfo> SnakeInfos { get; }

        public Map(int width, int height, IEnumerable<IEnumerable<ITileContent>> tiles, IEnumerable<SnakeInfo> snakeInfos)
        {
            Width = width;
            Height = height;
            _tiles = IndexizeTiles(tiles);
            SnakeInfos = snakeInfos?.ToList();
        }

        private IEnumerable<IndexedTile> GetTilesOfType(string contentType)
        {
            return _tiles.Where(t => t.Tile.Content.Equals(contentType));
        }

        private static IEnumerable<IndexedTile> IndexizeTiles(IEnumerable<IEnumerable<ITileContent>> tiles)
        {
            return tiles.SelectMany((row, x) => row.Select((tile, y) => new IndexedTile(tile, x, y))).ToList();
        }

        public IEnumerable<IndexedTile> GetFoods()
        {
            return GetTilesOfType(FoodTile.CONTENT);
        }

        public IEnumerable<IndexedTile> GetObstacles()
        {
            return GetTilesOfType(ObstacleTile.CONTENT);
        }

        public IEnumerable<IndexedTile> GetSnakeHeads()
        {
            return GetTilesOfType(SnakeHeadTile.CONTENT);
        }
        public IEnumerable<IndexedTile> GetSnakeBodies()
        {
            return GetTilesOfType(SnakeBodyTile.CONTENT);
        }

        public IEnumerable<IndexedTile> GetSnakeParts()
        {
            return _tiles.Where(t => t.Tile.Content.Equals(SnakeBodyTile.CONTENT) || t.Tile.Content.Equals(SnakeHeadTile.CONTENT));
        }

        public IEnumerable<IndexedTile> GetSnakeSpread(string playerId)
        {
            var head = GetSnakeHeads().FirstOrDefault(h => h.Tile is SnakeHeadTile && ((SnakeHeadTile)h.Tile).PlayerId.Equals(playerId));
            var body = GetSnakeBodies().Where(b => b.Tile is SnakeBodyTile && ((SnakeBodyTile)b.Tile).PlayerId.Equals(playerId)).OrderBy(b => ((SnakeBodyTile)b.Tile).Order);

            if (head == null)
                throw new ArgumentException($"Cannot find snake spread of snake with id:{playerId}");

            var op = new List<IndexedTile>() { head };
            op.AddRange(body);

            return op;
        }

        public DirectionalResult GetResultOfDirection(string playerId, MovementDirection dir)
        {
            var myHead = _tiles.FirstOrDefault(h => h.Tile is SnakeHeadTile && ((SnakeHeadTile)h.Tile).PlayerId.Equals(playerId));

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

            var targetTile = _tiles.FirstOrDefault(t => t.X == tx && t.Y == ty);
            switch (targetTile?.Tile.Content)
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

        public void Print()
        {
            Console.WriteLine(new string('-', Width + 2));
            var tileGroups = _tiles.GroupBy(t => t.Y).ToList();
            for (var y = 0; y < Height; y++)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("|"); // end line

                foreach (var indexedTile in tileGroups.ElementAt(y))
                {
                    indexedTile.Tile.Print();
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