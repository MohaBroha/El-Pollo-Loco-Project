/**
 * Hauptspieler-Charakter (Pepe)
 * Steuert Bewegung, Animationen, Zustände (Jump, Idle, Hurt, Dead) und Interaktionen im Spiel.
 * Er verarbeitet Keyboard-Input und synchronisiert die Kamera.
 */
class Character extends MovableObject {

    /**
     * Start-Y-Position am Bodenlevel
     */
    y = 80;

    /**
     * Höhe der Spielfigur
     */
    height = 280;

    /**
     * Breite der Spielfigur
     */
    width = 150;

    /**
     * Kollisions-Offset zur präziseren Hitbox.
     * Verkleinert die Trefferfläche gegenüber der Grafik.
    */    
    offset = {
    top: 30,
    bottom: 30,
    left: 40,
    right: 50
};

    /**
     * Laufgeschwindigkeit
     */
    speed = 7;

    /**
     * Lebensenergie
     */
    energy = 100;

    /**
     * Zeitpunkt des letzten Treffers (für Invincibility)
     */
    lastHitTime = 0;

    /**
     * Dauer der Unverwundbarkeit nach Treffer (ms)
     */
    invincibleDuration = 1000;

    /**
     * Zeit seit letzter Bewegung (Idle-Tracking)
     */
    idleTime = 0;

    /**
     * Zeit bevor Idle-Animation startet (ms)
     */
    idleDelay = 3000;

    /**
     * Bewegungsstatus
     */
    isWalking = false;

    /**
     * Flag: gerade gestoppt
     */
    hasJustStopped = false;

    /**
     * Flag: gerade gelandet
     */
    hasJustLanded = false;
isJumpAnimationPlaying = false;

    /**
     * Flag: Schnarchsound abgespielt
     */
    snorePlayed = false;

    /**
     * Animationsbilder: Laufen
     */

    IMAGES_IDLE = [
    'img/img/2_character_pepe/1_idle/idle/I-1.png',
    'img/img/2_character_pepe/1_idle/idle/I-2.png',
    'img/img/2_character_pepe/1_idle/idle/I-3.png',
    'img/img/2_character_pepe/1_idle/idle/I-4.png',
    'img/img/2_character_pepe/1_idle/idle/I-5.png',
    'img/img/2_character_pepe/1_idle/idle/I-6.png',
    'img/img/2_character_pepe/1_idle/idle/I-7.png',
    'img/img/2_character_pepe/1_idle/idle/I-8.png',
    'img/img/2_character_pepe/1_idle/idle/I-9.png',
    'img/img/2_character_pepe/1_idle/idle/I-10.png'
];

    IMAGES_WALKING = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Animationsbilder: Springen
     */
    IMAGES_JUMPING = [
        'img/img/2_character_pepe/3_jump/J-31.png',
        'img/img/2_character_pepe/3_jump/J-32.png',
        'img/img/2_character_pepe/3_jump/J-33.png',
        'img/img/2_character_pepe/3_jump/J-34.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-36.png',
        'img/img/2_character_pepe/3_jump/J-37.png',
        'img/img/2_character_pepe/3_jump/J-38.png',
        'img/img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Animationsbilder: Idle (lang)
     */
    IMAGES_IDLE_LONG = [
        'img/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /**
     * Animationsbilder: Tod
     */
    IMAGES_DEAD = [
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Animationsbilder: Hurt
     */
    IMAGES_HURT = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Referenz zur Spielwelt
     */
    world;

    /**
     * Gesammelte/mitgeführte Flaschen
     */
    carryingBottles = [];

    constructor() {
        super().loadImage('img/img/2_character_pepe/2_walk/W-21.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.applyGravity();
        this.animate();
    }

    /**
     * Haupt-Animations- und Logikloop
     */
    animate() {

        // 🎮 GAME LOGIC LOOP
        setStoppableInterval(() => {

            let moved = false;

            // RIGHT
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                moved = true;
                this.handleWalkSound();
            }

            // LEFT
            if (this.world.keyboard.LEFT && this.x > -2000) {
                this.moveLeft();
                moved = true;
                this.handleWalkSound();
            }

            // JUMP
            if ((this.world.keyboard.SPACE || this.world.keyboard.UP) && !this.isAboveGround()) {
                this.jump();
                moved = true;
                audioManager.playSound("jump");
            }

            if (this.wasAboveGround && !this.isAboveGround()) {
                this.hasJustLanded = true;
            }

            this.wasAboveGround = this.isAboveGround();

            this.world.camera_x = -this.x + 100;

            // IDLE HANDLING
            if (moved) {
                this.idleTime = 0;
                this.snorePlayed = false;
                this.isWalking = true;
                this.hasJustStopped = false;

                audioManager.stopSound("snore");

            } else {
                this.idleTime += 5;
                this.isWalking = false;
            }
        }, 1000 / 60);

        setStoppableInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }

            if (this.hasJustLanded) {
                this.playAnimation([this.IMAGES_JUMPING[8]]);

                setTimeout(() => {
                    this.hasJustLanded = false;
                }, 120);

                return;
            }

            if (this.isAboveGround()) {
    this.playJumpAnimation();
    return;
}

            if (this.idleTime > this.idleDelay) {
                this.playAnimation(this.IMAGES_IDLE_LONG);

                if (!this.snorePlayed) {
                    audioManager.playSound("snore");
                    this.snorePlayed = true;
                }

                return;
            }

            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
                {
               this.playAnimation(this.IMAGES_IDLE);
               this.hasJustStopped = true;
         }
               return;
     }  

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
                this.hasJustStopped = false;

            } else {
               if (!this.hasJustStopped) {
                   this.img = this.imageCache[this.IMAGES_IDLE_LONG[0]];
                   this.hasJustStopped = true;
                }
            }

        }, 150);
    }

    /**
     * Geh-Sound Steuerung
     */
    handleWalkSound() {
        if (!this.isWalking) {
            this.isWalking = true;
            audioManager.playSound("walk");
        }
    }
    /**
 * Spielt die Sprunganimation genau einmal ab.
 */
playJumpAnimation() {
    if (this.isJumpAnimationPlaying) return;

    this.isJumpAnimationPlaying = true;
    this.currentImage = 0;

    const jumpInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_JUMPING);

        if (this.currentImage >= this.IMAGES_JUMPING.length) {
            clearInterval(jumpInterval);
            this.isJumpAnimationPlaying = false;
        }
    }, 100);
}

    /**
     * Wirft eine Flasche
     */
    throwBottle() {
        if (this.carryingBottles.length <= 0) return null;

        const bottleX = this.otherDirection ? this.x - 10 : this.x + this.width - 40;
        const bottle = new ThrowableObject(bottleX, this.y + 135, this.otherDirection);

        this.carryingBottles.pop();
        return bottle;
    }

    /**
     * Trefferlogik
     */
    hit() {
        const now = Date.now();

        if (now - this.lastHitTime > this.invincibleDuration) {
            this.energy -= 20;

            if (this.energy < 0) this.energy = 0;

            this.lastHitTime = now;

            if (this.world && this.world.statusBar) {
                this.world.statusBar.setPercentage(this.energy);
            }

            if (this.energy <= 0 && !gameEnded)
                showEndScreen(false);
        }
    }

    /**
     * Prüft ob tot
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Prüft ob verletzt
     */
    isHurt() {
        return Date.now() - this.lastHitTime < this.invincibleDuration;
    }
}