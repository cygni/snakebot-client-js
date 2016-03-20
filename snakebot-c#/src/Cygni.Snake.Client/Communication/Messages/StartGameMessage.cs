namespace Cygni.Snake.Client.Communication.Messages
{
    public class StartGameMessage : GameMessage
    {
        public override string Type => MessageType.StartGame;

        public StartGameMessage(string playerId)
            : base(playerId)
        {
        }
    }
}