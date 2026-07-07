/**
 * Decorative cloud used in the background to add parallax/depth.
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
     * Start moving the cloud (simple left movement for parallax).
     */
    animate() {
        this.moveLeft();
    }
}