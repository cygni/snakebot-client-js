(ns cljs-snake-bot.utils.map-utils)

(def action-templates
  [{:x-d 1 :y-d 0 :dir "RIGHT"}
   {:x-d 0 :y-d -1 :dir "UP"}
   {:x-d -1 :y-d 0 :dir "LEFT"}
   {:x-d 0 :y-d 1 :dir "DOWN"}])

(defn translate-position[{x :x y :y} map]
  (+ x (* y (:width map))))

(defn convert-map-position[pos map]
  (let [y (Math.floor (/ pos (:width map)))
        x (- pos (* y (:width map)))]
  {:x x :y y}))

(defn convert-map-positions[positions map]
  (mapv #(convert-map-position % map) positions))

(defn contains-point [point position-list]
  (some #(= point %) position-list))

(defn get-point-in-snake [point snake]
  (let [head (first (:positions snake))
        tail (last (:positions snake))
        body (rest (butlast (:positions snake)))]
    (cond
      (= head point) (assoc point :content "snakehead" :id (:id snake))
      (= tail point) (assoc point :content "snaketail" :id (:id snake))
      (contains-point point body) (assoc point :content "snakebody" :id (:id snake))
      :else nil)))

(defn snake-contains-point [point snake-infos]
 (let [points (mapv #(get-point-in-snake point %) snake-infos)
       point (some #(when (some? %) %) points)]
   point))

(defn inside-of-map [{x :x y :y} map]
  (and (>= x 0) (< x (:width map)) (>= y 0) (< y (:height map))))

(defn content-at [point map]
   (when (inside-of-map point map)
    (let [sp (snake-contains-point point (:snakeInfos map))]
      (cond
        (some? sp) sp
        (contains-point point (:foodPositions map)) (assoc point :content "food")
        (contains-point point (:obstaclePositions map)) (assoc point :content "obstacle")
        :default (assoc point :content "empty")))))

(defn get-head-of-snake [id snake-infos]
 (let [snake (some #(if (= (:id %) id) %) snake-infos)]
   (first (:positions snake))))

;Function used to evaluate the result of an action
;Takes a direction as a string, an id of a snake, and the tiles from a map update event
;Returns a string indicating the result of said action
(defn get-result-of-dir [dir id map]
  (let [my-head (get-head-of-snake id (:snakeInfos map))
        action-template (some #(when (= (:dir %) dir) %) action-templates)
        target-x (+ (:x my-head) (:x-d action-template))
        target-y (+ (:y my-head) (:y-d action-template))
        content (content-at {:x target-x :y target-y} map)]
   (when (and (some? my-head) (some? action-template))
     (condp = (:content content)
       "empty" "empty"
       "food" "food"
       "obstacle" "death"
       "snake" "death"
       "death"))))

;Function used to evaluate if one can use a direction or not
;Takes a direction as a string, an id of a snake, and the tiles from a map update event
;Returns a boolean indicating whether you will die or not if taking said action
(defn able-to-use-dir [dir id map]
  (not= (get-result-of-dir dir id map) "death"))

;Calculates the manhattan distanccec from a start point; x,y to a target point; target-x, target-y
(defn manhattan-distance
  ([{x1 :x y1 :y} {x2 :x y2 :y}] (+ (Math.abs (- x1 x2)) (Math.abs (- y1 y2))))
  ([x y target-x target-y] (+ (Math.abs (- x target-x)) (Math.abs (- y target-y)))))
