# MapUtils

MapUtils.



* * *

### MapUtils.getManhattanDistance(startCoord, goalCoord) 

Calculates the Manhattan (or cab/grid) distance from point a to point b.
Note that Manhattan distance will not walk diagonally.

**Parameters**

**startCoord**: `coordinate`, Start coordinate.

**goalCoord**: `coordinate`, Goal coordinate.

**Returns**: `number`, Distance in map units.


### MapUtils.getEuclidianDistance(startCoord, goalCoord) 

Calculates the euclidian distance from point a to point b.
Note that eculidan distance will walk diagonally.

**Parameters**

**startCoord**: `coordinate`, Start coordinate.

**goalCoord**: `coordinate`, Goal coordinate.

**Returns**: `number`, Distance in map units.


### MapUtils.translatePosition(position, mapWidth) 

Converts a position in the flattened single array representation
of the Map to a MapCoordinate.

**Parameters**

**position**: `number`, The position to convert.

**mapWidth**: `number`, The width of the map.

**Returns**: `coordinate`, Coordinate of the position.


### MapUtils.translatePositions(positions, map) 

Converts an array of positions in the flattened single array representation
of the Map to an array of coordinates { x: number, y: number}.

**Parameters**

**positions**: `array.&lt;number&gt;`, The positions to translate

**map**: `GameMap`, The game map.

**Returns**: `array.&lt;coordinate&gt;`, Array of coordinates


### MapUtils.translateCoordinate(coordinate, mapWidth) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**coordinate**: `coordinate`, Coordinate to translate.

**mapWidth**: `number`, The width of the game map.

**Returns**: `number`, Flattened single array position.


### MapUtils.translateCoordinates(coordinates, map) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**coordinates**: `array.&lt;coordinate&gt;`, Array of coordinates to translate.

**map**: `GameMap`, The game map.

**Returns**: `array.&lt;number&gt;`, Array of flattened single array positions.


### MapUtils.getSnakePosition(playerId, map) 

Find where the head of the snake is on the map.

**Parameters**

**playerId**: `string`, The snakes player id.

**map**: `GameMap`, The game map.

**Returns**: `snakeheadcoordinate`, If the snake is dead, then x and y is set to 0.


### MapUtils.getSnakeLength(playerId, map) 

Get the length of the snake with a specific id.

**Parameters**

**playerId**: `string`, The snakes player id.

**map**: `GameMap`, The game map.

**Returns**: `number`, The length of the snake.


### MapUtils.isCoordinateOutOfBounds(coordinate, map) 

Check if a coordinate is outside of the game map.

**Parameters**

**coordinate**: `coordinate`, The coordinate to check.

**map**: , The game map.

**Returns**: `boolean`, True if coordinate is out of bounds.


### MapUtils.getOccupiedMapTiles(map) 

Get all occupied map tiles and the content
[ food | obstacle | snakehead | snakebody | snaketail ]

**Parameters**

**map**: `GameMap`, The game map.

**Returns**: `object`, tiles Object of occupied tiles where the tile position is
the key.
**Returns**: `tile`, tiles.POSITION the tile at position.


### MapUtils.getTileAt(coordinate, map) 

Get the tile content at the given coordinate
[food | obstacle | snakehead | snakebody | snaketail | outofbounds].

**Parameters**

**coordinate**: `coordinate`, The coordinate of the tile to retrieve.

**map**: `GameMap`, The game map.

**Returns**: `tile`, The tile in question.


### MapUtils.positionsToCoords(positions, mapWidth) 

Converts an array of positions to an array of coordinates.

**Parameters**

**positions**: `array.&lt;number&gt;`, The positions to convert.

**mapWidth**: `number`, The width of the map.

**Returns**: `array.&lt;coordinate&gt;`, Array of coordinates.


### MapUtils.sortByClosestTo(items, coordinate) 

Sorts the items in the array from closest to farthest
in relation to the given coordinate using Manhattan distance.

**Parameters**

**items**: `object`, the items (must expose ::getX() and ::getY();

**coordinate**: `coordinate`, The coordinate used as a reference.

**Returns**: `array.&lt;item&gt;`, The ordered array with the closest item at the end.


### MapUtils.listCoordinatesContainingFood(coordinate, map) 

Get all food on the map sorted by distance to the coordinate.

**Parameters**

**coordinate**: `coordinate`, The coordinate.

**map**: `GameMap`, The game map.

**Returns**: `array.&lt;coordinate&gt;`, Array of food coordinates.


### MapUtils.listCoordinatesContainingObstacle(coordinate, map) 

Get all obstacles on the map sorted by distance to the coordinate.

**Parameters**

**coordinate**: `coordinate`, the coordinate.

**map**: `GameMap`, The game map.

**Returns**: `array.&lt;coordinate&gt;`, Array of obstacle coordinates.


### MapUtils.getSnakeCoordinates(playerId, map) 

Get the coordinates of a specific snake.

**Parameters**

**playerId**: `string`, The snake to retrieve.

**map**: `GameMap`, The game map.

**Returns**: `array.&lt;coordinate&gt;`, The coordinates of the snake in question.


### MapUtils.getSnakesCoordinates(map, excludeIds) 

Get the coordinates of all snakes.
Note: You probably want to filter out your own snake.

**Parameters**

**map**: `GameMap`, The game map.

**excludeIds**: `array.&lt;string&gt;`, Snake ids to exclude.

**Returns**: `object`, snakeCoordinates Snake coordinates indexed by playerId.
**Returns**: `array.&lt;coordinate&gt;`, snakeCoordinates.playerId The coordinates of the
snake in question.


### MapUtils.isWithinSquare(coordinate, nwCoordinate, seCoordinate) 

Check if the coordinate is within a square, ne.x|y, sw.x|y.

**Parameters**

**coordinate**: `coordinate`, The coordinate to check.

**nwCoordinate**: `coordinate`, North west coordinate.

**seCoordinate**: `coordinate`, South east coordinate.

**Returns**: `boolean`, True if within.


### MapUtils.isTileAvailableForMovementTo(coordinate, map) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**coordinate**: `coordinate`, The coordinate.

**map**: `GameMap`, The game map.

**Returns**: `boolean`, True if movement to the coordinate in question does not
result in death.


### MapUtils.getTileInDirection(direction, snakeHeadPosition, map) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**direction**: `&#39;UP&#39; | &#39;DOWN&#39; | &#39;LEFT&#39; | &#39;RIGHT&#39;`, The direction to check.

**snakeHeadPosition**: `coordinate`, The position of the snakes head.

**map**: `GameMap`, The game map.

**Returns**: `tile`, Tile in the selected direction related to the snakes head.


### MapUtils.canSnakeMoveInDirection(direction, snakeHeadPosition, map) 

Checks if the snake will die when moving in the direction in question

**Parameters**

**direction**: `&#39;UP&#39; | &#39;DOWN&#39; | &#39;LEFT&#39; | &#39;RIGHT&#39;`, The direction to check.

**snakeHeadPosition**: `coordinate`, The position of the snakes head.

**map**: `GameMap`, The game map.

**Returns**: `boolean`, True if movement will not result in death.



* * *










