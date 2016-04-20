(ns cljs-snake-bot.helpers)


(defn find-first [predicate collection]
  (some #(when (predicate %) %) collection))

(defn pad [n coll val]
  (take n (concat col (repeat val))))

(defn pad-map-row-with-empty [n map-row y]
  (sort-by :x (pad-ordered n map-row {:y y :content "empty"} :x #(+ % 1) 1)))

(defn pad-ordered [n coll base-val key incrementor val]
  (if (= n 0)
    coll
    (pad-ordered (- n 1)
                 (if (find-first #(= (key %) val) coll)
                     coll
                     (conj coll (assoc base-val key val))) base-val key incrementor (incrementor val))))
