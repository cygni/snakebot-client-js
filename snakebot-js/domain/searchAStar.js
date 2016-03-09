function SearchAStar(){

  /**
   * Calculates the path to the goal using the A-star algorithm.
   *
   * @param startCoord      the start coordinate {x: xn, y: yn}
   * @param goalCoord       the goal coordinate {x: xn, y: yn}
   * @param mapWidth        the maps width
   * @param mapHeight       the maps height
   * @param fCalculateCost  the function that calculates the cost (heuristic value) for moving from current node to the goal.
   *                        <h value> = f(<node coordinate>={x: xn, y: yn}, <goal coordinate> = {x: xg, y: yg})
   * @returns the path to the goal as an object array [{coord:{x:11,y:10}, direction:'UP'}}, {...}, ...]
   */
  function findPath(startCoord, goalCoord, mapWidth, mapHeight, fCalculateCost){
    var openList    = [];
    var closedList  = [];
    openList.push(new Node(null, startCoord, 'START', 0, 0, 0));

    while(openList.length > 0){
      var nextNode    = popBestOpenNode(openList);
      var successors  = generateSuccessors(nextNode, mapWidth, mapHeight);
      var goalNode    = checkForGoalState(successors, goalCoord);
      if(!goalNode){
        processSuccessors(successors, goalCoord, fCalculateCost).forEach(function(successor){
          if(openList.some(function(openNode){return openNode.coord.x == successor.coord.x && openNode.coord.y == successor.coord.y && openNode.f <= successor.f})){
            return; // skip successor
          }
          if(closedList.some(function(closedNode){return closedNode.coord.x == successor.coord.x && closedNode.coord.y == successor.coord.y && closedNode.f <= successor.f})){
            return; // skip successor
          }
          openList.push(successor);
        });
        closedList.push(nextNode);
      } else {
        return backTrackPath(goalNode, []); // End state met
      }
    }
  }

  function processSuccessors(successors, goalCoord, fCalculateHCost){
    for(var sIdx = 0; sIdx < successors.length; sIdx++){
      var successor = successors[sIdx];
      successor.g = successor.parent.g + 1;
      successor.h = fCalculateHCost ? fCalculateHCost(successor.coord, goalCoord) : 0;
      successor.f = successor.g + successor.h;
    }
    return successors;
  }

  function generateSuccessors(node, width, height){
    var successorList = [];
    if(node.coord.y - 1 >= 0){
      successorList.push(new Node(node, {x:node.coord.x, y:node.coord.y - 1}, 'UP'));
    }
    if(node.coord.y + 1 < height){
      successorList.push(new Node(node, {x:node.coord.x, y:node.coord.y + 1}, 'DOWN'));
    }
    if(node.coord.x + 1 < width){
      successorList.push(new Node(node, {x:node.coord.x + 1, y:node.coord.y}, 'RIGHT'));
    }
    if(node.coord.x - 1 >= 0){
      successorList.push(new Node(node, {x:node.coord.x - 1, y:node.coord.y}, 'LEFT'));
    }
    return successorList;
  }

  function checkForGoalState(nodes, goalCoord){
    for(var i = 0; i < nodes.length; i++){
      if(nodes[i].coord.x == goalCoord.x && nodes[i].coord.y == goalCoord.y){
        return nodes[i];
      }
    }
    return null;
  }

  function popBestOpenNode(openList){
    var bestNodeIdx = null;
    for(var i=0; i < openList.length; i++){
      if(null == bestNodeIdx){
        bestNodeIdx = i;
      } else if(openList[i].f < openList[bestNodeIdx].f){
        bestNodeIdx = i;
      }
    }
    var node = openList[bestNodeIdx];
    openList.splice(bestNodeIdx, 1);
    return node;
  }

  function backTrackPath(node, path){
    if(node.parent){
      backTrackPath(node.parent, path);
      path.push({coord: node.coord, direction: node.direction});
    }
    return path;
  }

  function Node(parent, coord, direction, f, g, h){
    this.parent     = parent;
    this.coord      = coord;
    this.direction  = direction;
    this.f          = f;
    this.g          = g;
    this.h          = h;
  }

  return Object.freeze({
    findPath : findPath
  });

}

module.exports = SearchAStar;