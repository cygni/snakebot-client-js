using System;

namespace Cygni.Snake.Client
{
    public class MapCoordinate
    {
        public MapCoordinate(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; }

        public int Y { get; }

        public static MapCoordinate FromIndex(int index, int width)
        {
            int y = index / width;
            int x = index - y * width;
            return new MapCoordinate(x, y);
        }

        public int GetManhattanDistanceTo(MapCoordinate other)
        {
            return Math.Abs(X - other.X) + Math.Abs(Y - other.Y);
        }

        public int GetManhattanDistanceTo(int x, int y)
        {
            return Math.Abs(X - x) + Math.Abs(Y - y);
        }
    }
}