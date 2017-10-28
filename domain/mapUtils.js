
const directionMovementDeltas = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 }
};

/**
 * Calculates the Manhattan (or cab/grid) distance from point a to point b.
 * Note that Manhattan distance will not walk diagonally.
 * @param {coordinate} startCoord
 * @param {coordinate} goalCoord
 * @return {number} Distance in map units
 */
function getManhattanDistance(startCoord, goalCoord) {
    const x = Math.abs(startCoord.x - goalCoord.x);
    const y = Math.abs(startCoord.y - goalCoord.y);
    return x + y;
}

/**
 * Calculates the euclidian distance from point a to point b.
 * Note that eculidan distance will walk diagonally.
 * @param {coordinate} startCoord
 * @param {coordinate} goalCoord
 * @return {number} Distance in map units
 */
function getEuclidianDistance(startCoord, goalCoord) {
    const xd = Math.abs(startCoord.x - goalCoord.x);
    const yd = Math.abs(startCoord.y - goalCoord.y);
    return Math.floor(Math.sqrt(xd * xd + yd * yd));
}

/**
 * Find where the head of the snake is on the map.
 * @param playerId the snakes player id
 * @param map the map
 * @return {x: (Number), y: (Number), alive: (Boolean)}
 *          If the snake is dead, then x and y is coerced to 0.
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
 * @param {string} playerId the snakes player id
 * @param map the map
 * @return {number} The length of the snake
 */
function getSnakeLength(playerId, map) {
    const snake = map.getSnakeInfoForId(playerId);
    return snake.getLength();
}

/**
 * Get the length of the snake with a specific id.
 * @param coordinate the coordinate to check {x: (Number), y: (Number)}
 * @param map the map
 * @return [Boolean]
 */
function isCoordinateOutOfBounds(coordinate, map) {
    return coordinate.x < 0 ||
        coordinate.y < 0 ||
        coordinate.x > map.getWidth() - 1 ||
        coordinate.y > map.getHeight() - 1;
}

/**
 * Get the tile content at the given coordinate [food | obstacle | snakehead | snakebody | snaketail | outofbounds].
 * @param coords the coordinate
 * @param map the map
 * @returns {{content: String}} or null
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
 * Get all occupied map tiles and the content [food | obstacle | snakehead | snakebody]
 * @param {map} map the map
 * @returns {...{content: {string}}} Object of occupied tiles where the tile position is the key
 */
function getOccupiedMapTiles(map) {
    const tiles = {};
    map.getFoodPositions().map((pos) => { tiles[pos] = { content: 'food' }; });
    map.getObstaclePositions().map((pos) => { tiles[pos] = { content: 'obstacle' }; });
    map.getSnakeInfos().map((snakeInfo) => {
        snakeInfo.getPositions().map((pos, index) => {
            tiles[pos] = {
                content: index == 0 ? 'snakehead' :
                    index == snakeInfo.getLength() - 1 ? 'snaketail' :
                    'snakebody'
            };
        });
    });
    return tiles;
}

/**
 * Get all food on the map sorted by distance to the coordinate.
 * @param coords the coordinate
 * @param map the map
 * @returns {Array} of food coordinates
 */
function listCoordinatesContainingFood(coordinate, map) {
    return sortByClosestTo(
        positionsToCoords(map.getFoodPositions(), map.getWidth()),
        coordinate
    );
}

/**
 * Get all obstacles on the map sorted by distance to the coordinate.
 * @param coords the coordinate
 * @param map the map
 * @returns {Array} of food coordinates
 */
function listCoordinatesContainingObstacle(coordinate, map) {
    return sortByClosestTo(
        positionsToCoords(map.getObstaclePositions(), map.getWidth()),
        coordinate
    );
}


/**
 * Get the coordinates of all snakes.
 * Note: You probably want to filter out your own snake.
 * @param map
 * @returns {Array} of {x: (number), y: (number)} coordinates
 */
