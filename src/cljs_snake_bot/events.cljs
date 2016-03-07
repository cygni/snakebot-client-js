(ns cljs-snake-bot.events
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.messages :as msgs]
            [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.printer :as p]
            [cljs-snake-bot.snake-examples.random-snake :as rs]
            [cljs-snake-bot.snake-examples.edge-snake :as es]))

(nodejs/enable-util-print!)

(defn on-player-registered [msg]
  (p/print-registration-message msg)
  (reset! s/player-name (:name msg))
  (reset! s/player-id (:receivingPlayerId msg))
  (reset! s/player-color (:color msg))
  (reset! s/game-id (:gameId msg))
  (reset! s/is-playing true)
  (msgs/get-start-game-message @s/player-id))

(defn on-map-updated [msg]
  (p/print-map-updated-message msg)
  (swap! s/game-tick inc)
  (msgs/get-move-message @s/player-id @s/game-tick (es/get-next-movement msg)))

(defn on-game-ended [msg]
  (p/print-game-ended-message msg)
  (reset! s/game-running false)
  nil)

(defn on-snake-died [msg]
  (p/print-snake-died-message msg)
  (reset! s/is-playing false)
  nil)

(defn on-game-starting [msg]
  (p/print-game-starting-message msg)
  (reset! s/number-of-players (:noofPlayers msg))
  (reset! s/game-height (:height msg))
  (reset! s/game-width (:width msg))
  (reset! s/game-running true)
  (reset! s/game-tick -1)
  nil)

(defn on-invalid-player-name [msg]
  (p/print-invalid-player-name-message msg)
  nil)
