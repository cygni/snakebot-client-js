using CygniSnakeBot.Client.Communication;
using CygniSnakeBot.Client.Communication.Messages;

namespace CygniSnakeBot.Client.Events
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