(ns cljs-snake-bot.utils-test
  (:require [cljs.test :refer-macros [async deftest is testing]]
            [cljs-snake-bot.utils :as u]))

(deftest get-food-tiles-returns-all-food-tiles
 (let [foodtiles (u/get-food-tiles [[{:content "empty"}, {:content "empty"}, {:content "food"}],
                                    [{:content "empty"}, {:content "food"}, {:content "empty"}],
                                    [{:content "food"}, {:content "empty"}, {:content "empty"}]])]
  (is (= (count foodtiles) 3))
  (is (and (= (:x (nth foodtiles 0)) 0)
           (= (:y (nth foodtiles 0)) 2)))
  (is (and (= (:x (nth foodtiles 1)) 1)
           (= (:y (nth foodtiles 1)) 1)))
  (is (and (= (:x (nth foodtiles 2)) 2)
           (= (:y (nth foodtiles 2)) 0)))))

 (deftest get-obstacle-tiles-returns-all-obstacle-tiles
  (let [obstacletiles (u/get-obstacle-tiles [[{:content "empty"}, {:content "obstacle"}, {:content "food"}],
                                             [{:content "empty"}, {:content "obstacle"}, {:content "empty"}],
                                             [{:content "food"}, {:content "obstacle"}, {:content "empty"}]])]
   (is (= (count obstacletiles) 3))
   (is (and (= (:x (nth obstacletiles 0)) 0)
            (= (:y (nth obstacletiles 0)) 1)))
   (is (and (= (:x (nth obstacletiles 1)) 1)
            (= (:y (nth obstacletiles 1)) 1)))
   (is (and (= (:x (nth obstacletiles 2)) 2)
            (= (:y (nth obstacletiles 2)) 1)))))

(def snake-tile-map [[{:content "snakehead"}, {:content "obstacle"}, {:content "food"}],
                     [{:content "empty"}, {:content "obstacle"}, {:content "empty"}],
                     [{:content "food"}, {:content "obstacle"}, {:content "snakebody"}]])

(deftest get-snake-tiles-returns-all-snake-tiles-tiles
 (let [snaketiles (u/get-snake-tiles snake-tile-map)]
  (is (= (count snaketiles) 2))
  (is (and (= (:x (nth snaketiles 0)) 0)
           (= (:y (nth snaketiles 0)) 0)))
  (is (and (= (:x (nth snaketiles 1)) 2)
           (= (:y (nth snaketiles 1)) 2)))))

(deftest get-snake-head-tiles-returns-all-snake-head-tiles
  (let [headtiles (u/get-head-tiles snake-tile-map)]
   (is (= (count headtiles) 1))
   (is (and (= (:x (nth headtiles 0)) 0)
            (= (:y (nth headtiles 0)) 0)))))

(deftest get-snake-body-tiles-returns-all-snake-body-tiles
  (let [bodytiles (u/get-body-tiles snake-tile-map)]
    (is (= (count bodytiles) 1))
    (is (and (= (:x (nth bodytiles 0)) 2)
             (= (:y (nth bodytiles 0)) 2)))))

(def best-map [[{:content "empty"},{:content "food"},{:content "snakehead" :playerId "snakeid2"},{:content "empty"},{:content "empty"},{:content "empty"}],
               [{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"}],
               [{:content "snakebody" :playerId "snakeid1" :order 2},{:content "snakebody" :playerId "snakeid1" :order 3},{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"}],
               [{:content "snakebody" :playerId "snakeid1" :order 1},{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"}],
               [{:content "snakehead" :playerId "snakeid1"},{:content "empty"},{:content "empty"},{:content "empty"},{:content "empty"}]])

(deftest get-snake-spread-returns-spread-for-snake
  (let [spread (u/get-snake-spread "snakeid1" best-map)]
    (is (= (count spread) 4))
    (is (= (:content (nth spread 0)) "snakehead"))
    (is (and (= (:content (nth spread 1)) "snakebody")
             (= (:order (nth spread 1) 1))))
    (is (and (= (:content (nth spread 2)) "snakebody")
             (= (:order (nth spread 2) 2))))
    (is (and (= (:content (nth spread 3)) "snakebody")
             (= (:order (nth spread 3) 3))))))

(deftest get-result-of-dir-returns-valid-result
  (let [upresult (u/get-result-of-dir "UP" "snakeid1" best-map)
        downresult (u/get-result-of-dir "DOWN" "snakeid1" best-map)
        leftresult (u/get-result-of-dir "LEFT" "snakeid1" best-map)
        rightresult (u/get-result-of-dir "RIGHT" "snakeid1" best-map)
        up2result (u/get-result-of-dir "UP" "snakeid2" best-map)
        unknownidresult (u/get-result-of-dir "UP" "asd" best-map)
        unknowndirectionresult (u/get-result-of-dir "asd" "snakeid2" best-map)]
    (is (= upresult "death"))
    (is (= downresult "nothing"))
    (is (= leftresult "death"))
    (is (= rightresult "death"))
    (is (= up2result "food"))
    (is (= unknownidresult nil))
    (is (= unknowndirectionresult nil))))

(deftest able-to-use-dir-returns-valid-result
  (let [upresult (u/able-to-use-dir "UP" "snakeid1" best-map)
        downresult (u/able-to-use-dir "DOWN" "snakeid1" best-map)
        leftresult (u/able-to-use-dir "LEFT" "snakeid1" best-map)
        rightresult (u/able-to-use-dir "RIGHT" "snakeid1" best-map)
        up2result (u/able-to-use-dir "UP" "snakeid2" best-map)]
    (is (= upresult false))
    (is (= downresult true))
    (is (= leftresult false))
    (is (= rightresult false))
    (is (= up2result true))))

(deftest manhattan-distance-returns-correct-distance
  (is (= 5 (u/manhattan-distance 0 1 4 2)))
  (is (= 5 (u/manhattan-distance {:x 0 :y 1} {:x 4 :y 2}))))
