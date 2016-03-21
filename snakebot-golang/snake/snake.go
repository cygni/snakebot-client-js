package snake

import (
	"fmt"

	"../communication"
	"../printer"
)

type snake struct {
	Client        communication.Client
	name          string
	color         string
	playerId      string
	FinishChannel chan string
	IsPlaying     bool
}

func NewSnake(name string, color string, Client communication.Client) snake {
	s := snake{color: color, name: name, Client: Client, IsPlaying: false}
	s.FinishChannel = make(chan string)
	return s
}

func (s *snake) Init() {
	go eventLoop(*s)

	s.Client.RegisterPlayer(s.name, s.color)
}

func eventLoop(s snake) {
	var msg []byte
	for {
		select {
		case <-s.Client.FinishChannel:
			s.FinishChannel <- ""
		case msg = <-s.Client.ReadChannel:
			switch communication.ParseGameMessage(msg).Type {
			case communication.GameEnded:
				fmt.Println("GameEnded message received")
				s.onGameEnded(communication.ParseGameEndedMessage(msg))
			case communication.MapUpdated:
				fmt.Println("MapUpdated message received")
				s.onMapUpdated(communication.ParseMapUpdatedMessage(msg))
			case communication.SnakeDead:
				fmt.Println("SnakeDead message received")
				s.onSnakeDead(communication.ParseSnakeDeadMessage(msg))
			case communication.GameStarting:
				fmt.Println("GameStarting message received")
				s.onGameStarting(communication.ParseGameStartingMessage(msg))
			case communication.PlayerRegistered:
				fmt.Println("PlayerRegistered message received")
				s.onPlayerRegistered(communication.ParsePlayerRegisteredMessage(msg))
			case communication.InvalidPlayerName:
				fmt.Println("InvalidPlayerName message received")
				s.onInvalidPlayerName(communication.ParseInvalidPlayerNameMessage(msg))
			}
		}
	}
}

func (s *snake) onPlayerRegistered(registrationMessage communication.PlayerRegisteredMessage) {
	s.playerId = registrationMessage.ReceivingPlayerId
	if registrationMessage.GameMode == "training" {
		s.Client.StartGame(s.playerId)
	}
}

func (s *snake) onMapUpdated(mapUpdatedMessage communication.MapUpdatedMessage) {
	//Do stuff
	printer.PrintMap(mapUpdatedMessage.Map)

	s.Client.RegisterMove("UP", s.playerId)
}

func (s *snake) onInvalidPlayerName(invalidPlayerNameMessage communication.InvalidPlayerNameMessage) {

}

func (s *snake) onGameStarting(gameStartingMessage communication.GameStartingMessage) {
	s.IsPlaying = true
}

func (s *snake) onSnakeDead(snakeDeadMessage communication.SnakeDeadMessage) {
	if s.playerId == snakeDeadMessage.PlayerId {
		s.IsPlaying = false
		fmt.Println("You died")
	} else {
		fmt.Println("Someone else died")
	}
}

func (s *snake) onGameEnded(gameEndedMessage communication.GameEndedMessage) {
	printer.PrintMap(gameEndedMessage.Map)
	s.FinishChannel <- "Game Ended"
}
