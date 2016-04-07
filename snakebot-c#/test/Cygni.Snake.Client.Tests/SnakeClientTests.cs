using System.Net.WebSockets;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;
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
            var client = new SnakeClient(socket);

            client.Start(new FakeSnakeBot());

            var actualMessage = socket.OutgoingJson[0];
            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)actualMessage["type"]);
        }

        [Fact]
        public void RegisterPlayer_SendsRegisterPlayerJsonRequestWithPlayerName()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });
            var client = new SnakeClient(socket);

            client.Start(new FakeSnakeBot());

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
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.PlayerRegistered } });
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.GameStarting } });
            socket.IncomingJson.Enqueue(new JObject { { "type", MessageType.MapUpdated } });
            var client = new SnakeClient(socket);

            client.Start(new FakeSnakeBot(direction));
            
            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)socket.OutgoingJson[0]["type"]);
            Assert.Equal("se.cygni.snake.api.request.StartGame", (string)socket.OutgoingJson[1]["type"]);
            Assert.Equal("se.cygni.snake.api.request.RegisterMove", (string)socket.OutgoingJson[2]["type"]);
            Assert.Equal(expectedDirectionString, (string)socket.OutgoingJson[2]["direction"]);
        }
    }
}
