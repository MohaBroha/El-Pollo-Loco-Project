class CoinStatusBar extends DrawableObject {
    x = 20;
    y = 40;
    width = 200;
    height = 60;
    coinsCollected = 0;
    maxCoins = 30;


    IMAGES = [
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'

    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setCoins(0);
    }

    setCoins(coinsCollected) {
        this.coinsCollected = coinsCollected;

        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.coinsCollected <= 0) return 0;
        const maxIndex = this.IMAGES.length - 1;
        const ratio = this.coinsCollected / this.maxCoins;
        const index = Math.min(maxIndex, Math.ceil(ratio * maxIndex));
        return index;
    }
}
