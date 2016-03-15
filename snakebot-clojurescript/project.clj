(defproject cljs-snake-bot "0.1.0-SNAPSHOT"
  :description "Snake bot client in clojurescript for Cygnis snake bot challenge"
  :url "https://github.com/Maddemacher/cygni-cljs-snake-bot-client"

  :min-lein-version "2.5.3"

  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.170"]
                 [org.clojure/core.async "0.2.374"]]

  :plugins [[lein-cljsbuild "1.1.1"]
            [lein-figwheel "0.5.0-2"]
            [lein-npm "0.6.1"]]

  :source-paths ["src"]

  :npm {:dependencies  [ws "1.0.1"
                        colors "1.1.2"]}

  :clean-targets ["server.js"
                  "target"]

  :cljsbuild {
    :builds [{:source-paths ["src"]
              :compiler {
                :output-to "snake-bot.js"
                :output-dir "target/server_prod"
                :target :nodejs
                :optimizations :simple}}]})
