using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace CygniSnakeBot.Client.Communication
{
    public interface IClientWebSocket
    {
        WebSocketState State { get; }

        Task ConnectAsync(Uri uri, CancellationToken cancellationToken);
        Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> buffer, CancellationToken cancellationToken);
        Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
        Task SendAsync(ArraySegment<byte> buffer, WebSocketMessageType messageType, bool endOfMessage, CancellationToken cancellationToken);
    }
}