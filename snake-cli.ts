import colors from 'colors';
import path from 'path';
import process from 'process';
import { program } from 'commander';
import WebSocket from 'ws';
import { createClient, SnakeImplementation } from './src/client';
import { GameMode } from './src/types';

// const defaultSnakePath = url.fileURLToPath(new URL('./snakepit/slither.js', import.meta.url));
const defaultServerUrl = 'https://snake.cygni.se';
const defaultSnakePath = './snakepit/slither';
const defaultSnakeName = 'Slither';

program
  .description('Connect to a snake server and play a game')
  .name('npm start')
  .option('-h, --host <host>', 'Hostname of the server', defaultServerUrl)
  .option('-v, --venue <venue>', 'Venue name', 'training')
  .option('-n, --name <name>', 'Name of the snake', defaultSnakeName)
  .option('-s, --snake <path>', 'Path to the snake file', defaultSnakePath)
  .option('-sp, --spoiler', 'Show the results', false);

program.addHelpText('after', `
  Example:\tnpm start --host http://localhost:8080 --venue training --name Slither --snake ${defaultSnakePath}
  Or:\t\tnpm start -h http://localhost:8080 -v training -n Slither -s ${defaultSnakePath}`);

program.parse(process.argv);
const options = program.opts();
console.log('Starting snake with options:', options);

// Running the client
(async () => {
  const clientVer = process.env.npm_package_version || 'unknown';
  const snake: SnakeImplementation = await import(path.resolve(options.snake));
  console.log("Hi", colors.green(process.env.USER || 'friend'), "and welcome to the snake pit!");
  console.log("Using client version", colors.red.underline(clientVer));
  console.log("To display options, type", colors.yellow("npm start -- --help"));
  if (options.venue.toUpperCase() === GameMode.Training) {
    console.log("Overwriting training game settings with", colors.red.underline(JSON.stringify(snake.trainingGameSettings)));
  }

  const client = createClient({
    name: options.name,
    host: options.host,
    venue: options.venue,
    snake: snake,
    logger: console,
    spoiler: options.spoiler,
    WebSocket: WebSocket,
    clientInfo: {
      clientVersion: clientVer,
      operatingSystem: 'Node.js',
      operatingSystemVersion: process.versions.node,
    },
    gameSettings: snake.trainingGameSettings,
  });
})();
