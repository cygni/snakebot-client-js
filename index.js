import fs from 'fs';
import process from 'process';
import WebSocket from 'ws';

import { createClient } from './src/index.js';

// const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const clientInfo = Object.freeze({
  // clientVersion: pkg.version,
  // OS doesn't really matter for JavaScript, so specify that we're using Node
  operatingSystem: 'Node.js',
  operatingSystemVersion: process.versions.node,
});

export * from './src/index.js';

export function createNodeClient(options) {
  return createClient({
    // @ts-ignore
    WebSocket,
    clientInfo,
    ...options,
  });
}
