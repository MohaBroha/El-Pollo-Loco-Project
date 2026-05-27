class SmallChicken extends MovableObject {
    height = 50;
    width = 50;
    y = 380;
    energy = 100;
    dead = false;

    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    deathSound = "chickenSmall";

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.deathImage = 'img/img/3_enemies_chicken/chicken_small/2_dead/dead.png';
        this.x = 500 + Math.random() * 2000;
        this.speed = 0.3 + Math.random() * 0.25;
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
        }, 140);
    }

    hit() {
        this.energy -= 100;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead = true;
            this.loadImage(this.deathImage);

            audioManager.playSound(this.deathSound);
        }
    }

    isDead() {
        return this.dead;
    }
}
