(ns cljs-snake-bot.settings)

(def player-name (atom (str)))
(def player-color (atom (str)))
(def player-id (atom (str)))
(def game-id (atom (str)))
(def game-height (atom 0))
(def game-width (atom 0))
(def number-of-players (atom 0))
(def is-playing (atom true))
(def game-running (atom true))
(def game-tick (atom 0))

(def host-name "localhost")
(def host-port "8080")
(def game-mode "training")

(def printer-settings
  {
    :pretty-print-map-updated true
    :pretty-print-game-ended false
    :pretty-print-game-starting false
    :pretty-print-snake-died true
    :pretty-print-invalid-player-name false
    :pretty-print-win-message false
   })

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
