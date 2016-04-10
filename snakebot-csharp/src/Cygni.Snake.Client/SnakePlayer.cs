using System.Collections.Generic;
using System.Linq;

namespace Cygni.Snake.Client
{
    public class SnakePlayer
    {
        public SnakePlayer(string id, string name, int points, IEnumerable<MapCoordinate> positions)
        {
            Id = id;
            Name = name;
            Points = points;
            Positions = positions.ToList();
        }

        public string Id { get; }

        public string Name { get; }

        public int Points { get; }

        public IReadOnlyList<MapCoordinate> Positions { get; }

        public bool IsAlive => Positions.Any();

        public MapCoordinate HeadPosition => IsAlive ? Positions.First() : new MapCoordinate(-1, -1);

        public IEnumerable<MapCoordinate> Body => IsAlive ? Positions.Skip(1) : Enumerable.Empty<MapCoordinate>();

        public override string ToString()
        {
            return Name + " - " + Points + " pts";
        }
    }
}