using CygniSnakeBot.Client;
using CygniSnakeBot.Client.Communication;

namespace CygniSnakeBot
{
    public class MySnake : Snake
    {
        public MySnake(string name, string color, ISnakeClient snakeClient)
            : base(name, color, snakeClient)
        {
        }

        protected override MovementDirection OnGameTurn(Map map, long gameTick)
        {
            ConsoleMapPrinter.Printer(map);
            // figure out a good move

            // do calculated move
            return MovementDirection.Down;
        }
    }
}