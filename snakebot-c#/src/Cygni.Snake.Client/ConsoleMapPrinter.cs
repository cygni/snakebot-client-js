using System;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client
{
    public class ConsoleMapPrinter
    {
        public void Enque(IPrintable printable)
        {
            Task.Run(() =>
            {
                lock (Console.Out)
                {
                    printable.Print();
                }
            });
        }
    }
}