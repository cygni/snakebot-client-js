(ns cljs-snake-bot.map-utils-test
  (:require [cljs.test :refer-macros [async deftest is testing]]
            [cljs-snake-bot.utils.map-utils :as mu]))

(def best-map {:width 15,
               :height 15,
               :worldTick 1,
               :snakeInfos [{
                             :name "python",
                             :points 0,
                             :positions [ {:x 0 :y 0}, {:x 1 :y 0}, {:x 2 :y 0} ],
                             :id "id_python"
                             },
                            {
                             :name "cobra",
                             :points 0,
                             :positions [ {:x 4 :y 4} {:x 4 :y 3} ],
                             :id "id_cobra"
                             }],
               :foodPositions [ {:x 0 :y 1} ],
               :obstaclePositions [ {:x 3 :y 4} ],
               :receivingPlayerId "asd",
               :type "se.cygni.snake.api.model.Map"})

(deftest inside-of-map-returns-valid-result
  (is (true? (mu/inside-of-map {:x 0 :y 0} best-map)))
  (is (true? (mu/inside-of-map {:x 14 :y 0} best-map)))
  (is (false? (mu/inside-of-map {:x 15 :y 0} best-map)))
  (is (true? (mu/inside-of-map {:x 14 :y 14} best-map)))
  (is (false? (mu/inside-of-map {:x 14 :y 15} best-map)))
  (is (false? (mu/inside-of-map {:x -1 :y 0} best-map)))
  (is (false? (mu/inside-of-map {:x 0 :y -1} best-map))))

(deftest get-content-at-returns-valid-result
  (is (= nil (mu/content-at {:x 15 :y 0} best-map)))
  (is (= nil (mu/content-at {:x 0 :y 15} best-map)))
  (is (= nil (mu/content-at {:x -1 :y 0} best-map)))
  (is (= nil (mu/content-at {:x 0 :y -1} best-map)))
  (is (= "food" (:content (mu/content-at {:x 0 :y 1} best-map))))
  (is (= "obstacle" (:content (mu/content-at {:x 3 :y 4} best-map))))
  (let [pythonhead (mu/content-at {:x 0 :y 0} best-map)
        pythonbody (mu/content-at {:x 1 :y 0} best-map)
        pythontail (mu/content-at {:x 2 :y 0} best-map)]
    (is (= "snakehead" (:content pythonhead)))
    (is (= "id_python" (:id pythonhead)))
    (is (= "snakebody" (:content pythonbody)))
    (is (= "id_python" (:id pythonbody)))
    (is (= "snaketail" (:content pythontail)))
    (is (= "id_python" (:id pythontail))))
  (let [cobrahead (mu/content-at {:x 4 :y 4} best-map)
        cobratail (mu/content-at {:x 4 :y 3} best-map)]
    (is (= "snakehead" (:content cobrahead)))
    (is (= "id_cobra" (:id cobrahead)))
    (is (= "snaketail" (:content cobratail)))
    (is (= "id_cobra" (:id cobratail))))
  (is (= "empty" (:content (mu/content-at {:x 10 :y 3} best-map)))))

(deftest get-result-of-dir-returns-valid-result
  (let [upresult (mu/get-result-of-dir "UP" "id_python" best-map)
        downresult (mu/get-result-of-dir "DOWN" "id_python" best-map)
        leftresult (mu/get-result-of-dir "LEFT" "id_python" best-map)
        rightresult (mu/get-result-of-dir "RIGHT" "id_python" best-map)
        up2result (mu/get-result-of-dir "UP" "id_cobra" best-map)
        unknownidresult (mu/get-result-of-dir "UP" "asd" best-map)
        unknowndirectionresult (mu/get-result-of-dir "asd" "id_cobra" best-map)]
    (is (= upresult "death"))
    (is (= downresult "food"))
    (is (= leftresult "death"))
    (is (= rightresult "death"))
    (is (= up2result "death"))
    (is (= unknownidresult nil))
    (is (= unknowndirectionresult nil))))

(deftest able-to-use-dir-returns-valid-result
  (let [upresult (mu/able-to-use-dir "UP" "id_python" best-map)
        downresult (mu/able-to-use-dir "DOWN" "id_python" best-map)
        leftresult (mu/able-to-use-dir "LEFT" "id_python" best-map)
        rightresult (mu/able-to-use-dir "RIGHT" "id_python" best-map)
        up2result (mu/able-to-use-dir "LEFT" "id_cobra" best-map)]
    (is (= upresult false))
    (is (= downresult true))
    (is (= leftresult false))
    (is (= rightresult false))
    (is (= up2result false))))

(deftest manhattan-distance-returns-correct-distance
  (is (= 5 (mu/manhattan-distance 0 1 4 2)))
  (is (= 5 (mu/manhattan-distance {:x 0 :y 1} {:x 4 :y 2}))))

(deftest get-ordered-content-positions-returns-correct-order
  (is (= [{:x 1 :y 1} {:x 2 :y 1} {:x 1 :y 2} {:x 2 :y 2} {:x 1 :y 3}]
         (mu/get-ordered-content-positions {:foodPositions [ {:x 1 :y 3} {:x 1 :y 1} {:x 1 :y 2} {:x 2 :y 2} {:x 2 :y 1} ] :width 15 :height 15}))))
