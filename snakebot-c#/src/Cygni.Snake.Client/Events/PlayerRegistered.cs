using Cygni.Snake.Client.Communication.Messages;

namespace Cygni.Snake.Client.Events
{
    public class PlayerRegistered : GameEvent
    {
        public string Name { get; }

        public GameSettings GameSettings { get; }

        public string GameMode { get; }

        public override string Type => MessageType.PlayerRegistered;

        public PlayerRegistered(string name, GameSettings gameSettings, string gameMode, string gameId, string receivingPlayerId) 
            : base(gameId, receivingPlayerId)
        {
            Name = name;
            GameSettings = gameSettings;
            GameMode = gameMode;
        }
    }
}