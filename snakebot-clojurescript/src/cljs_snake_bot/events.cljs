(ns cljs-snake-bot.events
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.messages :as msgs]
            [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.printer :as p]))

(nodejs/enable-util-print!)

(defn on-player-registered [msg]
  (p/print-registration-message msg)
  (s/state-set :player-name (:name msg))
  (s/state-set :player-id (:receivingPlayerId msg))
  (s/state-set :player-color (:color msg))
  (s/state-set :is-playing true)
  (if (s/state-get :is-game-host)
    (msgs/get-start-game-message (s/state-get :player-id))
    (do (println "Waiting on map updates")
        nil)))


(defn on-map-updated [msg]
  (p/print-map-updated-message msg)
  (s/state-set :game-tick inc)
  (msgs/get-move-message (s/state-get :player-id) (s/state-get :game-tick) "DOWN"))

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
  (s/state-set :number-of-players (:noofPlayers msg))
  (s/state-set :game-height (:height msg))
  (s/state-set :game-width (:width msg))
  (s/state-set :game-running true)
  (s/state-set :game-tick -1)
  nil)

(defn on-invalid-player-name [msg]
  (p/print-invalid-player-name-message msg)
  nil)
