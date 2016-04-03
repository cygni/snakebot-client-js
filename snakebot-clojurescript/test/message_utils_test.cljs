(ns cljs-snake-bot.message-utils-test
  (:require [cljs.test :refer-macros [async deftest is testing]]
            [cljs-snake-bot.utils.message-utils :as mu]))


(def test-map-update-message {:map
                              {:width 15,
                               :height 15,
                               :worldTick 1,
                               :snakeInfos [{
                                             :name "python",
                                             :points 0,
                                             :positions [ 0, 15, 30 ],
                                             :id "id_python"
                                             },
                                            {
                                             :name "cobra",
                                             :points 0,
                                             :positions [ 2, 17, 32 ],
                                             :id "id_cobra"
                                             }],
                               :foodPositions [ 29,70,106 ],
                               :obstaclePositions [ 12,17,78 ],
                               :receivingPlayerId "asd",
                               :type "se.cygni.snake.api.model.Map"}})

(defn verify-snake [old new new-positions]
  (is (= (:name old) (:name new)))
  (is (= (:points old) (:points new)))
  (is (= (:id old) (:id new)))
  (is (= (:positions new) new-positions)))

(deftest setup-map-converts-all-positions
  (let [old (:map test-map-update-message)
        updated-map (:map (mu/setup-map-message test-map-update-message))]
    (is (= (:width old) (:width updated-map)))
    (verify-snake (get (:snakeInfos old) 0) (get (:snakeInfos updated-map) 0) [{:x 0 :y 0} {:x 0 :y 1} {:x 0 :y 2}])
    (verify-snake (get (:snakeInfos old) 1) (get (:snakeInfos updated-map) 1) [{:x 2 :y 0} {:x 2 :y 1} {:x 2 :y 2}])
    (is (= (:width old) (:width updated-map)))
    (is (= (:foodPositions updated-map) [{:x 14 :y 1}, {:x 10 :y 4}, {:x 1 :y 7}]))
    (is (= (:obstaclePositions updated-map) [{:x 12 :y 0}, {:x 2 :y 1}, {:x 3 :y 5}]))
    (is (= (:receivingPlayerId updated-map) (:receivingPlayerId updated-map)))
    (is (= (:type old) (:type updated-map)))))
