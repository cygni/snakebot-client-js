using System;
using System.Collections.Generic;
using System.Linq;

namespace Cygni.Snake.Client.Communication
{
    public static class PlayerColors
    {
        private static readonly IDictionary<string, ConsoleColor> AssignedColors = new Dictionary<string, ConsoleColor>();
        private static readonly IReadOnlyList<ConsoleColor> AvailableColors = Enum.GetValues(typeof (ConsoleColor)).OfType<ConsoleColor>().ToList();

        public static ConsoleColor GetColor(string id)
        {
            lock (AssignedColors)
            {
                ConsoleColor color;
                if (AssignedColors.TryGetValue(id, out color))
                {
                    return color;
                }

                color = GetUnassignedColor();
                AssignedColors[id] = color;
                return color;
            }
        }

        private static ConsoleColor GetUnassignedColor()
        {
            var assigned = AssignedColors.Values;
            return AvailableColors.FirstOrDefault(c => !assigned.Contains(c));
        }
    }
}