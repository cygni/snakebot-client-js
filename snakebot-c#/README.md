# Cygni C# .Net Snake Bot Client

## Baby, I'm just gonna snake, snake, snake, snake, snake. I snake it off, I snake it off

I would like to begin this section with some wise words from a great and wise man.

> I didn’t want to be just a *snake* building champion; I wanted to be the best *snake* builder of all times. <br /> **Arnold Schwarzenegger**

Within this repository you can find the beginning of the same journey that Mr. Schwarzenegger walked so many years ago. 
A journey that took him, an insignificant young boy from Steiermark in Austria, all the way to the podium at not one but **seven** Mr. Snake Olympia events.

Here you can find a Snake Client written in the C# language for the .Net Core platform and ASP .Net 5.

I would also like to leave you with a qoute from the formentioned great man

> Anything I’ve ever attempted, I was always willing to fail. So you can’t always win, but don’t be afraid of making decisions. You can’t be paralyzed by the fear of failure or you will never push yourself. You keep pushing because you believe in yourself and in your vision and you know that it is the right thing to do, and success will come. So don’t be afraid to fail. <br /> **Arnold Schwarzenegger**


### Requirements

- Windows 8 or higher (The current websocket implementation requires this.)
- .Net Core version 1.0.0-rc1-update1. Follow the instructions at: http://docs.asp.net/en/latest/getting-started/index.html
- ASP .Net 5 RC. Follow the instructions at: https://get.asp.net/
- Visual Studio 2015

### Get it running

- Open the solution in Visual Studio 2015
- Restore packages
- Build
- Run (Theres not much more to it)

### Structure

#### Cygni.Snake.Client
This is the main library that contains all the functionality needed to get everything running.
It contains communication logic, event handling, helper classes for printing and all the neccessary DTOs.

#### Cygni.Snake.Client.Tests

This project, as the name entails, contains all the unit tests for the main library project.

#### Cygni.Snake.SampleBot

This project holds the file that you as a user might need to change.

- MySnake.cs (Class that holds the current snake player logic) 
- Program.cs (Main entry point)



### What to change

The only two files you should need to modify is MySnake.cs and Program.cs. These two files hold the main entry point of everything and the snake class that is currently playing and hopefully winning the snake tournament.

#### MySnake.cs

Here is where you should put your awesome strategy for winning in this game and life in general. Only make sure that by the end of OnGameTurn you return whatever movement action you would like to perform. All the information avaliable to you about the world is contained within the passed map object.

If the printer line is not commented out a ANSI printer will print the current map state to the console. Your snake will have a different color than the rest of the snakes (Hopefully ^^ ). 

```csharp
    public class DemoSnake : Snake
    {
        public DemoSnake(string name, string color, ISnakeClient snakeClient)
            : base(name, color, snakeClient)
        {
        }
        
        protected override MovementDirection OnGameTurn(Map map, long gameTick)
        {
            ConsoleMapPrinter.Printer(map, PlayerInfos);
            // figure out a good move

            // do calculated move
            return MovementDirection.Down;
        }
    }
```

#### Program.cs

Here is the main entry point for everything. Here is where the settings for the game and the client is initialized.
Change these two objects if you want different settings on the map or if you want to run the game against another host/port/gamemode.

```csharp
     public class Program
    {
        public static void Main(string[] args)
        {
            var settings = new GameSettings();

            var client = new SnakeClient("snake.cygni.se", 80, "training", settings);
            var snake = new MySnake("dotnetSnake", "green", client);

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
