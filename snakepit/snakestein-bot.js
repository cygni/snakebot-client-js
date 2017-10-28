/**
 * Snake Bot script.
 */
const MapUtils = require('./../domain/mapUtils.js');

let log = null; // Injected logger

function onMapUpdated(mapState, myUserId) {
    const map = mapState.getMap();
    let direction = 'DOWN'; // <'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>
    const snakeBrainDump = {}; // Optional debug information about the snakes current state of mind.

    // 1. Where's what etc.
    const myCoords = MapUtils.getSnakePosition(myUserId, map);
    log('I am here:', myCoords);
    snakeBrainDump.myCoords = myCoords;

    // 2. Do some nifty planning...
    // (Tip: see MapUtils for some off-the-shelf navigation aid.

    ['left', 'right', 'up', 'down'].some((dir) => {
        if (MapUtils.canIMoveInDirection(dir, myCoords, map)) {
            direction = dir.toUpperCase();
            return true;
        }

        return false;
    });

    // 3. Then shake that snake!
    return {
        direction,
        debugData: snakeBrainDump
    };
}

function bootStrap(logger) {
    log = logger;
}

function onGameEnded(event) {
    log('On Game Ended');
    log(event);
    // Implement as needed.
}

function onTournamentEnded(event) {
    log('On Tournament Ended');
    log(event);
    // Implement as needed.
}

function onSnakeDied(event) {
    log('On Snake Died');
    log(event);
    // Implement as needed.
}

function onGameStarted(event) {
    log('On Game Started');
    log(event);
    // Implement as needed.
}

function onGameResult(event) {
    log('On Game Result');
    log(event);
    // Implement as needed.
}

module.exports = {
    bootStrap,
    onGameEnded,
    onGameResult,
    onGameStarted,
    onMapUpdated,
    onSnakeDied,
    onTournamentEnded
};
