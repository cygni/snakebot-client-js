using CygniSnakeBot.Client.Communication.Messages;

namespace CygniSnakeBot.Client.Events
{
    public class GameEndedEventArgs : GameEvent
    {
        public long GameTick { get; }

        public string PlayerWinnerId { get; }

        public Map Map { get; }

        public override string Type => MessageType.GameEnded;

        public GameEndedEventArgs(string gameId, string receivingPlayerId, long gameTick, string playerWinnerId, Map map)
            : base(gameId, receivingPlayerId)
        {
            GameTick = gameTick;
            PlayerWinnerId = playerWinnerId;
            Map = map;
        }
    }
}