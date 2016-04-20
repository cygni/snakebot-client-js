(ns cljs-snake-bot.helpers-test
  (:require [cljs.test :refer-macros [async deftest is testing]]
            [cljs-snake-bot.helpers :as h]))

(deftest inside-of-map-returns-valid-result
  (is (= [{:x 1 :y 2 :content "empty"} {:x 2 :y 2 :content "food"} {:x 3 :y 2 :content "empty"}]
         (h/pad-map-row-with-empty 3 [{:x 2 :y 2 :content "food"}] 2)))
  (is (= [{:x 1 :y 2 :content "empty"} {:x 2 :y 2 :content "empty"} {:x 3 :y 2 :content "empty"}]
         (h/pad-map-row-with-empty 3 [] 2))))
