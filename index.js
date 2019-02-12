'use strict';
const WebSocket = require('ws');
const snakebot = require('esm')(module)('./src');
const pkg = require('./package');

const clientInfo = {
  clientVersion: pkg.version,
  // OS doesn't really matter for JavaScript, so specify that we're using Node
  operatingSystem: 'Node.js',
  operatingSystemVersion: process.versions.node,
};

module.exports = {
  ...snakebot,

  createNodeClient(options) {
    return snakebot.createClient({ WebSocket, clientInfo, ...options });
  },
};
