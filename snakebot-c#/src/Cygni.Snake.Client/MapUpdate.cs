namespace Cygni.Snake.Client
{
    public class MapUpdate : GameEvent
    {
        public long GameTick { get; }

        public Map Map { get; }

        public override string Type => MessageType.MapUpdated;

        public MapUpdate(string gameId, string receivingPlayerId, long gameTick, Map map)
            : base(gameId, receivingPlayerId)
        {
            GameTick = gameTick;
            Map = map;
        }
    }
}