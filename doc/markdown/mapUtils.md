# Global





* * *

### getManhattanDistance(startCoord, goalCoord) 

Calculates the Manhattan (or cab/grid) distance from point a to point b.
Note that Manhattan distance will not walk diagonally.

**Parameters**

**startCoord**: `coordinate`, Calculates the Manhattan (or cab/grid) distance from point a to point b.
Note that Manhattan distance will not walk diagonally.

**goalCoord**: `coordinate`, Calculates the Manhattan (or cab/grid) distance from point a to point b.
Note that Manhattan distance will not walk diagonally.

**Returns**: `number`, Distance in map units


### getEuclidianDistance(startCoord, goalCoord) 

Calculates the euclidian distance from point a to point b.
Note that eculidan distance will walk diagonally.

**Parameters**

**startCoord**: `coordinate`, Calculates the euclidian distance from point a to point b.
Note that eculidan distance will walk diagonally.

**goalCoord**: `coordinate`, Calculates the euclidian distance from point a to point b.
Note that eculidan distance will walk diagonally.

**Returns**: `number`, Distance in map units


### getSnakePosition(playerId, map) 

Find where the head of the snake is on the map.

**Parameters**

**playerId**: , the snakes player id

**map**: , the map

**Returns**: `object`, If the snake is dead, then x and y is coerced to 0.


### getSnakeLength(playerId, map) 

Get the length of the snake with a specific id.

**Parameters**

**playerId**: `string`, the snakes player id

**map**: , the map

**Returns**: `number`, The length of the snake


### isCoordinateOutOfBounds(coordinate, map) 

Get the length of the snake with a specific id.

**Parameters**

**coordinate**: `coordinate`, the coordinate to check {x: {number}, y: {number}}

**map**: , the map

**Returns**: `boolean`


### getTileAt(coords, map) 

Get the tile content at the given coordinate [food | obstacle | snakehead | snakebody | snaketail | outofbounds].

**Parameters**

**coords**: , the coordinate

**map**: , the map

**Returns**: `object`, or null


### getOccupiedMapTiles(map) 

Get all occupied map tiles and the content [food | obstacle | snakehead | snakebody]

**Parameters**

**map**: `map`, the map

**Returns**: `Object`, Object of occupied tiles where the tile position is the key


### listCoordinatesContainingFood(coords, map) 

Get all food on the map sorted by distance to the coordinate.

**Parameters**

**coords**: , the coordinate

**map**: , the map

**Returns**: `Array`, of food coordinates


### listCoordinatesContainingObstacle(coords, map) 

Get all obstacles on the map sorted by distance to the coordinate.

**Parameters**

**coords**: , the coordinate

**map**: , the map

**Returns**: `Array`, of food coordinates


### getSnakesCoordinates(map) 

Get the coordinates of all snakes.
Note: You probably want to filter out your own snake.

**Parameters**

**map**: , Get the coordinates of all snakes.
Note: You probably want to filter out your own snake.

**Returns**: `Array`, of {x: (number), y: (number)} coordinates


### getSnakeCoordinates(map) 

Get the coordinates of a specific snake.

**Parameters**

**map**: , Get the coordinates of a specific snake.

**Returns**: `Array`, of {x: (number), y: (number)} coordinates


### sortByClosestTo(items, coords) 

Sorts the items in the array from closest to farthest
in relation to the given coordinate using Manhattan distance.

**Parameters**

**items**: , the items (must expose ::getX() and ::getY();

**coords**: , Sorts the items in the array from closest to farthest
in relation to the given coordinate using Manhattan distance.

**Returns**: `Array`, the ordered array with the closest item at the end.


### isWithinSquare(coord, neCoords, swCoords) 

Check if the coordinate is within a square, ne.x|y, sw.x|y.

**Parameters**

**coord**: , coordinate to check

**neCoords**: , north east coordinate

**swCoords**: , south west coordinate

**Returns**: `boolean`, true if within


### positionsToCoords(points, mapWidth) 

Converts an array of positions to an array of coordinates.

**Parameters**

**points**: , the positions to convert

**mapWidth**: , the width of the map

**Returns**: `Object`


### translatePosition(position) 

Converts a position in the flattened single array representation
of the Map to a MapCoordinate.

**Parameters**

**position**: , Converts a position in the flattened single array representation
of the Map to a MapCoordinate.

**Returns**: , [...Object]


### translatePositions(positions, map) 

Converts an array of positions in the flattened single array representation
of the Map to an array of coordinates { x: number, y: number}.

**Parameters**

**positions**: , Converts an array of positions in the flattened single array representation
of the Map to an array of coordinates { x: number, y: number}.

**map**: , Converts an array of positions in the flattened single array representation
of the Map to an array of coordinates { x: number, y: number}.

**Returns**: , [...Object]


### translateCoordinate(coordinate, mapWidth) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**coordinate**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**mapWidth**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Returns**: , [...Object]


### translateCoordinates(coordinates, map) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**coordinates**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**map**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Returns**: , []


### isTileAvailableForMovementTo(direction, direction, snakeHeadPosition, map) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**direction**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**direction**: , ['UP' | 'DOWN' | 'LEFT' | 'RIGHT']

**snakeHeadPosition**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**map**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Returns**: `boolean`


### getTileInDirection(direction, direction, snakeHeadPosition, map) 

Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Parameters**

**direction**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**direction**: , ['UP' | 'DOWN' | 'LEFT' | 'RIGHT']

**snakeHeadPosition**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**map**: , Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Returns**: `boolean`


### canIMoveInDirection(direction, snakeHeadPosition, map) 

Checks if the snake will die when moving in the direction in question

**Parameters**

**direction**: `string`, [ 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' ]

**snakeHeadPosition**: `coordinate`, The position of the snakes head. { x: (number), y: (number) }

**map**: `map`, The game map

**Returns**: `boolean`



* * *










