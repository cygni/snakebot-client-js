namespace CygniSnakeBot.Client
{
    public class SnakeInfo
    {
        public string Id { get; }

        public string Name { get; }

        public int Length { get; }

        public int X { get; }

        public int Y { get; }

        public SnakeInfo(string id, string name, int length, int x, int y)
        {
            Id = id;
            Name = name;
            Length = length;
            X = x;
            Y = y;
        }
    }
}