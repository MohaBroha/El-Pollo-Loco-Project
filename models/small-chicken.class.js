/**
 * Small enemy chicken. Moves automatically and plays walk animation.
 * On death it becomes inactive and displays a death image.
 */
class SmallChicken extends MovableObject {

    /**
     * Größe und Position des kleinen Huhns
     */
    height = 50;
    width = 50;
    y = 380;

    /**
     * Lebensenergie des Gegners
     */
    energy = 100;

    /**
     * Status ob das Huhn tot ist
     */
    dead = false;

    /**
     * Animationsbilder für die Laufbewegung
     */
    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /**
     * Sound der beim Tod abgespielt wird
     */
    deathSound = "chickenSmall";

    /**
     * Initialize a small chicken, set random position/speed and start animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.deathImage = 'img/img/3_enemies_chicken/chicken_small/2_dead/dead.png';
        this.x = 500 + Math.random() * 2000;
        this.speed = 0.3 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Start movement and animation intervals for the chicken.
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
        }, 140);
    }

    /**
     * Apply hit logic to the chicken. Reduces energy and triggers death state.
     */
    hit() {
        this.energy -= 100;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;
            this.loadImage(this.deathImage);

            audioManager.playSound(this.deathSound);
        }
    }

    /**
     * Check whether the chicken is dead.
     *
     * @returns {boolean} True if the chicken is dead.
     */
    isDead() {
        return this.dead;
    }
}