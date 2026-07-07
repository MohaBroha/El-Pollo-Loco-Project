/**
 * Level configuration container that holds enemies, backgrounds, clouds and coins.
 */
class Level {

    /**
     * Liste aller Gegner im Level
     */
    enemies;

    /**
     * Wolken im Hintergrund
     */
    clouds;

    /**
     * Hintergrundgrafiken des Levels
     */
    backgroundObjects;

    /**
     * Sammelbare Coins im Level
     */
    coins;

    /**
     * Ende des Levels (X-Koordinate)
     */
    level_end_x = 3650;

    /**
     * Create a new Level instance.
     *
     * @param {Array} enemies - Array of enemy objects.
     * @param {Array} clouds - Array of cloud objects.
     * @param {Array} backgroundObjects - Array of background objects.
     * @param {Array} coins - Array of coin objects.
     */
    constructor(enemies, clouds, backgroundObjects, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}