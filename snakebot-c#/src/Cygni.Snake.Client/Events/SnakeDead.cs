using System;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
{
    public class SnakeDead : GameEvent, IPrintable
    {
        public long GameTick { get; }

        public DeathReason DeathReason { get; }

        public int X { get; }

        public int Y { get; }

        public override string Type => MessageType.SnakeDead;
        public string PlayerId { get; }

        public SnakeDead(string gameId, string receivingPlayerId, long gameTick, DeathReason deathReason, int x, int y, string playerId)
            : base(gameId, receivingPlayerId)
        {
            GameTick = gameTick;
            DeathReason = deathReason;
            X = x;
            Y = y;
            PlayerId = playerId;
        }

        public void Print()
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(PlayerId == ReceivingPlayerId
                ? $"You died due to: {DeathReason}"
                : $"Snake with id: {PlayerId} died due to: {DeathReason}");
        }
    }
}