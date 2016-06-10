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
- Operating system supported by .NET Core 1.0 RC2 (https://www.microsoft.com/net/core).
- Your favourite text-editor. Although we would recommend using either 'Visual Studio Code' or 'Visual Studio 2015'.

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

### Installing .NET Core CLI
If you already have .NET Core CLI and .NET Core 1.0 RC2 installed, you can skip this step. Otherwise, go to: https://www.microsoft.com/net/core and follow the 'Getting Started' instructions for your operating system.

### Building and running
Firstly, get the latest source with git clone:
    
    git clone http://github.com/cygni/snakebot-clients
    
cd into the .NET client:

    cd snakebot-clients/snakebot-csharp

Restore all dependencies:

    dotnet restore
    
Run unit tests (optional):

    dotnet test test/Cygni.Snake.Client.Tests/
    
Run the sample bot client:

    dotnet run -p src/Cygni.Snake.SampleBot/

### Implementing a SnakeBot

The file src/Cygni.Snake.SampleBot/MySnakeBot.cs contains a skeleton SnakeBot implementation. All you need to do is to implement the GetNextMove()-method to return the direction of choice for your next move. The parameter map represents the current state of the world. It exposes a property called MySnake which represents your snake. Other than that, use the intellisense to examine its API.

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
        var client = SnakeClient.CreateSnakeClient(new Uri("ws://snake.cygni.se:80/training"), new GamePrinter());
        client.Start(new MySnakeBot("dotnetSnake"), true);

        Console.ReadLine();
    }
}
```
