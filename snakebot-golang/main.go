package main

import "./communication"
import "./snake"

const hostName string = "snake.cygni.se"
const port int = 80
const mode string = "training"

func main() {
	c := communication.NewClient(hostName, port, mode)
	defer c.Close()

	s := snake.NewSnake("emil", "black", c)
	s.Init()

	select {
	case <-s.FinishChannel:
		return
	case <-c.ErrorChannel:
		return
	}
}
