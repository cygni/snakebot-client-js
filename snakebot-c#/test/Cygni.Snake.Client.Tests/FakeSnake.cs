using Cygni.Snake.Client;
using Cygni.Snake.Client.Communication;

namespace CygniSnakeBot.tests
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