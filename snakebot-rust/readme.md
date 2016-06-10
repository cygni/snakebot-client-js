# SNAKE CLIENT

Do you want the most annoying compiler ever?
Do you want to constantly think of what is owning what variable?
Do you want to stare angrily at the screen and wonder what the hell it means that some dumb value can't be moved?
Then here is the ultimate snake client for you, written for the beautiful language Rust.

## Requirements

* Rust nightly (I recommend using [rustup](https://github.com/rust-lang-nursery/rustup.rs) to install it)
* Cargo (should automatically be installed by rustup)
* Snake Server (local or remote)

The packages used have a tendency to sometimes break due to using the nightly build,
so if it doesn't work try to install specifically: *rustc 1.11.0-nightly (12238b984 2016-06-04)*.

## Setup

A. Clone the repository: `git clone https://github.com/cygni/snakebot-clients.git`;

B. Open: `<repo>/snakebot-rust`;

C. Run the snake: `cargo run`;

D. Improve the snake: edit `src/snake.rs`, and more specifically `get_next_move`.

E. Debugging: see `log/snake.log` for all log output from the snake.
