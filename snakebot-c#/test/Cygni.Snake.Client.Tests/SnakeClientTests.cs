using System.Net.WebSockets;
using Cygni.Snake.Client.Communication;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class SnakeClientTests
    {
        [Fact]
        public void StartGame_SendsStartGameJsonRequest()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            var client = new SnakeClient(socket);

            client.StartGame();

            var actualMessage = socket.OutgoingJson[0];
            Assert.Equal("se.cygni.snake.api.request.StartGame", (string)actualMessage["type"]);
        }
        
        [Fact]
        public void RegisterPlayer_SendsRegisterPlayerJsonRequestWithPlayerName()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            var client = new SnakeClient(socket);

            client.RegisterPlayer("awesomeSnakePlayer");

            var actualMessage = socket.OutgoingJson[0];
            Assert.Equal("se.cygni.snake.api.request.RegisterPlayer", (string)actualMessage["type"]);
            Assert.Equal("awesomeSnakePlayer", (string)actualMessage["playerName"]);
        }

        [Theory]
        [InlineData(Direction.Down, "DOWN")]
        [InlineData(Direction.Up, "UP")]
        [InlineData(Direction.Left, "LEFT")]
        [InlineData(Direction.Right, "RIGHT")]
        public void RegisterMove_SendsRegisterMoveCommandRequestWithDirectionAndGameTick(Direction direction, string expectedDirectionString)
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            var client = new SnakeClient(socket);

            client.IssueMovementCommand(direction, 4);

            var actualMessage = socket.OutgoingJson[0];
            Assert.Equal("se.cygni.snake.api.request.RegisterMove", (string)actualMessage["type"]);
            Assert.Equal(expectedDirectionString, (string)actualMessage["direction"]);
            Assert.Equal(4, (int)actualMessage["gameTick"]);
        }
    }
}
