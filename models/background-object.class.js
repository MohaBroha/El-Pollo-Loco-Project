class BackgroundObjects extends MovableObject {

    width = 720;
    height = 400;
    constructor(ImagePath, y, x) {
        super().loadImage(ImagePath);
        this.y = y;
        this.x = x;
    }
}