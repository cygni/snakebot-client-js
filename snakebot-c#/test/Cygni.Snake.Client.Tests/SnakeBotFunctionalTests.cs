using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Communication.Messages;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Cygni.Snake.Client.Tests
{
    public class SnakeBotFunctionalTests
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

            var sc = new SnakeClient(socket);
            var snake = new FakeSnakeBot();
            
            // Run all tasks in sequence so that we do not assert before all calls have finished.
            SynchronousTaskScheduler.Run(() => sc.Start(snake));

            // Assert correct sequence of messages back to the socket.
            Assert.Equal(MessageType.RegisterPlayer, socket.OutgoingJson[0]["type"]);
            Assert.Equal(MessageType.StartGame, socket.OutgoingJson[1]["type"]);
            Assert.Equal(MessageType.RegisterMove, socket.OutgoingJson[2]["type"]);
        }
    }
}