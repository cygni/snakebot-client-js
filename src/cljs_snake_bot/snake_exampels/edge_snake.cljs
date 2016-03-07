(ns cljs-snake-bot.snake-examples.edge-snake
  (:require [cljs-snake-bot.settings :as s]))

;This snake ot will try use the same algorithm as a basic maze solver
; It will follow this movement priority pattern: Right Up, Left, Down
; It will pick the first usable direction according to that pattern and go with that

(def dir-lookup
  [{:x-d 0 :y-d 1 :dir "RIGHT"}
   {:x-d 1 :y-d 0 :dir "UP"}
   {:x-d 0 :y-d -1 :dir "LEFT"}
   {:x-d -1 :y-d 0 :dir "DOWN"}])

(defn is-usable [head-x head-y dir-template tiles]
  (let [x (+ head-x (:x-d dir-template))
        y (+ head-y (:y-d dir-template))
        target-tile (first (drop x (first (drop y tiles))))]
        (println "x " x " y " y " tt " target-tile)
    (if (and
          (and (< 0 x) (< 0 y))
          (= "empty" (:content target-tile)))
      (:dir dir-template)
      nil)))

(defn get-next-movement [msg]
 (let [snake-infos (:snakeInfos (:map msg))
       me (first (filter #(= (:name %) @s/player-name) snake-infos))
       tiles (:tiles (:map msg))
       new-dir (some #(is-usable (:x me) (:y me) % tiles) dir-lookup)]
       (println "me " me)
   (println new-dir)
   new-dir))
