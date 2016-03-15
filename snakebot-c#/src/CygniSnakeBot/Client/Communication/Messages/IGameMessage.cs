namespace CygniSnakeBot.Client.Communication.Messages
{
    public interface IGameMessage
    {
        string Type { get; }
        string ReceivingPlayerId { get; }
    }
}