/**
 * Level definiert eine komplette Spielwelt-Konfiguration.
 * Enthält Gegner, Hintergrundelemente, Clouds und Coins.
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
     * Erstellt ein neues Level mit allen Komponenten.
     *
     * @param {Array} enemies Gegnerliste
     * @param {Array} clouds Wolkenliste
     * @param {Array} backgroundObjects Hintergrundobjekte
     * @param {Array} coins Coins im Level
     */
    constructor(enemies, clouds, backgroundObjects, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}