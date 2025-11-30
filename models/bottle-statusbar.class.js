class BottleStatusBar extends DrawableObject {
    x = 20;
    y = 80;
    width = 200;
    height = 60;
    bottlesCollected = 0;
    maxBottles = 6;

    IMAGES = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    constructor() {
        super();
        this.imageCache = {};
        this.loadImages(this.IMAGES);
        this.setBottles(0);
        this.otherDirection = false;
    }


    setBottles(bottlesCollected) {
        this.bottlesCollected = bottlesCollected;
        let index = this.resolveImageIndex();
        let path = this.IMAGES[index];
        this.img = this.imageCache[path];

    }

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
