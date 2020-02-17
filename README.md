# snakebot-client-js

A snakebot client using modern JavaScript (ECMAScript 2020)

## Requirements

- Node.js >= v12.11

## Installation

1. Clone the repository: `git clone https://github.com/cygni/snakebot-client-js.git`.
1. Navigate inside: `cd snakebot-client-js`
1. Run: `npm install`

## Usage

```bash
# Start the client with the example snake, Slither:
npm start

# Start the client with your own snake:
npm start -- snakepit/mysnake.js

# Check options
npm start -- --help
```

## The Game

The goal of the game is to have the last snake alive. If your snake collides with a wall or another snake, it dies. You gain points by eating stars or nibbling on other snakes' tails.

Every turn, the current game board is broadcast to all players. Your task is to respond with a direction indicating your next move - either up, down, left or right. When all players have made their moves, or if 250 ms has passed, the turn is over.

```js
export function getNextMove(gameMap) {
  return Direction.Down;
}
```
