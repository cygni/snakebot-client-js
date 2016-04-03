using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client.Tests
{
    public class FakeSnake :Snake
    {
        public FakeSnake(ISnakeClient client) 
            : base("fake", "black", client)
        {
        }

        protected override Direction OnGameTurn(Map map, long gameTick)
        {
            return Direction.Down;
        }
    }
}