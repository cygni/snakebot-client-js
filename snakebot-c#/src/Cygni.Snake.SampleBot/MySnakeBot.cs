using Cygni.Snake.Client;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.SampleBot
{
    public class MySnakeBot : Client.SnakeBot
    {
        public MySnakeBot(string name, string color, ISnakeClient snakeClient)
            : base(name, color, snakeClient)
        {
        }
        
        protected override Direction OnGameTurn(Map map, long gameTick)
        {
            Printer.Enque(map);
            // figure out a good move

            // do calculated move
            return Direction.Down;
        }
    }
}