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
    endbossStatusBar = new EndbossStatusBar();

    throwableObjects = [];
    coins = [];
    collectedCoins = 0;
    collectedBottles = 0;
    throwableObjectsOnGround = [];

    lastThrowTime = 0;
    throwCooldown = 500;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;

        this.level.enemies.forEach(e => e.world = this);
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
        setStoppableInterval(() => {
            if (gameEnded) return;

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableObjectCollisions();
            this.updateEndbossStatusBar();

            const endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (this.character.isDead()) {
                showEndScreen(false);
            } else if (endboss && endboss.isDead() && this.character.x >= endboss.x) {
                showEndScreen(true);
            }

        }, 1000 / 60);

        setStoppableInterval(() => {
            if (gameEnded) return;
            this.checkCoinPickup();
            this.checkBottlePickup();
        }, 1000 / 60);
    }
    updateEndbossStatusBar() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) this.endbossStatusBar.setPercentage(endboss.energy);
    }

    checkCoinPickup() {
        this.coins.forEach(coin => {
            if (!coin.collected && this.checkCollision(this.character, coin) && this.character.isAboveGround()) {
                coin.collectSound.play();
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
                this.character.carryingBottles.push(bottle);
                this.collectedBottles++;
                this.bottleStatusBar.setBottles(this.collectedBottles);
                this.throwableObjectsOnGround.splice(index, 1);
            }
        });
    }

    checkThrowObjects() {
        const now = new Date().getTime();
        if (this.keyboard.D && this.character.carryingBottles.length > 0 &&
            now - this.lastThrowTime > this.throwCooldown) {

            let bottle = this.character.throwBottle();
            if (bottle) {
                this.throwableObjects.push(bottle);
                this.bottleStatusBar.setBottles(this.character.carryingBottles.length);
                this.lastThrowTime = now;
            }
        }
    }

    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(bottle => {
            if (!bottle.hit && (bottle.y + bottle.height) >= 500) {
                bottle.hitGround();
            }

            if (!bottle.hit) {
                this.level.enemies.forEach(enemy => {
                    if (!enemy.isDead() && this.checkCollision(bottle, enemy)) {
                        enemy.hit();
                        bottle.hitEnemy();
                        if (enemy.isDead() && typeof enemy.playDeath === 'function') {
                            enemy.playDeath();
                        }
                    }
                });
            }
        });

        this.throwableObjects = this.throwableObjects.filter(b => !b.toRemove);
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.isDead()) {
                if (this.character.y + this.character.height - 10 < enemy.y + enemy.height / 2) {
                    enemy.hit();
                    this.character.speedY = 20;
                    if (enemy.isDead()) enemy.playDeath();
                } else {
                    this.character.hit();
                }
            }
        });
    }

    checkCollision(obj1, obj2) {
        const o1 = obj1.offset || { top: 0, bottom: 0, left: 0, right: 0 };
        const o2 = obj2.offset || { top: 0, bottom: 0, left: 0, right: 0 };

        const left1 = obj1.x + o1.left;
        const right1 = obj1.x + obj1.width - o1.right;
        const top1 = obj1.y + o1.top;
        const bottom1 = obj1.y + obj1.height - o1.bottom;

        const left2 = obj2.x + o2.left;
        const right2 = obj2.x + obj2.width - o2.right;
        const top2 = obj2.y + o2.top;
        const bottom2 = obj2.y + obj2.height - o2.bottom;

        return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
    }

    draw() {
        if (gameEnded) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addobjectstoMap(this.level.backgroundObjects);
        this.addobjectstoMap(this.level.clouds);
        this.addobjectstoMap(this.level.enemies);
        this.addobjectstoMap(this.throwableObjectsOnGround);

        this.throwableObjects.forEach(obj => {
            if (obj && typeof obj.update === 'function') obj.update();
            this.addtoMap(obj);
        });

        this.addtoMap(this.character);
        this.coins.forEach(c => c.draw(this.ctx));

        this.ctx.restore();

        this.addtoMap(this.statusBar);
        this.addtoMap(this.coinStatusBar);
        this.addtoMap(this.bottleStatusBar);
        this.addtoMap(this.endbossStatusBar);

        requestAnimationFrame(() => this.draw());
    }

    addobjectstoMap(objects) {
        objects.forEach(o => this.addtoMap(o));
    }

    addtoMap(mo) {
        if (!mo) return;
        if (mo.otherDirection !== undefined && mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (typeof mo.drawFrame === 'function') mo.drawFrame(this.ctx);
        if (mo.otherDirection !== undefined && mo.otherDirection) this.flipImageBack(mo);
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
