using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
{
    public class MapUpdateEventArgs : GameEvent
    {
        public long GameTick { get; }

        public Map Map { get; }

        public override string Type => MessageType.MapUpdated;

        public MapUpdateEventArgs(string gameId, string receivingPlayerId, long gameTick, Map map)
            : base(gameId, receivingPlayerId)
        {
            GameTick = gameTick;
            Map = map;
        }
    }
}