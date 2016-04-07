using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using Cygni.Snake.Client.Communication.Messages;
using Cygni.Snake.Client.Events;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client.Communication
{
    public class SnakeClient
    {
        private readonly GameSettings _gameSettings;
        private readonly WebSocket _webSocket;

        public SnakeClient(WebSocket webSocket)
        {
            _webSocket = webSocket;
            _gameSettings = new GameSettings();
        }

        public void Start(SnakeBot snake)
        {
            SendRegisterPlayerRequest(snake.Name);

            while (_webSocket.State == WebSocketState.Open)
            {
                var message = ReceiveString();
                OnMessageReceived(snake, message);
            }
        }

        private void OnMessageReceived(SnakeBot snake, string jsonString)
        {
            var json = JObject.Parse(jsonString);
            string messageType = (string)json?["type"] ?? String.Empty;

            switch (messageType)
            {
                case MessageType.GameEnded:
                    snake.OnGameEnded(JsonConvert.DeserializeObject<GameEnded>(jsonString));
                    break;

                case MessageType.MapUpdated:
                    var update = JsonConvert.DeserializeObject<MapUpdate>(jsonString);
                    var direction = snake.OnMapUpdate(update);
                    SendRegisterMoveRequest(direction, update.GameTick);
                    break;

                case MessageType.SnakeDead:
                    snake.OnSnakeDead(JsonConvert.DeserializeObject<SnakeDead>(jsonString));
                    break;

                case MessageType.GameStarting:
                    snake.OnGameStarting(JsonConvert.DeserializeObject<GameStarting>(jsonString));
                    break;

                case MessageType.PlayerRegistered:
                    snake.OnPlayerRegistered(JsonConvert.DeserializeObject<PlayerRegistered>(jsonString));
                    SendStartGameRequest();
                    break;

                case MessageType.InvalidPlayerName:
                    snake.OnInvalidPlayerName(JsonConvert.DeserializeObject<InvalidPlayerName>(jsonString));
                    break;
            }
        }

        private string ReceiveString()
        {
            var sb = new StringBuilder();
            
            while (true)
            {
                var buffer = new byte[1024];
                var result = _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None).Result;

                sb.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));

                if (result.EndOfMessage)
                {
                    return sb.ToString();
                }
            }
        }

        private void SendStartGameRequest()
        {
            var msg = new JObject { ["type"] = MessageType.StartGame };
            SendString(JsonConvert.SerializeObject(msg));
        }

        private void SendRegisterPlayerRequest(string playerName)
        {
            var msg = new JObject
            {
                ["type"] = MessageType.RegisterPlayer,
                ["playerName"] = playerName
            };
            if (_gameSettings != null)
            {
                msg["gameSettings"] = JObject.FromObject(_gameSettings);
            }
            SendString(JsonConvert.SerializeObject(msg));
        }

        private void SendRegisterMoveRequest(Direction direction, long gameTick)
        {
            var msg = new JObject
            {
                ["type"] = MessageType.RegisterMove,
                ["direction"] = direction.ToString().ToUpperInvariant(),
                ["gameTick"] = gameTick
            };
            SendString(JsonConvert.SerializeObject(msg));
        }

        private void SendString(string msg)
        {
            var outputmessage = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg));
            _webSocket.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None).ConfigureAwait(false);
        }
    }
}