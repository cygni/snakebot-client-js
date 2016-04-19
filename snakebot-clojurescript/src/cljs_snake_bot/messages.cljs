(ns cljs-snake-bot.messages
  (:require [cljs-snake-bot.constants :as c]
            [cljs-snake-bot.settings :as s]
            [cljs.nodejs :as nodejs]))

(def os (nodejs/require "os"))

(defn get-ipv4 [addresses]
  (:address (some #(when (= (:family %) "IPv4") %) addresses)))

(defn get-ip []
  (let [interfaces (js->clj (.networkInterfaces os) :keywordize-keys true)
        eth0 (:eth0 interfaces)
        wifi (:Wi-Fi interfaces)]
    (if eth0 (get-ipv4 eth0)
             (get-ipv4 wifi))))

(defn get-os []
  (str (.platform os) " - " (.release os)))

(defn get-start-game-message []
  {:type c/start-game-message})

(defn get-move-message [direction]
  {:type c/register-move-message
   :direction (if (nil? direction) "DOWN" direction)
   :gameId (s/state-get :game-id)
   :gameTick (s/state-get :game-tick)})


(defn get-player-registration-message [name]
  {:type c/register-player-message
   :playerName name
   :gameSettings s/default-map})

(defn get-ping-message []
  {:type c/heart-beat-message})

(defn get-client-info-message []
  {:language "Clojurescript"
   :operatingSystem (get-os)
   :ipAddress (get-ip)
   :clientVersion s/client-version
   :type c/client-info-message})
