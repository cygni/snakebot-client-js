/** *
 * Sandbox!
 * Disregard!
 */

const Net = require('net');
const JsonSocket = require('json-socket');

let count = 0;

const port = 4242;
const host = '127.0.0.1';
const socket = new JsonSocket(new Net.Socket());
socket.connect(port, host);
socket.on('connect', () => {
    socket.on('message', (gameState) => {
        console.log(gameState);
        count += 1;
        socket.sendMessage({ direction: 'RIGHT', debugData: { myLog: count } });
    });
});
