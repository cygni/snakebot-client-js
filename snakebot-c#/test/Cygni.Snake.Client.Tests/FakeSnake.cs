using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client.Tests
{
    public class FakeSnake :Snake
    {
        public FakeSnake(ISnakeClient client) 
            : base("fake", "black", client)
        {
        }

        protected override MovementDirection OnGameTurn(Map map, long gameTick)
        {
            return MovementDirection.Down;
        }
    }
}