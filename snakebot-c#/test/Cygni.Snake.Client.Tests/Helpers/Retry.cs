using System;
using System.Threading.Tasks;

namespace Cygni.Snake.Client.Tests.Helpers
{
    public static class Retry
    {
        public static void For(Func<bool> func, TimeSpan retryTime)
        {
            var startTime = DateTime.Now;

            while (DateTime.Now.CompareTo(startTime.Add(retryTime)) < 0)
            {
                try
                {
                    if (func())
                        return;
                }
                catch(Exception)
                {
                    
                }

                Task.Delay(TimeSpan.FromMilliseconds(Math.Max(1, Math.Round(retryTime.TotalMilliseconds / 1000))));
            }
        }
    }
}