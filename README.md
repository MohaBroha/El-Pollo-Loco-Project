# El Pollo Loco

A browser-based 2D platform game inspired by classic side-scrolling adventures. Control Pepe, collect coins and salsa bottles, defeat enemies, and face the dangerous Endboss in an action-packed desert environment.

## Features

* Character movement, jumping, and combat mechanics
* Collectible coins and salsa bottles
* Throwable bottle attacks
* Multiple enemy types
* Endboss battle with animations and health bar
* Sound effects and background music
* Responsive fullscreen support
* Start screen, game over screen, and victory screen
* Animated characters, enemies, clouds, and collectibles

## Gameplay

The player controls Pepe through a desert level filled with enemies and collectibles. Coins increase the coin counter, while bottles can be collected and thrown at enemies. The goal is to reach the Endboss, survive the encounter, and defeat him to win the game.

## Controls

* Arrow Left → Move left
* Arrow Right → Move right
* Space → Jump
* D → Throw bottle

## Technologies

* HTML5
* CSS3
* JavaScript (ES6)
* Canvas API
* Object-Oriented Programming (OOP)

## Project Structure

* `models/` – Game objects and game logic
* `levels/` – Level configuration and enemy placement
* `img/` – Sprites, backgrounds, status bars, and UI assets
* `audio/` – Music and sound effects
* `js/` – Core game initialization and utility scripts

## Key Components

### Character

Handles movement, jumping, animations, collisions, and interactions.

### Enemies

Includes small chickens, chicken chicks, and the Endboss with individual behaviors.

### Endboss

* Dynamic chase behavior
* Attack animations
* Hurt and death states
* Health system
* Boss health bar
* Direction changes based on player position

### Status Bars

* Health
* Coins
* Bottles
* Endboss Health

## Installation

1. Clone the repository:
   git clone <repository-url>

2. Open the project folder.

3. Start a local server, for example:

   VS Code Live Server

   or

   python -m http.server 8000

4. Open the game in your browser.

## Future Improvements

* Additional levels
* More enemy types
* Improved boss mechanics
* Save system
* Mobile controls
* Additional sound and visual effects

## Author

Moha Broha
Developed as part of the Developer Academy training program.

## License

This project was created for educational purposes.
