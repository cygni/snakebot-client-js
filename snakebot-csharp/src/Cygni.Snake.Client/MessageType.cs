namespace Cygni.Snake.Client
{
    public static class MessageType
    {
        public const string GameEnded = "se.cygni.snake.api.event.GameEndedEvent";
        public const string MapUpdated = "se.cygni.snake.api.event.MapUpdateEvent";
        public const string SnakeDead = "se.cygni.snake.api.event.SnakeDeadEvent";
        public const string GameStarting = "se.cygni.snake.api.event.GameStartingEvent";
        public const string PlayerRegistered = "se.cygni.snake.api.response.PlayerRegistered";
        public const string InvalidPlayerName = "se.cygni.snake.api.exception.InvalidPlayerName";
        public const string HeartBeatResponse = "se.cygni.snake.api.response.HeartBeatResponse";

        public const string RegisterPlayer = "se.cygni.snake.api.request.RegisterPlayer";
        public const string StartGame = "se.cygni.snake.api.request.StartGame";
        public const string RegisterMove = "se.cygni.snake.api.request.RegisterMove";
        public const string HeartBeatRequest = "se.cygni.snake.api.request.HeartBeatRequest";
        public const string ClientInfo = "se.cygni.snake.api.request.ClientInfo";
    }
}