(ns cljs-snake-bot.runner
  (:require [cljs.test :as test]
            [doo.runner :refer-macros [doo-all-tests doo-tests]]
            [cljs-snake-bot.utils-test]))

(doo-tests 'cljs-snake-bot.utils-test)
