using System;
using Cygni.Snake.Client.Tiles;

namespace Cygni.Snake.Client.Utils
{
    public class IndexedTile
    {
        public ITileContent Tile { get; set; }

        public int X { get; set; }

        public int Y { get; set; }

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