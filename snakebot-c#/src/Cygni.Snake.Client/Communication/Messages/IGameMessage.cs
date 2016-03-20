namespace Cygni.Snake.Client.Communication.Messages
{
    public interface IGameMessage
    {
        string Type { get; }
        string ReceivingPlayerId { get; }
    }
}