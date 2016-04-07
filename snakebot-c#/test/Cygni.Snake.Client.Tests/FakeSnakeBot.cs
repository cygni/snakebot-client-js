using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client.Tests
{
    public class FakeSnakeBot :SnakeBot
    {
        private readonly Direction _direction;

        public FakeSnakeBot() : this(Direction.Down)
        {
        }

        public FakeSnakeBot(Direction direction) 
            : base("fake")
        {
            _direction = direction;
        }

        protected override Direction OnGameTurn(Map map, long gameTick)
        {
            return _direction;
        }
    }
}