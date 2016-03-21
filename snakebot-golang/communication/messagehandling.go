package communication

import "encoding/json"

//Outbound message senders
func (client *Client) RegisterPlayer(name string, color string) {
	registrationMessage := getPlayerRegistrationMessage(name, color)
	jsonMessage, _ := json.Marshal(&registrationMessage)
	client.WriteMessage(jsonMessage)
}

func (client *Client) StartGame(playerId string) {
	startGameMessage := getStartGameMessage(playerId)
	jsonMessage, _ := json.Marshal(&startGameMessage)
	client.WriteMessage(jsonMessage)
}

func (client *Client) RegisterMove(direction string, playerId string) {
	registerMoveMessage := getRegisterMoveMessage(direction, playerId)
	jsonMessage, _ := json.Marshal(&registerMoveMessage)
	client.WriteMessage(jsonMessage)
}

func (client *Client) WriteMessage(message []byte) {
	if client.writeChannel != nil {
		client.writeChannel <- message
	}
}

//Inbound message parsers
func ParseGameMessage(msg []byte) gameMessage {
	var parsed gameMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

func ParsePlayerRegisteredMessage(msg []byte) PlayerRegisteredMessage {
	var parsed PlayerRegisteredMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

func ParseMapUpdatedMessage(msg []byte) MapUpdatedMessage {
	var parsed MapUpdatedMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

func ParseInvalidPlayerNameMessage(msg []byte) InvalidPlayerNameMessage {
	var parsed InvalidPlayerNameMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

func ParseGameEndedMessage(msg []byte) GameEndedMessage {
	var parsed GameEndedMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

func ParseSnakeDeadMessage(msg []byte) SnakeDeadMessage {
	var parsed SnakeDeadMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

func ParseGameStartingMessage(msg []byte) GameStartingMessage {
	var parsed GameStartingMessage
	json.Unmarshal(msg, &parsed)
	return parsed
}

//Outbound messages
func getRegisterMoveMessage(direction string, playerId string) registerMoveMessage {
	return registerMoveMessage{
		gameMessage: gameMessage{Type: RegisterMove, ReceivingPlayerId: playerId},
		Direction:   direction}
}

func getStartGameMessage(playerId string) startGameMessage {
	return startGameMessage{gameMessage{Type: StartGame, ReceivingPlayerId: playerId}}
}

func getPlayerRegistrationMessage(name string, color string) playerRegistrationMessage {
	return playerRegistrationMessage{
		gameMessage:  gameMessage{Type: RegisterPlayerMessageType},
		PlayerName:   name,
		Color:        color,
		GameSettings: getGameSettings(),
	}
}

func getGameSettings() gameSettings {
	return gameSettings{
		Width:                    10,
		Height:                   10,
		MaxNoofPlayers:           5,
		StartSnakeLength:         1,
		TimeInMsPerTick:          250,
		ObstaclesEnabled:         false,
		FoodEnabled:              true,
		EdgeWrapsAround:          false,
		HeadToTailConsumes:       false,
		TailConsumeGrows:         false,
		AddFoodLikelihood:        15,
		RemoveFoodLikelihood:     5,
		AddObstacleLikelihood:    15,
		RemoveObstacleLikelihood: 15,
	}
}
