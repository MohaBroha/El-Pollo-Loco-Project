class Chicken extends MovableObject {

    height = 70;
    width = 70;
    y = 350;
    energy = 100;
    dead = false;

    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.deathImage = 'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
        this.deathSound = new Sound('audio/audio_chicken-dying.mp3', false, 0.2);

        this.x = 800 + Math.random() * 2000;
        this.speed = 0.2 + Math.random() * 0.35;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) return;
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 160);
    }

    hit() {
        this.energy -= 100;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;
            this.loadImage(this.deathImage);
            audioManager.playSound("chickenDead");
        }
    }

    isDead() {
        return this.dead;
    }
}
