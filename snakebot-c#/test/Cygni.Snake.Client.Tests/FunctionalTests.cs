using System.Net.WebSockets;
using System.Text;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class FunctionalTests
    {
        [Fact]
        public void RegisterPlayer_StartGame_RegisterMove()
        {
            // Setting up socket with normal flow of events
            var socket = new StubWebSocket(WebSocketState.Open) {CloseWhenNoMoreMessages = true};
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("player-registered.json", Encoding.UTF8)));
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-starting.json", Encoding.UTF8)));
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("map-update.json", Encoding.UTF8)));
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-ended.json", Encoding.UTF8)));

            var client = new SnakeClient(socket, Mock.Of<IGameObserver>());
            
            client.Start(new StubSnakeBot(Direction.Left));

            // Assert correct sequence of messages back to the socket.
            Assert.Equal(MessageType.RegisterPlayer, socket.OutgoingJson[0]["type"]);
            Assert.Equal(MessageType.StartGame, socket.OutgoingJson[1]["type"]);
            Assert.Equal(MessageType.RegisterMove, socket.OutgoingJson[2]["type"]);
        }
    }
}