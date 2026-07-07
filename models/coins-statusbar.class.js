/**
 * UI element that shows the number of collected coins as a visual status bar.
 */
class CoinStatusBar extends DrawableObject {

    /**
     * Position und Größe der Statusbar
     */
    x = 20;
    y = 50;
    width = 200;
    height = 60;

    /**
     * Aktuell gesammelte Coins
     */
    coinsCollected = 0;

    /**
     * Maximale Anzahl an Coins für 100%
     */
    maxCoins = 30;

    /**
     * Bildvarianten für Coin-Statusanzeige
     */
    IMAGES = [
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    /**
     * Initialize the coin status bar and preload images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setCoins(0);
    }

    /**
     * Set current collected coins and update the displayed image.
     *
     * @param {number} coinsCollected - Number of coins collected.
     */
    setCoins(coinsCollected) {
        this.coinsCollected = coinsCollected;

        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolve the appropriate image index based on the number of collected coins.
     *
     * @returns {number} Index in the `IMAGES` array.
     */
    resolveImageIndex() {
        if (this.coinsCollected <= 0) return 0;
        const maxIndex = this.IMAGES.length - 1;
        const ratio = this.coinsCollected / this.maxCoins;
        const index = Math.min(maxIndex, Math.ceil(ratio * maxIndex));
        return index;
    }
}