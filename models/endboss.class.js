/**
 * Final boss enemy of the game.
 * Controls movement, animations, attacks, and damage behavior.
 */
class Endboss extends MovableObject {

    /**
     * Size and position in the game
     */
    height = 500;
    width = 300;
    y = -30;

    /**
     * Status-Flags
     */
    isAttackingNow = false;
    dead = false;
    hurtSoundCooldown = false;
    currentState = null;

    /**
    * Animation speed per state
    */
    animationIntervals = {
        walk: 260,
        attack: 260,
        hurt: 200,
        dead: 200
    };

    /**
    * Timestamps of the last frame updates
    */
    _lastAnimTimestamps = {
        walk: 0,
        attack: 0,
        hurt: 0,
        dead: 0
    };

    /**
    * Frame indices for animations
    */
    _frameIndices = {
        walk: 0,
        attack: 0,
        hurt: 0,
        dead: 0
    };

    /**
    * Life energy
    */
    energy = 100;

    /**
    * Movement speed
    */
    speed = 0;

    /**
    * Attack control
    */
    attackCooldown = 280;
    attackDuration = 320;
    lastAttackTime = 0;

    /**
    * Walking Animation Frames
    */
    IMAGES_WALKING = [
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png',
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png',
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /**
    * Attack Animation Frames
    */
    IMAGES_ATTACK = [
        'img/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    /**
    * Hurt Animation Frames
    */
    IMAGES_HURT = [
        'img/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /**
    * Death Animation Frames
    */
    IMAGES_DEAD = [
        'img/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
    * Initializes the end boss and loads all animation assets.
    */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 3200;
        this.animate();
    }

    /**
    * Draws the boss with an offset depending on the state
    */
    draw(ctx) {
        const offsetY = (this.currentState === 'walk' || this.currentState === 'attack') ? 20 : 0;
        ctx.drawImage(this.img, this.x, this.y + offsetY, this.width, this.height);
    }

    /**
    * Starts the boss movement and animation loops.
    */
    animate() {
        this.startAnimationLoop();
        this.startMovementLoop();
    }

    /**
    * Starts the movement update loop.
    */
    startMovementLoop() {
        setStoppableInterval(() => {
            this.updateMovement();
        }, 1000 / 60);
    }

    /**
    * Returns whether the boss is able to move.
    * @returns {boolean}
    */
    canMove() {
        return this.world && this.world.character && !this.dead;
    }

    /**
    * Updates the boss movement and attack behavior.
    */
    updateMovement() {
        if (!this.canMove()) return;

        const { deltaX, distance, faceRight } = this.getMovementData();

        this.otherDirection = faceRight;

        if (distance > 1400) {
            this.speed = 0;
            return;
        }

        const shouldAttack = distance <= 520;

        this.updateSpeed(distance);

        if (deltaX < 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }

        this.otherDirection = faceRight;

        if (shouldAttack) {
            this.startAttack();
        }
    }

    /**
     * Updates the movement speed based on the player's distance.
     * @param {number} distance - Distance to the player.
     */
    updateSpeed(distance) {
        const shouldAttack = distance <= 520;
        const shouldCharge = distance <= 820;

        if (shouldAttack) {
            this.speed = 4.8;
        } else if (shouldCharge) {
            this.speed = 4.0;
        } else {
            this.speed = 3.2;
        }
    }

    /**
     * Returns the movement data based on the player's position.
     * @returns {Object} Movement data including deltaX, distance, and faceRight.
     */
    getMovementData() {
        const character = this.world.character;
        const deltaX = character.x - this.x;

        return {
            deltaX,
            distance: Math.abs(deltaX),
            faceRight: deltaX > 0
        };
    }

    /**
    * Starts the animation update loop.
    */
    startAnimationLoop() {
        setStoppableInterval(() => {
            this.updateAnimation();
        }, 60);
    }

    /**
    * Updates the animation based on the current state and time.
    */
    updateAnimation() {
        if (this.lockAnimation()) return;

        const now = Date.now();
        const state = this.getCurrentState();

        this.updateAnimationState(state, now);

        const interval = this.animationIntervals[state] || 200;
        const last = this._lastAnimTimestamps[state] || 0;

        this.playAnimationByState(state, now, last, interval);

    }

    /**
    * Locks the animation to prevent overlapping updates.
    * @returns {boolean} True if the animation is already locked.
    */
    lockAnimation() {
        if (this.animationLock) return true;

        this.animationLock = true;

        setTimeout(() => {
            this.animationLock = false;
        }, 10);

        return false;
    }

    /**
    * Returns the current animation state.
    * @returns {string}
    */
    getCurrentState() {
        if (this.dead) return 'dead';
        if (this.isHurt()) return 'hurt';
        if (this.isAttackingNow) return 'attack';

        return 'walk';
    }

    /**
    * Updates the animation state and resets the animation if needed.
    * @param {string} state - Current animation state.
    * @param {number} now - Current timestamp.
    */
    updateAnimationState(state, now) {
        if (state === this.currentState) return;

        this.currentState = state;
        this.currentImage = 0;
        this._lastAnimTimestamps[state] = now;

        if (this._frameIndices && this._frameIndices[state] !== undefined) {
            this._frameIndices[state] = 0;
        }
    }

    /**
    * Plays the animation matching the current boss state.
    */
    playAnimationByState(state, now, last, interval) {
        if (state === 'dead') {
            this.playDeadAnimation(now, last, interval);
        } else if (state === 'hurt') {
            this.playHurtAnimation(now, last, interval);
        } else if (state === 'attack') {
            this.playAttackAnimation(now, last, interval);
        } else {
            this.playWalkAnimation(now, last, interval);
        }
    }

    /**
    * Plays the walking animation.
    */
    playWalkAnimation(now, last, interval) {
        if (now - last >= interval) {
            const idx = this._frameIndices.walk % this.IMAGES_WALKING.length;
            const path = this.IMAGES_WALKING[idx];
            this.img = this.imageCache[path];
            this._frameIndices.walk++;
            this._lastAnimTimestamps.walk = now;
        }
    }

    /**
    * Plays the hurt animation and triggers the hurt sound.
    */
    playHurtAnimation(now, last, interval) {
        if (now - last >= interval) {
            const idx = this._frameIndices.hurt % this.IMAGES_HURT.length;
            const path = this.IMAGES_HURT[idx];
            this.img = this.imageCache[path];
            this._frameIndices.hurt++;
            this._lastAnimTimestamps.hurt = now;
        }

        if (!this.hurtSoundCooldown) {
            this.hurtSoundCooldown = true;

            audioManager.playSound('bossHurt');

            setTimeout(() => {
                this.hurtSoundCooldown = false;
            }, 1000);
        }
    }

    /**
    * Plays the attack animation.
    */
    playAttackAnimation(now, last, interval) {
        if (now - last >= interval) {
            const idx = this._frameIndices.attack % this.IMAGES_ATTACK.length;
            const path = this.IMAGES_ATTACK[idx];
            this.img = this.imageCache[path];
            this._frameIndices.attack++;
            this._lastAnimTimestamps.attack = now;
        }
    }

    /**
    * Plays the death animation.
    */
    playDeadAnimation(now, last, interval) {
        const idx = this._frameIndices.dead;

        if (idx >= this.IMAGES_DEAD.length) {
            this._frameIndices.dead = this.IMAGES_DEAD.length - 1;
            const path = this.IMAGES_DEAD[this._frameIndices.dead];
            this.img = this.imageCache[path];
        } else if (now - last >= interval) {
            const path = this.IMAGES_DEAD[this._frameIndices.dead % this.IMAGES_DEAD.length];
            this.img = this.imageCache[path];
            this._frameIndices.dead++;
            this._lastAnimTimestamps.dead = now;
        }
    }

    /**
    * Starts the attack sequence if the cooldown has expired.
    */
    startAttack() {
        const now = Date.now();
        if (this.dead || gameEnded) return;

        if (now - this.lastAttackTime < this.attackCooldown) return;

        this.isAttackingNow = true;
        this.lastAttackTime = now;

        setTimeout(() => {
            if (!gameEnded) {
                this.isAttackingNow = false;
            }
        }, this.attackDuration);
    }

    /**
    * Returns whether the boss is currently hurt.
    */
    isHurt() {
        return super.isHurt();
    }

    /**
    * Reduces the boss's health and handles the death state.
    */
    hit() {
        if (this.dead || gameEnded) return;

        this.energy -= 20;

        if (this.energy > 0) {
            this.lastHit = new Date().getTime();
        }

        audioManager.playSound("bossHurt");

        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;
            this.currentState = null;
            this.currentImage = 0;

            audioManager.playSound("bossAngry", true);
        }
    }

    /**
    * Returns whether the boss is dead.
    */
    isDead() {
        return this.dead;
    }
}