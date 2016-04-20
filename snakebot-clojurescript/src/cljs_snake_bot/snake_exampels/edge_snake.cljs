(ns cljs-snake-bot.snake-examples.edge-snake
  (:require [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.utils.map-utils :as mu])
  (:use     [cljs-snake-bot.helpers :only [find-first]]))

; This snake ot will try use the same algorithm as a basic maze solver
; It will follow this movement priority pattern: Right Up, Left, Down
; It will pick the first usable direction according to that pattern and go with that

(def dir-lookup ["RIGHT" "UP" "LEFT" "DOWN"])

(def last-direction (atom "DOWN"))

(defn is-usable [dir map]
 (mu/able-to-use-dir dir (s/state-get :player-id) map))

(defn get-next-movement [msg]
 (let [map (:map msg)]
   (if (is-usable @last-direction map)
     @last-direction
     (let [new-dir (find-first #(is-usable % map) dir-lookup)]
       (if new-dir
         (do (reset! last-direction new-dir)
             new-dir)
         @last-direction)))))
