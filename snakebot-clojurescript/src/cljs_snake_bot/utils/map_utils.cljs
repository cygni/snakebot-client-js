(ns cljs-snake-bot.utils.map-utils)

(def reference-map (atom {}))

(def action-templates
  {:RIGHT {:x 1 :y 0}
   :UP {:x 0 :y -1}
   :LEFT {:x -1 :y 0}
   :DOWN {:x 0 :y 1}})

(defn translate-position [{x :x y :y} map-width]
  (+ x (* y map-width)))

(defn convert-map-position[pos map]
  (let [y (Math.floor (/ pos (:width map)))
        x (- pos (* y (:width map)))]
  {:x x :y y}))

(defn convert-map-positions[positions map]
  (mapv #(convert-map-position % map) positions))

(defn contains-point [point position-list]
  (contains? (set position-list) point))

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
 (some #(let [p (get-point-in-snake point %)]
          (when (some? p) p)) snake-infos))

(defn inside-of-map [{x :x y :y} map]
  (and (>= x 0) (< x (:width map)) (>= y 0) (< y (:height map))))

(defn create-content-map [width height positions]
 (let [absolute-positions (into #{} (mapv #(translate-position % width) positions))]
   (map-indexed #(contains? absolute-positions %) (repeat (* width height) false))))

(defn setup-map-buffer! [map]
  (when (not= (:worldTick @reference-map)
              (:worldTick map))
    (let [positions (apply concat
                      (:foodPositions map)
                      (:obstaclePositions map)
                      (mapv :positions (:snakeInfos map)))
          content-map (into [] (create-content-map (:width map) (:height map) positions))]
      (reset! reference-map (assoc map :content-reference content-map)))))

(defn content-at [point map]
  (setup-map-buffer! map)
  (when (inside-of-map point map)
    (case (get (:content-reference @reference-map) (translate-position point (:width map)))
      true (let [sp (snake-contains-point point (:snakeInfos map))]
             (cond
               (some? sp) sp
               (contains-point point (:foodPositions map)) (assoc point :content "food")
               (contains-point point (:obstaclePositions map)) (assoc point :content "obstacle")
               :else (assoc point :content "empty")))
      false (assoc point :content "empty")
      :else nil)))

(defn get-head-of-snake [id snake-infos]
  (let [snake (some #(when (= (:id %) id) %) snake-infos)]
    (first (:positions snake))))

;Function used to evaluate the result of an action
;Takes a direction as a string, an id of a snake, and the tiles from a map update event
;Returns a string indicating the result of said action
(defn get-result-of-dir [dir id map]
  (let [my-head (get-head-of-snake id (:snakeInfos map))
        action-template ((keyword dir) action-templates)
        target-point (merge-with + my-head action-template)
        content (content-at target-point map)]
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
  ([x y target-x target-y] (+ (Math.abs (- x target-x)) (Math.abs (- y target-y))))
  ([{x1 :x y1 :y} {x2 :x y2 :y}] (manhattan-distance x1 y1 x2 y2)))
