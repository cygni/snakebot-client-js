namespace Cygni.Snake.Client
{
    public class GameStarting : GameEvent
    {
        public int NoofPlayers { get; }

        public int Width { get; }

        public int Height { get; }

        public override string Type => MessageType.GameStarting;

        public GameStarting(string gameId, string receivingPlayerId, int noofPlayers, int width, int height) 
            : base(gameId, receivingPlayerId)
        {
            NoofPlayers = noofPlayers;
            Width = width;
            Height = height;
        }
    }
}