using System;
using Cygni.Snake.Client;

namespace Cygni.Snake.SampleBot
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var client = SnakeClient.Connect(new Uri("ws://snake.cygni.se:80/training"), new GamePrinter());
            client.Start(new MySnakeBot("dotnetSnake"), true);
            Console.ReadLine();
        }
    }
}