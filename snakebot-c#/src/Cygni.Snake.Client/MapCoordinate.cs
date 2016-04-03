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

        /// <summary>
        /// Calculates the destination coordinate when moving to the specified
        /// <see cref="Direction"/>.
        /// </summary>
        /// <param name="direction">The specified direction.</param>
        /// <returns>A new <see cref="MapCoordinate"/> representing the destination.</returns>
        public MapCoordinate GetDestination(Direction direction)
        {
            switch (direction)
            {
                case Direction.Up:
                    return new MapCoordinate(X, Y - 1);
                case Direction.Down:
                    return new MapCoordinate(X, Y + 1);
                case Direction.Left:
                    return new MapCoordinate(X - 1, Y);
                case Direction.Right:
                    return new MapCoordinate(X + 1, Y);
                default:
                    throw new ArgumentException($"Unrecognized direction: {direction}, cannot calculate destination.",
                        nameof(direction));
            }
        }
    }
}