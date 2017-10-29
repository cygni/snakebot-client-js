/**
 * Tile: { content: string }
 *
 * @typedef {object} tile
 * @property {string} content The contents of the tile.
 */

/**
 * Coordinate: { x: number, y: number }
 *
 * @typedef {object} coordinate
 * @property {number} x The X Coordinate.
 * @property {number} y The Y Coordinate.
 */

/**
 * Snake head coordinate: { x: number, y: number, alive: boolean }
 *
 * @typedef {object} snakeheadcoordinate
 * @property {number} x The X Coordinate.
 * @property {number} y The Y Coordinate.
 * @property {boolean} alive True if snake is alive.
 */

const directionMovementDeltas = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 }
};

/** S
 * Calculates the Manhattan (or cab/grid) distance from point a to point b.
 * Note that Manhattan distance will not walk diagonally.
 *
 * @param {coordinate} startCoord Start coordinate.
 * @param {coordinate} goalCoord Goal coordinate.
 * @return {number} Distance in map units.
 */
function getManhattanDistance(startCoord, goalCoord) {
    const x = Math.abs(startCoord.x - goalCoord.x);
    const y = Math.abs(startCoord.y - goalCoord.y);

    return x + y;
}

/**
 * Calculates the euclidian distance from point a to point b.
 * Note that eculidan distance will walk diagonally.
 *
 * @param {coordinate} startCoord Start coordinate.
 * @param {coordinate} goalCoord Goal coordinate.
 * @return {number} Distance in map units.
 */
function getEuclidianDistance(startCoord, goalCoord) {
    const xd = Math.abs(startCoord.x - goalCoord.x);
    const yd = Math.abs(startCoord.y - goalCoord.y);

    return Math.sqrt((xd * xd) + (yd * yd));
}

/**
 * Converts a position in the flattened single array representation
 * of the Map to a MapCoordinate.
 *
 * @param {number} position The position to convert.
 * @param {number} mapWidth The width of the map.
 * @returns {coordinate} Coordinate of the position.
 */
function translatePosition(position, mapWidth) {
    const y = Math.floor(position / mapWidth);
    const x = Math.abs(position - (y * mapWidth));

    return { x, y };
}

/**
 * Converts an array of positions in the flattened single array representation
 * of the Map to an array of coordinates { x: number, y: number}.
 *
 * @param {array<number>} positions The positions to translate
 * @param {GameMap} map The game map.
 * @return {array<coordinate>} Array of coordinates
 */
function translatePositions(positions, mapWidth) {
    return positions.map(p => translatePosition(p, mapWidth));
}


/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param {coordinate} coordinate Coordinate to translate.
 * @param {number} mapWidth The width of the game map.
 * @return {number} Flattened single array position.
 */
function translateCoordinate(coordinate, mapWidth) {
    return coordinate.x + (coordinate.y * mapWidth);
}

/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param {array<coordinate>} coordinates Array of coordinates to translate.
 * @param {GameMap} map The game map.
 * @return {array<number>} Array of flattened single array positions.
 */
function translateCoordinates(coordinates, mapWidth) {
    return coordinates.map(c => translateCoordinate(c, mapWidth));
}

/**
 * Find where the head of the snake is on the map.
 *
 * @param {string} playerId The snakes player id.
 * @param {GameMap} map The game map.
 * @return {snakeheadcoordinate} If the snake is dead, then x and y is set to 0.
 */
function getSnakePosition(playerId, map) {
    const snake = map.getSnakeInfoForId(playerId);

    if (snake.isAlive()) {
        const pos = translatePosition(snake.getPositions()[0], map.getWidth());
        return { x: pos.x, y: pos.y, alive: snake.isAlive() };
    }

    return { x: 0, y: 0, alive: false };
}

/**
 * Get the length of the snake with a specific id.
 *
 * @param {string} playerId The snakes player id.
 * @param {GameMap} map The game map.
 * @return {number} The length of the snake.
 */
function getSnakeLength(playerId, map) {
    const snake = map.getSnakeInfoForId(playerId);
    return snake.getLength();
}

/**
 * Check if a coordinate is outside of the game map.
 *
 * @param {coordinate} coordinate The coordinate to check.
 * @param map The game map.
 * @return {boolean} True if coordinate is out of bounds.
 */
