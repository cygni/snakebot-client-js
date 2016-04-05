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
    public class SnakeClient : ISnakeClient, IDisposable
    {
        private readonly string _serverHost;
        private readonly int _serverPort;
        private readonly GameSettings _gameSettings;

        private readonly ITextClientWebSocket _socket;
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
        private WebSocket _webSocket;

        public SnakeClient(string serverHost, int serverPort, string gameMode, GameSettings gameSettings)

        {
        }

        public SnakeClient(string serverHost, int serverPort, string gameMode, GameSettings gameSettings, ITextClientWebSocket socket, IConverter converter)
        {
            _serverHost = serverHost;
            _serverPort = serverPort;
            GameMode = gameMode;
            _gameSettings = gameSettings;
            _socket = socket;
            _converter = converter;
        }

        public SnakeClient(WebSocket webSocket)
        {
            _webSocket = webSocket;
            _converter = new JsonConverter();
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

        private async Task<GameEvent> ReceiveEventAsync()
        {
            var message = await ReceiveStringAsync();
            var e = ActOnMessage(message);
            return e;
        }

        private GameEvent ActOnMessage(string jsonString)
        {
            var messageType = _converter.GetMessageType(jsonString);

            switch (messageType)
            {
                case MessageType.GameEnded:
                    return _converter.Deserialize<GameEnded>(jsonString);
                case MessageType.MapUpdated:
                    return _converter.Deserialize<MapUpdate>(jsonString);
                case MessageType.SnakeDead:
                    return _converter.Deserialize<SnakeDead>(jsonString);
                case MessageType.GameStarting:
                    return _converter.Deserialize<GameStarting>(jsonString);
                case MessageType.PlayerRegistered:
                    return _converter.Deserialize<PlayerRegistered>(jsonString);
                case MessageType.InvalidPlayerName:
                    return _converter.Deserialize<InvalidPlayerName>(jsonString);
                default:
                    throw new ArgumentOutOfRangeException($"Undefined message received: {jsonString}");
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
            SendStringAsync(_converter.Serialize(msg));
        }

        public void RegisterPlayer(string playerName)
        {
            var msg = CreateMessageJson(MessageType.RegisterPlayer);
            msg["playerName"] = playerName;
            if (_gameSettings != null)
            {
                msg["gameSettings"] = JObject.FromObject(_gameSettings);
            }
            SendStringAsync(_converter.Serialize(msg));
        }

        public void IssueMovementCommand(Direction direction, long gameTick)
        {
            var msg = CreateMessageJson(MessageType.RegisterMove);
            msg["direction"] = direction.ToString().ToUpperInvariant();
            msg["gameTick"] = gameTick;
            SendStringAsync(_converter.Serialize(msg));
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