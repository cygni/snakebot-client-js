using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cygni.Snake.Client.Tests
{
    public class StubWebSocket : WebSocket
    {
        private readonly List<JObject> _messages = new List<JObject>();
        private WebSocketState _state;

        public StubWebSocket(WebSocketState state)
        {
            this._state = state;
            CloseWhenNoMoreMessages = true;
        }

        public bool CloseWhenNoMoreMessages { get; set; }

        public override void Abort() { }

        public override Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription,
            CancellationToken cancellationToken)
        {
            _state = WebSocketState.Closed;
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
            var e = IncomingJson.Count > 0 ? IncomingJson.Dequeue() : null;
            if (e != null)
            {
                var data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(e));
                data.CopyTo(buffer.Array, 0);
                if (!IncomingJson.Any() && CloseWhenNoMoreMessages)
                {
                    _state = WebSocketState.Closed;
                }
                return Task.FromResult(new WebSocketReceiveResult(data.Length, WebSocketMessageType.Text, true));
            }
            return Task.FromResult(new WebSocketReceiveResult(0, WebSocketMessageType.Text, true));
        }

        public override Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage,
            CancellationToken cancellationToken)
        {
            _messages.Add(JsonConvert.DeserializeObject<JObject>(Encoding.UTF8.GetString(buffer.Array)));
            return Task.CompletedTask;
        }

        public override WebSocketCloseStatus? CloseStatus => WebSocketCloseStatus.Empty;

        public override string CloseStatusDescription => String.Empty;

        public override WebSocketState State => _state;

        public override string SubProtocol => String.Empty;

        public IReadOnlyList<JObject> OutgoingJson => _messages;

        public Queue<JObject> IncomingJson { get; } = new Queue<JObject>();
    }
}