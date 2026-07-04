/**
 * DrawableObject ist die Basis-Klasse für alle sichtbaren Objekte im Spiel.
 * Sie stellt Grundfunktionen für Laden und Zeichnen von Bildern bereit.
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
     * Lädt ein einzelnes Bild
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Zeichnet das Objekt auf den Canvas
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

   

    /**
     * Lädt mehrere Bilder in den Cache
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}