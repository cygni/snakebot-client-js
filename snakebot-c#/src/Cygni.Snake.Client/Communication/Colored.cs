using System;
using System.Collections.Generic;

namespace Cygni.Snake.Client.Communication
{
    public class Colored
    {
        private static int _currentColor = 1;
        private static readonly IDictionary<string, ConsoleColor> colors = new Dictionary<string, ConsoleColor>();
        private readonly string _id;

        public Colored(string id)
        {
            _id = id;
            if (colors.ContainsKey(_id))
                return;

            colors.Add(_id, (ConsoleColor)_currentColor);
            _currentColor++;
        }

        protected ConsoleColor Color => colors[_id];
    }
}