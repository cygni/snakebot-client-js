using System;
using System.IO;
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
        private Task _receiveTask;
        private Action<MapUpdate> _onMapUpdate;
        private Action<SnakeDead> _onSnakeDead;
        private Action<GameEnded> _onGameEnded;
        private Action<GameStarting> _onGameStarting;
        private Action<PlayerRegistered> _onPlayerRegistered;
        private Action<InvalidPlayerName> _onInvalidPlayerName;
        private Action _onSessionClosed;

        public SnakeClient(WebSocket webSocket)
        {
            _webSocket = webSocket;
            _converter = new JsonConverter();
            _gameSettings = new GameSettings();
        }

        public void OnSnakeDead(Action<SnakeDead> onSnakeDead)
        {
            _onSnakeDead = onSnakeDead;
        }

        public void OnGameEnded(Action<GameEnded> onGameEnded)
        {
            _onGameEnded = onGameEnded;
        }

        public void OnGameStarting(Action<GameStarting> onGameStaring)
        {
            _onGameStarting = onGameStaring;
        }

        public void OnPlayerRegistered(Action<PlayerRegistered> onPlayerRegistered)
        {
            _onPlayerRegistered = onPlayerRegistered;
        }

        public void OnInvalidPlayerName(Action<InvalidPlayerName> onInvalidPlayerName)
        {
            _onInvalidPlayerName = onInvalidPlayerName;
        }

        public void OnMapUpdate(Action<MapUpdate> onMapUpdate)
        {
            _onMapUpdate = onMapUpdate;
        }

        public void OnSessionClosed(Action onSessionClosed)
        {
            _onSessionClosed = onSessionClosed;
        }

        private async void Receive()
        {
            while (_webSocket.State == WebSocketState.Open)
            {
                ActOnMessage(await ReceiveStringAsync());
            }
        }
        

        private void ActOnMessage(string jsonString)
        {
            var messageType = _converter.GetMessageType(jsonString);

            switch (messageType)
            {
                case MessageType.GameEnded:
                    _onGameEnded?.Invoke(_converter.Deserialize<GameEnded>(jsonString));
                    break;

                case MessageType.MapUpdated:
                    _onMapUpdate?.Invoke(_converter.Deserialize<MapUpdate>(jsonString));
                    break;

                case MessageType.SnakeDead:
                    _onSnakeDead?.Invoke(_converter.Deserialize<SnakeDead>(jsonString));
                    break;

                case MessageType.GameStarting:
                    _onGameStarting?.Invoke(_converter.Deserialize<GameStarting>(jsonString));
                    break;

                case MessageType.PlayerRegistered:
                    _onPlayerRegistered?.Invoke(_converter.Deserialize<PlayerRegistered>(jsonString));
                    break;

                case MessageType.InvalidPlayerName:
                    _onInvalidPlayerName?.Invoke(_converter.Deserialize<InvalidPlayerName>(jsonString));
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

        public void StartReceiving()
        {
            _receiveTask = new Task(Receive);
            _receiveTask.Start();
        }

        public void RegisterPlayer(string playerName)
        {
            var msg = CreateMessageJson(MessageType.RegisterPlayer);
            msg["playerName"] = playerName;
            if (_gameSettings != null)
            {
                msg["gameSettings"] = JObject.FromObject(_gameSettings);
            }
            SendStringAsync(_converter.Serialize(msg)).Wait();
            StartReceiving();
        }

        public void IssueMovementCommand(Direction direction, long gameTick)
        {
            var msg = CreateMessageJson(MessageType.RegisterMove);
            msg["direction"] = direction.ToString().ToUpperInvariant();
            msg["gameTick"] = gameTick;
            SendStringAsync(_converter.Serialize(msg)).Wait();
        }
        
        private JObject CreateMessageJson(string type)
        {
            var msg = new JObject();
            msg["type"] = type;
            return msg;
        }
    }
}