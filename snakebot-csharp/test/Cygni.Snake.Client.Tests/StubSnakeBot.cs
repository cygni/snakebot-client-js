using System;

namespace Cygni.Snake.Client.Tests
{
    public class StubSnakeBot : SnakeBot
    {
        private readonly Func<Map, Direction> _nextMove;

        public StubSnakeBot() : this(map => Direction.Down)
        {
        }

        public StubSnakeBot(Func<Map, Direction> nextMove) : base("fake")
        {
            _nextMove = nextMove;
        }

        public StubSnakeBot(Direction direction) : this(map => direction)
        {
        }

        public override Direction GetNextMove(Map map)
        {
            return _nextMove(map);
        }
    }
}