function isCoordinateOutOfBounds(coordinate, map) {
    return coordinate.x < 0 ||
        coordinate.y < 0 ||
        coordinate.x > map.getWidth() - 1 ||
        coordinate.y > map.getHeight() - 1;
}

/**
 * Get all occupied map tiles and the content
 * [ food | obstacle | snakehead | snakebody | snaketail ]
 *
 * @param {GameMap} map The game map.
 * @return {object} tiles Object of occupied tiles where the tile position is
 * the key.
 * @return {tile} tiles.POSITION the tile at position.
 */
function getOccupiedMapTiles(map) {
    const tiles = {};
    map.getFoodPositions().map(pos => tiles[pos] = { content: 'food' });
    map.getObstaclePositions().map(pos => tiles[pos] = { content: 'obstacle' });

    map.getSnakeInfos().map(snakeInfo =>
        snakeInfo.getPositions().map((pos, index) => {
            let content = 'snakebody';

            if (index === 0) {
                content = 'snakehead';
            } else if (index === snakeInfo.getLength() - 1) {
                content = 'snaketail';
            }

            tiles[pos] = {
                content
            };

            return content;
        }));

    return tiles;
}

/**
 * Get the tile content at the given coordinate
 * [food | obstacle | snakehead | snakebody | snaketail | outofbounds].
 *
 * @param {coordinate} coordinate The coordinate of the tile to retrieve.
 * @param {GameMap} map The game map.
 * @return {tile} The tile in question.
 */
function getTileAt(coordinate, map) {
    if (isCoordinateOutOfBounds(coordinate, map)) {
        return { content: 'outofbounds' };
    }

    const point = translateCoordinate(coordinate, map.getWidth());
    const tile = getOccupiedMapTiles(map)[point];

    return tile !== undefined ? tile : { content: '' };
}

/**
 * Converts an array of positions to an array of coordinates.
 *
 * @param {array<number>} positions The positions to convert.
 * @param {number} mapWidth The width of the map.
 * @returns {array<coordinate>} Array of coordinates.
 */
function positionsToCoords(positions, mapWidth) {
    return positions.map(pos => translatePosition(pos, mapWidth));
}

/**
 * Sorts the items in the array from closest to farthest
 * in relation to the given coordinate using Manhattan distance.
 *
 * @param {object} items the items (must expose ::getX() and ::getY();
 * @param {coordinate} coordinate The coordinate used as a reference.
 * @returns {array<item>} The ordered array with the closest item at the end.
 */
function sortByClosestTo(items, coordinate) {
    const distanceItems = [];

    items.forEach((item) => {
        distanceItems.push({
            d: getManhattanDistance(coordinate, item),
            item
        });
    });

    distanceItems.sort((a, b) => a.d - b.d);

    return distanceItems.map(di => di.item);
}

/**
 * Get all food on the map sorted by distance to the coordinate.
 *
 * @param {coordinate} coordinate The coordinate.
 * @param {GameMap} map The game map.
 * @return {array<coordinate>} Array of food coordinates.
 */
function listCoordinatesContainingFood(coordinate, map) {
    return sortByClosestTo(
        positionsToCoords(map.getFoodPositions(), map.getWidth()),
        coordinate
    );
}

/**
 * Get all obstacles on the map sorted by distance to the coordinate.
 *
 * @param {coordinate} coordinate the coordinate.
 * @param {GameMap} map The game map.
 * @return {array<coordinate>} Array of obstacle coordinates.
 */
function listCoordinatesContainingObstacle(coordinate, map) {
    return sortByClosestTo(
        positionsToCoords(map.getObstaclePositions(), map.getWidth()),
        coordinate
    );
}

/**
 * Get the coordinates of a specific snake.
 *
 * @param {string} playerId The snake to retrieve.
 * @param {GameMap} map The game map.
 * @return {array<coordinate>} The coordinates of the snake in question.
 */

function getSnakeCoordinates(playerId, map) {
    const snake = map.getSnakeInfoForId(playerId);

    return positionsToCoords(snake.getPositions(), map.getWidth());
}

/**
 * Get the coordinates of all snakes.
 * Note: You probably want to filter out your own snake.
 *
 * @param {GameMap} map The game map.
 * @param {array<string>} excludeIds Snake ids to exclude.
 * @returns {object} snakeCoordinates Snake coordinates indexed by playerId.
 * @return {array<coordinate>} snakeCoordinates.playerId The coordinates of the
 * snake in question.
 */
