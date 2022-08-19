# snakebot-client-js

A snakebot client implemented in JavaScript with TypeScript support.

## Requirements

- Node.js >= v16.15.1

#

## Installation

1. Clone the repository: `git clone https://github.com/cygni/snakebot-client-js.git`.
1. Navigate inside: `cd snakebot-client-js`
1. Run: `npm install`

#

## Usage

```bash
# Start the client with the default snake, slither.ts:
npm start

# Start the client with your own snake:
npm start -- --snake snakepit/mysnake.ts

# Check options
npm start -- --help
```

#

## Enter the Arena

The Arena gamemode allows you to compete against other snakebots. To start an Arena, head over to [our website](https://snake.cygni.se) and navigate to the Arena tab

Once created, you are now the host of the Arena with the id that was provided. In order to join the specific arena, clients needs to pass the id as an argument while connecting

```bash

# Example
npm start -- -n mysnakename -v arenaid

```

#

## Enter the Tournament

From time to time, Cygni will host tournaments where you get to compete against other players. If you are a participant of a tournament and wish to connect,
issue the following command:

```bash
# Example
npm start -- -n mysnakename -v tournament
```

### To connect locally:

```bash
# Example
npm start -- -h http://localhost:8080 -n mysnakename -v tournament
```

#

## Local usage

Requires: Docker

If you want to spin up your own local development enviroment the easiest way to do so is to use Docker instead of cloning all of the repos. By issuing the command below in your terminal it will automatically pull the server and webclient's images and run them as containers.

`docker-compose up`

The default port is **8090** for the webclient and **8080** for the server. To connect your client to your local server you would run it with the host flag as seen below:

`npm start -- --host http://localhost:8080`

**NOTE: Even if your bot can respond fast enough on your local server, ensure it is still fast enough to respond on production. Production will be slower due to network speed and congestion.**

#

## The Game

The goal of the game is to have the last snake alive. If your snake collides with a wall, object or another snake, it dies. You gain points by eating stars, trapping other snakes to crash into you or nibbling on other snakes' tails. Points are only used to determine which non-winning snakes to advance in a tournament setting, which lets you have an another chance for victory!

Every turn, the current game board is broadcast to all players. Your task is to respond with a direction indicating your next move - either up, down, left or right. When all players have made their moves, or if 250 ms has passed, the turn is over.

#

## Getting started with your first game

_To get going and playing your first game is quite simple!_

Open ./snakepit/slither.ts in your favourite editor. This file represents your snakebot and is equipped with all the necessary tools needed to survive inside the snakepit.

To unleash your snake into the testing grounds, issue the following command in your terminal:

```bash
npm start
```

**_As you notice, your snake is just turning in random directions and needs your help to find a better path!_**

## Improving your snake

You've already learned the most important lesson: "If my snake doesn't know where to go it will hurt". Your next step is to figure out how to keep your snake safe with some serious thinking. As of now, your snakes brain is barely the size of a peanut and resides in the method shown below.

#

```ts
export async function getNextMove(gameMap: GameMap) {}
```

## Tip #1: Shake that snake!

To issue commands to your snake you have to return a direction. The direction is a string and consists of enums < UP | DOWN | LEFT | RIGHT >. Remember that you can only make one move per game tick, so no bullet time or any other Matrix tricks buddy! Also keep in mind that in the event of failing to returning a direction within the time limit of 250ms, your snake will automatically return the latest direction it was heading to.

#

## Tip #2: The only fence against the world is a thorough knowledge of it

To be able to execute good moves, you first have to have a deep understanding of the world your snake lives and grows in. Your goal is to outlive the other snakes, but you may also have to consider other factors such as gathering points to make sure you advance in the tournament, aswell as watching out for obstacles and other snakes.

The _gameMap_ object as mentioned before, contains everything you really need to know and gives you access to all the game tiles and snake positions. You are Manasa, a god of snakes! Use this information wisely to get a good view of the snakepit and everything that resides inside of it..!

#

## Tip 3: Give a snake the right mind, and it will eat the world

You now know how to move your snake around and understand the layout of the world. It's now time to synthesise this knowledge to form a puny brain or... a sentient life form. It's all you from here!

Now, if you've forgotten all those classes in AI and discrete mathematics from uni there is still hope for you. Take a look in **utils.ts**. This little helper contains some nifty functions for calculating routes and distances. Use them wisely, they can prove to come in handy! Or not..

## Psst (Last tip)

If you want to listen to specific events from the server, you can use the supplied onMessage function. Perhaps you want to switch strategy after some snakes are dead and start hoarding points..? It's totally optional but it exists if you want to use it.

```ts
// Optional
export function onMessage(message: Message) {
  switch (message.type) {
    case MessageType.GameStarting:
      message = message as GameStartingEventMessage; // Cast to correct type
      // Reset snake state here
      break;
    case MessageType.SnakeDead:
      message = message as SnakeDeadEventMessage; // Cast to correct type
      // Check how many snakes are left and switch strategy
      break;
  }
}
```

#

## Arena

Once you've got the hang of it, feel free to try out the Arena gamemode! In this mode you can challenge friends or perhaps put two different bots of your own against eachother to help you decide which bot performs the best.

#

# Happy Snaking!

That's all, now you are ready to get out there! Good luck and have fun twisting your minds!