function getSnakesCoordinates(map, excludeIds) {
    const snakeInfos = map.getSnakeInfos();
    const snakeCoords = [];
    snakeInfos.forEach((snakeInfo) => {
        if (!excludeIds || excludeIds.indexOf(snakeInfo.getId()) == -1) {
            const coords = positionsToCoords(snakeInfo.getPositions(), map.getWidth());
            snakeCoords[snakeInfo.getId()] = coords;
        }
    });
    return snakeCoords;
}

/**
 * Get the coordinates of a specific snake.
 * @param map
 * @returns {Array} of {x: (number), y: (number)} coordinates
 */

function getSnakeCoordinates(playerId, map) {
    const snake = map.getSnakeInfoForId(playerId);

    return snake.getPositions();
}

/**
 * Sorts the items in the array from closest to farthest
 * in relation to the given coordinate using Manhattan distance.
 * @param items the items (must expose ::getX() and ::getY();
 * @param coords
 * @returns {Array} the ordered array with the closest item at the end.
 */
function sortByClosestTo(items, coords) {
    const distanceItem = [];
    items.forEach((item) => {
        distanceItem.push({
            d: getManhattanDistance(coords, { x: item.x, y: item.y }),
            item
        });
    });
    distanceItem.sort((a, b) => b.d - a.d);
    return distanceItem.map(di => di.item);
}

/**
 * Check if the coordinate is within a square, ne.x|y, sw.x|y.
 * @param coord     coordinate to check
 * @param neCoords  north east coordinate
 * @param swCoords  south west coordinate
 * @returns {boolean} true if within
 */
function isWithinSquare(coord, neCoords, swCoords) {
    return coord.x < neCoords.x || coord.x > swCoords.x || coord.y < swCoords.y || coord.y > neCoords.y;
}

/**
 * Converts an array of positions to an array of coordinates.
 * @param points the positions to convert
 * @param mapWidth the width of the map
 * @returns {{x: (Number), y: (Number)}}
 */
function positionsToCoords(positions, mapWidth) {
    return positions.map(pos => translatePosition(pos, mapWidth));
}

/**
 * Converts a position in the flattened single array representation
 * of the Map to a MapCoordinate.
 *
 * @param position
 * @return
 */
function translatePosition(position, mapWidth) {
    const y = Math.floor(position / mapWidth);
    const x = Math.abs(position - y * mapWidth);
    return { x, y };
}

/**
 * Converts an array of positions in the flattened single array representation
 * of the Map to an array of coordinates { x: number, y: number}.
 *
 * @param positions
 * @param map
 * @return [{ x: number, y: number }, { x: number, y: number}]
 */
function translatePositions(positions, map) {
    return positions.map(p => translatePosition(p, map.width));
}


/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param coordinate
 * @param mapWidth
 * @return
 */
function translateCoordinate(coords, mapWidth) {
    return coords.x + coords.y * mapWidth;
}

/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param coordinates
 * @param map
 * @return []
 */
function translateCoordinates(coordinates, mapWidth) {
    return coordinates.map(c => translateCoordinate(c, mapWidth));
}

/**
 * Converts a MapCoordinate to the same position in the flattened
 * single array representation of the Map.
 *
 * @param direction
 * @param direction ['UP' | 'DOWN' | 'LEFT' | 'RIGHT']
 * @param snakeHeadPosition
 * @param map
 * @return boolean
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
 * @param direction
 * @param direction ['UP' | 'DOWN' | 'LEFT' | 'RIGHT']
 * @param snakeHeadPosition
 * @param map
 * @return boolean
 */
function getTileInDirection(direction, snakeHeadPosition, map) {
    const directionMovementDelta = directionMovementDeltas[direction.toLocaleLowerCase()];

    if (!directionMovementDelta) {
        throw new Error(`Unknown movement direction: ${direction}`);
    }

    return getTileAt({
        x: snakeHeadPosition.x + directionMovementDelta.x,
        y: snakeHeadPosition.y + directionMovementDelta.y
    }, map);
}

/**
 * Checks if the snake will die when moving in the direction in question
 *
 * @param {string} direction [ 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' ]
 * @param {coordinate} snakeHeadPosition The position of the snakes head. { x: (number), y: (number) }
 * @param {map} map The game map
 * @returns {boolean}
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
