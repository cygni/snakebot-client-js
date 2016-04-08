using System.Collections.Generic;
using System.Linq;

namespace Cygni.Snake.Client
{
    public class SnakeInfo
    {
        public SnakeInfo(string id, string name, int points, IEnumerable<MapCoordinate> positions)
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

        public override string ToString()
        {
            return Name + " - " + Points + " pts";
        }
    }
}