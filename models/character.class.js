class Character extends MovableObject {

    y = 80;
    height = 280;
    width = 150;
    speed = 10;

    energy = 100;
    lastHitTime = 0;
    invincibleDuration = 1000;



    idleTime = 0;
    idleDelay = 3000;

    isWalking = false;
    hasJustStopped = false;

    hasJustLanded = false;
    snorePlayed = false;

    IMAGES_WALKING = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png'
    ];

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

    IMAGES_DEAD = [
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    world;
    carryingBottles = [];

    constructor() {
        super().loadImage('img/img/2_character_pepe/2_walk/W-21.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.applyGravity();
        this.animate();
    }

    animate() {

        // 🎮 GAME LOGIC LOOP
        setInterval(() => {

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
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
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



        setInterval(() => {

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
                this.playAnimation(this.IMAGES_JUMPING);
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

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
                this.hasJustStopped = false;

            } else {
                if (!this.hasJustStopped) {
                    this.img = this.imageCache[
                        this.IMAGES_WALKING[this.IMAGES_WALKING.length - 1]
                    ];

                    this.hasJustStopped = true;
                }
            }

        }, 100);
    }


    // 🚶 WALK SOUND CONTROL (ANTI-SPAM)
    handleWalkSound() {
        if (!this.isWalking) {
            this.isWalking = true;
            audioManager.playSound("walk");
        }
    }

    throwBottle() {
        if (this.carryingBottles.length <= 0) return null;

        const bottleX = this.otherDirection ? this.x - 50 : this.x + this.width;
        const bottle = new ThrowableObject(bottleX, this.y + 50, this.otherDirection);

        this.carryingBottles.pop();
        return bottle;
    }

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

    isDead() {
        return this.energy <= 0;
    }

    isHurt() {
        return Date.now() - this.lastHitTime < this.invincibleDuration;
    }
}