using System;

namespace Cygni.Snake.Client
{
    public class PlayerInfo
    {
        public ConsoleColor Color { get; }

        public string PlayerId { get; }

        public PlayerInfo(string playerId, string color)
        {
            PlayerId = playerId;
            Color = (ConsoleColor)Enum.Parse(typeof(ConsoleColor), color, true);
        }
    }
}