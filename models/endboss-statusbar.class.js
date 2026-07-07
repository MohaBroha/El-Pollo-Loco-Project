/**
 * Status bar used for the endboss. Displays endboss health visually as a bar.
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

    /** Current health percentage of the boss */
    percentage = 100;

    /**
     * Initialize the endboss status bar and preload images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 700;
        this.y = 8;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Set the current percentage and update the displayed image.
     *
     * @param {number} percentage - Current percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolve the image index corresponding to the current percentage.
     * @returns {number} Image index.
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