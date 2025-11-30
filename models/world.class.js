class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();

    throwableObjects = [];

    coins = [];
    collectedCoins = 0;

    collectedBottles = 0;
    throwableObjectsOnGround = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;

        this.setWorld();

        this.coins = this.level.coins || [];
        this.coinStatusBar.setCoins(this.collectedCoins);

        this.level.bottles = this.level.bottles || [];
        this.bottleStatusBar.setBottles(this.collectedBottles);

        this.throwableObjectsOnGround = PickupBottle.generateBottles();

        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.character.animate();
    }

    run() {
        setInterval(() => {
            this.chekCollisions();
            this.checkThrowObjects();
        }, 200);

        setInterval(() => {
            this.checkCoinPickup();
            this.checkBottlePickup();
        }, 1000 / 60);
    }



    checkCoinPickup() {
        this.coins.forEach(coin => {
            if (!coin.collected && this.checkCoinCollision(coin)) {
                coin.collected = true;
                this.collectedCoins++;
                this.coinStatusBar.setCoins(this.collectedCoins);
            }
        });
    }


    checkBottlePickup() {
        this.throwableObjectsOnGround.forEach((bottle, index) => {
            if (!bottle.collected && this.checkCollision(this.character, bottle)) {

                bottle.collected = true;
                this.collectedBottles++;

                this.bottleStatusBar.setBottles(this.collectedBottles);
                this.throwableObjectsOnGround.splice(index, 1);
            }
        });
    }



    checkThrowObjects() {
        if (this.keyboard.D && this.collectedBottles > 0) {

            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 100
            );

            this.throwableObjects.push(bottle);

            this.collectedBottles--;
            this.bottleStatusBar.setBottles(this.collectedBottles);
        }
    }



    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y;
    }

    chekCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    checkCoinCollision(coin) {
        return this.character.x < coin.x + coin.width &&
            this.character.x + this.character.width > coin.x &&
            this.character.y < coin.y + coin.height &&
            this.character.y + this.character.height > coin.y;
    }



    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addobjectstoMap(this.level.backgroundObjects);
        this.addobjectstoMap(this.level.clouds);
        this.addobjectstoMap(this.level.enemies);

        this.addobjectstoMap(this.throwableObjectsOnGround);
        this.addobjectstoMap(this.throwableObjects);

        this.addtoMap(this.character);

        this.coins.forEach(c => c.draw(this.ctx));

        this.ctx.restore();

        this.addtoMap(this.bottleStatusBar);
        this.addtoMap(this.coinStatusBar);
        this.addtoMap(this.statusBar);

        requestAnimationFrame(() => this.draw());
    }

    addobjectstoMap(objects) {
        objects.forEach(o => this.addtoMap(o));
    }

    addtoMap(mo) {
        if (!mo) return;

        if (mo.otherDirection !== undefined && mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (typeof mo.drawFrame === 'function') {
            mo.drawFrame(this.ctx);
        }

        if (mo.otherDirection !== undefined && mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
