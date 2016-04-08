using System.Net.WebSockets;
using System.Text;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class ClientTests
    {
        [Fact]
        public void ClientShouldInvokeOnGameTurnEventWhenMessageIsReceived()
        {
            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("map-update.json", Encoding.UTF8)));

            var client = new SnakeClient(socket, Mock.Of<IPrinter>());
            var mockSnake = new Mock<FakeSnakeBot>();
            mockSnake.Setup(s => s.OnMapUpdate(It.IsAny<Map>()));
            SynchronousTaskScheduler.Run(() => client.Start(mockSnake.Object));

            mockSnake.Verify(s => s.OnMapUpdate(It.IsAny<Map>()), Times.Once());
        }
    }
}
