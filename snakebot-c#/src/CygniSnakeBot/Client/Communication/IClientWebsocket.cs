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
        Task<string> ReceiveAsync();
        Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken);
        Task SendAsync(string message);
    }
}