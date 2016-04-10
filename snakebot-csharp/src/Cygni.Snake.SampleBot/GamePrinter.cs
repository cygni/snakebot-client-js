using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cygni.Snake.Client;

namespace Cygni.Snake.SampleBot
{
    public class GamePrinter : IGameObserver
    {
        public void OnGameStart()
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("New game starting...");
                }
            });
        }

        public void OnGameEnd(Map map)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("Game ended");
                }
            });
        }

        public void OnSnakeDied(string reason, string snakeId)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    Console.ForegroundColor = PlayerColors.GetColor(snakeId);
                    Console.WriteLine($"Snake '{snakeId}' died due to: {reason}");
                }
            });
        }

        public void OnUpdate(Map map)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    PrintMap(map);
                }
            });
        }

        private static void PrintMap(Map map)
        {
            var foodTiles = map.FoodPositions.Select(p => new PrintTile(p, "F", ConsoleColor.Red));
            var obstacleTiles = map.ObstaclePositions.Select(p => new PrintTile(p, "*", ConsoleColor.Yellow));
            var playerTiles = map.Snakes.Where(p => p.IsAlive)
                .SelectMany(p =>
                {
                    var headPosition = p.Positions.First();
                    var color = PlayerColors.GetColor(p.Id);
                    var head = new PrintTile(headPosition, "@", color);
                    return new[] { head }.Concat(p.Positions.Skip(1).Select(pos => new PrintTile(pos, "#", color)));
                });

            Console.WriteLine(new string('-', map.Width + 2));
            int rowIndex = 0;
            foreach (var row in obstacleTiles.Concat(playerTiles).Concat(foodTiles).GroupBy(t => t.Position.Y).OrderBy(x => x.Key))
            {
                var stringBuilder = new StringBuilder();
                Console.ForegroundColor = ConsoleColor.White;
                while (rowIndex++ < row.Key)
                {
                    stringBuilder.Append('|').Append(' ', map.Width).Append('|').AppendLine();
                }
                Console.Write(stringBuilder.ToString());

                Console.ForegroundColor = ConsoleColor.White;
                Console.Write('|');

                int column = 0;
                foreach (var tile in row.OrderBy(p => p.Position.ToIndex(map.Width)))
                {
                    int diff = tile.Position.X - column;
                    column = tile.Position.X + 1;
                    if (diff < 0)
                    {
                        continue;
                    }
                    Console.ForegroundColor = tile.Color;
                    Console.Write(new StringBuilder().Append(' ', diff).Append(tile.Character));
                }

                Console.ForegroundColor = ConsoleColor.White;
                Console.Write(new StringBuilder().Append(' ', map.Width - column).AppendLine("|"));
            }

            var sb = new StringBuilder();
            Console.ForegroundColor = ConsoleColor.White;
            while (rowIndex++ < map.Height)
            {
                sb.Append('|').Append(' ', map.Width).Append('|').AppendLine();
            }
            sb.Append('-', map.Width + 2).AppendLine();
            Console.Write(sb.ToString());
        }
        
        private class PrintTile
        {
            public PrintTile(MapCoordinate position, string character, ConsoleColor color)
            {
                Position = position;
                Character = character;
                Color = color;
            }

            public MapCoordinate Position { get; }

            public string Character { get; }

            public ConsoleColor Color { get; }
        }
        
        /// <summary>
        /// Helper class to keep track of colors assigned to different players in the game.
        /// </summary>
        private static class PlayerColors
        {
            private static readonly IDictionary<string, ConsoleColor> AssignedColors =
                new Dictionary<string, ConsoleColor>();

            private static readonly IReadOnlyList<ConsoleColor> AvailableColors =
                Enum.GetValues(typeof(ConsoleColor)).OfType<ConsoleColor>()
                .Where(c => c != ConsoleColor.Black).ToList();

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
}
