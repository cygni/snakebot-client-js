using System;
using System.Threading.Tasks;

namespace Cygni.Snake.Client
{
    public class ConsoleMapPrinter : IPrinter
    {
        public void Print(IPrintable printable)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    printable.Print();
                }
            });
        }

        public void Print(string text)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine(text);
                }
            });
        }

        public void SnakeDied(string reason, string id, bool thisSnake)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine(thisSnake
                        ? $"You died due to: {reason}"
                        : $"Snake '{id}' died due to: {reason}");
                }
            });
        }
    }
}