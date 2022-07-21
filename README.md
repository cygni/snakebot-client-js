# snakebot-client-js

A snakebot client using modern JavaScript (ECMAScript 2020)

## Requirements

- Node.js >= v12.11

#

## Installation

1. Clone the repository: `git clone https://github.com/cygni/snakebot-client-js.git`.
1. Navigate inside: `cd snakebot-client-js`
1. Run: `npm install`

#

## Usage

```bash
# Start the client with the example snake, Slither:
npm start

# Start the client with your own snake:
npm start -- snakepit/mysnake.js

# Check options
npm start -- --help
```

#

## Local usage

Requires: Docker

The easiest way to start client locally is to use Docker instead of cloning all of the repos. Simply pull the server and webclient's images and run them as containers by issuing the command below in your terminal:

`docker-compose up`

#

## The Game

The goal of the game is to have the last snake alive. If your snake collides with a wall or another snake, it dies. You gain points by eating stars or nibbling on other snakes' tails.

Every turn, the current game board is broadcast to all players. Your task is to respond with a direction indicating your next move - either up, down, left or right. When all players have made their moves, or if 250 ms has passed, the turn is over.

#

## Getting started with your first game

_To get going and playing your first game is simple!_

Open ./snakepit/slither.ts in your favourite editor. This file represents your snakebot and is equipped with all the necessary tools needed to survive in the snakepit.

To unleash your snake into the testing grounds, issue the following command in your terminal:

```bash
npm start
```

**_There's a problem though, your snake will always slam into the wall! Hisss!_**

## Improving your snake

You've already learned the most important lesson: "If my snake can't turn it will hurt". Your next step is to figure out how to keep your snake safe with some serious thinking. As of now, your snakes brain is barely the size of a peanut and resides in the method shown below.

#

```js
export function getNextMove(gameMap) {
  return Direction.Down;
}
```

## Tip #1: Shake that snake!

The first action recommended to take is probably to get familiar with how to wriggle that slimy worm of yours in another direction. To issue commands to your snake you have to return a direction. The direction is a string and consists of enums < UP | DOWN | LEFT | RIGHT >. Remember that you can only make one move per game tick, so no bullet time or any other Matrix tricks buddy! Also keep in mind that in the event of failing to returning a direction within the time limit of 250ms, your snake will automatically return the latest direction it was heading to.

#

## Tip #2: The only fence against the world is a thorough knowledge of it

To be able to execute good moves, you first have to have a deep understanding of the world your snake lives and grows in. Your goal is to outlive the other snakes, but you may also have to consider other factors such as gathering points, watching out for obstacles and other snakes etc.

The _gameMap_ object as mentioned before, containts everything you really need to know and gives you access to all the game tiles and snake positions. You are Manasa, a god of snakes! Use this information wisely to get a good view of the snakepit and everything that resides inside of it..!

#

## Tip 3: Give a snake the right mind, and it will eat the world

You now know how to move your snake around and understand the layout of the world. It's now time to synthesise this knowledge to form a puny brain or...a sentient life form. It's all you from here!

Now, if you've forgotten all those classes in AI and discrete mathematics from uni there is still hope for you. Take a look in utils.ts. This little helper contains some nifty functions for calculating routes and distances. Use them wisely, they can prove to come in handy! Or not..

#

# Happy Snaking!

That's all, now you are ready to get out there! Good luck and have fun twisting your minds!
