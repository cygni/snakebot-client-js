using System;
using System.Net.WebSockets;
using System.Threading;
using Cygni.Snake.Client;

namespace Cygni.Snake.SampleBot
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var ws = new ClientWebSocket();
            ws.ConnectAsync(new Uri("ws://snake.cygni.se:80/training"), CancellationToken.None).Wait();

            var client = new SnakeClient(ws, new GamePrinter());
            client.Start(new MySnakeBot("dotnetSnake"), true);

            Console.ReadLine();
        }
    }
}