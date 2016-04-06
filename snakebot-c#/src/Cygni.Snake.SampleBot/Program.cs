using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.SampleBot
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var ws = new ClientWebSocket();
            var client = new SnakeClient(ws);
            var snake = new MySnakeBot("dotnetSnake", "green", client);

            ws.ConnectAsync(new Uri("ws://snake.cygni.se:80/training"), CancellationToken.None).Wait();
            snake.Start();

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