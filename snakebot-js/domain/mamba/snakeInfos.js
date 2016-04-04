function SnakeInfos(name, points, positions, id) {

  var type        = 'SnakeInfos';
  var name        = name;
  var points      = points;
  var positions   = positions;
  var id          = id;

  var toString = function(){
    return '<Type:' + type + ', name:' + name +
      ', points:' + points + ', positions:' + positions + ', id:' + id + '>';
  };

  function getName(){
   return name;
  }

  function getPoints(){
   return points;
  }

  function getPositions(){
   return positions;
  }

  function getId(){
   return id;
  }

  function getLength(){
    return positions.length;
  }

  function isAlive(){
    return positions.length > 0;
  }

  var marshall = function(){
    return {
      type : type,
      name : name,
      points : points,
      positions : positions,
      id : id
    };
  };

  return Object.freeze({
    getName           : getName,
    getPoints         : getPoints,
    getPositions      : getPositions,
    getId             : getId,
    isAlive           : isAlive,
    getLength         : getLength,
    marshall          : marshall,
    toString          : toString,
    type              : type
  });

};

function create(data){
  return SnakeInfos(
    data.name,
    data.points,
    data.positions,
    data.id);
};

exports.new = SnakeInfos;
exports.create = create;
exports.type = SnakeInfos().type;