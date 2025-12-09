class ThrowableObject extends MovableObject {
    width = 60;
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

    splashSound = new Sound('audio/audio_splash.mp3', false, 0.25);
    enemyHitSound = new Sound('audio/audio_splash1.mp3', false, 0.28);

    speedY = 10;
    acceleration = 1;
    speed = 0;
    otherDirection = false;

    hit = false;
    toRemove = false;

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

    update() {
        if (this.toRemove) return;

        if (!this.hit) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.x += this.speed;

        }

    }

    animateRotation() {
        let currentFrame = 0;
        const frameCount = this.rotationImages.length;
        this.rotationInterval = setInterval(() => {
            if (!this.hit) {
                this.img = this.imageCache[this.rotationImages[currentFrame]];
                currentFrame = (currentFrame + 1) % frameCount;
            } else {
                clearInterval(this.rotationInterval);
            }
        }, 120);
    }

    hitEnemy() {
        if (this.hit) return;
        this.hit = true;
        clearInterval(this.rotationInterval);
        this.enemyHitSound.play();
        this.playSplashAnimation(() => {
            this.toRemove = true;
        });
    }

    hitGround() {
        if (this.hit) return;
        this.hit = true;
        clearInterval(this.rotationInterval);
        this.splashSound.play();
        this.playSplashAnimation(() => {
            this.toRemove = true;
        });
    }

    playSplashAnimation(doneCallback) {
        let currentFrame = 0;
        const frameCount = this.splashImages.length;
        const animateSplash = setInterval(() => {
            if (currentFrame < frameCount) {
                this.img = this.imageCache[this.splashImages[currentFrame]];
                currentFrame++;
            } else {
                clearInterval(animateSplash);
                if (doneCallback) doneCallback();
            }
        }, 100);
    }
}
