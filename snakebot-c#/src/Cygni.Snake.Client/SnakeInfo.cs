using System;
using Cygni.Snake.Client.Communication;

namespace Cygni.Snake.Client
{
    public class SnakeInfo : Colored, IPrintable
    {
        public string Id { get; }

        public string Name { get; }

        public int Length { get; }

        public int X { get; }

        public int Y { get; }
        
        public int Points { get; }

        public SnakeInfo(string id, string name, int length, int x, int y, int points) : base(id)
        {
            Id = id;
            Name = name;
            Length = length;
            X = x;
            Y = y;
            Points = points;
        }

        public override string ToString()
        {
            return Name + " - " + Points + " pts";
        }

        public void Print()
        {
            Console.ForegroundColor = Color;
            Console.Write(this);
        }
    }
}