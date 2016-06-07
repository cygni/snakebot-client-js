use messages::{ Map, SnakeInfo };
use util;

#[derive(PartialEq, Debug)]
pub enum Tile<'a> {
    Food { coordinate: (i32,i32) },
    Obstacle { coordinate: (i32,i32) },
    Empty { coordinate: (i32,i32) },
    SnakeHead { coordinate: (i32,i32), snake: &'a SnakeInfo },
    SnakeBody { coordinate: (i32,i32), snake: &'a SnakeInfo }
}

#[derive(Debug)]
pub enum Direction {
    Down,
    Up,
    Left,
    Right
}

pub fn direction_as_string(direction: &Direction) -> String {
    let s = match direction {
        &Direction::Down => "DOWN",
        &Direction::Up => "UP",
        &Direction::Left => "LEFT",
        &Direction::Right => "RIGHT"
    };

    String::from(s)
}

pub fn direction_as_movement_delta(direction: &Direction) -> (i32,i32) {
    match direction {
        &Direction::Down => (0, 1),
        &Direction::Up => (0, -1),
        &Direction::Left => (-1, 0),
        &Direction::Right => (1, 0)
    }
}

impl Map {
    pub fn get_snake_by_id<'a>(&'a self, id: &String) -> Option<&'a SnakeInfo> {
        self.snakeInfos.iter().find(|s| &s.id == id)
    }

    pub fn get_tile_at(&self, coordinate: (i32,i32)) -> Tile {
        let position = util::translate_coordinate(coordinate, self.width);
        let snake_at_tile = self.snakeInfos.iter().find(|s| s.positions.contains(&position));

        if self.obstaclePositions.contains(&position) {
            Tile::Obstacle { coordinate: coordinate }
        } else if self.foodPositions.contains(&position) {
            Tile::Food { coordinate: coordinate }
        } else if snake_at_tile.is_some() {
            let s = snake_at_tile.unwrap();
            if s.positions[0] == position {
                Tile::SnakeHead { coordinate: coordinate, snake: s }
            } else {
                Tile::SnakeBody { coordinate: coordinate, snake: s }
            }
        } else {
            Tile::Empty { coordinate: coordinate }
        }
    }

    pub fn is_tile_available_for_movement(&self, coordinate: (i32,i32)) -> bool {
        let tile = self.get_tile_at(coordinate);
        match tile {
            Tile::Empty { coordinate: _ } => true,
            Tile::Food { coordinate: _ } => true,
            _ => false
        }
    }

    pub fn can_snake_move_in_direction(&self, snake: &SnakeInfo, direction: Direction) -> bool {
        let (xd,yd) = direction_as_movement_delta(&direction);
        let (x,y) = util::translate_position(snake.positions[0], self.width);

        self.is_tile_available_for_movement((x+xd,y+yd))
    }

    #[allow(dead_code)]
    pub fn is_coordinate_out_of_bounds(&self, coordinate: (i32,i32)) -> bool {
        let (x,y) = coordinate;
        x < 0 || x >= self.width || y < 0 || y >= self.height
    }
}

#[cfg(test)]
mod test {
    use util::{ translate_coordinate };
    use maputil::{ Direction, Tile };
    use messages::{ Map, SnakeInfo };

    const MAP_WIDTH: i32 = 3;

    fn get_snake_one() -> SnakeInfo {
        SnakeInfo {
            name: String::from("1"),
            points: 0,
            tailProtectedForGameTicks: 0,
            positions: vec![translate_coordinate((1,1), MAP_WIDTH),
                            translate_coordinate((0,1), MAP_WIDTH)],
            id: String::from("1")
        }
    }

    fn get_snake_two() -> SnakeInfo {
        SnakeInfo {
            name: String::from("2"),
            points: 0,
            tailProtectedForGameTicks: 0,
            positions: vec![translate_coordinate((1,2), MAP_WIDTH)],
            id: String::from("2")
        }
    }

    // The map used for testing, 1 and 2 represents the snakes
    //yx012
    //0  F
    //1 11#
    //2  2
    fn get_test_map() -> Map {
        Map {
            type_: String::from("type"),
            width: MAP_WIDTH,
            height: MAP_WIDTH,
            worldTick: 0,
            snakeInfos: vec![get_snake_one(), get_snake_two()],
            foodPositions: vec![translate_coordinate((1,0),  MAP_WIDTH)],
            obstaclePositions: vec![translate_coordinate((2,1), MAP_WIDTH)],
            receivingPlayerId: Some(String::from("1"))
        }
    }

    #[test]
    fn snake_can_be_found_by_id() {
        let map = get_test_map();
        let id = map.receivingPlayerId.as_ref().unwrap();
        let s = map.get_snake_by_id(id);
        let found_id = &s.unwrap().id;
        assert_eq!(id, found_id);
    }

    #[test]
    fn tile_is_correctly_found() {
        let map = get_test_map();
        let snake_one = get_snake_one();
        let snake_two = get_snake_two();
        let tiles =
            vec![
                vec![Tile::Empty{ coordinate: (0,0) },
                     Tile::Food{ coordinate: (1,0) },
                     Tile::Empty{ coordinate: (2,0) }],
                vec![Tile::SnakeBody{ coordinate: (0,1), snake: &snake_one },
                     Tile::SnakeHead{ coordinate: (1,1), snake: &snake_one },
                     Tile::Obstacle{ coordinate: (2,1)}],
                vec![Tile::Empty{ coordinate: (0,2) },
                     Tile::SnakeHead{ coordinate: (1,2), snake: &snake_two },
                     Tile::Empty{ coordinate:(2,2) }]];
        for y in 0..map.width {
            for x in 0..map.height {
                assert_eq!(tiles[y as usize][x as usize],
                           map.get_tile_at((x,y)));
            }
        }
    }

    #[test]
    fn tile_is_correctly_marked_as_movable() {
        let map = get_test_map();
        let tiles = vec![vec![true, true, true],
                         vec![false, false, false],
                         vec![true, false, true]];

        for y in 0..map.height {
            for x in 0..map.width {
                assert_eq!(tiles[y as usize][x as usize],
                           map.is_tile_available_for_movement((x,y)));
            }
        }
    }

    #[test]
    fn can_snake_move_identifies_correctly() {
        let map = get_test_map();
        let id = map.receivingPlayerId.as_ref().unwrap();
        let snake = map.get_snake_by_id(id).unwrap();

        assert_eq!(true, map.can_snake_move_in_direction(&snake, Direction::Up));
        assert_eq!(false, map.can_snake_move_in_direction(&snake, Direction::Down));
        assert_eq!(false, map.can_snake_move_in_direction(&snake, Direction::Left));
        assert_eq!(false, map.can_snake_move_in_direction(&snake, Direction::Right));
    }
}
