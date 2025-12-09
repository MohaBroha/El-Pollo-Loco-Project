class Endboss extends MovableObject {
    height = 500;
    width = 300;
    y = -30;
    isAttackingNow = false;
    dead = false;

    energy = 100;
    speed = 0;

    IMAGES_WALKING = [
        'img/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/img/4_enemie_boss_chicken/2_alert/G11.png'
    ];

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

    IMAGES_HURT = [
        'img/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img/4_enemie_boss_chicken/5_dead/G26.png',
        'img/img/You won, you lost/Game Over.png'
    ];

    attackSound = new Sound('audio/audio_endboss_sound1.mp3', false, 0.5);
    hitSound = new Sound('audio/audio_endboss_sound2.mp3', false, 0.5);
    deathSound = new Sound('audio/audio_endboss_sound3.mp3', false, 1);


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 3000;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.dead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAttackingNow) {
                this.playAnimation(this.IMAGES_ATTACK);
                if (!this.attackSoundPlayed) {
                    this.attackSound.play();
                    this.attackSoundPlayed = true;
                }
            } else {
                this.playAnimation(this.IMAGES_WALKING);
                this.attackSoundPlayed = false;
            }
        }, 200);

        setInterval(() => {
            if (!this.world || !this.world.character || this.dead) return;

            const character = this.world.character;
            const distance = this.x - character.x;

            if (distance > 600) {
                this.speed = 0;
            } else if (distance > 120) {
                this.speed = 2.0;
                this.moveLeft();
                this.otherDirection = false;
            } else if (distance <= 120) {
                this.speed = 0;
                this.startAttack();
            }
        }, 1000 / 60);
    }

    startAttack() {
        if (!this.isAttackingNow) {
            this.isAttackingNow = true;
            setTimeout(() => {
                this.isAttackingNow = false;
            }, 1000);
        }
    }

    isAttacking() {
        if (!this.world || !this.world.character) return false;
        const distance = this.x - this.world.character.x;
        return distance < 400 && distance > -50;
    }

    isHurt() {
        return this.energy < 100 && this.energy > 0;
    }

    hit() {
        if (this.dead) return;

        this.energy -= 20;
        this.hitSound.play();

        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;

            if (!gameEnded) {
                showEndScreen(true);
            }
        }
    }

    isDead() {
        return this.dead;
    }

    playDeath() {
        if (this.dead) return;
        this.dead = true;
        this.loadImage(this.IMAGES_DEAD[0]);
        this.attackSound.stop();
        this.attackSound.play();
    }
}
