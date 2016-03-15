(ns cljs-snake-bot.messagehandler
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.constants :as c]
            [cljs-snake-bot.events :as e]))

(defn get-response-message [message]
  (let [messageType (:type message)]
    (condp = messageType
      c/player-registered-message (e/on-player-registered message)
      c/map-updated-message (e/on-map-updated message)
      c/game-ended-message (e/on-game-ended message)
      c/snake-died-message (e/on-snake-died message)
      c/game-starting-message (e/on-game-starting message)
      c/invalid-player-name-message (e/on-invalid-player-name message)
      (println "undefined message received"))))
