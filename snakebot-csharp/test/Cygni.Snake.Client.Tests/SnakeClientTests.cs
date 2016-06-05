//using System;
//using System.Linq;
//using System.Net.WebSockets;
//using System.Text;
//using Newtonsoft.Json.Linq;
//using Xunit;

//namespace Cygni.Snake.Client.Tests
//{
//    public class StubGameObserver : IGameObserver
//    {
//        public void OnSnakeDied(string reason, string snakeId)
//        {}

//        public void OnGameStart()
//        {
//            GameStartCalls++;
//        }

//        public void OnGameEnd(Map map)
//        {}

//        public void OnUpdate(Map map)
//        {}

//        public int GameStartCalls { get; private set; }
//    } 

//    public class SnakeClientTests
//    {
//        private readonly JObject _sampleMapJson = new JObject
//        {
//            {"width", 3},
//            {"height", 3},
//            {"worldTick", 1 },
//            {"snakeInfos", new JArray(new JObject
//            {
//                {"id", "snake-id"},
//                {"positions", new JArray(0, 1)},
//                {"name", "snake"},
//                {"points", 3}
//            })},
//            {"foodPositions", new JArray(2) },
//            {"obstaclePositions", new JArray(3) }
//        };

//        [Fact]
//        public void Start_ThrowsArgumentNullWhenBotIsNull()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            var client = new SnakeClient(socket);
//            Assert.Throws<ArgumentNullException>(() => client.Start(null, true));
//        }

//        [Theory]
//        [InlineData(WebSocketState.None)]
//        [InlineData(WebSocketState.Aborted)]
//        [InlineData(WebSocketState.CloseReceived)]
//        [InlineData(WebSocketState.CloseSent)]
//        [InlineData(WebSocketState.Closed)]
//        [InlineData(WebSocketState.Connecting)]
//        public void Start_ThrowsInvalidOperationWhenSocketIsNotOpen(WebSocketState state)
//        {
//            var socket = new StubWebSocket(state);
//            var client = new SnakeClient(socket);
//            Assert.Throws<InvalidOperationException>(() => client.Start(new StubSnakeBot(), true));
//        }

//        [Fact]
//        public void Start_ThrowsInvalidOperationWhenServerSaysPlayerNameIsInvalid()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.InvalidPlayerName }, { "reason", "taken" } });
//            var client = new SnakeClient(socket);

//            Assert.Throws<InvalidOperationException>(() => client.Start(new StubSnakeBot(), true));
//        }

//        [Fact]
//        public void Start_SendsRegisterPlayerRequest()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
//            var client = new SnakeClient(socket, new StubGameObserver());

//            var bot = new StubSnakeBot();
//            client.Start(bot, true);

//            var registerMessage = socket.OutgoingJson[0];
//            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)registerMessage["type"]);
//            Assert.Equal(bot.Name, (string)registerMessage["playerName"]);
//        }

//        [Fact]
//        public void Start_SendsStartGameRequestAfterServerHasConfirmedRegistration()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
//            var client = new SnakeClient(socket, new StubGameObserver());

//            client.Start(new StubSnakeBot(), true);

//            var startGameMessage = socket.OutgoingJson[2];
//            Assert.Equal("se.cygni.snake.api.request.StartGame", (string)startGameMessage["type"]);
//        }

//        [Fact]
//        public void Start_NotifiesObserverWhenGameIsStarting()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });

//            var observer = new StubGameObserver();
//            var client = new SnakeClient(socket, observer);
//            client.Start(new StubSnakeBot(), true);

//            Assert.Equal(1, observer.GameStartCalls);
//        }
        
//        [Fact]
//        public void Start_NotifiesObserverWhenMapHasUpdated()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject
//            {
//                { "type", MessageType.MapUpdated },
//                { "map", _sampleMapJson }
//            });


//            var observer = new Mock<IGameObserver>();
//            observer.Setup(o => o.OnUpdate(It.IsAny<Map>()));

