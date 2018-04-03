/* eslint-disable import/no-nodejs-modules */
import process from 'process';
import WebSocket from 'ws';
import pkg from './package.json';
import { createClient } from './src/index.mjs';
export * from './src/index.mjs';

const clientInfo = {
  clientVersion: pkg.version,
  // OS doesn't really matter for JavaScript, so specify that we're using Node
  operatingSystem: 'Node.js',
  operatingSystemVersion: process.versions.node,
};

export function createNodeClient(options) {
  return createClient({ WebSocket, clientInfo, ...options });
}
