package main

import (
	"fmt"

	"./communication"
)
import "./snake"

const hostName string = "snake.cygni.se"
const port int = 80
const mode string = "training"

func main() {
	c := communication.NewClient(hostName, port, mode)
	defer c.Close()

	s := snake.NewSnake("emil", "black", c)
	s.Init()

	var message string
	select {
	case message = <-s.FinishChannel:
		fmt.Println("Snake finished: ", message)
		return
	}
}
