using System;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
{
    public class GameEnded : GameEvent, IPrintable
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

        public void Print()
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("Game Ended");
            Map.Print();
        }
    }
}