# Cygni C# Snake Bot Client

[![Build Status](http://jenkins.snake.cygni.se/buildStatus/icon?job=Snake-Client-Csharp)](http://jenkins.snake.cygni.se/job/Snake-Client-Csharp/)

## Baby, I'm just gonna snake, snake, snake, snake, snake. I snake it off, I snake it off

I would like to begin this section with some wise words from a great and wise man.

> I didn’t want to be just a *snake* building champion; I wanted to be the best *snake* builder of all times. <br /> **Arnold Schwarzenegger**

Within this repository you can find the beginning of the same journey that Mr. Schwarzenegger walked so many years ago. 
A journey that took him, an insignificant young boy from Steiermark in Austria, all the way to the podium at not one but **seven** Mr. Snake Olympia events.

Here you can find a Snake Client written in the C# language for the .Net Core platform.

I would also like to leave you with a qoute from the aforementioned great man

> Anything I’ve ever attempted, I was always willing to fail. So you can’t always win, but don’t be afraid of making decisions. You can’t be paralyzed by the fear of failure or you will never push yourself. You keep pushing because you believe in yourself and in your vision and you know that it is the right thing to do, and success will come. So don’t be afraid to fail. <br /> **Arnold Schwarzenegger**

## System Requirements

- Windows 8 or higher (required by System.Net.WebSocket.ClientWebSocket)
- .Net Core version 1.0.0-rc2, see: http://docs.asp.net/en/latest/getting-started/index.html
- ASP .Net 5 RC. Follow the instructions at: https://get.asp.net/
- Visual Studio 2015

## Project structure
The solution contains three projects
- Cygni.Snake.Client
- Cygni.Snake.Client.Tests
- Cygni.Snake.SampleBot

#### Cygni.Snake.Client
This project contains among other things, the SnakeClient, SnakeBot and Map classes.

- SnakeClient: Provides the communication with the Cygni Snake server.
- SnakeBot: Provides an abstract base class for snake bots.
- Map: Provides an way to examine the state of the snake world.
- IGameObserver: Interface for types that can observe games.

#### Cygni.Snake.Client.Tests
Contains unit tests for the Cygni.Snake.Client library.

#### Cygni.Snake.SampleBot
This project illustrates how to connect to the Cygni Snake server using a SnakeBot implementation and the SnakeClient class.

- Program: The main entry point. Connects to the server and requests a new game.
- MySnakeBot: The sample SnakeBot implementation.
- GamePrinter: An implementation of IGameObserver for printing snake updates to console.

## Get started

- Open the solution in Visual Studio 2015.
- Restore packages.
- Implement an awesome bot.
- Build.
- Run.

### Implementing a SnakeBot

MySnakeBot.cs contains a skeleton SnakeBot implementation. All you need to do is to implement the GetNextMove()-method to return the direction of choice for your next move. The parameter map represents the current state of the world. It exposes a property called MySnake which represents your snake. Other than that, use the intellisense to examine its API.

```csharp
public class MySnakeBot : SnakeBot
{
    public MySnakeBot(string name) : base(name)
    {
    }
    
    public override Direction GetNextMove(Map map)
    {
        // figure out a good move
        
        // do calculated move
        return Direction.Down;
    }
}
```

The Main()-method in Program.cs wires up the WebSocket connection with the SnakeClient and the SnakeBot of your choice. You can choose to omit the GamePrinter parameter in SnakeClient. Or, if you prefer, you can provide another implementation to log or do whatever cool stuff you like.

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        var ws = new ClientWebSocket();
        ws.ConnectAsync(new Uri("ws://snake.cygni.se:80/training"), CancellationToken.None).Wait();

        var client = new SnakeClient(ws, new GamePrinter());

        client.Start(new MySnakeBot("dotnetSnake"));
        Console.ReadLine();
    }
}
```
