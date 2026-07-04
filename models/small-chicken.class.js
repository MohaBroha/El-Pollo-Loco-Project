/**
 * SmallChicken ist ein kleiner Gegner im Spiel.
 * Er bewegt sich automatisch nach links und spielt eine Laufanimation.
 * Beim Tod wird er deaktiviert und zeigt ein Todesbild.
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
     * Initialisiert das SmallChicken und setzt Position, Geschwindigkeit und Animation.
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
     * Startet Bewegungs- und Animationsintervalle.
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
     * Wird aufgerufen wenn das Huhn Schaden bekommt.
     * Setzt Energie auf 0 und aktiviert Todeszustand.
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
     * Prüft ob das Huhn tot ist.
     *
     * @returns {boolean} true wenn tot
     */
    isDead() {
        return this.dead;
    }
}