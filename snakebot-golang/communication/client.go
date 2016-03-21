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
}

func NewClient(host string, port int, mode string) Client {
	client := Client{}

	client.connect(host, port, mode)

	client.writeChannel = make(chan []byte)
	client.ReadChannel = make(chan []byte)
	client.ErrorChannel = make(chan string)

	go reader(client)
	go writer(client)
	go closer(client)

	return client
}

func (client *Client) Close() {
	client.ErrorChannel <- "planned close"
}

func closer(client Client) {
	for {
		select {
		case <-client.ErrorChannel:
			close(client.ErrorChannel)
			close(client.ReadChannel)
			close(client.writeChannel)
			client.socketConnection.Close()
		}
	}
}

func reader(client Client) {
	for {
		select {
		case <-client.ErrorChannel:
			return
		default:
			_, message, err := client.socketConnection.ReadMessage()

			if err != nil {
				log.Fatal("Error while reading ", err)
				return
			}

			//			fmt.Printf("got message: %s\n", string(message))
			client.ReadChannel <- message
		}
	}
}

func writer(client Client) {
	for {
		var msg []byte
		select {
		case msg = <-client.writeChannel:
			err := client.socketConnection.WriteMessage(websocket.TextMessage, msg)

			if err != nil {
				log.Fatal("error while writing ", err)
				client.ErrorChannel <- "close"
			}

		case <-client.ErrorChannel:
			return
		}
	}
}

func (client *Client) connect(host string, port int, mode string) {
	connection, _, err := websocket.DefaultDialer.Dial(fmt.Sprintf("ws://%s:%d/%s", host, port, mode), nil)

	if err != nil {
		log.Fatal("unable to connect", err)
	}

	client.socketConnection = connection
}
