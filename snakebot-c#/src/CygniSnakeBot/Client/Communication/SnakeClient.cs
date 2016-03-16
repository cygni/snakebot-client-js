using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CygniSnakeBot.Client.Communication.Messages;
using CygniSnakeBot.Client.Communication.Serialization;
using CygniSnakeBot.Client.Events;

namespace CygniSnakeBot.Client.Communication
{
    public class SnakeClient : ISnakeClient, IDisposable
    {
        private const int BufferSize = 1024;

        private readonly string _serverHost;
        private readonly int _serverPort;
        private readonly GameSettings _gameSettings;
        private string _playerId;

        private readonly IClientWebSocket _socket;
        private readonly IConverter _converter;
        private Task _receiveTask;

        public event EventHandler<MapUpdateEventArgs> OnMapUpdate;
        public event EventHandler<SnakeDeadEventArgs> OnSnakeDead;
        public event EventHandler<GameEndedEventArgs> OnGameEnded;
        public event EventHandler<GameStartingEventArgs> OnGameStarting;
        public event EventHandler<PlayerRegisteredEventArgs> OnPlayerRegistered;
        public event EventHandler<InvalidPlayerNameEventArgs> OnInvalidPlayerName;
        public event EventHandler OnConnected;
        public event EventHandler OnSessionClosed;

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

        public string GameMode { get; }

        public void Connect()
        {
            var uri = new Uri($"ws://{_serverHost}:{_serverPort}/{GameMode}");
            _socket.ConnectAsync(uri, CancellationToken.None).Wait();

            _receiveTask = new Task(Receive);
            _receiveTask.Start();

            OnConnected?.Invoke(null, null);
        }

        private async void Receive()
        {
            var sb = new StringBuilder();

            while (_socket.State == WebSocketState.Open)
            {
                var buffer = new byte[BufferSize];
                var result = await _socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
               
                sb.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));

                if (result.EndOfMessage)
                {
                    ActOnMessage(sb.ToString());
                    sb.Clear();
                }

                if (result.MessageType != WebSocketMessageType.Close)
                    continue;

                await _socket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                OnSessionClosed?.Invoke(null, null);
            }
        }

        private void ActOnMessage(string jsonString)
        {
            var messageType = _converter.GetMessageType(jsonString);

            switch (messageType)
            {
                case MessageType.GameEnded:
                    OnGameEnded?.Invoke(null, _converter.Deserialize<GameEndedEventArgs>(jsonString));
                    break;

                case MessageType.MapUpdated:
                    OnMapUpdate?.Invoke(null, _converter.Deserialize<MapUpdateEventArgs>(jsonString));
                    break;

                case MessageType.SnakeDead:
                    OnSnakeDead?.Invoke(null, _converter.Deserialize<SnakeDeadEventArgs>(jsonString));
                    break;

                case MessageType.GameStarting:
                    OnGameStarting?.Invoke(null, _converter.Deserialize<GameStartingEventArgs>(jsonString));
                    break;

                case MessageType.PlayerRegistered:
                    OnPlayerRegistered?.Invoke(null, _converter.Deserialize<PlayerRegisteredEventArgs>(jsonString));
                    break;

                case MessageType.InvalidPlayerName:
                    OnInvalidPlayerName?.Invoke(null, _converter.Deserialize<InvalidPlayerNameEventArgs>(jsonString));
                    break;

                default:
                    throw new ArgumentOutOfRangeException($"Undefined message received: {jsonString}");
            }
        }

        private void SendMessage(object msg)
        {
            var outputmessage = new ArraySegment<byte>(Encoding.UTF8.GetBytes(_converter.Serialize(msg)));

            _socket.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None).Wait();

            if (_socket.State == WebSocketState.Closed)
            {
                OnSessionClosed?.Invoke(null, null);
            }
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