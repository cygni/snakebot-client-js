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
            return GetManhattanDistanceTo(new MapCoordinate(x, y));
        }

        public bool IsInsideMap(int width, int height)
        {
            return X >= 0 && Y >= 0 && X < width && Y < height;
        }

        protected bool Equals(MapCoordinate other)
        {
            return X == other.X && Y == other.Y;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((MapCoordinate) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (X*397) ^ Y;
            }
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

        public int ToIndex(int width)
        {
            return X + Y*width;
        }
    }
}