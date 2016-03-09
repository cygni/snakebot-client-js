function Food(x, y) {

  var type        = 'Food';
  var x           = x;
  var y           = y;

  var toString = function(){
    return '<Type:' + type + ', x:' + x + ', y:' + y + '>';
  };

  function getX(){
    return x;
  }

  function getY(){
    return y;
  }

  function getCoords(){
   return {x:x, y:y}
  }

  var marshall = function(){
    return {
      type : type,
      x : x,
      y : y
    };
  };

  return Object.freeze({
    getX : getX,
    getY : getY,
    getCoords : getCoords,
    marshall : marshall,
    toString : toString,
    type: type
  });

};

function create(data){
  return Food(
    data.x,
    data.y
  );
};

exports.new = Food;
exports.create = create;
exports.type = Food().type;