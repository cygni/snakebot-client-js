(ns cljs-snake-bot.utils.message-utils
  (:require [cljs-snake-bot.utils.map-utils :as mu]))

(defn setup-map-message [message]
 (let [map (:map message)
       updated-map (assoc map
                          :foodPositions (into [] (mu/convert-map-positions (:foodPositions map) map))
                          :obstaclePositions (into [] (mu/convert-map-positions (:obstaclePositions  map) map))
                          :snakeInfos (into [] (mapv #(assoc % :positions (mu/convert-map-positions (:positions %) map)) (:snakeInfos map))))]
   (assoc message :map updated-map)))
