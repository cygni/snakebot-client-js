using System;
using CygniSnakeBot.Client.Communication.Messages;

namespace CygniSnakeBot.Client.Events
{
    public abstract class GameEvent : EventArgs, IGameMessage
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