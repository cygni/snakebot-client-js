#[allow(dead_code)]
pub fn translate_position(position: i32, map_width: i32) -> (i32,i32) {
    let pos = position as f64;
    let width = map_width as f64;

    let y = (pos / width).floor();
    let x = (pos - y * width).abs();

    (x as i32, y as i32)
}

#[allow(dead_code)]
pub fn translate_positions(positions: &Vec<i32>, map_width: i32) -> Vec<(i32,i32)> {
    positions.into_iter().map(|pos| translate_position(*pos, map_width)).collect()
}

#[allow(dead_code)]
pub fn translate_coordinate(coordinates: (i32,i32), map_width: i32) -> i32 {
    let (x,y) = coordinates;
    x + y * map_width
}

#[allow(dead_code)]
pub fn get_manhattan_distance(start: (i32,i32), goal: (i32,i32)) ->  i32 {
    let (x1,y1) = start;
    let (x2,y2) = goal;

    let x = ( x1 - x2 ).abs();
    let y = ( y1 - y2 ).abs();

    x+y
}

#[allow(dead_code)]
pub fn get_euclidian_distance(start: (i32,i32), goal: (i32,i32)) -> f64 {
    let (x1,y1) = start;
    let (x2,y2) = goal;

    let x = ( x1 - x2 ).pow(2);
    let y = ( y1 - y2 ).pow(2);
    let d = ( x + y ) as f64;

    d.sqrt().floor()
}

#[allow(dead_code)]
pub fn is_within_square(coord: (i32,i32), ne_coord: (i32,i32), sw_coord: (i32,i32)) -> bool {
    let (x,y) = coord;
    let (ne_x, ne_y) = ne_coord;
    let (sw_x, sw_y) = sw_coord;

    x < ne_x || x > sw_x || y < sw_y || y > ne_y
}
