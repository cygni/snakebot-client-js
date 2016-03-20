using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication.Messages;
using Cygni.Snake.Client.Communication.Serialization;
using Cygni.Snake.Client.Events;

namespace Cygni.Snake.Client.Communication
{
    public class SnakeClient : ISnakeClient, IDisposable
    {
        private readonly string _serverHost;
        private readonly int _serverPort;
        private readonly GameSettings _gameSettings;
        private string _playerId;

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

        private void SendMessage(object msg)
        {
            _socket.SendAsync(_converter.Serialize(msg));
        }
        
        public void StartGame(string gameId, string playerId)
        {
            _playerId = playerId;

            SendMessage(new StartGameMessage(_playerId));
        }

        public void RegisterPlayer(string playerName, string playerColor)
        {
            SendMessage(new PlayerRegistrationMessage(playerName, playerColor, _gameSettings, _playerId));
        }

        public void IssueMovementCommand(MovementDirection direction, long gameTick)
        {
            SendMessage(new RegisterMoveMessage(direction, gameTick, _playerId));
        }

        public void Dispose()
        {
            _socket?.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None).Wait();
        }
    }
}