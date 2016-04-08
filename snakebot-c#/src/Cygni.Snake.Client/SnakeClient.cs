using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client
{
    public class SnakeClient
    {
        private readonly GameSettings _gameSettings;
        private readonly WebSocket _socket;
        private readonly IPrinter _printer;

        public SnakeClient(WebSocket socket) : this(socket, new ConsoleMapPrinter())
        {}

        public SnakeClient(WebSocket socket, IPrinter printer)
        {
            _socket = socket;
            _gameSettings = new GameSettings();
            _printer = printer;
        }

        public void Start(SnakeBot snake)
        {
            SendRegisterPlayerRequest(snake.Name);

            while (_socket.State == WebSocketState.Open)
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
                    OnGameEnded(JsonConvert.DeserializeObject<GameEnded>(jsonString));
                    break;

                case MessageType.MapUpdated:
                    OnMapUpdated(snake, JsonConvert.DeserializeObject<MapUpdate>(jsonString));
                    break;

                case MessageType.SnakeDead:
                    OnSnakeDead(JsonConvert.DeserializeObject<SnakeDead>(jsonString));
                    break;

                case MessageType.PlayerRegistered:
                    SendStartGameRequest();
                    break;

                case MessageType.InvalidPlayerName:
                    OnInvalidPlayerName(JsonConvert.DeserializeObject<InvalidPlayerName>(jsonString));
                    break;
            }
        }

        private void OnInvalidPlayerName(InvalidPlayerName invalidPlayerName)
        {
            var reason = Enum.GetName(typeof(PlayerNameInvalidReason), invalidPlayerName.ReasonCode);
            throw new InvalidOperationException($"Player name is invalid (reason: {reason})");
        }

        private void OnSnakeDead(SnakeDead e)
        {
            _printer.Print(e);
        }

        private string ReceiveString()
        {
            var sb = new StringBuilder();
            
            while (true)
            {
                var buffer = new byte[1024];
                var result = _socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None).Result;

                sb.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));

                if (result.EndOfMessage)
                {
                    return sb.ToString();
                }
            }
        }

        private void OnGameEnded(GameEnded gameEnded)
        {
            _printer.Print(gameEnded);
        }

        private void OnMapUpdated(SnakeBot snake, MapUpdate mapUpdate)
        {
            _printer.Print(mapUpdate.Map);
            var direction = snake.OnMapUpdate(mapUpdate.Map);
            SendRegisterMoveRequest(direction, mapUpdate.GameTick);
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
            _socket.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None).ConfigureAwait(false);
        }
    }
}