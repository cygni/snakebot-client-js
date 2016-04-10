namespace Cygni.Snake.Client.Tests
{
    public class StubSnakeBot : SnakeBot
    {
        private readonly Direction _direction;

        public StubSnakeBot() : this(Direction.Down)
        {
        }

        public StubSnakeBot(Direction direction) 
            : base("fake")
        {
            _direction = direction;
        }

        public override Direction GetNextMove(Map map)
        {
            return _direction;
        }
    }
}