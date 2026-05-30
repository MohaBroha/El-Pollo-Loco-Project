/**
 * Repräsentiert ein statisches Hintergrundobjekt in der Spielwelt.
 * Wird für Parallax-Ebenen wie Boden, Berge usw. verwendet.
 * Erbt von MovableObject für ein einheitliches Rendering-System.
 */
class BackgroundObjects extends MovableObject {

    /** @type {number} */
    width = 720;

    /** @type {number} */
    height = 480;

    /**
     * Erstellt ein Hintergrundobjekt an einer bestimmten Position.
     *
     * @param {string} ImagePath - Pfad zur Bilddatei.
     * @param {number} x - Horizontale Position in der Spielwelt.
     */
    constructor(ImagePath, x) {
        super().loadImage(ImagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}