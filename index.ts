import fs from 'fs';
import process from 'process';
import WebSocket from 'ws';
import type { ClientInfo, ClientOptions } from './src/client';

import { createClient } from './src/index';

// const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const clientInfo: ClientInfo = Object.freeze({
  // clientVersion: pkg.version,
  // OS doesn't really matter for JavaScript, so specify that we're using Node
  operatingSystem: 'Node.js',
  operatingSystemVersion: process.versions.node,
});

export * from './src/index';

type NodeClientOptions = Omit<ClientOptions, 'WebSocket' | 'clientInfo'>;
export function createNodeClient(options: NodeClientOptions) {
  return createClient({
    WebSocket,
    clientInfo,
    ...options,
  });
}