function getSnakesCoordinates(map, excludeIds) {
    const snakeInfos = map.getSnakeInfos();
    const snakeCoords = {};

    snakeInfos.forEach((snakeInfo) => {
        const snakeId = snakeInfo.getId();

        if (!excludeIds || excludeIds.includes(snakeId) === false) {
            snakeCoords[snakeId] = getSnakeCoordinates(snakeId, map);
        }
    });

    return snakeCoords;
}

/**
 * Check if the coordinate is within a square, ne.x|y, sw.x|y.
 *
 * @param {coordinate} coordinate The coordinate to check.
 * @param {coordinate} nwCoordinate North west coordinate.
 * @param {coordinate} seCoordinate South east coordinate.
 * @returns {boolean} True if within.
 */
function isWithinSquare(coordinate, nwCoordinate, seCoordinate) {
    return coordinate.x >= nwCoordinate.x &&
        coordinate.y >= nwCoordinate.y &&
    coordinate.x <= seCoordinate.x &&
        coordinate.y <= seCoordinate.y;
}

/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param {coordinate} coordinate The coordinate.
 * @param {GameMap} map The game map.
 * @return {boolean} True if movement to the coordinate in question does not
 * result in death.
 */
function isTileAvailableForMovementTo(coordinate, map) {
    const tile = getTileAt(coordinate, map);

    return tile.content !== 'outofbounds' &&
        tile.content !== 'snakehead' &&
        tile.content !== 'snakebody' &&
        tile.content !== 'obstacle';
}

/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param {('UP'|'DOWN'|'LEFT'|'RIGHT')} direction The direction to check.
 * @param {coordinate} snakeHeadPosition The position of the snakes head.
 * @param {GameMap} map The game map.
 * @return {tile} Tile in the selected direction related to the snakes head.
 */
function getTileInDirection(direction, snakeHeadPosition, map) {
    const delta = directionMovementDeltas[direction.toLocaleLowerCase()];

    if (!delta) {
        throw new Error(`Unknown movement direction: ${direction}`);
    }

    return getTileAt({
        x: snakeHeadPosition.x + delta.x,
        y: snakeHeadPosition.y + delta.y
    }, map);
}

/**
 * Checks if the snake will die when moving in the direction in question
 *
 * @param {('UP'|'DOWN'|'LEFT'|'RIGHT')} direction The direction to check.
 * @param {coordinate} snakeHeadPosition The position of the snakes head.
 * @param {GameMap} map The game map.
 * @returns {boolean} True if movement will not result in death.
 */
function canIMoveInDirection(direction, snakeHeadPosition, map) {
    const tile = getTileInDirection(direction, snakeHeadPosition, map);

    return tile.content !== 'outofbounds' &&
        tile.content !== 'snakehead' &&
        tile.content !== 'snakebody' &&
        tile.content !== 'obstacle';
}

exports.canIMoveInDirection = canIMoveInDirection;
exports.getEuclidianDistance = getEuclidianDistance;
exports.getManhattanDistance = getManhattanDistance;
exports.getOccupiedMapTiles = getOccupiedMapTiles;
exports.getSnakeCoordinates = getSnakeCoordinates;
exports.getSnakeLength = getSnakeLength;
exports.getSnakePosition = getSnakePosition;
exports.getSnakesCoordinates = getSnakesCoordinates;
exports.getTileAt = getTileAt;
exports.getTileInDirection = getTileInDirection;
exports.isCoordinateOutOfBounds = isCoordinateOutOfBounds;
exports.isTileAvailableForMovementTo = isTileAvailableForMovementTo;
exports.isWithinSquare = isWithinSquare;
exports.listCoordinatesContainingFood = listCoordinatesContainingFood;
exports.listCoordinatesContainingObstacle = listCoordinatesContainingObstacle;
exports.positionsToCoords = positionsToCoords;
exports.sortByClosestTo = sortByClosestTo;
exports.translateCoordinate = translateCoordinate;
exports.translateCoordinates = translateCoordinates;
exports.translatePosition = translatePosition;
exports.translatePositions = translatePositions;
