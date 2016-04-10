using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client
{
    public class Map
    {
        public Map(int width, int height, int worldTick, SnakePlayer mySnake, IEnumerable<SnakePlayer> snakeInfos, IEnumerable<MapCoordinate> foodPositions, IEnumerable<MapCoordinate> obstaclePositions)
        {
            Tick = worldTick;
            MySnake = mySnake;
            FoodPositions = foodPositions.ToList();
            ObstaclePositions = obstaclePositions.ToList();
            Snakes = snakeInfos.ToList();

            Width = width;
            Height = height;
        }

        public int Width { get; }

        public int Height { get; }

        public int Tick { get; }

        public IReadOnlyList<SnakePlayer> Snakes { get; }

        public SnakePlayer MySnake { get; }

        public SnakePlayer GetSnake(string id)
        {
            return Snakes.FirstOrDefault(s => s.Id.Equals(id, StringComparison.Ordinal));
        }

        public IReadOnlyList<MapCoordinate> FoodPositions { get; }

        public IReadOnlyList<MapCoordinate> ObstaclePositions { get; }

        public IEnumerable<MapCoordinate> SnakeHeads
        {
            get
            {
                return Snakes.Where(snake => snake.IsAlive)
                    .Select(snake => snake.HeadPosition);
            }
        }

        public IEnumerable<MapCoordinate> SnakeBodies
        {
            get
            {
                return Snakes.Where(s => s.IsAlive).SelectMany(s => s.Body);
            }
        }

        public IEnumerable<MapCoordinate> SnakeParts
        {
            get
            {
                return Snakes.SelectMany(s => s.Positions);
            }
        }

        public DirectionalResult GetResultOfDirection(string playerId, Direction dir)
        {
            var mySnake = GetSnake(playerId);
            if (mySnake == null)
            {
                throw new ArgumentException($"No snake with id: {playerId}");
            }

            var myHead = mySnake.Positions.First();
            var target = myHead.GetDestination(dir);

            if (IsSnake(target) || IsObstace(target) || !target.IsInsideMap(Width, Height))
            {
                return DirectionalResult.Death;
            }

            return IsFood(target) ? DirectionalResult.Points : DirectionalResult.Nothing;
        }

        public bool IsObstace(MapCoordinate coordinate)
        {
            return ObstaclePositions.Contains(coordinate);
        }

        public bool IsSnake(MapCoordinate coordinate)
        {
            return SnakeParts.Contains(coordinate);
        }

        public bool IsFood(MapCoordinate coordinate)
        {
            return FoodPositions.Contains(coordinate);
        }

        public bool AbleToUseDirection(string playerId, Direction dir)
        {
            return GetResultOfDirection(playerId, dir).Equals(DirectionalResult.Death) == false;
        }

        public static Map FromJson(string json)
        {
            return FromJson(JObject.Parse(json));
        }

        public static Map FromJson(JObject json)
        {
            int width = (int)json["width"];
            int height = (int)json["height"];
            int tick = (int)json["worldTick"];
            string myId = (string) json["receivingPlayerId"];

            var snakes = json["snakeInfos"].Select(token =>
            {
                string name = (string) token["name"];
                string id = (string) token["id"];
                int points = (int) token["points"];
                var positions = token["positions"].Select(i => MapCoordinate.FromIndex((int) i, width));
                return new SnakePlayer(id, name, points, positions);
            }).ToList();

            var mySnake = snakes.FirstOrDefault(s => s.Id.Equals(myId));

            var foods = json["foodPositions"].Select(i => MapCoordinate.FromIndex((int) i, width));
            var obstacles = json["obstaclePositions"].Select(i => MapCoordinate.FromIndex((int) i, width));
            return new Map(width, height, tick, mySnake, snakes, foods, obstacles);
        }
    }
}