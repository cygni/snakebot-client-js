(ns cljs-snake-bot.snake-examples.edge-snake
  (:require [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.utils :as u]))

; This snake ot will try use the same algorithm as a basic maze solver
; It will follow this movement priority pattern: Right Up, Left, Down
; It will pick the first usable direction according to that pattern and go with that

(def dir-lookup ["RIGHT" "UP" "LEFT" "DOWN"])

(def last-direction (atom "DOWN"))

(defn is-usable [dir tiles]
 (u/able-to-use-dir dir (s/state-get :player-id) tiles))

(defn get-next-movement [msg]
 (let [tiles (:tiles (:map msg))]
   (if (is-usable @last-direction tiles)
     @last-direction
     (let [new-dir (some #(when (is-usable % tiles) %) dir-lookup)]
       (if new-dir
         (do (reset! last-direction new-dir)
             new-dir)
         @last-direction)))))
