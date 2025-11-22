class BackgroundObjects extends MovableObject {

    width = 720;
    height = 480;
    constructor(ImagePath, x) {
        super().loadImage(ImagePath);
        this.x = x;
        this.y = 480 - this.height;

    }
}