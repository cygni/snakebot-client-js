using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
{
    public class GameEnded : GameEvent
    {
        public long GameTick { get; }

        public string PlayerWinnerId { get; }

        public Map Map { get; }

        public override string Type => MessageType.GameEnded;

        public GameEnded(string gameId, string receivingPlayerId, long gameTick, string playerWinnerId, Map map)
            : base(gameId, receivingPlayerId)
        {
            GameTick = gameTick;
            PlayerWinnerId = playerWinnerId;
            Map = map;
        }
    }
}