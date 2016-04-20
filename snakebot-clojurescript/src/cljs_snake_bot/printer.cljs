(ns cljs-snake-bot.printer
    (:require-macros [cljs.core.async.macros :refer [go-loop]])
    (:require [cljs.nodejs :as nodejs]
              [cljs-snake-bot.settings :as s]
              [cljs-snake-bot.constants :as c]
              [cljs.core.async :as async :refer [<! timeout]]
              [cljs-snake-bot.utils.map-utils :as mu]
              [cljs-snake-bot.utils.message-utils :as msg-utils]
              [goog.Timer :as timer])
    (:use     [cljs-snake-bot.helpers :only [find-first]]))

(def colors (nodejs/require "colors"))

(def messages (atom []))
(def snake-colors (atom []))

(defn get-next-color []
 (let [color (first @s/snake-colors)]
   (swap! s/snake-colors subvec 1)
   color))

(defn get-color [id]
  (let [c (:color (find-first #(= (:id %) id) @snake-colors))]
    (if (some? c)
      c
      (do (swap! snake-colors conj {:id id :color (get-next-color)})
          (get-color id)))))

(defn get-tile-color [tile]
  (condp = (:content tile)
    "empty" "white"
    "snakehead"  (get-color (:id tile))
    "snakebody" (get-color (:id tile))
    "snaketail" (get-color (:id tile))
    "obstacle" "yellow"
    "food" "red"))

(defn format-tile [tile]
  (condp = (:content tile)
    "empty" " "
    "snakehead" (if (= (:id tile) (:player-id @s/game-state)) "$" "@")
    "snakebody" "#"
    "snaketail" "^"
    "obstacle" "0"
    "food" "F"))

(defn get-printable-tile [tile]
  (colors.stylize (format-tile tile) (get-tile-color tile)))

(defn get-printable-snake-info [snake]
  (colors.stylize (str (:name snake) (if (not (:alive snake)) "- [RIP]" "") "-" (:points snake) "pts" "-" (:id snake)) (get-color (:id snake))))

(defn print-pretty-map [map]
   (doseq [y (range (:height map))]
     (println (mapv #(let [tile (mu/content-at {:x % :y y} map)
                           formatted (format-tile tile)
                           color (get-tile-color tile)]
                       (colors.stylize formatted color)) (range (:width map)))
              (if (< y (count (:snakeInfos map))) (get-printable-snake-info (get (:snakeInfos map) y)) ""))))

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

(defn print [msg]
  (swap! messages conj msg))

(defn print-user-message [& msgs]
  (print {:type "user" :content (apply str msgs)}))

(defn renderer []
  (go-loop []
      (when (empty @messages) (async/<! (async/timeout 10)))
      (let [msg (first @messages)]
       (swap! messages #(into [] (rest %)))
       (when msg
          (condp = (:type msg)
            c/game-ended-message (print-game-ended-message msg)
            c/player-registered-message (print-registration-message msg)
            c/map-updated-message (print-map-updated-message (msg-utils/setup-map-message msg))
            c/snake-died-message (print-snake-died-message msg)
            c/game-starting-message (print-game-starting-message msg)
            c/invalid-player-name-message (print-invalid-player-name-message msg)
            c/heart-beat-response (println "heart beat message received")
            c/invalid-message (println "Invalid message: " msg)
            "user" (println (:content msg)))))
      (if (or (s/state-get :socket-open)
              (> (count @messages) 0))
        (recur))))
