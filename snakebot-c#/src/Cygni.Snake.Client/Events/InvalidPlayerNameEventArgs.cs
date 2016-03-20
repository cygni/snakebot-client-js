using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
{
    public class InvalidPlayerNameEventArgs : GameEvent
    {
        public PlayerNameInvalidReason ReasonCode { get; }

        public override string Type => MessageType.InvalidPlayerName;

        public InvalidPlayerNameEventArgs(string gameId, string receivingPlayerId, PlayerNameInvalidReason reasonCode) 
            : base(gameId, receivingPlayerId)
        {
            ReasonCode = reasonCode;
        }
    }
}