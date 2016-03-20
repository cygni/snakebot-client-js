using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
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