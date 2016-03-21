package communication

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	socketConnection *websocket.Conn
	writeChannel     chan []byte
	ReadChannel      chan []byte
	ErrorChannel     chan string
	FinishChannel    chan bool
}

func NewClient(host string, port int, mode string) Client {
	client := Client{}

	client.connect(host, port, mode)

	client.writeChannel = make(chan []byte)
	client.ReadChannel = make(chan []byte)
	client.ErrorChannel = make(chan string)
	client.FinishChannel = make(chan bool)

	go reader(client)
	go writer(client)
	go closer(client)

	return client
}

func (client *Client) Close() {
	client.ErrorChannel <- "Planned Close"
}

func closer(client Client) {
	for {
		select {
		case _, ok := <-client.ErrorChannel:
			if !ok {
				continue
			}

			if client.ErrorChannel != nil {
				close(client.ErrorChannel)
				client.ErrorChannel = nil
			}

			if client.ReadChannel != nil {
				close(client.ReadChannel)
				client.ReadChannel = nil
			}

			if client.writeChannel != nil {
				close(client.writeChannel)
				client.writeChannel = nil
			}

			if client.socketConnection != nil {
				client.socketConnection.Close()
				client.socketConnection = nil
			}
		}
	}
}

func reader(client Client) {
	for {
		select {
		case _, ok := <-client.ErrorChannel:
			if !ok {
				continue
			}
			return
		default:
			_, message, err := client.socketConnection.ReadMessage()

			if err != nil {
				log.Fatal("Error while Reading ", err)
				if client.ErrorChannel != nil {
					client.ErrorChannel <- fmt.Sprintf("%s", err)
				}
			}

			//	fmt.Printf("got message: %s\n", string(message))
			client.ReadChannel <- message
		}
	}
}

func writer(client Client) {
	for {
		select {
		case msg, ok := <-client.writeChannel:
			if !ok {
				continue
			}

			err := client.socketConnection.WriteMessage(websocket.TextMessage, msg)

			if err != nil {
				log.Fatal("Error while Writing ", err)
				if client.ErrorChannel != nil {
					client.ErrorChannel <- fmt.Sprintf("%s", err)
				}
			}

		case _, ok := <-client.ErrorChannel:
			if !ok {
				continue
			}
			return
		}
	}
}

func (client *Client) connect(host string, port int, mode string) {
	connection, _, err := websocket.DefaultDialer.Dial(fmt.Sprintf("ws://%s:%d/%s", host, port, mode), nil)

	if err != nil {
		log.Fatal("Unable to Connect", err)
		if client.ErrorChannel != nil {
			client.ErrorChannel <- fmt.Sprintf("%s", err)
		}
	}

	client.socketConnection = connection
}
