/**
 * Repräsentiert die Flaschen-Statusleiste im UI.
 * Zeigt an, wie viele Flaschen der Spieler gesammelt hat.
 * Erbt von DrawableObject für die Darstellung auf dem Canvas.
 */
class BottleStatusBar extends DrawableObject {

    /** @type {number} */
    x = 20;

    /** @type {number} */
    y = 100;

    /** @type {number} */
    width = 200;

    /** @type {number} */
    height = 60;

    /** @type {number} */
    bottlesCollected = 0;

    /** @type {number} */
    maxBottles = 6;

    /** @type {string[]} */
    IMAGES = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    /**
     * Initialize the bottle status bar and preload UI images.
     */
    constructor() {
        super();
        this.imageCache = {};
        this.loadImages(this.IMAGES);
        this.setBottles(0);
        this.otherDirection = false;
    }

    /**
     * Update the number of collected bottles and set the appropriate UI image.
     *
     * @param {number} bottlesCollected - Number of bottles collected by the player.
     */
    setBottles(bottlesCollected) {
        this.bottlesCollected = bottlesCollected;
        let index = this.resolveImageIndex();
        let path = this.IMAGES[index];
        this.img = this.imageCache[path];
    }

    /**
     * Resolve the image index for the status bar based on collected bottles.
     *
     * @returns {number} Index in the `IMAGES` array.
     */
    resolveImageIndex() {
        let percentage = (this.bottlesCollected / this.maxBottles) * 100;

        if (percentage == 100) return 5;
        else if (percentage > 80) return 4;
        else if (percentage > 60) return 3;
        else if (percentage > 40) return 2;
        else if (percentage > 20) return 1;
        else return 0;
    }
}