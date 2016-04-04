namespace Cygni.Snake.Client.Events
{
    public abstract class GameEvent
    {
        public string GameId { get; }

        public string ReceivingPlayerId { get; }

        public abstract string Type { get; }

        protected GameEvent(string gameId, string receivingPlayerId)
        {
            ReceivingPlayerId = receivingPlayerId;
            GameId = gameId;
        }
    }
}