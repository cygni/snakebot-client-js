# Golang snake client

## To Go, or not to Go, that is the question:

>
To Go, or not to Go, I there's the point,<br />
To Die, to slither, is that all? Aye all:<br />
No, to start, to slither, aye win there it goes,<br />
For in that slither to victory, when we awake,<br />
And borne before an everlasting game host,<br />
From whence no passenger ever returned,<br />
The undiscovered game world, at whose sight<br />
The happy snake, and the accursed damn'd.<br />
But for this, the joyful hope of this,<br />
Who'd bear the scorns and flattery of the map,<br />
Scorned by the right rich, the rich cursed of the poor?<br />
The widow being oppressed, the food wrong'd,<br />
The taste of hunger, or a snakes reign,<br />
And thousand more calamities besides,<br />
To grunt and sweat under this weary life,<br />
When that he may his full Quietus make,<br />
With a bare bodkin, who would this endure,<br />
But for a hope of something after death?<br />
Which puzzles the brain, and doth confound the sense,<br />
Which makes us rather bear those evils we have,<br />
Than fly to others that we know not of.<br />
Aye that, O this conscience makes snakes of us all,<br />
Lady in thy orizons, be all my slithers remembered. <br /> ***William Shakespeare***

#### Disclaimer
This is a judgement free zone. The only form of judgement that is accepted is silent angry stares and angry mumbling. I can honestly say that golang is not my forte. One could argue that I suck and you wouldn't be wrong. That being said I present to thee the golang client for the Cygni snakebot challenge.

### Get it running

1. Install golang, follow the instructions at https://golang.org/
2. In a terminal go to the repository root
3. go get github.com/gorilla/websocket
4. go get github.com/fatih/color
5. go run ./main.go


### What to change

#### snake.go

This file contains all the logic for the snake. Here is where you will place your logic.
The onMapUpdated function is the function that will be called for each tick. Here is where you should place your logic. Updae the "UP" string for any of the following strings; "UP", "DOWN", "LEFT" or "RIGHT and that movement command will be sent to the server.

If you don't want a print out of the map for each iteration just comment out the printer.PrintMap call.

```go
func (s *snake) onMapUpdated(mapUpdatedMessage communication.MapUpdatedMessage) {
	printer.PrintMap(mapUpdatedMessage.Map)

  //Do (hopefully) smart stuff
	s.Client.RegisterMove("UP", s.playerId)
}
```

#### main.go

This is the main entry point of this client.
Here is where you change what endpoint you would like to communicate to. Change this by changing the constants at the beginning of the file.

Here is also where your snake is constructed. Change the arguments to the snake.NewSnake call to change your name and or your color.

```go
const hostName string = "snake.cygni.se"
const port int = 80
const mode string = "training"

s := snake.NewSnake("emil", "black", c)
```

### Todo

1. Fix panic handling
