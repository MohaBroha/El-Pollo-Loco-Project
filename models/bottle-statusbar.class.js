/**
 * Repräsentiert die Flaschen-Statusleiste im UI.
 * Zeigt an, wie viele Flaschen der Spieler gesammelt hat.
 * Erbt von DrawableObject für die Darstellung auf dem Canvas.
 */
class BottleStatusBar extends DrawableObject {

    /** @type {number} */
    x = 220;

    /** @type {number} */
    y = 40;

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
     * Erstellt die Flaschen-Statusleiste und lädt alle UI-Bilder.
     */
    constructor() {
        super();
        this.imageCache = {};
        this.loadImages(this.IMAGES);
        this.setBottles(0);
        this.otherDirection = false;
    }

    /**
     * Aktualisiert die Anzahl der gesammelten Flaschen
     * und setzt das passende UI-Bild.
     * @param {number} bottlesCollected
     */
    setBottles(bottlesCollected) {
        this.bottlesCollected = bottlesCollected;
        let index = this.resolveImageIndex();
        let path = this.IMAGES[index];
        this.img = this.imageCache[path];
    }

    /**
     * Berechnet den passenden Statusleisten-Index
     * basierend auf der Anzahl gesammelter Flaschen.
     * @returns {number}
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