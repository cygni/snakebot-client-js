namespace CygniSnakeBot.Client.Communication.Messages
{
    public class PlayerRegistrationMessage : GameMessage
    {
        public string PlayerName { get; }

        public string Color { get; }

        public GameSettings GameSettings { get; }

        public override string Type => MessageType.RegisterPlayer;

        public PlayerRegistrationMessage(string playerName, string color, GameSettings gameSettings, string playerId)
            : base(playerId)
        {
            PlayerName = playerName;
            Color = color;
            GameSettings = gameSettings;
        }
    }
}