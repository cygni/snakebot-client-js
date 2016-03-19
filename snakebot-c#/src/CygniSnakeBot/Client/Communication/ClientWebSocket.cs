using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CygniSnakeBot.Client.Communication
{
    public class ClientWebSocket : IClientWebSocket
    {
        private const int BufferSize = 1024;

        public WebSocketState State => _socket.State;

        private readonly System.Net.WebSockets.ClientWebSocket _socket = new System.Net.WebSockets.ClientWebSocket();

        public Task ConnectAsync(Uri uri, CancellationToken cancellationToken)
        {
            return _socket.ConnectAsync(uri, cancellationToken);
        }

        public async Task<string> ReceiveAsync()
        {
            var sb = new StringBuilder();
            
            while (true)
            {
                var buffer = new byte[BufferSize];
                var result = await _socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                sb.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));

                if (result.EndOfMessage)
                {
                    return sb.ToString();
                }
            }
        }

        public Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken cancellationToken)
        {
            return _socket.CloseAsync(closeStatus, statusDescription, cancellationToken);
        }

        public Task SendAsync(string message)
        {
            var outputmessage = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));

            return _socket.SendAsync(outputmessage, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}