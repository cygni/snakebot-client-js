namespace Cygni.Snake.Client
{
    public class InvalidPlayerName : GameEvent
    {
        public PlayerNameInvalidReason ReasonCode { get; }

        public override string Type => MessageType.InvalidPlayerName;

        public InvalidPlayerName(string gameId, string receivingPlayerId, PlayerNameInvalidReason reasonCode) 
            : base(gameId, receivingPlayerId)
        {
            ReasonCode = reasonCode;
        }
    }
}