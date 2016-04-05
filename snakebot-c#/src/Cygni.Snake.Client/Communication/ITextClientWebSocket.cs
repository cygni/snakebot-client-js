using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace Cygni.Snake.Client.Communication
{
    public interface ITextClientWebSocket
    {
        WebSocketState State { get; }

        Task ConnectAsync(Uri uri, CancellationToken cancellationToken);
        Task<string> ReceiveAsync();
        Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
        Task SendAsync(string message);
    }
}