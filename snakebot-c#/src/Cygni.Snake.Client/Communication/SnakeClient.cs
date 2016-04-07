using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication.Messages;
using Cygni.Snake.Client.Communication.Serialization;
using Cygni.Snake.Client.Events;
using Newtonsoft.Json.Linq;
using JsonConverter = Cygni.Snake.Client.Communication.Serialization.JsonConverter;

namespace Cygni.Snake.Client.Communication
{
    public class SnakeClient : ISnakeClient
    {
        private readonly GameSettings _gameSettings;
        private readonly IConverter _converter;
        private readonly WebSocket _webSocket;
        private SnakeBot _snake;

        public SnakeClient(WebSocket webSocket)
        {
            _webSocket = webSocket;
            _converter = new JsonConverter();
            _gameSettings = new GameSettings();
        }

        private async Task Receive()
        {
            while (_webSocket.State == WebSocketState.Open)
            {
                OnMessageReceived(await ReceiveStringAsync());
            }
        }

        private void OnMessageReceived(string jsonString)
        {
            if (_snake == null)
            {
                return;
            }
            var messageType = _converter.GetMessageType(jsonString);

            switch (messageType)
            {
                case MessageType.GameEnded:
                    _snake.OnGameEnded(_converter.Deserialize<GameEnded>(jsonString));
                    break;

                case MessageType.MapUpdated:
                    var update = _converter.Deserialize<MapUpdate>(jsonString);
                    var direction = _snake.OnMapUpdate(update);
                    IssueMovementCommand(direction, update.GameTick);
                    break;

                case MessageType.SnakeDead:
                    _snake.OnSnakeDead(_converter.Deserialize<SnakeDead>(jsonString));
                    break;

                case MessageType.GameStarting:
                    _snake.OnGameStarting(_converter.Deserialize<GameStarting>(jsonString));
                    break;

                case MessageType.PlayerRegistered:
                    _snake.OnPlayerRegistered(_converter.Deserialize<PlayerRegistered>(jsonString));
                    StartGame();
                    break;

                case MessageType.InvalidPlayerName:
                    _snake.OnInvalidPlayerName(_converter.Deserialize<InvalidPlayerName>(jsonString));
                    break;
            }
        }

        private async Task SendStringAsync(string msg)
        {
            var outputmessage = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg));
            await _webSocket.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None)
                .ConfigureAwait(false);
        }

        private async Task<string> ReceiveStringAsync()
        {
            var sb = new StringBuilder();

            while (true)
            {
                var buffer = new byte[1024];
                var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                sb.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));

                if (result.EndOfMessage)
                {
                    return sb.ToString();
                }
            }
        }

        public void StartGame()
        {
            var msg = CreateMessageJson(MessageType.StartGame);
            SendStringAsync(_converter.Serialize(msg)).ConfigureAwait(false);
        }

        public void Start(SnakeBot snake)
        {
            _snake = snake;
            RegisterPlayer(snake.Name);

            Receive().ConfigureAwait(false);
        }

        public void RegisterPlayer(string playerName)
        {
            var msg = CreateMessageJson(MessageType.RegisterPlayer);
            msg["playerName"] = playerName;
            if (_gameSettings != null)
            {
                msg["gameSettings"] = JObject.FromObject(_gameSettings);
            }
            SendStringAsync(_converter.Serialize(msg)).Wait(CancellationToken.None);
        }

        public void IssueMovementCommand(Direction direction, long gameTick)
        {
            var msg = CreateMessageJson(MessageType.RegisterMove);
            msg["direction"] = direction.ToString().ToUpperInvariant();
            msg["gameTick"] = gameTick;
            SendStringAsync(_converter.Serialize(msg)).Wait(CancellationToken.None);
        }
        
        private JObject CreateMessageJson(string type)
        {
            var msg = new JObject {["type"] = type};
            return msg;
        }
    }
}