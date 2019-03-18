'use strict';
const WebSocket = require('ws');
const requireWithEsm = require('esm')(module);

/** @type {import('./src')} */
const snakebot = requireWithEsm('./src');
const pkg = require('./package.json');

function getDefaultExport(mod) {
  return typeof mod === 'object' && mod !== null && mod.default !== undefined ? mod.default : mod;
}

function getSnake(snakePath) {
  if (typeof snakePath === 'string') {
    const Snake = getDefaultExport(requireWithEsm(snakePath));
    if (typeof Snake === 'function') {
      return new Snake();
    }
  }
}

const clientInfo = Object.freeze({
  clientVersion: pkg.version,
  // OS doesn't really matter for JavaScript, so specify that we're using Node
  operatingSystem: 'Node.js',
  operatingSystemVersion: process.versions.node,
});

module.exports = {
  ...snakebot,

  createNodeClient({ snakePath, snake = getSnake(snakePath), ...options }) {
    // @ts-ignore
    return snakebot.createClient({ WebSocket, clientInfo, snake, ...options });
  },
};
