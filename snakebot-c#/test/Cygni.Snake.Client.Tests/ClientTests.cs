using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Serialization;
using Cygni.Snake.Client.Events;
using Cygni.Snake.Client.Tests.Helpers;
using Moq;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class ClientTests
    {
        private Mock<IClientWebSocket> _socketMock;

        // TODO: Unreliable tests. Fails when doing "Run all tests".
        [Fact]
        public void ClientShouldInvokeOnGameTurnEventWhenMessageIsReceived()
        {
            _socketMock = new Mock<IClientWebSocket>();
            string jsonString = TestResources.GetResourceText("map-update.json", Encoding.UTF8);
            MapUpdate eventArgs = null;

            _socketMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Delay(1));
            _socketMock.Setup(m => m.State).Returns(WebSocketState.Open);

            _socketMock.Setup(m => m.ReceiveAsync()).Returns(Task.Factory.StartNew(() => jsonString));

            var client = new SnakeClient("localhost", 1, "training", null, _socketMock.Object, new JsonConverter());
            client.OnMapUpdate(args => { eventArgs = args; });

            client.Connect();

            Retry.For(() => eventArgs != null, TimeSpan.FromSeconds(5));
            Assert.Equal(eventArgs.GameTick, 0);
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");

            client.Dispose();
        }

        [Fact]
        public void ClientShouldInvokePlayerRegisteredWhenMessageIsReceived()
        {
            _socketMock = new Mock<IClientWebSocket>();
            string jsonString = TestResources.GetResourceText("player-registered.json", Encoding.UTF8);
            PlayerRegistered eventArgs = null;

            _socketMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Delay(1));
            _socketMock.Setup(m => m.State).Returns(WebSocketState.Open);

            _socketMock.Setup(m => m.ReceiveAsync()).Returns(Task.Factory.StartNew(() => jsonString));

            var client = new SnakeClient("localhost", 1, "training", null, _socketMock.Object, new JsonConverter());
            client.OnPlayerRegistered(args => { eventArgs = args; });

            client.Connect();

            Retry.For(() => eventArgs != null, TimeSpan.FromSeconds(5));

            Assert.Equal(eventArgs.Name, "#emil");
            Assert.Equal(eventArgs.GameMode, "training");
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.Color, "black");

            client.Dispose();
        }

        [Fact]
        public void ClientShouldInvokeGameStartingEvent()
        {
            _socketMock = new Mock<IClientWebSocket>();
            string jsonString = TestResources.GetResourceText("game-starting.json", Encoding.UTF8);
            GameStarting eventArgs = null;

            _socketMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Delay(1));
            _socketMock.Setup(m => m.State).Returns(WebSocketState.Open);

            _socketMock.Setup(m => m.ReceiveAsync()).Returns(Task.Factory.StartNew(() => jsonString));

            var client = new SnakeClient("localhost", 1, "training", null, _socketMock.Object, new JsonConverter());
            client.OnGameStarting(args => { eventArgs = args; });

            client.Connect();

            Retry.For(() => eventArgs != null, TimeSpan.FromSeconds(5));
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.NoofPlayers, 5);

            client.Dispose();
        }

        [Fact]
        public void ClientShouldInvokeGameEndedEvent()
        {
            _socketMock = new Mock<IClientWebSocket>();
            string jsonString = TestResources.GetResourceText("game-ended.json", Encoding.UTF8);
            GameEnded eventArgs = null;

            _socketMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>()))
                .Returns(Task.Delay(1));
            _socketMock.Setup(m => m.State).Returns(WebSocketState.Open);

            _socketMock.Setup(m => m.ReceiveAsync()).Returns(Task.Factory.StartNew(() => jsonString));

            var client = new SnakeClient("localhost", 1, "training", null, _socketMock.Object, new JsonConverter());
            client.OnGameEnded(args => { eventArgs = args; });

            client.Connect();

            Retry.For(() => eventArgs != null, TimeSpan.FromSeconds(1));
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.PlayerWinnerId, "bestWinner");

            client.Dispose();
        }

        [Fact]
        public void ClientShouldInvokeOnSnakeDeadEvent()
        {
            _socketMock = new Mock<IClientWebSocket>();
            string jsonString = TestResources.GetResourceText("snake-dead.json", Encoding.UTF8);
            SnakeDead eventArgs = null;

            _socketMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Delay(1));
            _socketMock.Setup(m => m.State).Returns(WebSocketState.Open);

            _socketMock.Setup(m => m.ReceiveAsync()).Returns(Task.Factory.StartNew(() => jsonString));

            var client = new SnakeClient("localhost", 1, "training", null, _socketMock.Object, new JsonConverter());
            client.OnSnakeDead(args => { eventArgs = args; });

            client.Connect();

            Retry.For(() => eventArgs != null, TimeSpan.FromSeconds(5));
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.DeathReason, DeathReason.CollisionWithWall);
            Assert.Equal(eventArgs.ReceivingPlayerId, "fb5cbf29-fd3c-4012-af0b-bd32ad10c9f7");

            client.Dispose();
        }
    }
}
