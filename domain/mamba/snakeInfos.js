function SnakeInfos(name, points, positions, id) {
    const type = 'SnakeInfos';
    var name = name;
    var points = points;
    var positions = positions;
    var id = id;

    const toString = function () {
        return `<Type:${type}, name:${name
        }, points:${points}, positions:${positions}, id:${id}>`;
    };

    function getName() {
        return name;
    }

    function getPoints() {
        return points;
    }

    function getPositions() {
        return positions;
    }

    function getId() {
        return id;
    }

    function getLength() {
        return positions.length;
    }

    function isAlive() {
        return positions.length > 0;
    }

    const marshall = function () {
        return {
            type,
            name,
            points: JSON.stringify(points),
            positions: JSON.stringify(positions),
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
