/**
 * Endboss ist der finale Gegner im Spiel.
 * Er besitzt mehrere Zustände (walk, attack, hurt, dead) und komplexe KI-Logik.
 * Steuert Animation, Bewegung, Angriff und Schadenverhalten.
 */
class Endboss extends MovableObject {

    /**
     * Größe und Position im Spiel
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
     * Animationsgeschwindigkeit pro Zustand
     */
    animationIntervals = {
        walk: 260,
        attack: 260,
        hurt: 200,
        dead: 200
    };

    /**
     * Zeitstempel der letzten Frame-Updates
     */
    _lastAnimTimestamps = {
        walk: 0,
        attack: 0,
        hurt: 0,
        dead: 0
    };

    /**
     * Frame-Indizes für Animationen
     */
    _frameIndices = {
        walk: 0,
        attack: 0,
        hurt: 0,
        dead: 0
    };

    /**
     * Lebensenergie
     */
    energy = 100;

    /**
     * Bewegungsgeschwindigkeit
     */
    speed = 0;

    /**
     * Angriffsteuerung
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
     * Zeichnet den Boss mit Offset je nach Zustand
     */
    draw(ctx) {
        const offsetY = (this.currentState === 'walk' || this.currentState === 'attack') ? 20 : 0;
        ctx.drawImage(this.img, this.x, this.y + offsetY, this.width, this.height);
    }

    /**
     * Hauptanimations- und KI-Loop
     */
    animate() {

        setStoppableInterval(() => {

            if (this.animationLock) return;
            this.animationLock = true;

            setTimeout(() => {
                this.animationLock = false;
            }, 10);

            const now = Date.now();

            let state;

            if (this.dead) {
                state = 'dead';
            } else if (this.isHurt()) {
                state = 'hurt';
            } else if (this.isAttackingNow) {
                state = 'attack';
            } else {
                state = 'walk';
            }

            if (state !== this.currentState) {
                this.currentState = state;
                this.currentImage = 0;
                this._lastAnimTimestamps[state] = now;
                if (this._frameIndices && this._frameIndices[state] !== undefined) {
                    this._frameIndices[state] = 0;
                }
            }

            const interval = this.animationIntervals[state] || 200;
            const last = this._lastAnimTimestamps[state] || 0;

            if (state === 'dead') {
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

            } else if (state === 'hurt') {
                if (now - last >= interval) {
                    const idx = this._frameIndices.hurt % this.IMAGES_HURT.length;
                    const path = this.IMAGES_HURT[idx];
                    this.img = this.imageCache[path];
                    this._frameIndices.hurt++;
                    this._lastAnimTimestamps.hurt = now;
                }

                if (!this.hurtSoundCooldown) {
                    this.hurtSoundCooldown = true;

                    audioManager.playSound("bossHurt");
                    setTimeout(() => {
                        this.hurtSoundCooldown = false;
                    }, 1000);
                }

            } else if (state === 'attack') {
                if (now - last >= interval) {
                    const idx = this._frameIndices.attack % this.IMAGES_ATTACK.length;
                    const path = this.IMAGES_ATTACK[idx];
                    this.img = this.imageCache[path];
                    this._frameIndices.attack++;
                    this._lastAnimTimestamps.attack = now;
                }

            } else {
                if (now - last >= interval) {
                    const idx = this._frameIndices.walk % this.IMAGES_WALKING.length;
                    const path = this.IMAGES_WALKING[idx];
                    this.img = this.imageCache[path];
                    this._frameIndices.walk++;
                    this._lastAnimTimestamps.walk = now;
                }
            }

        }, 60);

        setStoppableInterval(() => {
            if (!this.world || !this.world.character || this.dead) return;

            const character = this.world.character;
            const deltaX = character.x - this.x;
            const distance = Math.abs(deltaX);
            const faceRight = deltaX > 0;

            this.otherDirection = faceRight;

            if (distance > 1400) {
                this.speed = 0;
                return;
            }

            const shouldAttack = distance <= 520;
            const shouldCharge = distance <= 820;

            if (shouldAttack) {
                this.speed = 4.8;
            } else if (shouldCharge) {
                this.speed = 4.0;
            } else {
                this.speed = 3.2;
            }

            if (deltaX < 0) {
                this.moveLeft();
            } else {
                this.moveRight();
            }

            this.otherDirection = faceRight;

            if (shouldAttack) {
                this.startAttack();
            }
        }, 1000 / 60);
    }

    /**
     * Startet Angriff
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

    isHurt() {
        return super.isHurt();
    }

    /**
     * Nimmt Schaden
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
     * Prüft ob Boss tot ist
     */
    isDead() {
        return this.dead;
    }
}