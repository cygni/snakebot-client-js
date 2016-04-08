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
            var snake = new MySnakeBot("dotnetSnake");
            
            ws.ConnectAsync(new Uri("ws://snake.cygni.se:80/training"), CancellationToken.None).Wait();
            client.Start(snake);

            Console.ReadLine();
        }
    }
}