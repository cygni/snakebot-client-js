using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;
using System.Linq;

namespace Cygni.Snake.Client.Tests
{
    public class SnakeClientTests
    {
        private class StubWebSocket : WebSocket
        {
            private readonly List<byte[]> _messages = new List<byte[]>();

            public StubWebSocket(WebSocketState state)
            {
                State = state;
            }

            public override void Abort() { }

            public override Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription,
                CancellationToken cancellationToken)
            {
                return Task.CompletedTask;
            }

            public override Task CloseOutputAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken)
            {
                return Task.CompletedTask;
            }

            public override void Dispose()
            {
            }

            public override Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> buffer, CancellationToken cancellationToken)
            {
                return Task.FromResult(new WebSocketReceiveResult(0, WebSocketMessageType.Text, true));
            }

            public override Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage,
                CancellationToken cancellationToken)
            {
                _messages.Add(buffer.Array);
                return Task.CompletedTask;
            }

            public override WebSocketCloseStatus? CloseStatus => WebSocketCloseStatus.Empty;

            public override string CloseStatusDescription => String.Empty;

            public override WebSocketState State { get; }

            public override string SubProtocol => String.Empty;

            public IReadOnlyList<byte[]> Messages => _messages;

            public IReadOnlyList<JObject> JsonMessages => 
                _messages.Select(x => JsonConvert.DeserializeObject<JObject>(Encoding.UTF8.GetString(x)))
                .ToList();
        }

        [Fact]
        public void StartGame_SendsStartGameJsonRequest()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            var client = new SnakeClient(socket);

            client.StartGame();

            var actualMessage = socket.JsonMessages[0];
            Assert.Equal("se.cygni.snake.api.request.StartGame", (string)actualMessage["type"]);
        }

        [Fact]
        public void RegisterPlayer_SendsRegisterPlayerJsonRequestWithPlayerName()
        {
            var socket = new StubWebSocket(WebSocketState.Open);
            var client = new SnakeClient(socket);

            client.RegisterPlayer("awesomeSnakePlayer");

            var actualMessage = socket.JsonMessages[0];
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

            var actualMessage = socket.JsonMessages[0];
            Assert.Equal("se.cygni.snake.api.request.RegisterMove", (string)actualMessage["type"]);
            Assert.Equal(expectedDirectionString, (string)actualMessage["direction"]);
            Assert.Equal(4, (int)actualMessage["gameTick"]);
        }


    }
}
