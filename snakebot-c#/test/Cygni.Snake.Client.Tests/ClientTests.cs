using System.Net.WebSockets;
using System.Text;
using Cygni.Snake.Client.Communication;
using Cygni.Snake.Client.Events;
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

            var client = new SnakeClient(socket);
            MapUpdate eventArgs = null;
            client.OnMapUpdate(args => { eventArgs = args; });

            SynchronousTaskScheduler.Run(() => client.StartReceiving());

            Assert.Equal(eventArgs.GameTick, 0);
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");

        }

        [Fact]
        public void ClientShouldInvokePlayerRegisteredWhenMessageIsReceived()
        {
            var socket = new StubWebSocket(WebSocketState.Open) {CloseWhenNoMoreMessages = true};
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("player-registered.json", Encoding.UTF8)));
            PlayerRegistered eventArgs = null;

            var client = new SnakeClient(socket);
            client.OnPlayerRegistered(args => { eventArgs = args; });

            SynchronousTaskScheduler.Run(() => client.StartReceiving());
            
            Assert.Equal(eventArgs.Name, "#emil");
            Assert.Equal(eventArgs.GameMode, "training");
            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
        }

        [Fact]
        public void ClientShouldInvokeGameStartingEvent()
        {
            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-starting.json", Encoding.UTF8)));
            GameStarting eventArgs = null;

            var client = new SnakeClient(socket);
            client.OnGameStarting(args => { eventArgs = args; });

            SynchronousTaskScheduler.Run(() => client.StartReceiving());

            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.NoofPlayers, 5);
        }

        [Fact]
        public void ClientShouldInvokeGameEndedEvent()
        {
            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("game-ended.json", Encoding.UTF8)));

            GameEnded eventArgs = null;

            var client = new SnakeClient(socket);
            client.OnGameEnded(args => { eventArgs = args; });

            SynchronousTaskScheduler.Run(() => client.StartReceiving());

            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.PlayerWinnerId, "bestWinner");
        }

        [Fact]
        public void ClientShouldInvokeOnSnakeDeadEvent()
        {
            var socket = new StubWebSocket(WebSocketState.Open) { CloseWhenNoMoreMessages = true };
            socket.IncomingJson.Enqueue(JObject.Parse(TestResources.GetResourceText("snake-dead.json", Encoding.UTF8)));
            SnakeDead eventArgs = null;

            var client = new SnakeClient(socket);
            client.OnSnakeDead(args => { eventArgs = args; });

            SynchronousTaskScheduler.Run(() => client.StartReceiving());

            Assert.Equal(eventArgs.GameId, "1a3d727e-40cb-4982-ba75-9cd67c0cf896");
            Assert.Equal(eventArgs.DeathReason, DeathReason.CollisionWithWall);
            Assert.Equal(eventArgs.ReceivingPlayerId, "fb5cbf29-fd3c-4012-af0b-bd32ad10c9f7");
        }
    }
}
