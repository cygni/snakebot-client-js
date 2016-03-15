# cygni-snake-bot-client

## README is WIP

This is a Snake client written in C#.
The project type is vNext and target framework is dnxcore50.

# Requirements

- dnx = 1.0.0-rc1-update1 (?)
-  https://get.asp.net/ and get ASP.NET 5 RC for your OS.

# Usage

```csharp
    public class DemoSnake : Snake
    {
        public DemoSnake(string name, string color, ISnakeClient snakeClient)
            : base(name, color, snakeClient)
        {
        }
        
        protected override MovementDirection OnGameTurn(Map map, long gameTick)
        {
            // figure out a good move

            // do calculated move
            return MovementDirection.Up;
        }
    }
```

```csharp
    public class Program
    {
        public static void Main(string[] args)
        {
            var settings = new GameSettings();

            var client = new SnakeClient("localhost", 8080, "training", settings);
            var name = "dotnetDemoSnake";
            var color = "color";
            var snake = new DemoSnake(name, color, client);

            client.Connect();
            
            // this is just here to keep the console from closing on us.
            do
            {
                Task.Delay(TimeSpan.FromSeconds(10)).Wait();

            } while (snake.IsPlaying);
            // don't close the console because the game is over.
            Console.ReadLine();
        }
    }
```
