/**
 * Base class for all visible objects in the game.
 * Provides basic image loading, caching and drawing functionality.
 */
class DrawableObject {

    /**
     * X-Position auf dem Canvas
     */
    x = 120;

    /**
     * Y-Position auf dem Canvas
     */
    y = 280;

    /**
     * Aktuelles Bild-Objekt
     */
    img;

    /**
     * Höhe des Objekts
     */
    height = 150;

    /**
     * Breite des Objekts
     */
    width = 100;

    /**
     * Bild-Cache zur Performance-Optimierung
     */
    imageCache = {};

    /**
     * Index für Animationsbilder
     */
    currentImage = 0;

    /**
     * Load an image from the given path and assign it to `this.img`.
     *
     * @param {string} path - Relative path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draw the object's current image on the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }



    /**
     * Preload multiple images into the internal image cache.
     *
     * @param {string[]} arr - Array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}