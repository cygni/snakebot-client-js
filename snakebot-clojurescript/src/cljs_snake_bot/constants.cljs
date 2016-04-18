(ns cljs-snake-bot.constants)

;Outbound message types
(def register-player-message "se.cygni.snake.api.request.RegisterPlayer")

(def register-move-message "se.cygni.snake.api.request.RegisterMove")

(def start-game-message "se.cygni.snake.api.request.StartGame")

(def heart-beat-message "se.cygni.snake.api.request.HeartBeatRequest")

(def client-info-message "se.cygni.snake.api.request.ClientInfo")

;Inbound message types
(def game-ended-message "se.cygni.snake.api.event.GameEndedEvent")

(def player-registered-message "se.cygni.snake.api.response.PlayerRegistered")

(def map-updated-message "se.cygni.snake.api.event.MapUpdateEvent")

(def snake-died-message "se.cygni.snake.api.event.SnakeDeadEvent")

(def game-starting-message "se.cygni.snake.api.event.GameStartingEvent")

(def invalid-player-name-message "se.cygni.snake.api.exception.InvalidPlayerName")

(def heart-beat-response "se.cygni.snake.api.response.HeartBeatResponse")

(def invalid-message "se.cygni.snake.api.exception.InvalidMessage")
