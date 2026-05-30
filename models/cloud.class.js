/**
 * Cloud ist ein dekoratives Hintergrund-Objekt.
 * Sie bewegt sich kontinuierlich nach links und erzeugt Tiefenwirkung.
 */
class Cloud extends MovableObject {

    /**
     * Y-Position der Cloud
     */
    y = 20;

    /**
     * Höhe der Cloud
     */
    height = 250;

    /**
     * Breite der Cloud
     */
    width = 500;

    constructor() {
        super().loadImage('img/img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Startet die Bewegung der Cloud
     */
    animate() {
        this.moveLeft();
    }
}