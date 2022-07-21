import path from 'path';
import process from 'process';
import readline from 'readline';
import { program } from 'commander';
import { createClient, GameMode } from './src/index';
import WebSocket from 'ws';
import colors from 'colors';
import { SnakeImplementation } from './src/client';

// const defaultSnakePath = url.fileURLToPath(new URL('./snakepit/slither.js', import.meta.url));
const defaultServerUrl = 'wss://snake.cygni.se';
const defaultSnakePath = './snakepit/slither';
const defaultSnakeName = 'Slither';

program
  .option('-h, --host <host>', 'Hostname of the server', defaultServerUrl)
  .option('-v, --venue <venue>', 'Venue name', 'training')
  .option('-n, --name <name>', 'Name of the snake', defaultSnakeName)
  .option('-s, --snake <path>', 'Path to the snake file', defaultSnakePath)
  .option('-a, --autostart', 'Auto start the game', true)
  .option('-sp, --spoiler', 'Show the results', false);

program.parse(process.argv);
const options = program.opts();
console.log('Starting snake with options:', options);

// Running the client
(async () => {
  const clientVer = process.env.npm_package_version || 'unknown';
  const snake: SnakeImplementation = await import(path.resolve(options.snake));
  console.log("Hi", colors.green(process.env.USER || 'friend'), "and welcome to the snake pit!");
  console.log("Using client version", colors.red.underline(clientVer));
  if (options.venue.toUpperCase() === GameMode.Training) {
    console.log("Overwriting training game settings with", colors.red.underline(JSON.stringify(snake.gameSettings)));
  }

  const client = createClient({
    name: options.name,
    host: options.host,
    venue: options.venue,
    snake: snake,
    logger: console,
    autoStart: options.autostart,
    spoiler: options.spoiler,
    WebSocket: WebSocket,
    clientInfo: {
      clientVersion: clientVer,
      operatingSystem: 'Node.js',
      operatingSystemVersion: process.versions.node,
    },
    gameSettings: snake.gameSettings,

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
