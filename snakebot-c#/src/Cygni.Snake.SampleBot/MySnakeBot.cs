using Cygni.Snake.Client;

namespace Cygni.Snake.SampleBot
{
    public class MySnakeBot : SnakeBot
    {
        public MySnakeBot(string name)
            : base(name)
        {
        }
        
        protected override Direction OnGameTurn(Map map, long gameTick)
        {
            //Printer.Enque(map);
            // figure out a good move

            // do calculated move
            return Direction.Down;
        }
    }
}