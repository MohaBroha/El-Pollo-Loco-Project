/**
 * Main player character (Pepe).
 * Handles movement, animations, input processing and interactions with the world.
 */
class Character extends MovableObject {

    /**
    * Start Y-position at ground level
    */
    y = 80;

    /**
    * Height of the game character
    */
    height = 280;

    /**
    * Width of the game character
    */
    width = 150;

    /**
    * Collision offset for a more precise hitbox.
    * Reduces the hit area compared to the graphic.
    */
    offset = {
        top: 30,
        bottom: 30,
        left: 40,
        right: 50
    };

    /**
    * Running speed
    */
    speed = 7;

    /**
    * Life energy
    */
    energy = 100;

    /**
    * Duration of invulnerability after a hit (ms)
    */
    lastHitTime = 0;

    /**
    * Duration of invulnerability after a hit (ms)
    */
    invincibleDuration = 1000;

    /**
    * Time since last movement (idle tracking)
    */
    idleTime = 0;

    /**
    * Time before idle animation starts (ms)
    */
    idleDelay = 3000;

    /**
    * Movement status
    */
    isWalking = false;

    /**
    * Flag: just stopped
    */
    hasJustStopped = false;

    /**
    * Flag: just landed
    */
    hasJustLanded = false;
    isJumpAnimationPlaying = false;

    /**
    * Flag: Snoring sound played
    */
    snorePlayed = false;

    /**
    * Animated images: Idle
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

    /**
    * Animated images: Walking
    */
    IMAGES_WALKING = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
    * Animated images: Jumping
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
    * Animated images: Idle (long)
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
    * Animated images: Death
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
    * Animation frame: Hurt
    */
    IMAGES_HURT = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
    * Game World Reference
    */
    world;

    /**
    * Collected/carried bottles
    */
    carryingBottles = [];

    /**
     * Create the player character, preload animations and start gravity/animation loops.
     */
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
     * Start the character's internal animation and movement update loops.
     */
    animate() {
        setStoppableInterval(() => {
            this.updateMovement();
        }, 1000 / 60);

        setStoppableInterval(() => {
            this.updateAnimation();
        }, 150);
    }

    /**
     * Update movement by handling input actions and camera/idle state.
     */
    updateMovement() {
        let moved = false;

        moved = this.handleRightMovement() || moved;
        moved = this.handleLeftMovement() || moved;
        moved = this.handleJump() || moved;

        this.updateLandingState();
        this.updateCamera();
        this.updateIdleState(moved);
    }

    /**
     * Update the animation state based on character status (dead, hurt, jump, idle, walking).
     */
    updateAnimation() {
        if (this.handleDeadAnimation()) {
            return;
        }

        if (this.handleHurtAnimation()) {
            return;
        }

        if (this.handleLandingAnimation()) {
            return;
        }

        if (this.handleJumpAnimation()) {
            return;
        }

        if (this.handleLongIdleAnimation()) {
            return;
        }

        if (this.handleIdleAnimation()) {
            return;
        }

        this.handleWalkingAnimation();
    }

    /**
     * Update idle-related timers and sound based on whether the player moved.
     *
     * @param {boolean} moved - Whether the player moved this frame.
     */
    updateIdleState(moved) {
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
    }

    /**
     * Update camera horizontal offset to follow the player.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handle right movement input and apply movement and sounds.
     *
     * @returns {boolean} True if movement occurred.
     */
    handleRightMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.handleWalkSound();
            return true;
        }

        return false;
    }

    /**
     * Handle left movement input and apply movement and sounds.
     *
     * @returns {boolean} True if movement occurred.
     */
    handleLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > -2000) {
            this.moveLeft();
            this.handleWalkSound();
            return true;
        }

        return false;
    }

    /**
     * Handle jump input and trigger jump sound.
     *
     * @returns {boolean} True if jump was initiated.
     */
    handleJump() {
        if ((this.world.keyboard.SPACE || this.world.keyboard.UP) && !this.isAboveGround()) {
            this.jump();
            audioManager.playSound("jump");
            return true;
        }

        return false;
    }

    /**
     * Play walking sound when starting to walk.
     */
    handleWalkSound() {
        if (!this.isWalking) {
            this.isWalking = true;
            audioManager.playSound("walk");
        }
    }

    /**
     * Update flags related to landing detection (used to play landing animation).
     */
    updateLandingState() {
        if (this.wasAboveGround && !this.isAboveGround()) {
            this.hasJustLanded = true;
        }

        this.wasAboveGround = this.isAboveGround();
    }

    /**
     * Play death animation if character is dead.
     *
     * @returns {boolean} True when the death animation was applied.
     */
    handleDeadAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            return true;
        }

        return false;
    }

    /**
     * Play hurt animation if the character is in hurt state.
     *
     * @returns {boolean} True when hurt animation was applied.
     */
    handleHurtAnimation() {
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            return true;
        }

        return false;
    }

    /**
     * Play a short landing animation when the character just landed.
     *
     * @returns {boolean} True when landing animation was applied.
     */
    handleLandingAnimation() {
        if (this.hasJustLanded) {
            this.playAnimation([this.IMAGES_JUMPING[8]]);

            setTimeout(() => {
                this.hasJustLanded = false;
            }, 120);

            return true;
        }

        return false;
    }

    /**
     * Play jump animation while the character is above ground.
     *
     * @returns {boolean} True when jump animation was applied.
     */
    handleJumpAnimation() {
        if (this.isAboveGround()) {
            this.playJumpAnimation();
            return true;
        }

        return false;
    }

    /**
    * Handles the long idle animation.
    *
    * @returns {boolean} True if the long idle animation was played.
    */
    handleLongIdleAnimation() {
        if (this.idleTime > this.idleDelay) {
            this.playAnimation(this.IMAGES_IDLE_LONG);

            if (!this.snorePlayed) {
                audioManager.playSound("snore");
                this.snorePlayed = true;
            }

            return true;
        }

        return false;
    }

    /**
    * Handles the idle animation.
    *
    * @returns {boolean} True if the idle animation was played.
    */
    handleIdleAnimation() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_IDLE);
            this.hasJustStopped = true;
            return true;
        }

        return false;
    }

    /**
    * Handles the walking animation.
    */
    handleWalkingAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
            this.hasJustStopped = false;
        } else {
            if (!this.hasJustStopped) {
                this.img = this.imageCache[this.IMAGES_IDLE_LONG[0]];
                this.hasJustStopped = true;
            }
        }
    }

    /**
    * Plays the jump animation exactly once.
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
    * Throws a bottle
    */
    throwBottle() {
        if (this.carryingBottles.length <= 0) return null;

        const bottleX = this.otherDirection ? this.x - 10 : this.x + this.width - 40;
        const bottle = new ThrowableObject(bottleX, this.y + 135, this.otherDirection);

        this.carryingBottles.pop();
        return bottle;
    }

    /**
    * Hit logic
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
    * Checks if the player is dead
    */
    isDead() {
        return this.energy <= 0;
    }

    /**
    * Checks for injuries
    */
    isHurt() {
        return Date.now() - this.lastHitTime < this.invincibleDuration;
    }
}