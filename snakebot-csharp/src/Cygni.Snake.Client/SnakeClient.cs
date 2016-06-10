using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client
{
    /// <summary>
    ///     Provides a way to communicate with a CygniSnake server.
    /// </summary>
    public sealed class SnakeClient : IDisposable
    {
        private const string ClientVersion = "0.0.1";
        private readonly IGameObserver _observer;
        private readonly WebSocket _socket;
        private bool _isTrainingMode;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SnakeClient" /> class that communicates
        ///     with a Snake server over the specified <see cref="WebSocket" /> instance.
        ///     The specified <see cref="IGameObserver" />  will receive notifications on applicable messages.
        ///     Note that the specified <see cref="WebSocket" /> does not need to be in an <see cref="WebSocketState.Open" />
        ///     state in order to create this instance. However, it will need to be connected before starting a game.
        /// </summary>
        /// <param name="socket">The specified <see cref="WebSocket" /> instance.</param>
        /// <param name="observer">The specified <see cref="IGameObserver" /> instance.</param>
        public SnakeClient(WebSocket socket, IGameObserver observer)
        {
            if (socket == null)
            {
                throw new ArgumentNullException(nameof(socket));
            }
            if (observer == null)
            {
                throw new ArgumentNullException(nameof(observer));
            }

            _socket = socket;
            _observer = observer;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="SnakeClient" /> class that communicates
        ///     with a Snake server over the specified <see cref="WebSocket" /> instance.
        ///     Note that the specified <see cref="WebSocket" /> does not need to be in an <see cref="WebSocketState.Open" />
        ///     state in order to create this instance. However, it will need to be connected before starting a game.
        /// </summary>
        /// <param name="socket">The specified <see cref="WebSocket" /> instance.</param>
        public SnakeClient(WebSocket socket) : this(socket, new VoidObserver())
        {
        }

        public void Dispose()
        {
            _socket.Dispose();
        }

        /// <summary>
        ///     Registers the specified <see cref="SnakeBot" /> with the server and
        ///     tries to initiate a game. The specified <see cref="SnakeBot" /> instance
        ///     will receive calls to <see cref="SnakeBot.GetNextMove" /> when the server
        ///     requests a new move from this client.
        /// </summary>
        /// <remarks>This method will throw an exception if the web socket is not open.</remarks>
        /// <param name="snake">The specified <see cref="SnakeBot" /></param>
        /// <param name="isTrainingMode">Indicates if the game mode is training or not</param>
        /// <exception cref="ArgumentNullException" />
        /// <exception cref="InvalidOperationException">
        ///     If the socket is not opened, or if the specified <see cref="SnakeBot" /> has an invalid name.
        /// </exception>
        public void Start(SnakeBot snake, bool isTrainingMode)
        {
            Start(snake, isTrainingMode, null);
        }

        /// <summary>
        ///     Registers the specified <see cref="SnakeBot" /> with the server and
        ///     tries to initiate a new game using the specified <see cref="GameSettings" />.
        ///     The specified <see cref="SnakeBot" /> instance will receive calls to
        ///     <see cref="SnakeBot.GetNextMove" /> when the server requests a new move
        ///     from this client.
        /// </summary>
        /// <remarks>This method will throw an exception if the web socket is not open.</remarks>
        /// <param name="snake">The specified <see cref="SnakeBot" /></param>
        /// <param name="isTrainingMode">Indicates if the game mode is training or not</param>
        /// <param name="settings">The specified <see cref="GameSettings" />, can be null.</param>
        /// <exception cref="ArgumentNullException" />
        /// <exception cref="InvalidOperationException">
        ///     If the socket is not opened, or if the specified <see cref="SnakeBot" /> has an invalid name.
        /// </exception>
        public void Start(SnakeBot snake, bool isTrainingMode, GameSettings settings)
        {
            _isTrainingMode = isTrainingMode;

            if (snake == null)
            {
                throw new ArgumentNullException(nameof(snake));
            }

            if (_socket.State != WebSocketState.Open)
            {
                throw new InvalidOperationException("Cannot start a new game without connecting the Snake server. " +
                                                    $"The current state of the connection is {_socket.State}.");
            }

            SendRegisterPlayerRequest(snake.Name, settings);
            SendClientInfoMessage();

            while (_socket.State == WebSocketState.Open)
            {
                var message = ReceiveString();
                var json = JObject.Parse(message);
                OnMessageReceived(snake, json);
            }
        }

        private void OnMessageReceived(SnakeBot snake, JObject json)
        {
            var messageType = (string) json?["type"] ?? string.Empty;

            switch (messageType)
            {
                case MessageType.GameStarting:
                    OnGameStarting();
                    break;

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
                    OnPlayerRegistered();
                    break;

                case MessageType.InvalidPlayerName:
                    OnInvalidPlayerName(snake, json);
                    break;

                case MessageType.HeartBeatResponse:
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

        private void OnPlayerRegistered()
        {
            if (_isTrainingMode)
                SendStartGameRequest();
        }

        private void OnInvalidPlayerName(SnakeBot snake, JObject json)
        {
            var reason = (string) json["reasonCode"];
            throw new InvalidOperationException(
                $"The given player name '{snake.Name}' is not valid because. Reason: {reason}");
        }

        private void OnGameStarting()
        {
            _observer.OnGameStart();
        }

        private void OnSnakeDead(JObject json)
        {
            var deathReason = (string) json["deathReason"];
            var id = (string) json["playerId"];
            _observer.OnSnakeDied(deathReason, id);
        }

        private void OnGameEnded(JObject json)
        {
            var map = Map.FromJson((JObject) json["map"], (string) json["receivingPlayerId"]);
            _observer.OnGameEnd(map);
        }

        private void OnMapUpdated(SnakeBot snake, JObject json)
        {
            var map = Map.FromJson((JObject) json["map"], (string) json["receivingPlayerId"]);
            _observer.OnUpdate(map);
            var direction = snake.GetNextMove(map);
            SendRegisterMoveRequest(direction, map.Tick, (string) json["gameId"]);
        }

        private void SendStartGameRequest()
        {
            var msg = new JObject
            {
                ["type"] = MessageType.StartGame
            };
            SendString(JsonConvert.SerializeObject(msg), _socket);
        }

        private void SendRegisterPlayerRequest(string playerName, GameSettings settings)
        {
            var msg = new JObject
            {
                ["type"] = MessageType.RegisterPlayer,
                ["playerName"] = playerName
            };
            if (settings != null)
            {
                msg["gameSettings"] = JObject.FromObject(settings);
            }
            SendString(JsonConvert.SerializeObject(msg), _socket);
        }

        private void SendRegisterMoveRequest(Direction direction, long gameTick, string gameId)
        {
            var msg = new JObject
            {
                ["type"] = MessageType.RegisterMove,
                ["direction"] = direction.ToString().ToUpperInvariant(),
                ["gameTick"] = gameTick,
                ["gameId"] = gameId
            };
            SendString(JsonConvert.SerializeObject(msg), _socket);
        }

        private static string GetLocalIpAddress()
        {
            var host = Dns.GetHostEntryAsync(Dns.GetHostName()).Result;
            foreach (var ip in host.AddressList.Where(ip => ip.AddressFamily == AddressFamily.InterNetwork))
            {
                return ip.ToString();
            }
            throw new Exception("Local IP Address Not Found!");
        }

        private void SendClientInfoMessage()
        {
            var msg = new JObject
            {
                ["type"] = MessageType.ClientInfo,
                ["language"] = "C#",
                ["operatingSystem"] = "N/A",
                ["ipAddress"] = GetLocalIpAddress(),
                ["clientVersion"] = ClientVersion
            };
            SendString(JsonConvert.SerializeObject(msg), _socket);
        }

        private static void SendString(string msg, WebSocket ws)
        {
            var outputmessage = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg));
            lock (ws)
            {
                ws.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None).Wait();
            }
        }

        /// <summary>
        /// Connects to a Snake server on the specified <see cref="Uri"/>.
        /// Returns a new instance of <see cref="SnakeClient"/> that can be used
        /// to interact with the server.
        /// </summary>
        public static SnakeClient Connect(Uri uri, IGameObserver observer)
        {
            var ws = new ClientWebSocket().CreateWebSocket(uri, CancellationToken.None).Result;
            Task.Run(() => HearBeat(ws));
            return new SnakeClient(ws, observer);
        }

        private static void HearBeat(WebSocket ws)
        {
            while (ws.State == WebSocketState.Open)
            {
                var msg = new JObject
                {
                    ["type"] = MessageType.HeartBeatRequest
                };
                SendString(JsonConvert.SerializeObject(msg), ws);

                Task.Delay(TimeSpan.FromSeconds(30)).Wait();
            }
        }

        private class VoidObserver : IGameObserver
        {
            public void OnSnakeDied(string reason, string snakeId)
            {
            }

            public void OnGameStart()
            {
            }

            public void OnGameEnd(Map map)
            {
            }

            public void OnUpdate(Map map)
            {
            }
        }
    }
}