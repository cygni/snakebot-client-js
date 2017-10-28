## Classes

<dl>
<dt><a href="#Mamba">Mamba</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#Net">Net</a></dt>
<dd><p>Sandbox!
Disregard!</p>
</dd>
<dt><a href="#MapUtils">MapUtils</a></dt>
<dd><p>Snake Bot script.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getManhattanDistance">getManhattanDistance(startCoord, goalCoord)</a> ⇒ <code>number</code></dt>
<dd><p>Calculates the Manhattan (or cab/grid) distance from point a to point b.
Note that Manhattan distance will not walk diagonally.</p>
</dd>
<dt><a href="#getEuclidianDistance">getEuclidianDistance(startCoord, goalCoord)</a> ⇒ <code>number</code></dt>
<dd><p>Calculates the euclidian distance from point a to point b.
Note that eculidan distance will walk diagonally.</p>
</dd>
<dt><a href="#getSnakePosition">getSnakePosition(playerId, map)</a> ⇒ <code>object</code></dt>
<dd><p>Find where the head of the snake is on the map.</p>
</dd>
<dt><a href="#getSnakeLength">getSnakeLength(playerId, map)</a> ⇒ <code>number</code></dt>
<dd><p>Get the length of the snake with a specific id.</p>
</dd>
<dt><a href="#isCoordinateOutOfBounds">isCoordinateOutOfBounds(coordinate, map)</a> ⇒ <code>boolean</code></dt>
<dd><p>Get the length of the snake with a specific id.</p>
</dd>
<dt><a href="#getTileAt">getTileAt(coords, map)</a> ⇒ <code>object</code></dt>
<dd><p>Get the tile content at the given coordinate [food | obstacle | snakehead | snakebody | snaketail | outofbounds].</p>
</dd>
<dt><a href="#getOccupiedMapTiles">getOccupiedMapTiles(map)</a> ⇒ <code>Object</code></dt>
<dd><p>Get all occupied map tiles and the content [food | obstacle | snakehead | snakebody]</p>
</dd>
<dt><a href="#listCoordinatesContainingFood">listCoordinatesContainingFood(coords, map)</a> ⇒ <code>Array</code></dt>
<dd><p>Get all food on the map sorted by distance to the coordinate.</p>
</dd>
<dt><a href="#listCoordinatesContainingObstacle">listCoordinatesContainingObstacle(coords, map)</a> ⇒ <code>Array</code></dt>
<dd><p>Get all obstacles on the map sorted by distance to the coordinate.</p>
</dd>
<dt><a href="#getSnakesCoordinates">getSnakesCoordinates(map)</a> ⇒ <code>Array</code></dt>
<dd><p>Get the coordinates of all snakes.
Note: You probably want to filter out your own snake.</p>
</dd>
<dt><a href="#getSnakeCoordinates">getSnakeCoordinates(map)</a> ⇒ <code>Array</code></dt>
<dd><p>Get the coordinates of a specific snake.</p>
</dd>
<dt><a href="#sortByClosestTo">sortByClosestTo(items, coords)</a> ⇒ <code>Array</code></dt>
<dd><p>Sorts the items in the array from closest to farthest
in relation to the given coordinate using Manhattan distance.</p>
</dd>
<dt><a href="#isWithinSquare">isWithinSquare(coord, neCoords, swCoords)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the coordinate is within a square, ne.x|y, sw.x|y.</p>
</dd>
<dt><a href="#positionsToCoords">positionsToCoords(points, mapWidth)</a> ⇒ <code>Object</code></dt>
<dd><p>Converts an array of positions to an array of coordinates.</p>
</dd>
<dt><a href="#translatePosition">translatePosition(position)</a> ⇒</dt>
<dd><p>Converts a position in the flattened single array representation
of the Map to a MapCoordinate.</p>
</dd>
<dt><a href="#translatePositions">translatePositions(positions, map)</a> ⇒</dt>
<dd><p>Converts an array of positions in the flattened single array representation
of the Map to an array of coordinates { x: number, y: number}.</p>
</dd>
<dt><a href="#translateCoordinate">translateCoordinate(coordinate, mapWidth)</a> ⇒</dt>
<dd><p>Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.</p>
</dd>
<dt><a href="#translateCoordinates">translateCoordinates(coordinates, map)</a> ⇒</dt>
<dd><p>Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.</p>
</dd>
<dt><a href="#isTileAvailableForMovementTo">isTileAvailableForMovementTo(direction, direction, snakeHeadPosition, map)</a> ⇒ <code>boolean</code></dt>
<dd><p>Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.</p>
</dd>
<dt><a href="#getTileInDirection">getTileInDirection(direction, direction, snakeHeadPosition, map)</a> ⇒ <code>boolean</code></dt>
<dd><p>Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.</p>
</dd>
<dt><a href="#canIMoveInDirection">canIMoveInDirection(direction, snakeHeadPosition, map)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if the snake will die when moving in the direction in question</p>
</dd>
</dl>

