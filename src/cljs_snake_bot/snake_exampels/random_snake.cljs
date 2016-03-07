(ns cljs-snake-bot.snake-examples.random-snake
  (:require [cljs.core :as core]))

(def last-direction (atom "DOWN"))

(defn get-next-movement [msg]
  (let [new-dir (rand-int 3)]
                (condp = @last-direction
                  "DOWN"  (condp = new-dir
                            0 "DOWN"
                            1 "LEFT"
                            2 "RIGHT"); "DOWN"
                  "UP" (condp = new-dir
                            0 "UP"
                            1 "LEFT"
                            2 "RIGHT");"UP"
                  "LEFT" (condp = new-dir
                            0 "LEFT"
                            1 "UP"
                            2 "DOWN")
                  "RIGHT" (condp = new-dir
                            0 "RIGHT"
                            1 "UP"
                            2 "DOWN"))))
