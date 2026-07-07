/**
 * Player health status bar.
 * Visually represents player health by switching between predefined images
 * depending on the current percentage value.
 */
class StatusBar extends DrawableObject {

    /**
     * Bildzustände der Health-Bar (0% bis 100%)
     */
    IMAGES = [
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /**
     * Aktueller Prozentwert der Lebensanzeige
     */
    percentage = 100;

    /**
     * Initialize the status bar, preload images and set default values.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Update the displayed image based on the current health percentage.
     *
     * @param {number} percentage - Current health percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolve the image index corresponding to the current percentage.
     *
     * @returns {number} Index in the `IMAGES` array.
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