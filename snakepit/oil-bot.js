/***
 * Sandbox!
 * Disregard!
 */

var Net = require('net');
var JsonSocket = require('json-socket');

var count = 0;

var port = 4242;
var host = '127.0.0.1';
var socket = new JsonSocket(new Net.Socket());
socket.connect(port, host);
socket.on('connect', function() {
  socket.on('message', function(gameState) {
    console.log(gameState);
    count += 1;
    socket.sendMessage({"direction" : "RIGHT", "debugData": { "myLog" : count}});
  });
});