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
        private readonly IGameObserver _observer;

        public SnakeClient(WebSocket socket, IGameObserver observer)
        {
            _socket = socket;
            _gameSettings = new GameSettings();
            _observer = observer;
        }

        public void Start(SnakeBot snake)
        {
            SendRegisterPlayerRequest(snake.Name);

            while (_socket.State == WebSocketState.Open)
            {
                var message = ReceiveString();
                var json = JObject.Parse(message);
                OnMessageReceived(snake, json);
            }
        }

        private void OnMessageReceived(SnakeBot snake, JObject json)
        {
            string messageType = (string)json?["type"] ?? String.Empty;

            switch (messageType)
            {
                case MessageType.GameEnded:
                    OnGameEnded(json);
                    break;

                case MessageType.MapUpdated:
                    OnMapUpdated(snake, json);
                    break;

                case MessageType.SnakeDead:
                    OnSnakeDead(json);
                    break;

                case MessageType.PlayerRegistered:
                    SendStartGameRequest();
                    break;

                case MessageType.InvalidPlayerName:
                    OnInvalidPlayerName(json);
                    break;
            }
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

        private void OnInvalidPlayerName(JObject json)
        {
            var reason = (string) json["reasonCode"];
            throw new InvalidOperationException($"Player name is invalid (reason: {reason})");
        }

        private void OnSnakeDead(JObject json)
        {
            string deathReason = (string)json["deathReason"];
            string id = (string) json["playerId"];
            _observer.OnSnakeDied(deathReason, id);
        }

        private void OnGameEnded(JObject json)
        {
            var map = Map.FromJson((JObject)json["map"]);
            _observer.OnGameEnd(map);
        }

        private void OnMapUpdated(SnakeBot snake, JObject json)
        {
            var map = Map.FromJson((JObject)json["map"]);
            _observer.OnUpdate(map);
            var direction = snake.OnMapUpdate(map);
            SendRegisterMoveRequest(direction, map.Tick);
        }

        private void SendStartGameRequest()
        {
            var msg = new JObject
            {
                ["type"] = MessageType.StartGame
            };
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