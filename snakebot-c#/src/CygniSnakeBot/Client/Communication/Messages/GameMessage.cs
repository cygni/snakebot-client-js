namespace CygniSnakeBot.Client.Communication.Messages
{
    public abstract class GameMessage : IGameMessage
    {
        public abstract string Type { get; }

        public string ReceivingPlayerId { get; }

        protected GameMessage(string receivingPlayerId)
        {
            ReceivingPlayerId = receivingPlayerId;
        }
    }
}