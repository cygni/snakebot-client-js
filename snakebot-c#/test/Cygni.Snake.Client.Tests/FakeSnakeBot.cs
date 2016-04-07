using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client.Tests
{
    public class FakeSnakeBot :SnakeBot
    {
        public FakeSnakeBot() 
            : base("fake")
        {
        }

        protected override Direction OnGameTurn(Map map, long gameTick)
        {
            return Direction.Down;
        }
    }
}