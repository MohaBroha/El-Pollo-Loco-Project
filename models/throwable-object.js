/**
 * Repräsentiert eine werfbare Salsa-Flasche.
 * Die Flasche rotiert während des Flugs,
 * kann auf dem Boden oder an Gegnern zerschellen
 * und spielt entsprechende Animationen und Sounds ab.
 */
class ThrowableObject extends MovableObject {
    width = 80;
    height = 70;
    offset = { top: 10, bottom: 10, left: 10, right: 10 };

    rotationImages = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    splashImages = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    splashSound = "splash";
    enemyHitSound = "bottleSplash";

    speedY = 10;
    acceleration = 1;
    speed = 0;
    otherDirection = false;

    hit = false;
    toRemove = false;

    /**
     * Erstellt ein neues Wurfobjekt.
     *
     * @param {number} x X-Position der Flasche.
     * @param {number} y Y-Position der Flasche.
     * @param {boolean} [otherDirection=false] Gibt an, ob die Flasche nach links geworfen wird.
     */
    constructor(x, y, otherDirection = false) {
        super();
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.speed = otherDirection ? -8 : 8;
        this.speedY = 14;

        this.loadImage(this.rotationImages[0]);
        this.loadImages(this.rotationImages);
        this.loadImages(this.splashImages);

        this.animateRotation();
    }

    /**
     * Aktualisiert die Flugbewegung der Flasche.
     * Berechnet Flugbahn und Position während des Wurfs.
     */
    update() {
        if (this.toRemove) return;

        if (!this.hit) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.x += this.speed;
        }
    }

    /**
     * Startet die Rotationsanimation der Flasche während des Flugs.
     */
    animateRotation() {
        let currentFrame = 0;
        const frameCount = this.rotationImages.length;

        this.rotationInterval = setStoppableInterval(() => {
            if (!this.hit) {
                this.img = this.imageCache[this.rotationImages[currentFrame]];
                currentFrame = (currentFrame + 1) % frameCount;
            } else {
                clearInterval(this.rotationInterval);
            }
        }, 120);
    }

    /**
     * Wird aufgerufen, wenn die Flasche einen Gegner trifft.
     * Stoppt die Rotation, spielt Sound und Splash-Animation.
     */
    hitEnemy() {
        if (this.hit) return;

        this.hit = true;
        clearInterval(this.rotationInterval);

        audioManager.playSound(this.enemyHitSound);

        this.playSplashAnimation(() => {
            this.toRemove = true;
        });
    }

    /**
     * Wird aufgerufen, wenn die Flasche den Boden berührt.
     * Stoppt die Rotation, spielt Sound und Splash-Animation.
     */
    hitGround() {
        if (this.hit) return;

        this.hit = true;
        clearInterval(this.rotationInterval);

        audioManager.playSound(this.splashSound);

        this.playSplashAnimation(() => {
            this.toRemove = true;
        });
    }

    /**
     * Spielt die Splash-Animation der zerbrechenden Flasche ab.
     *
     * @param {Function} doneCallback Callback-Funktion,
     * die nach Abschluss der Animation ausgeführt wird.
     */
    playSplashAnimation(doneCallback) {
        let currentFrame = 0;
        const frameCount = this.splashImages.length;

        const animateSplash = setStoppableInterval(() => {
            if (currentFrame < frameCount) {
                this.img = this.imageCache[this.splashImages[currentFrame]];
                currentFrame++;
            } else {
                clearInterval(animateSplash);

                if (doneCallback) {
                    doneCallback();
                }
            }
        }, 100);
    }
}