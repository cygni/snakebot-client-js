const DateFormat = require('dateformat');
const GameSettings = require('./domain/mamba/gameSettings.js');
const JsonSocket = require('json-socket');
const Mamba = require('./domain/mamba-client.js');
const Net = require('net');
const argv = require('minimist')(process.argv.slice(2));
const now = require('performance-now');
const open = require('open');

const Colors = { yellow: '\x1b[1m\x1b[33m', red: '\x1b[1m\x1b[31m', reset: '\x1b[0m' };

let snakeBot = null;
let gameInfo = null;
let gameLink = null;
const renderer = null;


function logError(message, err) {
    console.log(`${Colors.red + DateFormat(new Date(), 'HH:MM:ss.l')} - ERROR - ${message}${Colors.reset}`, err);
}

function logWarning(message) {
    console.log(`${Colors.yellow + DateFormat(new Date(), 'HH:MM:ss.l')} - WARNING - ${message}${Colors.reset}`);
}

function log(msg, data) {
    const formattedMsg = `${DateFormat(new Date(), 'HH:MM:ss.l')} - ${msg}`;
    return data ? console.log(formattedMsg, data) : console.log(formattedMsg);
}

/**
 * Logger function injected into the snake bot.
 * @param msg the message
 * @param data the data
 */
function logExt(msg, data) {
    if (!options.silentLog) {
        if (typeof data === typeof {}) {
            data = JSON.stringify(data);
        }

        if (typeof msg === typeof {}) {
            msg = JSON.stringify(msg);
        }

        log(msg, data);
    }
}

/**
 * Prints usage information.
 * @param options
 */
function printUsage() {
    log('Usage; node snake-cli <snake-bot.js>\n');
    log(' -u, --user <username> : the username');
    log(' --host <snake.cygni.se> : the host');
    log(' --port <80> : the server port');
    log(' --venue <training | arena | tournament> : the game room');
    log(' -t --training : force training');
    log(' --arena : arena name');
    log(' --silent : snakebot log is silenced');
    log(' --mambadbg : show all mamba logs');
    log(' --gamelink : open GameLink');
    log(' --snakeoil <4242> : enable SnakeOil bot bus (sandbox feature)');
    log('\n');
}

/**
 * Parses the command line options.
 * @param argv minimist command line options
 * @returns {{help: *, snakeScript: null, user: *, host: *, port: *, venue: string, training: *, renderMode: string, silentLog: *, mambaDebug: *, gamelink: *}}
 */
function parseOptions(argv) {
    const options = {
        help: argv.h || argv.help,
        snakeScript: argv._ ? argv._[0] : null,
        user: argv.u || argv.user,
        host: argv.host ? argv.host : 'snake.cygni.se',
        port: argv.port ? argv.port : 80,
        venue: argv.venue ? argv.venue : 'training',
        arena: argv.arena ? argv.arena : 'official',
        training: argv.t || argv.training,
        silentLog: argv.silent,
        mambaDebug: argv.mambadbg,
        gamelink: argv.gamelink,
        snakeoil: argv.snakeoil
    };

    if (options.help || (!options.snakeScript && !options.snakeoil)) {
        printUsage(options);
        process.exit();
    }

    if (!options.user) {
        logWarning('Username not set, consider setting one `-u, --user <name>`');
    }

    return options;
}


/**
 * Launch a new game!
 * @param theSnakeBot the bot to use
 */
function launchGame(theSnakeBot) {
    snakeBot = theSnakeBot;

    if (options.venue === 'arena') {
        client.connect(`${options.venue}/${options.arena}`);
    } else {
        client.connect(options.venue);
    }
}

/**
 * Prepares a new game on the server.
 */
function prepareNewGame() {
    client.prepareNewGame(options.user, GameSettings.create());
}

/**
 * Notifies the the snake bot of a new game tick.
 * @param mapUpdateEvent the world state (@see MapUpdateEvent).
 * @param onResponse call back when response received
 */
function handleGameUpdate(mapUpdateEvent, onResponse) {
    const start = now();
    snakeBot.gameStateChanged(mapUpdateEvent, gameInfo.getPlayerId(), (response) => {
        response.debugData.executionTime = (now() - start).toFixed(3);
        client.moveSnake(response.direction, mapUpdateEvent.getGameTick());
        if (onResponse) {
            onResponse(response.debugData);
        }
    });
}

/**
 * Called when the game ends.
 * @param exit true if process should exit.
 */
function endGame(exit, event) {
    const fProcEnd = exit ? () => process.exit() : () => {};

    if (options.gamelink && gameLink) {
        open(gameLink.getUrl());
    } else if (gameLink) {
        log(`GameLink: ${gameLink.getUrl()}`);
    }

    fProcEnd();
}

