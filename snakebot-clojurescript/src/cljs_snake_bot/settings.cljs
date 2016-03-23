(ns cljs-snake-bot.settings)

(def game-state (atom
                 {:player-name ""
                  :player-color ""
                  :player-id ""
                  :game-height 0
                  :game-width 0
                  :number-of-players 0
                  :is-playing false
                  :game-tick 0
                  :game-running true}))

(def host-name "snake.cygni.se")
(def host-port "80")
(def game-mode "training")

(defn state-get [key]
  (key @game-state))

(defn state-set [key value]
  (if (fn? value)
   (swap! game-state update-in [key] value)
   (swap! game-state assoc key value)))

(defn state-set-many [value-map]
     (reset! game-state (merge @game-state value-map)))

(def printer-settings
   {:pretty-print-map-updated true
    :pretty-print-game-ended false
    :pretty-print-game-starting false
    :pretty-print-snake-died true
    :pretty-print-invalid-player-name false
    :pretty-print-player-registration false})

(def default-map
  {:width 10
   :height 10
   :maxNoofPlayers 5
   :startSnakeLength 1
   :timeInMsPerTick 250
   :obstaclesEnabled false
   :foodEnabled true
   :edgeWrapsAround false
   :headToTailConsumes false
   :tailConsumeGrows false
   :addFoodLikelihood 15
   :removeFoodLikelihood 5
   :addObstacleLikelihood 15
   :removeObstacleLikelihood 15})
