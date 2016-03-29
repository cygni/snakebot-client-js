(ns cljs-snake-bot.printer
    (:require-macros [cljs.core.async.macros :refer [go-loop]])
    (:require [cljs.nodejs :as nodejs]
              [cljs-snake-bot.settings :as s]
              [cljs-snake-bot.constants :as c]
              [cljs.core.async :as async :refer [<! timeout]]))

(def colors (nodejs/require "colors"))

(def messages (atom []))
(def snake-colors (atom []))

(defn get-next-color []
 (let [color (first @s/snake-colors)]
   (swap! s/snake-colors subvec 1)
   color))

(defn get-color [id]
  (let [c (some #(when (= (:id %) id) (:color %)) @snake-colors)]
    (if (some? c)
      c
      (do (swap! snake-colors conj {:id id :color (get-next-color)})
          (get-color id)))))

(defn get-tile-color [tile]
  (condp = (:content tile)
    "empty" "white"
    "snakehead"  (get-color (:playerId tile))
    "snakebody" (get-color (:playerId tile))
    "food" "red"))

(defn format-tile [tile]
  (condp = (:content tile)
    "empty" " "
    "snakehead" (if (= (:playerId tile) (:player-id @s/game-state)) "$" "@")
    "snakebody" "#"
    "food" "F"))

(defn get-printable-tile [tile]
  (colors.stylize (format-tile tile) (get-tile-color tile)))

(defn get-printable-snake-info [snake]
  (colors.stylize (str (:name snake) (if (not (:alive snake)) "- [RIP]" "") "-" (:points snake) "pts" "-" (:id snake)) (get-color (:id snake))))

(defn print-pretty-map [map]
  (let [tiles (apply mapv list (:tiles map))
        snakeInfos (:snakeInfos map)
        firstTiles (take (count snakeInfos) tiles)
        rest (drop (count snakeInfos) tiles)]
   (mapv #(println (mapv (fn [t] (get-printable-tile t)) %1) (get-printable-snake-info %2)) firstTiles snakeInfos)
   (mapv #(println (mapv (fn [t] (get-printable-tile t)) %)) rest)))

(defn print-registration-message [msg]
 (when (:pretty-print-player-registration s/printer-settings)
  (println "player registrated")))

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
    (if (= (s/state-get :player-id) (:playerId msg))
      (print-you-died-message msg)
      (print-enemy-died-message msg))))

(defn print-game-ended-message [msg]
  (when (:pretty-print-game-ended s/printer-settings)
    (print-pretty-map (:map msg))))

(defn print-game-starting-message [msg]
 (when (:pretty-print-game-starting s/printer-settings)
  (println "game starting message received")))

(defn print-invalid-player-name-message [msg]
 (when (:pretty-print-invalid-player-name s/printer-settings)
   (println "Invalid player name message received")))

(defn print-map-updated-message [msg]
  (when (:pretty-print-map-updated s/printer-settings)
    (println "\ngame tick: " (:gameTick msg))
    (print-pretty-map (:map msg))))

(defn renderer []
  (go-loop []
      (async/<! (async/timeout 100))
      (let [msg (first @messages)]
       (swap! messages #(into [] (rest %)))
       (when msg
          (condp = (:type msg)
            c/game-ended-message (print-game-ended-message msg)
            c/player-registered-message (print-registration-message msg)
            c/map-updated-message (print-map-updated-message msg)
            c/snake-died-message (print-snake-died-message msg)
            c/game-starting-message (print-game-starting-message msg)
            c/invalid-player-name-message (print-invalid-player-name-message msg))))
      (if (or (s/state-get :game-running)
              (> (count @messages) 0))
        (recur))))
