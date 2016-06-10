//using System.Net.WebSockets;
//using System.Text;
//using Newtonsoft.Json.Linq;
//using Xunit;

//namespace Cygni.Snake.Client.Tests
//{
//    public class FunctionalTests
//    {
//        [Fact]
//        public void RegisterPlayer_ClientInfo_StartGame_RegisterMove_TrainingMode()
//        {
//            // Setting up socket with normal flow of events
//            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("player-registered.json", Encoding.UTF8)));
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-starting.json", Encoding.UTF8)));
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("map-update.json", Encoding.UTF8)));
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-ended.json", Encoding.UTF8)));

//            var client = new SnakeClient(socket);

//            client.Start(new StubSnakeBot(Direction.Left), true);

//            // Assert correct sequence of messages back to the socket.
//            Assert.Equal(MessageType.RegisterPlayer, (string)socket.OutgoingJson[0]["type"]);
//            Assert.Equal(MessageType.ClientInfo, (string)socket.OutgoingJson[1]["type"]);
//            Assert.Equal(MessageType.StartGame, (string)socket.OutgoingJson[2]["type"]);
//            Assert.Equal(MessageType.RegisterMove, (string)socket.OutgoingJson[3]["type"]);
//        }

//        [Fact]
//        public void RegisterPlayer_ClientInfo__RegisterMove_TournamentMode()
//        {
//            // Setting up socket with normal flow of events
//            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("player-registered.json", Encoding.UTF8)));
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-starting.json", Encoding.UTF8)));
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("map-update.json", Encoding.UTF8)));
//            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-ended.json", Encoding.UTF8)));

//            var client = new SnakeClient(socket);

//            client.Start(new StubSnakeBot(Direction.Left), false);

//            // Assert correct sequence of messages back to the socket.
//            Assert.Equal(MessageType.RegisterPlayer, (string)socket.OutgoingJson[0]["type"]);
//            Assert.Equal(MessageType.ClientInfo, (string)socket.OutgoingJson[1]["type"]);
//            Assert.Equal(MessageType.RegisterMove, (string)socket.OutgoingJson[2]["type"]);
//        }
//    }
//}