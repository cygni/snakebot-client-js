using System.Net.WebSockets;
using System.Text;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class SnakeClientTests
    {
        [Fact]
        public void Start_SendsRegisterPlayerRequest()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
            var client = new SnakeClient(socket, Mock.Of<IGameObserver>());

            client.Start(new StubSnakeBot());

            var actualMessage = socket.OutgoingJson[0];
            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)actualMessage["type"]);
        }

        [Fact]
        public void RegisterPlayer_SendsRegisterPlayerJsonRequestWithPlayerName()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });
            var client = new SnakeClient(socket, Mock.Of<IGameObserver>());

            client.Start(new StubSnakeBot());

            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)socket.OutgoingJson[0]["type"]);
            Assert.Equal("se.cygni.snake.api.request.StartGame", (string)socket.OutgoingJson[1]["type"]);
        }

        [Theory]
        [InlineData(Direction.Down, "DOWN")]
        [InlineData(Direction.Up, "UP")]
        [InlineData(Direction.Left, "LEFT")]
        [InlineData(Direction.Right, "RIGHT")]
        public void RegisterMove_SendsRegisterMoveCommandRequestWithDirectionAndGameTick(Direction direction, string expectedDirectionString)
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered }});
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });
            socket.IncomingJson.Enqueue(new JObject
            {
                { "type", MessageType.MapUpdated },
                { "map", JObject.Parse(TestResources.GetResourceText("map.json", Encoding.UTF8)) }
            });

            var client = new SnakeClient(socket, Mock.Of<IGameObserver>());

            client.Start(new StubSnakeBot(direction));
            
            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)socket.OutgoingJson[0]["type"]);
            Assert.Equal("se.cygni.snake.api.request.StartGame", (string)socket.OutgoingJson[1]["type"]);
            Assert.Equal("se.cygni.snake.api.request.RegisterMove", (string)socket.OutgoingJson[2]["type"]);
            Assert.Equal(expectedDirectionString, (string)socket.OutgoingJson[2]["direction"]);
        }


        [Fact]
        public void ClientShouldInvokeOnGameTurnEventWhenMessageIsReceived()
        {
            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("map-update.json", Encoding.UTF8)));

            var client = new SnakeClient(socket, Mock.Of<IGameObserver>());
            var mockSnake = new Mock<StubSnakeBot>();
            mockSnake.Setup(s => s.GetNextMove(It.IsAny<Map>()));
            client.Start(mockSnake.Object);

            mockSnake.Verify(s => s.GetNextMove(It.IsAny<Map>()), Times.Once());
        }
    }
}
