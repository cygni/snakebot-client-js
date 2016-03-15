using CygniSnakeBot.Client.Communication.Messages;

namespace CygniSnakeBot.Client.Events
{
    public class SnakeDeadEventArgs : GameEvent
    {
        public long GameTick { get; }

        public DeathReason DeathReason { get; }

        public int X { get; }

        public int Y { get; }

        public override string Type => MessageType.SnakeDead;

        public SnakeDeadEventArgs(string gameId, string receivingPlayerId, long gameTick, DeathReason deathReason, int x, int y) 
            : base(gameId, receivingPlayerId)
        {
            GameTick = gameTick;
            DeathReason = deathReason;
            X = x;
            Y = y;
        }
    }
}