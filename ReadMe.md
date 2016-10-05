# SNAKE CLIENT

This a Snake Client written in javascript (ECMAScript 5).

## Requirements

* NodeJs >= 5.5.0 
* Npm >= 3.5.3
* Snake Server (local or remote)

## Installation

A. Clone the repository: `git clone https://github.com/cygni/snakebot-client-js.git`.

B. Open: `<repo>/snakebot-client-js`

C. Execute: `npm install`


## Usage

*To launch a quick game using the template snake:*

```bash 
node snake-cli.js ./snakepit/snakestein-bot.js
```

*To get a nice print out of the available options:*

```bash 
node snake-cli.js

 -u, --user <username> : the username
 --host <snake.cygni.se> : the host
 --port <80> : the server port
 --venue <training> : the game room
 -t --training : force training
 --animate : animated game replay
 --silent : keep logs to minimum
 --mambadbg : mamba debug logs
 --gamelink : open GameLink®
```

## Your first game

*Setting up and running your first game is straight forward.*  

First have a quick look at `./snakepit/snakestein-bot.js` in your favourite editor.
This file contains a fresh out of the nest snake bot.

You unleash it by issuing the following command in your terminal:

`node snake-cli ./snakepit/snakestein-bot.js --user slimey`

***There's a problem though, your snake will always slam into the wall! Hisss!***

## Improve your snake

You have already experienced an important lesson; "if I go all the way to the right it will hurt".  
Well, actually it will hurt your snake the most. Don't hurt your snake. 
To improve the snake you need to do some serious thinking. Right now your snakes brain is as small as a shopping list. It's entire mind resides in the method named *::update(mapState)*.

This method takes just one teeny weeny, er I mean mighty, parameter named *mapState* (see [::MapUpdateEvent](domain/mamba/MapUpdateEvent.js)).     
This mapState parameter represents the world state at a given game tick. All snakes sees the same world at the same game tick (yes, even snakes must obey the arrow of time and anyways the theory of relativity has not yet been formalised  
by Snakebert Snakestein). The world changes state every 250 millisecond in the standard snake Universe.   
You, being a God in the snake Universe, can tweak this and other worldly parameters with the *game settings*   
(see [::GameSettings](domain/mamba/gameSettings.js)) and *snake-cli.js::prepareNewGame* (see [snake-cli.js](snake-cli.js)).

### Lesson 1: Shake that snake!

The first thing on your agenda should probably be to wriggle that slimy worm of yours in another direction.  
You issue commands to you snake by returning a direction in *::update(mapState)*.   
The *direction* is a string and can be one of < UP | DOWN | LEFT | RIGHT >. Remember that you can only  
make one move per game tick, so no *bullet time* or any other Matrix tricks buddy! Yes, I'm talking to you. Or you. Or..yeah ok you got it. 

### Lesson 2: The only fence against the world is a thorough knowledge of it

To be able to execute good moves you really need to understand the world your snake lives and grows in.    
Yes your goal is to survive and eat, if you didn't know this already.  
The *mapState* as mentioned above contains everything you really need to know. The *mapState::gameMap()* (see [::GameMap](domain/mamba/gameMap.js))
method will give you access to all the game tiles and snake positions.  
You are a God indeed. Use this data to gain a good view of the...snakepit or whatever you wish to call  
that, *yuck*, slimy world of theirs.

### Lesson 3: Give a snake the right mind, and it will eat the world

You know how to move the snake and you know the layout of the world. It's now time to synthesise this knowledge      
to form a puny brain or...a sentient life form. It's all up to you. Now, if you have forgotten all those classes     
in artifical intelligence and discrete mathematics from uni there is still some hope for you. Enter the [::MapUtils] (domain/mapUtils.js). This little helper contains some crufty functions for calculating routes and distances.   
Use it, or not...you sturdy computer science genious you...ggrrrrr. Uhm, well.  

Oh and by the way, you need to issue your move before the next game tick. Otherwise your snake will just keep going in the same direction as it did the last tick. Hmm that reminds me of a song; 'Right, right goes your snake, gently down the grid, merrily merrily, merrily, merrily until it KA-SCHMACK HITS THE WALL'. It's such a sad song.

## Analysing the game 
 
The MapRenderer visualises the outcome of a game. It is enabled by default and prints game data to the console for your perusal. It prints either the data in chronological order or displays an animated version. It can even spit out debug information for you.

```bash 
 node snake-cli ./snakepit/snakestein-bot.js --animated
```

*To log data to the console:*

```
log('I am here:', myCoords);
```

*To log and display data in the MapRenderer:*

```
snakeBrainDump.iamhere = myCoords;
```

# Happy snaking!

That's it, now go out there, have fun twisting your minds!
Don't forget to raid the Cygni fridge before you get started, it's free after all. **Yay!**

/Snake McWriggles