// Mamba client events are handled and responded to below.
function onEvent(event) {
    switch (event.type) {
    case 'CONNECTED':
        log('Server connected!');
        prepareNewGame();
        break;

    case 'REGISTERED':
        log('Ready to play!');
        gameInfo = event.payload;
        client.startGame();
        break;

    case 'GAME_MAP_UPDATED':
        log(`Game map updated - gameTick:${event.payload.getGameTick()}`);
        log(`gameid: ${event.payload.getGameId()}`);
        handleGameUpdate(event.payload);
        break;

    case 'GAME_SNAKE_DEAD':
        log('A snake died!');

        if (snakeBot.onSnakeDied) {
            snakeBot.onSnakeDied(event);
        }
        break;

    case 'NEW_GAME_STARTED':
        log('New game started!');
        log(JSON.stringify(event.payload));

        if (snakeBot.onGameStarted) {
            snakeBot.onGameStarted(event);
        }
        break;

    case 'GAME_LINK':
        log('Game link!');
        gameLink = event.payload;
        break;

    case 'GAME_ENDED':
        log('Game ended!');
        log(JSON.stringify(event.payload));
        endGame(!isTournament() && !isArena()); // Do not exit in tournament or arena mode.

        if (snakeBot.onGameEnded) {
            snakeBot.onGameEnded(event);
        }
        break;

    case 'GAME_RESULT':
        log('Game result!');

        if (snakeBot.onGameResult) {
            snakeBot.onGameResult(event);
        }
        break;

    case 'TOURNAMENT_ENDED':
        log('Tournament ended!');
        endGame(true);

        if (snakeBot.onTournamentEnded) {
            snakeBot.onTournamentEnded(event);
        }
        break;

    default:
    case 'ERROR':
        logError(`Error - ${event.payload}`);
        break;
    }
}

/**
 * Setup a snake bot, scripted or oiled.
 * The type is determined by options.
 * @param onSnakeInited call me back when the snake is initiated
 */
function initSnakeBot(onSnakeInited) {
    if (options.snakeoil) {
        setupOiledBot(options, onSnakeInited);
    } else {
        setupScriptedBot(options, onSnakeInited);
    }
}

/**
 * Sets up a new scripted snake bot.
 * @param options the options
 * @param onSnakeInited call me when the snake is initiated
 */
function setupScriptedBot(options, onSnakeInited) {
    try {
        const snake = require(options.snakeScript);
        snake.bootStrap(logExt);
        snake.gameStateChanged = (mapUpdateEvent, playerId, onResponse) => {
            onResponse(snake.onMapUpdated(mapUpdateEvent, playerId));
        };

        onSnakeInited(snake);
    } catch (e) {
        logError(`Could not find or init snake bot script at : ${options.snakeScript}`, e);
        throw new Error('SnakeBotError');
    }
}

/**
 * Sets up the snakeoil server
 * @param options the options
 * @param onSnakeInited call me when snake is initiated
 */
function setupOiledBot(options, onSnakeInited) {
    // A wrapper for the oiled snake
    const snake = {
        client: null,
        gameStateResponder: null,
        gameStateChanged: function update(mapUpdateEvent, playerId, onResponse) {
            this.gameStateResponder = onResponse;
            this.client.sendMessage(JSON.stringify({
                type: 'GAME_STATE',
                mapState: mapUpdateEvent.marshall(),
                myUserId: playerId
            }));
        },
        gameEnded() {
            this.client.sendMessage(JSON.stringify({ type: 'GAME_END' }));
        },
        handleResponse(response) {
            this.gameStateResponder(response);
        }
    };

    try {
        const server = Net.createServer();
        server.listen(4242);
        server.on('connection', (socket) => {
            log('Client connected!');
            snake.client = new JsonSocket(socket);
            snake.client.on('message', (response) => {
                snake.handleResponse(response);
            });
            onSnakeInited(snake);
        });
    } catch (e) {
        logError('Could not init SnakeOil bot bus', e);
        throw new Error('SnakeBotError');
    }
}

function isTournament() {
    return gameInfo.getGameMode() === 'TOURNAMENT';
}

function isArena() {
    return gameInfo.getGameMode() === 'ARENA';
}

/**
 * A command line client for Snake written in Javascript 5.
 * Uses the Mamba Client for server communication.
 */

console.log('\n*** snake-cli by Cygni ***\n');


const options = parseOptions(argv);
const client = Mamba(options.host, options.port, onEvent, options.mambaDebug);

initSnakeBot(launchGame);
