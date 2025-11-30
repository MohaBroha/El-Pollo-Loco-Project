class Coin extends MovableObject {
    width = 50;
    height = 50;
    IMAGES = [
        'img/img/8_coin/coin_1.png',
        'img/img/8_coin/coin_2.png'
    ];

    currentImage = 0;

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
    }

    animate() {
    }

    playAnimation() {
        let i = this.currentImage % this.IMAGES.length;
        let path = this.IMAGES[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
