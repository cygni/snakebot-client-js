(ns cljs-snake-bot.messages
  (:require [cljs-snake-bot.constants :as c]
            [cljs-snake-bot.settings :as s]))

(defn get-start-game-message [player-id]
  {:type c/start-game-message
   :receivingPlayerId player-id})

(defn get-move-message [player-id tick direction]
  {:type c/register-move-message
   :direction (if (nil? direction) "DOWN" direction)
   :gameTick tick
   :receivingPlayerId player-id})


(defn get-player-registration-message [name]
  {:type c/register-player-message
   :playerName name
   :gameSettings s/default-map})
