/**
 * SnakeInfos
 *
 * @param {string} name The name of the snake.
 * @param {number} points The score of the snake.
 * @param {positions}  positions The positions of the snake.
 * @param {string} id Id of the snake.
 * @returns {object}
 * @constructor
 */
function SnakeInfos(name, points, positions, id) {
    const type = 'SnakeInfos';
    let _name = name;
    let _points = points;
    let _positions = positions;
    let _id = id;

    const toString = function () {
        return `<Type:${type}, name:${name
        }, points:${points}, positions:${positions}, id:${id}>`;
    };

    /**
     * Get snake name.
     *
     * @return {string} Snake name.
     */
    function getName() {
        return _name;
    }

    /**
     * Get the score of the snake.
     *
     * @return {number} Snake score.
     */
    function getPoints() {
        return _points;
    }

    /**
     * Get the positions of the snake.
     *
     * @return {array<number>} The positions of the snake. This array is ordered
     * in the direction that the snake is moving. The head is on index 0 and
     * the tail is the last item..
     */
    function getPositions() {
        return _positions;
    }

    /**
     * Get the id of the snake.
     *
     * @return {string} Snake id.
     */
    function getId() {
        return _id;
    }

    /**
     * Get the length of the snake.
     *
     * @return {number} Snake length.
     */
    function getLength() {
        return _positions.length;
    }

    /**
     * Check if the snake is alive.
     *
     * @return {boolean} True if the snake is alive.
     */
    function isAlive() {
        return _positions.length > 0;
    }

    const marshall = function () {
        return {
            type,
            name: _name,
            points: JSON.stringify(_points),
            positions: JSON.stringify(_positions),
            id
        };
    };

    return Object.freeze({
        getName,
        getPoints,
        getPositions,
        getId,
        isAlive,
        getLength,
        marshall,
        toString,
        type
    });
}

function create(data) {
    return SnakeInfos(
        data.name,
        data.points,
        data.positions,
        data.id
    );
}

exports.new = SnakeInfos;
exports.create = create;
exports.type = SnakeInfos().type;
