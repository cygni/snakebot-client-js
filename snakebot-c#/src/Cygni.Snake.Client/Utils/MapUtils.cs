using System;
using System.Collections.Generic;
using System.Linq;
using Cygni.Snake.Client.Tiles;

namespace Cygni.Snake.Client.Utils
{
    public static class MapUtils
    {
        private static IEnumerable<IndexedTile> IndexizeTiles(IEnumerable<IEnumerable<ITileContent>> tiles)
        {
            return tiles.SelectMany((row, x) => row.Select((tile, y) => new IndexedTile() {Tile = tile, X = x, Y = y}));
        }

        public static IEnumerable<IndexedTile> GetFoods(this Map map)
        {
            return
                IndexizeTiles(map.Tiles)
                    .Where(t => t.Tile.Content.Equals(FoodTile.CONTENT));
        }

        public static IEnumerable<IndexedTile> GetObstacles(this Map map)
        {
            return
              IndexizeTiles(map.Tiles)
                  .Where(t => t.Tile.Content.Equals(ObstacleTile.CONTENT));
        }

        public static IEnumerable<IndexedTile> GetSnakeHeads(this Map map)
        {
            return
              IndexizeTiles(map.Tiles)
                  .Where(t => t.Tile.Content.Equals(SnakeHeadTile.CONTENT));
        }
        public static IEnumerable<IndexedTile> GetSnakeBodies(this Map map)
        {
            return
              IndexizeTiles(map.Tiles)
                  .Where(t => t.Tile.Content.Equals(SnakeBodyTile.CONTENT));
        }

        public static IEnumerable<IndexedTile> GetSnakeParts(this Map map)
        {
            return
              IndexizeTiles(map.Tiles)
                  .Where(t => t.Tile.Content.Equals(SnakeBodyTile.CONTENT) || t.Tile.Content.Equals(SnakeHeadTile.CONTENT));
        }

        public static IEnumerable<IndexedTile> GetSnakeSpread(this Map map, string playerId)
        {
            var head = map.GetSnakeHeads().FirstOrDefault(h => h.Tile is SnakeHeadTile && ((SnakeHeadTile)h.Tile).PlayerId.Equals(playerId));
            var body = map.GetSnakeBodies().Where(b => b.Tile is SnakeBodyTile && ((SnakeBodyTile)b.Tile).PlayerId.Equals(playerId)).OrderBy(b => ((SnakeBodyTile)b.Tile).Order);

            if (head == null)
                throw new ArgumentException($"Cannot find snake spread of snake with id:{playerId}");
            
            var op = new List<IndexedTile>() {head};
            op.AddRange(body);

            return op;
        }

        public static DirectionalResult GetResultOfDirection(this Map map, string playerId, MovementDirection dir)
        {
            var indexizedTiles = IndexizeTiles(map.Tiles).ToList();
            var myHead = indexizedTiles.FirstOrDefault(h => h.Tile is SnakeHeadTile && ((SnakeHeadTile)h.Tile).PlayerId.Equals(playerId));

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

            var targetTile = indexizedTiles.FirstOrDefault(t => t.X == tx && t.Y == ty);
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

        public static bool AbleToUseDirection(this Map map, string playerId, MovementDirection dir)
        {
            return map.GetResultOfDirection(playerId, dir).Equals(DirectionalResult.Death) == false;
        }
    }
}