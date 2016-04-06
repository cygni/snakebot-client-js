# SNAKE CLIENT

This a Snake Client written in javascript (ECMAScript 5).

## Requirements

* NodeJs >= 5.5.0 
* Npm >= 3.5.3
* Snake Server (local or remote)

## Installation

A. Clone the repository: `git clone https://github.com/cygni/snakebot-clients.git`.

B. Open: `<repo>/snakebot-js`

C. Execute: `npm install`


## Usage

`node snake-cli`

## Your first game

*Setting up and running your first game is straight forward.*  

Open `snake-cli.js` in your favourite editor.

Edit the server connection parameters.   
See *var client = Mamba('snake.cygni.se', 80, onEvent, false).connect("training")*

Change your player name...  
See *::prepareNewGame(){...}*

Your default snake is now ready to be unleashed!

***There's a problem though, your snake will always slam into the wall! Hisss!***

## Improve your snake

You have already experienced an important lesson; "if I go all the way to the right it will hurt".  
Well, actually it will hurt your snake the most. Don't hurt your snake. 
To improve the snake you need to do some serious thinking.  
Right now your snakes brain is as small as a shopping list. It's entire mind resides in the method named *::handleGameUpdate(mapState)*.

This method takes just one teeny weeny, er I mean mighty, parameter named *mapState* (see domain/mamba/MapUpdateEvent.js).     
This mapState parameter represents the world state at a given game tick. All snakes sees the same world at the same game tick    
(yes, even snakes must obey the arrow of time and anyways the theory of relativity has not yet been formalised  
by Snakebert Snakestein). The world changes state every 250 millisecond in the standard snake Universe.   
You, being a God in the snake Universe, can tweak this and other worldly parameters with the *game settings*   
(see domain/mamba/gameSettings.js) and *::prepareNewGame*.

### Lesson 1: Shake that snake!

The first thing on your agenda should probably be to wriggle that slimy worm of yours in another direction.  
You issue commands to you snake by calling *::moveSnake(direction, mapState.getGameTick())*.   
The *direction* is a string and can be one of < UP | DOWN | LEFT | RIGHT >. Remember that you can only  
make one move per game tick, so no *bullet time* or any other Matrix tricks buddy! Yes, I'm talking to you. Or you. Or..yeah ok you got it. 

### Lesson 2: The only fence against the world is a thorough knowledge of it

To be able to execute good moves you really need to understand the world your snake lives and grows in.    
Yes your goal is to survive and eat, if you didn't know this already.  
The *mapState* as mentioned above contains everything you really need to know. The *mapState::gameMap()*  
method  will give you access to all the game tiles, *::getTiles()*, and all the snake positions, *::getSnakeInfos()*.  
You are a God indeed. Use this data to gain a good view of the...snakepit or whatever you wish to call  
that, *yuck*, slimy world of theirs.

### Lesson 3: Give a snake the right mind, and it will eat the world

You know how to move the snake and you know the layout of the world. It's now time to synthesise this knowledge      
to form a puny brain or...a sentient life form. It's all up to you. Now, if you have forgotten all those classes     
in artifical intelligence and discrete mathematics from uni there is still some hope for you. Enter the *::MapUtils*    
(see domain/mapUtils.js). This little helper contains some crufty functions for calculating routes and distances.   
Use it, or not...you sturdy computer science genious you...ggrrrrr. Uhm, well.  

Oh and by the way, you need to issue your move before the next game tick. Otherwise your snake will just keep going in the same direction as it did the last tick. Hmm that reminds me of a song; 'Right, right goes your snake, gently down the grid, merrily merrily, merrily, merrily until it KA-SCHMACK HITS THE WALL'. It's such a sad song.

## Analysing the game 
 
The MapRenderer visualises the outcome of a game. It is enabled by default and prints game data to the console for your perusal. It prints either the data in chronological order or displays an animated version. It can even spit out debug information for you. Code examples are available in ´snake-cli.js´.

```js
 // Frame by frame render
 renderer.render(function(){process.exit()}, {followPid : gameInfo.getPlayerId()});
 
 // Animated
 renderer.render(function(){process.exit()}, {animate: true, delay: 500, followPid : gameInfo.getPlayerId()});
```

# Happy snaking!

That's it, now go out there, have fun twisting your minds!
Don't forget to raid the Cygni fridge before you get started, it's free after all. **Yay!**

/Snake McWriggles


#### PS. Need a nudge in some direction? Here's a snippet for a snake that eats and tries to keep itself out of trouble. DS.

```js
var food = MapUtils.findFood(myCoords, map);
  if(food.length){
    var foodCoord = food.pop();
    var path = MapUtils.findPathAS(myCoords, foodCoord, map.getWidth(), map.getHeight(), function(coord, goalCoord){
      var tile = MapUtils.peekAt(myCoords, map);
      return MapUtils.getManhattanDistance(coord, goalCoord) + (tile.content === 'snakebody' ? 1000 : 0);
    });
    direction = path[0].direction;
    snakeBrainDump = {foodCoord: foodCoord, path: path};
  }
```
 