//            var client = new SnakeClient(socket, observer.Object);
//            client.Start(new StubSnakeBot(), true);

//            observer.Verify(o => o.OnUpdate(It.IsAny<Map>()), Times.Once);
//        }

//        [Fact]
//        public void Start_NotifiesObserverWhenGameHasEnded()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject
//            {
//                { "type", MessageType.GameEnded },
//                { "map", _sampleMapJson }
//            });


//            var observer = new Mock<IGameObserver>();
//            observer.Setup(o => o.OnGameEnd(It.IsAny<Map>()));

//            var client = new SnakeClient(socket, observer.Object);
//            client.Start(new StubSnakeBot(), true);

//            observer.Verify(o => o.OnGameEnd(It.IsAny<Map>()), Times.Once);
//        }

//        [Fact]
//        public void Start_NotifiesObserverWhenSnakeHasDied()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject
//            {
//                { "type", MessageType.SnakeDead },
//                { "playerId", "snake-id" },
//                { "deathReason", "CollisionWithWall" },
//            });

//            var observer = new Mock<IGameObserver>();
//            observer.Setup(o => o.OnSnakeDied(It.IsAny<string>(), It.IsAny<string>()));

//            var client = new SnakeClient(socket, observer.Object);
//            client.Start(new StubSnakeBot(), true);

//            observer.Verify(o => o.OnSnakeDied(
//                It.Is<string>(s => s.Equals("CollisionWithWall", StringComparison.Ordinal)),
//                It.Is<string>(s => s.Equals("snake-id"))), Times.Once);
//        }
        
//        [Fact]
//        public void Start_RequestsMoveFromSnakeBotOnMapUpdate()
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });
//            socket.IncomingJson.Enqueue(new JObject
//            {
//                { "type", MessageType.MapUpdated },
//                { "map", _sampleMapJson }
//            });

//            var bot = new Mock<StubSnakeBot>();
//            bot.Setup(b => b.GetNextMove(It.IsAny<Map>()));

//            var client = new SnakeClient(socket);
//            client.Start(bot.Object, true);

//            bot.Verify(o => o.GetNextMove(It.IsAny<Map>()), Times.Once);
//        }
        
//        [Fact]
//        public void Start_RequestsMoveFromBotEventIfNoGameStartingMessageHasBeenReceived()
//        {
//            // Not an actual requirement, but this test is here for completness.
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("map-update.json", Encoding.UTF8)));

//            var client = new SnakeClient(socket);
//            var mockSnake = new Mock<StubSnakeBot>();
//            mockSnake.Setup(s => s.GetNextMove(It.IsAny<Map>()));
//            client.Start(mockSnake.Object, true);

//            mockSnake.Verify(s => s.GetNextMove(It.IsAny<Map>()), Times.Once());
//        }

//        [Theory]
//        [InlineData(Direction.Down, "DOWN")]
//        [InlineData(Direction.Up, "UP")]
//        [InlineData(Direction.Left, "LEFT")]
//        [InlineData(Direction.Right, "RIGHT")]
//        public void Start_SendsRegisterMoveRequestFromBot(Direction direction, string expectedDirectionString)
//        {
//            var socket = new StubWebSocket(WebSocketState.Open);
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
//            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });
//            socket.IncomingJson.Enqueue(new JObject
//            {
//                { "type", MessageType.MapUpdated },
//                { "map", _sampleMapJson }
//            });

//            var client = new SnakeClient(socket, Mock.Of<IGameObserver>());
//            client.Start(new StubSnakeBot(direction), true);

//            var moveMessage = socket.OutgoingJson.Last();
//            Assert.Equal("se.cygni.snake.api.request.RegisterMove", (string)moveMessage["type"]);
//            Assert.Equal(expectedDirectionString, (string)moveMessage["direction"]);
//            Assert.Equal(_sampleMapJson["worldTick"], (string)moveMessage["gameTick"]);
//        }
//    }
//}
