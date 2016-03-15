(ns cljs-snake-bot.snake-examples.edge-snake
  (:require [cljs-snake-bot.settings :as s]))

; This snake ot will try use the same algorithm as a basic maze solver
; It will follow this movement priority pattern: Right Up, Left, Down
; It will pick the first usable direction according to that pattern and go with that

(def dir-lookup
  [{:x-d 1 :y-d 0 :dir "RIGHT"}
   {:x-d 0 :y-d -1 :dir "UP"}
   {:x-d -1 :y-d 0 :dir "LEFT"}
   {:x-d 0 :y-d 1 :dir "DOWN"}])

(def last-direction (atom {:x-d 0 :y-d 1 :dir "DOWN"}))

(defn is-usable-tile [tile]
  (or (= "empty" (:content tile))
      (= "food" (:content tile))))

(defn is-usable [head-x head-y dir-template tiles]
  (let [x (+ head-x (:x-d dir-template))
        y (+ head-y (:y-d dir-template))
        target-tile (get (get tiles x) y)]
    (if (is-usable-tile target-tile)
      dir-template
      nil)))

(defn get-next-movement [msg]
 (let [snake-infos (:snakeInfos (:map msg))
       me (some #(when (= (:id %) (s/state-get :player-id)) %) snake-infos)
       tiles (:tiles (:map msg))]
  (if (is-usable (:x me) (:y me) @last-direction tiles)
      (:dir @last-direction)
      (let [new-dir-template (some #(is-usable (:x me) (:y me) % tiles) dir-lookup)]
            (reset! last-direction new-dir-template)
            (:dir new-dir-template)))))
