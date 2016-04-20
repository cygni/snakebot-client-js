(ns cljs-snake-bot.runner
  (:require [cljs.test :as test]
            [doo.runner :refer-macros [doo-all-tests doo-tests]]
            [cljs-snake-bot.map-utils-test]
            [cljs-snake-bot.message-utils-test]
            [cljs-snake-bot.helpers-test]))

(doo-tests 'cljs-snake-bot.map-utils-test
           'cljs-snake-bot.message-utils-test
           'cljs-snake-bot.helpers-test)
