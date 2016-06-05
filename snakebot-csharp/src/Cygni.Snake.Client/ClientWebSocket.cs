using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebSockets.Protocol;

namespace Cygni.Snake.Client
{
    internal class ClientWebSocket
    {
        private const string Magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        
        public async Task<WebSocket> CreateWebSocket(Uri uri, CancellationToken cancellationToken)
        {
            if (uri.Scheme == "wss")
                throw new NotSupportedException("https is not supported");

            var port = uri.Port == 0 ? 80 : uri.Port;

            var connection = new TcpClient
            {
                NoDelay = true
            };
            await connection.ConnectAsync(uri.Host, port);

            var stream = connection.GetStream();
            var secKey = Convert.ToBase64String(Encoding.ASCII.GetBytes(Guid.NewGuid().ToString().Substring(0, 16)));
            string expectedAccept = Convert.ToBase64String(SHA1.Create().ComputeHash(Encoding.ASCII.GetBytes(secKey + Magic)));

            var headerString =
                $"GET {uri.PathAndQuery} HTTP/1.1\r\n" +
                $"Host: {uri.Host}\r\n" +
                "Connection: Upgrade\r\n" +
                "Upgrade: websocket\r\n" +
                "Sec-WebSocket-Version: 13\r\n" +
                $"Sec-WebSocket-Key: {secKey}\r\n\r\n";

            var bytes = Encoding.UTF8.GetBytes(headerString);
            await stream.WriteAsync(bytes, 0, bytes.Length, cancellationToken);
            await stream.FlushAsync(cancellationToken);

            var buffer = new byte[1024];
            var resultLenth = await stream.ReadAsync(buffer, 0, 1024, cancellationToken);
            var resultString = new StringReader(Encoding.UTF8.GetString(buffer, 0, resultLenth));

            var respCode = 0;
            var headers = new Dictionary<string, string>();
            var line = resultString.ReadLine();
            while (line != null)
            {
                if (line.StartsWith("HTTP/1.1 ") && line.Length > 11)
                    respCode = Convert.ToInt16(line.Substring(9, 3));
                else
                {
                    var items = line.Split(new[] { ':' }, 2);
                    if (items.Length == 2)
                        headers[items[0]] = items[1].TrimStart();
                }

                line = resultString.ReadLine();
            }

            if (respCode != (int)HttpStatusCode.SwitchingProtocols)
                throw new WebSocketException("The server returned status code '" + (int)respCode +
                                             "' when status code '101' was expected");
            if (!string.Equals(headers["Upgrade"], "WebSocket", StringComparison.OrdinalIgnoreCase)
                || !string.Equals(headers["Connection"], "Upgrade", StringComparison.OrdinalIgnoreCase)
                || !string.Equals(headers["Sec-WebSocket-Accept"], expectedAccept))
                throw new WebSocketException("HTTP header error during handshake");

            return CommonWebSocket.CreateClientWebSocket(stream, null, default(TimeSpan), 1024, true);
        }
    }
}