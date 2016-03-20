using Cygni.Snake.Client;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.SampleBot
{
    public class MySnake : Client.Snake
    {
        public MySnake(string name, string color, ISnakeClient snakeClient)
            : base(name, color, snakeClient)
        {
        }

        protected override MovementDirection OnGameTurn(Map map, long gameTick)
        {
            ConsoleMapPrinter.Printer(map, PlayerInfos);
            // figure out a good move

            // do calculated move
            return MovementDirection.Down;
        }
    }
}