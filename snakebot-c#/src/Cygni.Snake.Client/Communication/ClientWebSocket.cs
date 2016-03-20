using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace Cygni.Snake.Client.Communication
{
    public class ClientWebSocket : IClientWebSocket
    {
        public WebSocketState State => _socket.State;

        private readonly System.Net.WebSockets.ClientWebSocket _socket = new System.Net.WebSockets.ClientWebSocket();

        public Task ConnectAsync(Uri uri, CancellationToken cancellationToken)
        {
            return _socket.ConnectAsync(uri, cancellationToken);
        }

        public Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> buffer, CancellationToken cancellationToken)
        {
            return _socket.ReceiveAsync(buffer, cancellationToken);
        }

        public Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken)
        {
            return _socket.CloseAsync(closeStatus, statusDescription, cancellationToken);
        }

        public Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage, CancellationToken cancellationToken)
        {
            return _socket.SendAsync(buffer, messageType, endOfMessage, cancellationToken);
        }
    }
}