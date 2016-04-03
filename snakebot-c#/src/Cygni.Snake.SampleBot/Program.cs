using System;
using System.Threading.Tasks;
using Cygni.Snake.Client;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.SampleBot
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var settings = new GameSettings();

            var client = new SnakeClient("snake.cygni.se", 80, "training", settings);
            var snake = new MySnakeBot("dotnetSnake", "green", client);

            client.Connect();

            // this is just here to keep the console from closing on us.
            do
            {
                Task.Delay(TimeSpan.FromSeconds(1)).Wait();

            } while (snake.GameRunning);
            // don't close the console because the game is over.
            Console.ReadLine();
        }
    }
}