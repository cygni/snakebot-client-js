Here are snake clients for different languages. More info under each language implementation.

Snake rules (short version)

1. The player with the most amounts of point wins, regardless of when it died (or didn't die).

2. A game is running as long as there are more than 1 players alive (server bots don't count).

3. Head to head collisions render both snakes dead.

4. Every third* tick all snakes grow spontaneously. Growth is forward, i.e. the head moves forward one tile but the tail will stay.

5. A snake can never grow more than one tile. If food has been eaten and spontaneous growth occured at the same time grow size will still be only one.

6. A snake can grow when eating food. Eating food also gives 2 points*.

7. If a snake manages to hit another snakes' tail it consumes this tail piece. This is rewarded with 10 points* and no growth. The targeted snake is then protected for 3 ticks* and if a snake tries to eat the tail during this period it will die.

8. For every piece of length a snake has it is rewarded 1 point*.

9. Hitting a wall, itself or an obstacle is considered a suicide. This comes with a penalty of 10 points*.

10. If another snake hits your snake and dies the server gives you 5 points*.

11. There is a 15%* chance of spawning a new food every tick.

12. There is a 5%* chance of a food being removed every tick.

13. There is a 15%* chance of spawning a new obstacle every tick. A spawned obstacle will never be placed to a tile near a snake head.

14. There is a 15%* chance of an obstacle being removed every tick.

15. The last living snake in a game is rewarded with 10 points*.


(*) : default settings, may be changed in GameSettings