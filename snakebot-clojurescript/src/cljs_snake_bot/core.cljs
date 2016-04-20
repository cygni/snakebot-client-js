(ns cljs-snake-bot.core
  (:require-macros [cljs.core.async.macros :refer [go-loop]])
  (:require [cljs.nodejs :as nodejs]
            [cljs-snake-bot.messagehandler :as mh]
            [cljs-snake-bot.constants :as c]
            [cljs-snake-bot.settings :as s]
            [cljs-snake-bot.messages :as m]
            [cljs-snake-bot.printer :as p]
            [cljs.core.async :as async :refer [<! timeout]]))

(nodejs/enable-util-print!)

(def ws (nodejs/require "ws"))
(def socket (ws (str "ws://" s/host-name ":" s/host-port "/" s/game-mode)))

(defn json-str [obj]
  (JSON/stringify (clj->js obj)))

(defn json-parse [j]
  (js->clj (JSON/parse j) :keywordize-keys true))

(defn setup-listener []
    (.on socket "message"
         #(let [response (mh/get-response-message (json-parse %))]
            (when (some? response) (.send socket (json-str response))))))

(defn setup-server-ping []
 (go-loop []
   (.send socket (json-str (m/get-ping-message)))
   (async/<! (async/timeout 30000))
   (when (s/state-get :socket-open) (recur))))

(defn setup-socket []
  (.on socket "open"
       #(do (println "socket opened")
            (s/state-set :socket-open true)
            (.send socket (json-str (m/get-player-registration-message "emi")))
            (.send socket (json-str (m/get-client-info-message)))
            (setup-listener)
            (setup-server-ping)
            (p/renderer)))
  (.on socket "close"
       #(s/state-set :socket-open false)))

(defn -main []
  (setup-socket))

(set! *main-cli-fn* -main)
