#!/usr/bin/env node --experimental-modules --unhandled-rejections=strict
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import readline from 'readline';
import commander from 'commander';

import { createNodeClient } from './index.js';

async function run(relativeSnakePath, { host, venue, autostart }) {
  const snakePath = path.resolve(process.cwd(), relativeSnakePath);
  const snake = await import(snakePath);

  const client = createNodeClient({
    host,
    venue,
    snake,
    autoStart: autostart,
    onGameReady(startGame) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('Start game? (y/n) ', answer => {
        rl.close();
        if (answer === '' || answer.startsWith('y')) {
          startGame();
        } else {
          client.close();
        }
      });
    },
  });
}

(async () => {
  const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf8'));

  const program = commander
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .version(pkg.version)
    .arguments('<snake-path>')
    .option('--host [url]', 'The server to connect to', 'ws://snake.cygni.se')
    .option('--venue [name]', 'Which venue to use', 'training')
    .option('--autostart', 'Automatically start the game', true)
    .option('--no-autostart', 'Do not automatically start the game')
    .action(run);

  await program.parseAsync(process.argv);
})();