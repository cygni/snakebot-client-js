(ns cljs-snake-bot.events
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.messages :as msgs]
            [cljs-snake-bot.settings :as s]))

(nodejs/enable-util-print!)

(defn on-player-registered [msg]
  (println "player registered message received")
  (reset! s/player-name (:name msg))
  (reset! s/player-id (:receivingPlayerId msg))
  (reset! s/player-color (:color msg))
  (reset! s/game-id (:gameId msg))
  (let [response (msgs/get-start-game-message @s/player-id)]
    (println "response " response)
    response))

(defn on-map-updated [msg]
  (println "map updated message received")
  (swap! s/game-tick inc)
  (msgs/get-move-message @s/player-id @s/game-tick))

(defn on-game-ended [msg]
  (println "game ended message received")
  (reset! s/is-playing false))

(defn on-snake-died [msg]
  (println "snake died message received")
  (reset! s/is-playing false))

(defn on-game-starting [msg]
  (println "game starting message received")
  (reset! s/number-of-players (:noofPlayers msg))
  (reset! s/game-height (:height msg))
  (reset! s/game-width (:width msg))
  (reset! s/is-playing true)
  (reset! s/game-tick 0)
  nil)

(defn on-invalid-player-name [msg]
  (println "Invalid player name message received"))
