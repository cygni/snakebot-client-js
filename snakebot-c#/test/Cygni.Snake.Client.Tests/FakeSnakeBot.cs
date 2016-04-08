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

        public override Direction OnMapUpdate(Map map)
        {
            return _direction;
        }
    }
}