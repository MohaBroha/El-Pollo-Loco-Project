/**
 * Represents a static background object used for parallax layers (ground, mountains, etc.).
 * Inherits from MovableObject to integrate with the rendering system.
 */
class BackgroundObjects extends MovableObject {

    /** @type {number} */
    width = 720;

    /** @type {number} */
    height = 480;

    /**
     * Create a background object at the specified X position.
     *
     * @param {string} ImagePath - Path to the image file.
     * @param {number} x - Horizontal position in the world.
     */
    constructor(ImagePath, x) {
        super().loadImage(ImagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}