<a name="Mamba"></a>

## Mamba
**Kind**: global class  
<a name="new_Mamba_new"></a>

### new Mamba(host, port, eventListener, verboseLogging)
The Mamba Client is a Javascript client for the Snake Server.


| Param | Description |
| --- | --- |
| host | the host |
| port | the port |
| eventListener | listener for game events |
| verboseLogging | prints debug information |

<a name="Net"></a>

## Net
Sandbox!
Disregard!

**Kind**: global constant  
<a name="MapUtils"></a>

## MapUtils
Snake Bot script.

**Kind**: global constant  
<a name="getManhattanDistance"></a>

## getManhattanDistance(startCoord, goalCoord) ⇒ <code>number</code>
Calculates the Manhattan (or cab/grid) distance from point a to point b.
Note that Manhattan distance will not walk diagonally.

**Kind**: global function  
**Returns**: <code>number</code> - Distance in map units  

| Param | Type |
| --- | --- |
| startCoord | <code>coordinate</code> | 
| goalCoord | <code>coordinate</code> | 

<a name="getEuclidianDistance"></a>

## getEuclidianDistance(startCoord, goalCoord) ⇒ <code>number</code>
Calculates the euclidian distance from point a to point b.
Note that eculidan distance will walk diagonally.

**Kind**: global function  
**Returns**: <code>number</code> - Distance in map units  

| Param | Type |
| --- | --- |
| startCoord | <code>coordinate</code> | 
| goalCoord | <code>coordinate</code> | 

<a name="getSnakePosition"></a>

## getSnakePosition(playerId, map) ⇒ <code>object</code>
Find where the head of the snake is on the map.

**Kind**: global function  
**Returns**: <code>object</code> - If the snake is dead, then x and y is coerced to 0.  

| Param | Description |
| --- | --- |
| playerId | the snakes player id |
| map | the map |

<a name="getSnakeLength"></a>

## getSnakeLength(playerId, map) ⇒ <code>number</code>
Get the length of the snake with a specific id.

**Kind**: global function  
**Returns**: <code>number</code> - The length of the snake  

| Param | Type | Description |
| --- | --- | --- |
| playerId | <code>string</code> | the snakes player id |
| map |  | the map |

<a name="isCoordinateOutOfBounds"></a>

## isCoordinateOutOfBounds(coordinate, map) ⇒ <code>boolean</code>
Get the length of the snake with a specific id.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| coordinate | <code>coordinate</code> | the coordinate to check {x: {number}, y: {number}} |
| map |  | the map |

<a name="getTileAt"></a>

## getTileAt(coords, map) ⇒ <code>object</code>
Get the tile content at the given coordinate [food | obstacle | snakehead | snakebody | snaketail | outofbounds].

**Kind**: global function  
**Returns**: <code>object</code> - or null  

| Param | Description |
| --- | --- |
| coords | the coordinate |
| map | the map |

<a name="getOccupiedMapTiles"></a>

## getOccupiedMapTiles(map) ⇒ <code>Object</code>
Get all occupied map tiles and the content [food | obstacle | snakehead | snakebody]

**Kind**: global function  
**Returns**: <code>Object</code> - Object of occupied tiles where the tile position is the key  

| Param | Type | Description |
| --- | --- | --- |
| map | <code>map</code> | the map |

<a name="listCoordinatesContainingFood"></a>

## listCoordinatesContainingFood(coords, map) ⇒ <code>Array</code>
Get all food on the map sorted by distance to the coordinate.

**Kind**: global function  
**Returns**: <code>Array</code> - of food coordinates  

| Param | Description |
| --- | --- |
| coords | the coordinate |
| map | the map |

<a name="listCoordinatesContainingObstacle"></a>

