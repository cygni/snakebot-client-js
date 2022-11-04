export type SnakeInfo = {
  name: string;
  points: number;
  positions: number[];
  tailProtectedForGameTicks: number;
  id: string;
};

export type RawMap = {
  width: number;
  height: number;
  worldTick: number;
  snakeInfos: SnakeInfo[];
  foodPositions: number[];
  obstaclePositions: number[];
};

export enum TileType {
  Empty = 'Empty',
  Food = 'Food',
  Obstacle = 'Obstacle',
  Snake = 'Snake',
}

export enum GameMode {
  Training = 'TRAINING',
  Tournament = 'TOURNAMENT',
  Arena = 'ARENA',
}

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export enum RelativeDirection {
  Forward = 'FORWARD',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type GameSettings = {
  /** Maximum noof players in this game */
  maxNoofPlayers: number;
  /** The starting length of a snake */
  startSnakeLength: number;
  /** The time clients have to respond with a new move */
  timeInMsPerTick: number;
  /** Randomly place obstacles */
  obstaclesEnabled: boolean;
  /** Randomly place food */
  foodEnabled: boolean;
  /** If a snake manages to nibble on the tail 
     of another snake it will consume that tail part. 
     I.e. the nibbling snake will grow one and 
     victim will loose one. */
  headToTailConsumes: boolean;
  /** Only valid if headToTailConsumes is active. 
     When tailConsumeGrows is set to true the 
     consuming snake will grow when eating 
     another snake. */
  tailConsumeGrows: boolean;
  /** Likelihood (in percent) that a new food will be 
     added to the world */
  addFoodLikelihood: number;
  /** Likelihood (in percent) that a
     food will be removed from the world */
  removeFoodLikelihood: number;
  /** Snake grow every N world ticks.
     0 for disabled */
  spontaneousGrowthEveryNWorldTick: number;
  /** Indicates that this is a training game,
    Bots will be added to fill up remaining players. */
  trainingGame: boolean;
  /** Points given per length unit the Snake has */
  pointsPerLength: number;
  /** Points given per Food item consumed */
  pointsPerFood: number;
  /** Points given per caused death (i.e. another 
     snake collides with yours) */
  pointsPerCausedDeath: number;
  /** Points given when a snake nibbles the tail
     of another snake */
  pointsPerNibble: number;
  /** Number of rounds a tail is protected after nibble */
  noofRoundsTailProtectedAfterNibble: number;
  /** The starting count for food */
  startFood: number;
  /** The starting count for obstacles */
  startObstacles: number;
};
