(ns cljs-snake-bot.events
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.messages :as msgs]
            [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.printer :as p]
            [cljs-snake-bot.snake-examples.edge-snake :as es]))

(defn on-player-registered [msg]
  (p/print-registration-message msg)
  (s/state-set-many {:player-name (:name msg)
                     :player-id (:receivingPlayerId msg)
                     :player-color (:color msg)
                     :is-playing true})
  (if (= "training" s/game-mode)
      (msgs/get-start-game-message (s/state-get :player-id))
      nil))


(defn on-map-updated [msg]
  (p/print-map-updated-message msg)
  (s/state-set :game-tick (:gameTick msg))
  (msgs/get-move-message (s/state-get :player-id) (s/state-get :game-tick) (es/get-next-movement msg)))

(defn on-game-ended [msg]
  (p/print-game-ended-message msg)
  (s/state-set :game-running false?)
  nil)

(defn on-snake-died [msg]
  (p/print-snake-died-message msg)
  (s/state-set :is-playing false?)
  nil)

(defn on-game-starting [msg]
  (p/print-game-starting-message msg)
  (s/state-set-many {:number-of-players (:noofPlayers msg)
                     :game-height (:height msg)
                     :game-width (:width msg)
                     :game-running true
                     :game-tick -1})
  nil)

(defn on-invalid-player-name [msg]
  (p/print-invalid-player-name-message msg)
  nil)
