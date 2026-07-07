/**
 * Simple enemy chicken that walks left and can be defeated by the player.
 */
class Chicken extends MovableObject {

    /**
     * Höhe des Huhns
     */
    height = 70;

    /**
     * Breite des Huhns
     */
    width = 70;

    /**
     * Y-Position am Boden
     */
    y = 350;

    /**
     * Lebensenergie
     */
    energy = 100;

    /**
     * Todesstatus
     */
    dead = false;

    /**
     * Animationsbilder für Laufbewegung
     */
    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /**
     * Initialize chicken position, preload images and start animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.deathImage = 'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

        this.x = 800 + Math.random() * 2000;
        this.speed = 0.2 + Math.random() * 0.35;

        this.animate();
    }

    /**
     * Start movement and animation loops for the chicken.
     */
    animate() {
        setStoppableInterval(() => {
            if (this.isDead()) return;
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60);

        setStoppableInterval(() => {
            if (this.isDead()) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 160);
    }

    /**
     * Apply hit logic to the chicken and trigger death if energy drops to zero.
     */
    hit() {
        this.energy -= 100;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;
            this.loadImage(this.deathImage);
            audioManager.playSound("chickenDead");
        }
    }

    /**
     * Check whether the chicken is dead.
     *
     * @returns {boolean} True if dead.
     */
    isDead() {
        return this.dead;
    }
}