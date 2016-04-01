using System;

namespace Cygni.Snake.Client.Tiles
{
    public class IndexedTile
    {
        public IndexedTile(ITileContent tile, int x, int y)
        {
            Tile = tile;
            X = x;
            Y = y;
        }

        public ITileContent Tile { get; }

        public int X { get; }

        public int Y { get; }

        public int ManhattanDistanceTo(IndexedTile other)
        {
            return Math.Abs(X - other.X) + Math.Abs(Y - other.Y);
        }

        public int ManhattanDistanceTo(int x, int y)
        {
            return Math.Abs(X - x) + Math.Abs(Y - y);
        }
    }
}