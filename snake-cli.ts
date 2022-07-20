import path from 'path';
import process from 'process';
import readline from 'readline';
import { program } from 'commander';
import { createClient } from './src/index';
import WebSocket from 'ws';
import colors from 'colors';

// const defaultSnakePath = url.fileURLToPath(new URL('./snakepit/slither.js', import.meta.url));
const defaultServerUrl = 'wss://snake.cygni.se';
const defaultSnakePath = './snakepit/slither';
const defaultSnakeName = 'Slither';

program
  .option('-h, --host <host>', 'Hostname of the server', defaultServerUrl)
  .option('-v, --venue <venue>', 'Venue name', 'training')
  .option('-n, --name <name>', 'Name of the snake', defaultSnakeName)
  .option('-s, --snake <path>', 'Path to the snake file', defaultSnakePath)
  .option('-a, --autostart', 'Auto start the game', true);

program.parse(process.argv);
const options = program.opts();
console.log('Starting snake with options:', options);

// Running the client
(async () => {
  const snake = await import(path.resolve(options.snake));

  const client = createClient({
    name: options.name,
    host: options.host,
    venue: options.venue,
    snake: snake,
    logger: console,
    autoStart: options.autostart,
    WebSocket: WebSocket,
    clientInfo: {
      operatingSystem: 'Node.js',
      operatingSystemVersion: process.versions.node,
    },
    gameSettings: {},

    onGameReady: (startGame) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(('Start game? ' + '('+ colors.green('y') + '/'+ colors.red('n') + '): '), answer => {
        rl.close();
        if (answer === '' || answer.startsWith('y')) {
          startGame();
        } else {
          client.close();
        }
      });
    },
  });
})();