## listCoordinatesContainingObstacle(coords, map) ⇒ <code>Array</code>
Get all obstacles on the map sorted by distance to the coordinate.

**Kind**: global function  
**Returns**: <code>Array</code> - of food coordinates  

| Param | Description |
| --- | --- |
| coords | the coordinate |
| map | the map |

<a name="getSnakesCoordinates"></a>

## getSnakesCoordinates(map) ⇒ <code>Array</code>
Get the coordinates of all snakes.
Note: You probably want to filter out your own snake.

**Kind**: global function  
**Returns**: <code>Array</code> - of {x: (number), y: (number)} coordinates  

| Param |
| --- |
| map | 

<a name="getSnakeCoordinates"></a>

## getSnakeCoordinates(map) ⇒ <code>Array</code>
Get the coordinates of a specific snake.

**Kind**: global function  
**Returns**: <code>Array</code> - of {x: (number), y: (number)} coordinates  

| Param |
| --- |
| map | 

<a name="sortByClosestTo"></a>

## sortByClosestTo(items, coords) ⇒ <code>Array</code>
Sorts the items in the array from closest to farthest
in relation to the given coordinate using Manhattan distance.

**Kind**: global function  
**Returns**: <code>Array</code> - the ordered array with the closest item at the end.  

| Param | Description |
| --- | --- |
| items | the items (must expose ::getX() and ::getY(); |
| coords |  |

<a name="isWithinSquare"></a>

## isWithinSquare(coord, neCoords, swCoords) ⇒ <code>boolean</code>
Check if the coordinate is within a square, ne.x|y, sw.x|y.

**Kind**: global function  
**Returns**: <code>boolean</code> - true if within  

| Param | Description |
| --- | --- |
| coord | coordinate to check |
| neCoords | north east coordinate |
| swCoords | south west coordinate |

<a name="positionsToCoords"></a>

## positionsToCoords(points, mapWidth) ⇒ <code>Object</code>
Converts an array of positions to an array of coordinates.

**Kind**: global function  

| Param | Description |
| --- | --- |
| points | the positions to convert |
| mapWidth | the width of the map |

<a name="translatePosition"></a>

## translatePosition(position) ⇒
Converts a position in the flattened single array representation
of the Map to a MapCoordinate.

**Kind**: global function  
**Returns**: [...Object]  

| Param |
| --- |
| position | 

<a name="translatePositions"></a>

## translatePositions(positions, map) ⇒
Converts an array of positions in the flattened single array representation
of the Map to an array of coordinates { x: number, y: number}.

**Kind**: global function  
**Returns**: [...Object]  

| Param |
| --- |
| positions | 
| map | 

<a name="translateCoordinate"></a>

## translateCoordinate(coordinate, mapWidth) ⇒
Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Kind**: global function  
**Returns**: [...Object]  

| Param |
| --- |
| coordinate | 
| mapWidth | 

<a name="translateCoordinates"></a>

## translateCoordinates(coordinates, map) ⇒
Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Kind**: global function  
**Returns**: []  

| Param |
| --- |
| coordinates | 
| map | 

<a name="isTileAvailableForMovementTo"></a>

## isTileAvailableForMovementTo(direction, direction, snakeHeadPosition, map) ⇒ <code>boolean</code>
Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Kind**: global function  

| Param | Description |
| --- | --- |
| direction |  |
| direction | ['UP' | 'DOWN' | 'LEFT' | 'RIGHT'] |
| snakeHeadPosition |  |
| map |  |

<a name="getTileInDirection"></a>

## getTileInDirection(direction, direction, snakeHeadPosition, map) ⇒ <code>boolean</code>
Converts a MapCoordinate to the same position in the flattened
single array representation of the Map.

**Kind**: global function  

| Param | Description |
| --- | --- |
| direction |  |
| direction | ['UP' | 'DOWN' | 'LEFT' | 'RIGHT'] |
| snakeHeadPosition |  |
| map |  |

<a name="canIMoveInDirection"></a>

## canIMoveInDirection(direction, snakeHeadPosition, map) ⇒ <code>boolean</code>
Checks if the snake will die when moving in the direction in question

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>string</code> | [ 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' ] |
| snakeHeadPosition | <code>coordinate</code> | The position of the snakes head. { x: (number), y: (number) } |
| map | <code>map</code> | The game map |

