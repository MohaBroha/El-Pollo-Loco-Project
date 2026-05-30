/**
 * StatusBar für den Endboss.
 * Zeigt die aktuelle Lebensenergie visuell als Balken an.
 */
class EndbossStatusBar extends DrawableObject {

    /**
     * Bildvarianten für die Statusanzeige (0% - 100%)
     */
    IMAGES = [
        'img/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /**
     * Aktueller Prozentwert der Boss-Gesundheit
     */
    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 220;
        this.y = 8;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Setzt den aktuellen Prozentwert und aktualisiert das Bild
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Berechnet das passende Bild basierend auf Prozentwert
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}