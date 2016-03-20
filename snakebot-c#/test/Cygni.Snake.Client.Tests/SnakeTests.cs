using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;
using Cygni.Snake.Client.Communication.Serialization;
using Cygni.Snake.Client.Events;
using Cygni.Snake.Client.Tiles;
using Xunit;
using Moq;

namespace CygniSnakeBot.tests
{
    public class SnakeTests
    {
        [Fact]
        public void SnakeShouldNotStartGameIfGameModeIsNotTraining()
        {
            var clientMock = new Mock<IClientWebSocket>();
            clientMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Factory.StartNew(() => { }));
            clientMock.Setup(m => m.State).Returns(WebSocketState.Open);
            clientMock.Setup(m => m.ReceiveAsync()).Returns(() =>
            {
                clientMock.Setup(m => m.State).Returns(WebSocketState.Closed);
                return
                    Task.Factory.StartNew(
                        () =>
                            new JsonConverter().Serialize(new PlayerRegistered("supersnake", "black", new GameSettings(),
                                "tournament", "", "")));
            });

            var sc = new SnakeClient("localhost", 1, "tournament", new GameSettings(), clientMock.Object,
                new JsonConverter());
            new FakeSnake(sc);

            sc.Connect();

            Thread.Sleep(1000);

            clientMock.Verify(m => m.SendAsync(It.Is<string>(s => s.Contains(MessageType.StartGame))), Times.Never);
        }


        [Fact]
        public void SnakeShouldStartGameIfGameModeIsTraining()
        {
            var clientMock = new Mock<IClientWebSocket>();
            clientMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Factory.StartNew(() => { }));
            clientMock.Setup(m => m.State).Returns(WebSocketState.Open);
            clientMock.Setup(m => m.ReceiveAsync()).Returns(() =>
            {
                clientMock.Setup(m => m.State).Returns(WebSocketState.Closed);
                return
                    Task.Factory.StartNew(
                        () =>
                            new JsonConverter().Serialize(new PlayerRegistered("supersnake", "black", new GameSettings(),
                                "tournament", "", "")));
            });

            var sc = new SnakeClient("localhost", 1, "training", new GameSettings(), clientMock.Object,
                new JsonConverter());
            new FakeSnake(sc);

            sc.Connect();

            Thread.Sleep(1000);

            clientMock.Verify(m => m.SendAsync(It.Is<string>(s => s.Contains(MessageType.StartGame))), Times.Once);
        }

        [Fact]
        public void SnakeShouldRespondWithNewMovementDirectionWhenMapIsUpdated()
        {
            var clientMock = new Mock<IClientWebSocket>();
            clientMock.Setup(m => m.ConnectAsync(It.IsAny<Uri>(), It.IsAny<CancellationToken>())).Returns(Task.Factory.StartNew(() => { }));
            clientMock.Setup(m => m.State).Returns(WebSocketState.Open);

            clientMock.Setup(m => m.ReceiveAsync()).Returns(() =>
            {
                clientMock.Setup(m => m.State).Returns(WebSocketState.Closed);
                return Task.Factory.StartNew(() => new JsonConverter().Serialize(new MapUpdate("", "", 1337,
                    new Map(0, 0, new List<IEnumerable<ITileContent>>(), new List<SnakeInfo>()))));
            });

            var sc = new SnakeClient("localhost", 1, "training", new GameSettings(), clientMock.Object,
                new JsonConverter());
            new FakeSnake(sc);

            sc.Connect();

            Thread.Sleep(1000);

            clientMock.Verify(m => m.SendAsync(It.Is<string>(s => s.Contains(MessageType.RegisterMove))), Times.Once);
        }
    }
}