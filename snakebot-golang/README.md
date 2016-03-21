# Golang snake client

### Get it running

1. Install golang, follow the instructions at https://golang.org/
2. In a terminal go to the repository root
3. go get github.com/gorilla/websocket
4. go run ./main.go


### What to change

#### snake.go

```go
func (s *snake) onMapUpdated(mapUpdatedMessage communication.MapUpdatedMessage) {
	//Do stuff
	printer.PrintMap(mapUpdatedMessage.Map)

	s.Client.RegisterMove("UP", s.playerId)
}
```

#### main.go
