using CygniSnakeBot.Client.Communication.Messages;

namespace CygniSnakeBot.Client.Events
{
    public class GameStartingEventArgs : GameEvent
    {
        public int NoofPlayers { get; }

        public int Width { get; }

        public int Height { get; }

        public override string Type => MessageType.GameStarting;

        public GameStartingEventArgs(string gameId, string receivingPlayerId, int noofPlayers, int width, int height) 
            : base(gameId, receivingPlayerId)
        {
            NoofPlayers = noofPlayers;
            Width = width;
            Height = height;
        }
    }
}