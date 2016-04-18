using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client
{
    /// <summary>
    /// Provides a way to communicate with a CygniSnake server.
    /// </summary>
    public class SnakeClient
    {
        private readonly WebSocket _socket;
        private readonly IGameObserver _observer;
        private bool _isTrainingMode;
        private const string ClientVersion = "0.0.1";

        /// <summary>
        /// Initializes a new instance of the <see cref="SnakeClient"/> class that communicates
        /// with a Snake server over the specified <see cref="WebSocket"/> instance. 
        /// The specified <see cref="IGameObserver"/>  will receive notifications on applicable messages.
        /// Note that the specified <see cref="WebSocket"/> does not need to be in an <see cref="WebSocketState.Open"/>
        /// state in order to create this instance. However, it will need to be connected before starting a game.
        /// </summary>
        /// <param name="socket">The specified <see cref="WebSocket"/> instance.</param>
        /// <param name="observer">The specified <see cref="IGameObserver"/> instance.</param>
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
        /// Initializes a new instance of the <see cref="SnakeClient"/> class that communicates
        /// with a Snake server over the specified <see cref="WebSocket"/> instance.
        /// Note that the specified <see cref="WebSocket"/> does not need to be in an <see cref="WebSocketState.Open"/>
        /// state in order to create this instance. However, it will need to be connected before starting a game.
        /// </summary>
        /// <param name="socket">The specified <see cref="WebSocket"/> instance.</param>
        public SnakeClient(WebSocket socket) : this(socket, new VoidObserver())
        {}

        /// <summary>
        /// Registers the specified <see cref="SnakeBot"/> with the server and
        /// tries to initiate a game. The specified <see cref="SnakeBot"/> instance
        /// will receive calls to <see cref="SnakeBot.GetNextMove"/> when the server 
        /// requests a new move from this client.
        /// </summary>
        /// <remarks>This method will throw an exception if the web socket is not open.</remarks>
        /// <param name="snake">The specified <see cref="SnakeBot"/></param>
        /// <param name="isTrainingMode">Indicates if the game mode is training or not</param>
        /// <exception cref="ArgumentNullException" />
        /// <exception cref="InvalidOperationException">
        /// If the socket is not opened, or if the specified <see cref="SnakeBot"/> has an invalid name.
        /// </exception>
        public void Start(SnakeBot snake, bool isTrainingMode)
        {
            Start(snake, isTrainingMode, null);
        }

        /// <summary>
        /// Registers the specified <see cref="SnakeBot"/> with the server and
        /// tries to initiate a new game using the specified <see cref="GameSettings"/>. 
        /// The specified <see cref="SnakeBot"/> instance will receive calls to 
        /// <see cref="SnakeBot.GetNextMove"/> when the server requests a new move 
        /// from this client.
        /// </summary>
        /// <remarks>This method will throw an exception if the web socket is not open.</remarks>
        /// <param name="snake">The specified <see cref="SnakeBot"/></param>
        /// <param name="isTrainingMode">Indicates if the game mode is training or not</param>
        /// <param name="settings">The specified <see cref="GameSettings"/>, can be null.</param>
        /// <exception cref="ArgumentNullException" />
        /// <exception cref="InvalidOperationException">
        /// If the socket is not opened, or if the specified <see cref="SnakeBot"/> has an invalid name.
        /// </exception>
        public void Start(SnakeBot snake, bool isTrainingMode, GameSettings settings)
        {
            _isTrainingMode = isTrainingMode;

            if (snake == null)
            {
                throw new ArgumentNullException(nameof(snake));
            }
            var state = _socket.State;
            if (state != WebSocketState.Open)
            {
                throw new InvalidOperationException("Cannot start a new game without connecting the Snake server. " +
                                                    $"The current state of the connection is {state}.");
            }

            SendRegisterPlayerRequest(snake.Name, settings);
            SendClientInfoMessage();

            Task.Run(() =>
            {
                while (_socket.State == WebSocketState.Open)
                {
                    SendPingMessage();
                    Task.Delay(TimeSpan.FromSeconds(30)).Wait();
                }
            });

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
            if(_isTrainingMode)
                SendStartGameRequest();
        }

        private void OnInvalidPlayerName(SnakeBot snake, JObject json)
        {
            var reason = (string) json["reasonCode"];
            throw new InvalidOperationException($"The given player name '{snake.Name}' is not valid because. Reason: {reason}");
        }
        
        private void OnGameStarting()
        {
            _observer.OnGameStart();
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
            var direction = snake.GetNextMove(map);
            SendRegisterMoveRequest(direction, map.Tick, (string)json["gameId"]);
        }

        private void SendStartGameRequest()
        {
            var msg = new JObject
            {
                ["type"] = MessageType.StartGame
            };
            SendString(JsonConvert.SerializeObject(msg));
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
            SendString(JsonConvert.SerializeObject(msg));
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
            SendString(JsonConvert.SerializeObject(msg));
        }

        private void SendClientInfoMessage()
        {
            var msg = new JObject
            {
                ["type"] = MessageType.ClientInfo,
                ["language"] = "C#",
                ["operatingSystem"] = "Windows",
                ["ipAddress"] = "",
                ["clientVersion"] = ClientVersion
            };
            SendString(JsonConvert.SerializeObject(msg));
        }

        private void SendPingMessage()
        {
            var msg = new JObject
            {
                ["type"] = MessageType.HeartBeatRequest
            };
            SendString(JsonConvert.SerializeObject(msg));
        }

        private void SendString(string msg)
        {
            var outputmessage = new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg));
            _socket.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None).ConfigureAwait(false);
        }

        private class VoidObserver : IGameObserver
        {
            public void OnSnakeDied(string reason, string snakeId) {}
            public void OnGameStart() { }
            public void OnGameEnd(Map map) { }
            public void OnUpdate(Map map) { }
        }
    }
}