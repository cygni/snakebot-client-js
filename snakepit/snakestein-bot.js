/**
 * Snake Bot script.
 */
const MapUtils = require('../domain/mapUtils.js');

let log = null; // Injected logger

const directionMovementDeltas = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 }
};
let lastDirection = 'DOWN';

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
    const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    let possibleDirections = directions.filter(dir => MapUtils.canSnakeMoveInDirection(dir, myCoords, map));
    possibleDirections = possibleDirections.sort(dir => {
        if(MapUtils.getTileInDirection(dir, myCoords, map).content == 'food') {
            return -1;
        }

        if(direction == lastDirection) {
            return 0;
        }

        return 1;
    });

    let bestDirection = direction;
    let bestDirectionScore = 0;
    let foundDirection = false;

    for(const key in possibleDirections) {
        direction = possibleDirections[key];

        const delta = directionMovementDeltas[possibleDirections[key].toLocaleLowerCase()];
        log(delta);

        const newPos = {
            x: myCoords.x,
            y: myCoords.y
        };

        newPos.x = newPos.x + delta.x;
        newPos.y = newPos.y + delta.y;

        if(bestDirectionScore == 0)
        {
            bestDirectionScore = 1;
            bestDirection = direction;
        }

        if(MapUtils.canSnakeMoveInDirection(direction, newPos, map)) {
            newPos.x = newPos.x + delta.x;
            newPos.y = newPos.y + delta.y;

            if(bestDirectionScore == 1)
            {
                bestDirectionScore = 2;
                bestDirection = direction;
            }

            if(MapUtils.canSnakeMoveInDirection(direction, newPos, map)) {
                foundDirection = true;
                break;
            }
        }
    }

    if(foundDirection == false) {
        direction = bestDirection;
    }

    lastDirection = direction;

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
    // Implement as needed.
}

function onTournamentEnded(event) {
    // Implement as needed.
}

function onSnakeDied(event) {
    // Implement as needed.
}

function onGameStarted(event) {
    // Implement as needed.
}

function onGameResult(event) {
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
