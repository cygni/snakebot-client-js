using System;
using System.Collections.Generic;
using Cygni.Snake.Client;
using System.Linq;

namespace Cygni.Snake.SampleBot
{
    public class MySnakeBot : SnakeBot
    {
        private Direction previousDirection;

        public MySnakeBot(string name) : base(name)
        {
        }
        
        public override Direction GetNextMove(Map map)
        {
            if (!map.MySnake.IsAlive)
            {
                return Direction.Down;
            }

            var myHead = map.MySnake.HeadPosition;
            var nearestFood = map.FoodPositions
                .OrderBy(x => x.GetManhattanDistanceTo(myHead))
                .DefaultIfEmpty(myHead)
                .First();

            var bestMove = GetPossibleMoves(map)
                .OrderBy(x => x.Destination.GetManhattanDistanceTo(nearestFood))
                .FirstOrDefault();

            if (bestMove == null)
            {
                return previousDirection;
            }

            previousDirection = bestMove.Direction;
            Console.WriteLine("Descision: " + bestMove.Direction);
            return bestMove.Direction;
        }

        private IEnumerable<Move> GetPossibleMoves(Map map)
        {
            var myHead = map.MySnake.HeadPosition;

            foreach (var direction in Enum.GetValues(typeof(Direction)).Cast<Direction>())
            {
                var destination = myHead.GetDestination(direction);
                if(!map.IsObstace(destination) && !map.IsSnake(destination) && destination.IsInsideMap(map.Width, map.Height))
                {
                    yield return new Move {Direction = direction, Destination = destination};
                }
            }
        }

        private class Move
        {
            public Direction Direction;
            public MapCoordinate Destination;
        }
    }
}