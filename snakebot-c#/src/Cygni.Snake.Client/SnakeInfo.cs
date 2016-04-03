using System.Collections.Generic;
using System.Linq;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client
{
    public class SnakeInfo
    {
        public string Id { get; }

        public string Name { get; }

        public int Points { get; }

        public SnakeInfo(string id, string name, int points, IEnumerable<int> positions)
        {
            Id = id;
            Name = name;
            Points = points;
            Positions = positions?.ToList() ?? new List<int>();
        }

        public IReadOnlyList<int> Positions { get; }

        /// <summary>
        /// Gets the position of this snakes head. Or -1 if this snake is dead.
        /// </summary>
        public int HeadPosition => Positions.Any() ? Positions.First() : -1;

        public override string ToString()
        {
            return Name + " - " + Points + " pts";
        }
    }
}