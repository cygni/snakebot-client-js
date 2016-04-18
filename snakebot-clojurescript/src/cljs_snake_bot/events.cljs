(ns cljs-snake-bot.events
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.messages :as msgs]
            [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.printer :as p]
            [cljs-snake-bot.snake-examples.edge-snake :as es]))

(defn on-player-registered [msg]
  (s/state-set-many {:player-name (:name msg)
                     :player-id (:receivingPlayerId msg)
                     :game-id (:gameId msg)
                     :player-color (:color msg)
                     :is-playing true})
  (if (= "training" s/game-mode)
      (msgs/get-start-game-message)
      nil))


(defn on-map-updated [msg]
  (s/state-set :game-tick (:gameTick msg))
  (msgs/get-move-message (es/get-next-movement msg)))

(defn on-game-ended [msg]
  (s/state-set :game-running false?)
  nil)

(defn on-snake-died [msg]
  (s/state-set :is-playing false?)
  nil)

(defn on-game-starting [msg]
  (s/state-set-many {:number-of-players (:noofPlayers msg)
                     :game-height (:height msg)
                     :game-width (:width msg)
                     :game-running true
                     :game-tick -1})
  nil)

(defn on-invalid-player-name [msg]
  nil)
