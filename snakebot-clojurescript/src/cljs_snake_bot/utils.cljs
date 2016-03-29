(ns cljs-snake-bot.utils)

(def action-templates
  [{:x-d 1 :y-d 0 :dir "RIGHT"}
   {:x-d 0 :y-d -1 :dir "UP"}
   {:x-d -1 :y-d 0 :dir "LEFT"}
   {:x-d 0 :y-d 1 :dir "DOWN"}])

(defn indexize-tiles [tiles] (map-indexed (fn [x col] (map-indexed (fn [y tile] (merge tile {:x x :y y })) col)) tiles))

(defn filter-tiles-equals [type tiles]
  (filter #(= (:content %) type) (flatten tiles)))

(defn filter-tiles-contains [regex tiles]
  (filter #(boolean (re-find regex (:content %))) (flatten tiles)))

;Function used to retreive all the food tiles
;Takes the tiles from a map update event
;Returns all the food tiles in the current tile set. All pieces will also be facetted with the x and y position they had in the set
(defn get-food-tiles [tiles]
  (filter-tiles-equals "food" (indexize-tiles tiles)))

;Function used to retreive all the obstacle tiles
;Takes the tiles from a map update event
;Returns all the obstacle tiles in the current tile set. All pieces will also be facetted with the x and y position they had in the set
(defn get-obstacle-tiles [tiles]
  (filter-tiles-equals "obstacle" (indexize-tiles tiles)))

;Function used to retreive all the snake tiles
;Takes the tiles from a map update event
;Returns all the snake tiles in the current tile set. All pieces will also be facetted with the x and y position they had in the set
(defn get-snake-tiles [tiles]
  (filter-tiles-contains #"snake" (indexize-tiles tiles)))

;Function used to retreive all the snake head tiles
;Takes the tiles from a map update event
;Returns all the snake head tiles in the current tile set. All pieces will also be facetted with the x and y position they had in the set
(defn get-head-tiles [tiles]
  (filter-tiles-equals "snakehead" (indexize-tiles tiles)))

;Function used to retreive all the snake body tiles
;Takes the tiles from a map update event
;Returns all the snake body tiles in the current tile set. All pieces will also be facetted with the x and y position they had in the set
(defn get-body-tiles [tiles]
  (filter-tiles-equals "snakebody" (indexize-tiles tiles)))

(defn get-tile-at [x y tiles]
  (some #(when (and (= x (:x %)) (= y (:y %))) %) (flatten (indexize-tiles tiles))))

;Function used to retreive all the pieces of a snake and sort them in descending order
;Takes the id of the snake to spread an dthe tiles from a map update event
;Returns a list with all the pieces of a snake sorted in descending order
(defn get-snake-spread [id tiles]
  (let [snake-tiles (filter #(= id (:playerId %)) (get-snake-tiles tiles))
        head-tiles (filter-tiles-equals "snakehead" snake-tiles)
        body-tiles (filter-tiles-equals "snakebody" snake-tiles)]
    (concat head-tiles (sort-by #(:order %) body-tiles))))

;Function used to evaluate the result of an action
;Takes a direction as a string, an id of a snake, and the tiles from a map update event
;Returns a string indicating the result of said action
(defn get-result-of-dir [dir id tiles]
  (let [my-head (first (get-snake-spread id tiles))
        action-template (some #(when (= (:dir %) dir) %) action-templates)
        target-x (+ (:x my-head) (:x-d action-template))
        target-y (+ (:y my-head) (:y-d action-template))
        target-tile (get-tile-at target-x target-y tiles)]
   (condp = (:content target-tile)
     "empty" "nothing"
     "food" "food"
     "obstacle" "death"
     "snakehead" "death"
     "snakebody" "death"
     "death")))

;Function used to evaluate if one can use a direction or not
;Takes a direction as a string, an id of a snake, and the tiles from a map update event
;Returns a boolean indicating whether you will die or not if taking said action
(defn able-to-use-dir [dir id tiles]
  (not= (get-result-of-dir dir id tiles) "death"))

;Calculates the manhattan distanccec from a start point; x,y to a target point; target-x, target-y
(defn manhattan-distance [x y target-x target-y]
  (+ (Math.abs (- x target-x)) (Math.abs (- y target-y))))
