using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client
{
    public class ConsoleMapPrinter
    {
        private readonly Queue<IPrintable> _mapPrintQueue;
        private CancellationTokenSource _token;
        
        public ConsoleMapPrinter()
        {
            _mapPrintQueue = new Queue<IPrintable>();
        }

        public void Enque(IPrintable printable)
        {
            _mapPrintQueue.Enqueue(printable);
        }

        private IPrintable Dequeue()
        {
            return _mapPrintQueue.Any() ? _mapPrintQueue.Dequeue() : null;
        }

        public void Start()
        {
            _token?.Cancel();

            _token = new CancellationTokenSource();

            new TaskFactory().StartNew(() =>
            {
                while (true)
                {
                    Dequeue()?.Print();
                    if (_token.IsCancellationRequested)
                        return;

                    Task.Delay(TimeSpan.FromMilliseconds(100)).Wait();
                }
            }, _token.Token);
        }

        public void Close()
        {
            _token?.Cancel();
        }
    }
}