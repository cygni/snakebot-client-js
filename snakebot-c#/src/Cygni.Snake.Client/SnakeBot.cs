using System;

namespace Cygni.Snake.Client
{
    public abstract class SnakeBot
    {
        public string Name { get; }

        protected SnakeBot(string name)
        {
            Name = name;
        }

        public abstract Direction OnMapUpdate(Map map);
    }
}