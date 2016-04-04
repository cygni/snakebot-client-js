using System;
using System.IO;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication.Messages;
using Cygni.Snake.Client.Communication.Serialization;
using Cygni.Snake.Client.Events;
using Newtonsoft.Json.Linq;
using JsonConverter = Cygni.Snake.Client.Communication.Serialization.JsonConverter;

namespace Cygni.Snake.Client.Communication
{
    public class SnakeClient : ISnakeClient, IDisposable
    {
        private readonly string _serverHost;
        private readonly int _serverPort;
        private readonly GameSettings _gameSettings;

        private readonly IClientWebSocket _socket;
        private readonly IConverter _converter;
        private Task _receiveTask;
        private Action<MapUpdate> _onMapUpdate;
        private Action<SnakeDead> _onSnakeDead;
        private Action<GameEnded> _onGameEnded;
        private Action<GameStarting> _onGameStarting;
        private Action<PlayerRegistered> _onPlayerRegistered;
        private Action<InvalidPlayerName> _onInvalidPlayerName;
        private Action _onConnected;
        private Action _onSessionClosed;

        public SnakeClient(string serverHost, int serverPort, string gameMode, GameSettings gameSettings)
            : this(serverHost, serverPort, gameMode, gameSettings, new ClientWebSocket(), new JsonConverter())
        {
        }

        public SnakeClient(string serverHost, int serverPort, string gameMode, GameSettings gameSettings, IClientWebSocket socket, IConverter converter)
        {
            _serverHost = serverHost;
            _serverPort = serverPort;
            GameMode = gameMode;
            _gameSettings = gameSettings;
            _socket = socket;
            _converter = converter;
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

        public void OnConnected(Action onConnected)
        {
            _onConnected = onConnected;
        }

        public void OnSessionClosed(Action onSessionClosed)
        {
            _onSessionClosed = onSessionClosed;
        }

        public string GameMode { get; }

        public void Connect()
        {
            var uri = new Uri($"ws://{_serverHost}:{_serverPort}/{GameMode}");
            _socket.ConnectAsync(uri, CancellationToken.None).Wait();

            _receiveTask = new Task(Receive);
            _receiveTask.Start();

            _onConnected?.Invoke();
        }

        private async void Receive()
        {
            while (_socket.State == WebSocketState.Open)
            {
                ActOnMessage(await _socket.ReceiveAsync());
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
                    File.AppendAllText("C:\\Users\\Daniel\\Workspace\\tmp\\map.json", jsonString + "\n\n");
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

                default:
                    throw new ArgumentOutOfRangeException($"Undefined message received: {jsonString}");
            }
        }

        private Task SendMessage(object msg)
        {
            return _socket.SendAsync(_converter.Serialize(msg));
        }

        public void StartGame()
        {
            var msg = CreateMessageJson(MessageType.StartGame);
            SendMessage(msg);
        }

        public void RegisterPlayer(string playerName)
        {
            var msg = CreateMessageJson(MessageType.RegisterPlayer);
            msg["playerName"] = playerName;
            msg["gameSettings"] = JObject.FromObject(_gameSettings);
            SendMessage(msg);
        }

        public void IssueMovementCommand(Direction direction, long gameTick)
        {
            var msg = CreateMessageJson(MessageType.RegisterMove);
            msg["direction"] = direction.ToString().ToUpperInvariant();
            msg["gameTick"] = gameTick;
            SendMessage(msg);
        }
        
        private JObject CreateMessageJson(string type)
        {
            var msg = new JObject();
            msg["type"] = type;
            return msg;
        }

        public void Dispose()
        {
            _socket?.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None).Wait();
        }
    }
}