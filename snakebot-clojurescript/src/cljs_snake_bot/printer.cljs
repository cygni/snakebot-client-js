(ns cljs-snake-bot.printer
    (:require [cljs.nodejs :as nodejs]
              [cljs-snake-bot.settings :as s]))

(nodejs/enable-util-print!)

(defn format-tile [tile]
  (condp = (:content tile)
    "empty" " "
    "snakehead" (if (= (:playerId tile) @s/player-id) "$" "@")
    "snakebody" "#"
    "food" "F"))

(defn print-pretty-map [map]
  (let [tiles (apply mapv list (:tiles map))]
   (println)
   (mapv #(println (mapv (fn [t] (format-tile t)) %)) tiles)))

(defn print-registration-message [msg]
  (println "player registrated"))

(defn get-pretty-reason [reason]
  reason)

(defn get-pretty-game-tick [gameTick]
  "- Game Tick: " gameTick " -" )

(defn print-you-died-message [msg]
  (println "---------------------------------")
  (println "-           YOU DIED            -")
  (println (get-pretty-reason (:deathReason msg)))
  (println "---------------------------------"))

(defn print-enemy-died-message [msg]
  (println "---------------------------------")
  (println "-         Snake DIED            -")
  (println (get-pretty-reason (:deathReason msg)))
  (println "---------------------------------"))

(defn print-snake-died-message [msg]
  (when (:pretty-print-snake-died s/printer-settings)
    (if (= @s/player-id (:playerId msg))
      (print-you-died-message msg)
      (print-enemy-died-message msg))))

(defn print-game-ended-message [msg]
  (print-pretty-map (:map msg)))

(defn print-game-starting-message [msg]
  (println "game starting message received"))

(defn print-invalid-player-name-message [msg]
  (println "Invalid player name message received"))

(defn print-map-updated-message [msg]
  (when (:pretty-print-map-updated s/printer-settings)
    (print-pretty-map (:map msg))))
