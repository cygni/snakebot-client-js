/**
 * Snake Bot script.
 */
const MapUtils = require('../domain/mapUtils.js');
const _ = require('lodash');

let log = null; // Injected logger

function onMapUpdated(mapState, myUserId) {
    const map = mapState.getMap();
    const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const snakeBrainDump = {}; // Optional debug information about the snakes current state of mind.

    // 1. Where's what etc.
    const myCoords = MapUtils.getSnakePosition(myUserId, map);
    log('I am here:', myCoords);
    snakeBrainDump.myCoords = myCoords;

    const dirScores = directions.map((d) => {
        let score = 0;

        const c = { ...myCoords };
        let delta = MapUtils.dirDeltas[d.toLowerCase()];

        c.x += delta.x;
        c.y += delta.y;
        while (MapUtils.isTileAvailableForMovementTo(c, map)) {
            score += 1;

            delta = MapUtils.dirDeltas[d.toLowerCase()];
            const d1 = {
                x: delta.y,
                y: delta.x
            };
            const d2 = {
                x: -delta.y,
                y: -delta.x
            };

            const c1 = {
                ...c
            };
            const c2 = {
                ...c
            };

            let steps = 0;
            while (MapUtils.isTileAvailableForMovementTo(c1, map) && steps < 50) {
                steps += 1;
                score += 1;
                c1.x += d1.x;
                c1.y += d1.y;
            }

            steps = 0;
            while (MapUtils.isTileAvailableForMovementTo(c2, map) && steps < 50) {
                steps += 1;
                score += 1;
                c2.x += d2.x;
                c2.y += d2.y;
            }

            c.x += delta.x;
            c.y += delta.y;
        }

        return { score, dir: d };
    });

    log(dirScores);
    log(_.sortBy(dirScores, 'score'));

    log('tick');
    log(mapState.getGameTick());

    const final = _.sortBy(_.map(dirScores, (ds) => {
        ds.score = MapUtils.getTileInDirection(ds.dir, myCoords, map).content === 'food' ? Math.max(2, ds.score * 0.9) : ds.score;
        return ds;
    }), 'score')[3].dir;

    // 2. Do some nifty planning...
    // (Tip: see MapUtils for some off-the-shelf navigation aid.
    const finalDir = [final, ...directions].find(d => MapUtils.canSnakeMoveInDirection(d, myCoords, map));

    // 3. Then shake that snake!
    const direction = finalDir || 'DOWN';
    log(direction);
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
