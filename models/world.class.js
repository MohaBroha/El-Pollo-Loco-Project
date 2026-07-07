/**
 * Represents the entire game world.
 * Responsible for rendering, collisions, enemies, pickups, status bars and game flow.
 */
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

    /**
     * Create a new World instance and start the main loops.
     *
     * @param {HTMLCanvasElement} canvas - The game's canvas element.
     * @param {Object} keyboard - Keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;
        this.startBackgroundMusic();

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

    /**
     * Link the player character to this world and start its animations.
     */
    setWorld() {
        this.character.world = this;
        this.character.animate();
    }

    /**
     * Start the main game logic loop responsible for collision checks,
     * pickups, throw handling and end game conditions.
     */
    run() {
        setStoppableInterval(() => {
            if (gameEnded) return;

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableObjectCollisions();
            this.updateEndbossStatusBar();
            this.checkCoinPickup();
            this.checkBottlePickup();

            const endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (this.character.isDead()) {
                if (!this.deathTriggered) {
                    this.deathTriggered = true;

                    setTimeout(() => {
                        showEndScreen(false);
                    }, 800);
                }
            } else if (endboss && endboss.isDead() && !this.endbossDeathTriggered) {
                this.endbossDeathTriggered = true;


                setTimeout(() => {
                    showEndScreen(true);
                }, 1200);
            }
        }, 1000 / 60);
    }

    /**
     * Start background music playback.
     */
    startBackgroundMusic() {
        audioManager.playMusic("bgMusic", true);
    }

    /**
     * Update the endboss status bar to reflect the endboss energy.
     */
    updateEndbossStatusBar() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) this.endbossStatusBar.setPercentage(endboss.energy);
    }

    /**
     * Check for coin pickups by the player and update counters/UI.
     */
    checkCoinPickup() {
        this.coins.forEach(coin => {
            if (!coin.collected && this.checkCollision(this.character, coin) && this.character.isAboveGround()) {
                audioManager.playSound("coin");
                coin.collected = true;
                this.collectedCoins++;
                this.coinStatusBar.setCoins(this.collectedCoins);
            }
        });
    }

    /**
     * Check for bottle pickups and add them to the player's inventory.
     */
    checkBottlePickup() {
        this.throwableObjectsOnGround.forEach((bottle, index) => {
            if (!bottle.collected && this.checkCollision(this.character, bottle)) {
                bottle.collected = true;
                this.character.carryingBottles.push(bottle);
                this.collectedBottles++;
                audioManager.playSound("bottlePickup");
                this.bottleStatusBar.setBottles(this.collectedBottles);
                this.throwableObjectsOnGround.splice(index, 1);
            }
        });
    }

    /**
     * Handle player throw input and spawn throwable objects with cooldown.
     */
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

    /**
     * Check collisions between throwable objects and enemies or ground.
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach(bottle => {

            if (!bottle.hit && (bottle.y + bottle.height) >= 500) {
                bottle.hitGround();
            }

            if (!bottle.hit) {
                this.level.enemies.forEach(enemy => {

                    if (!enemy.isDead() && !bottle.hasHitEnemy && this.checkCollision(bottle, enemy)) {

                        enemy.hit();
                        bottle.hitEnemy();
                        bottle.hasHitEnemy = true;

                        if (enemy.isDead() && typeof enemy.playDeath === 'function') {
                            enemy.playDeath();
                        }
                    }
                });
            }
        });

        this.throwableObjects = this.throwableObjects.filter(b => !b.toRemove);
    }

    /**
     * Check collisions between the character and enemies and handle hits.
     */
    checkCollisions() {
        this.level.enemies.forEach(enemy => {

            if (enemy.isDead()) return;

            const char = this.character;

            const isTopTouching = char.isTopCollision(enemy);
            const isSideTouching = char.isSideCollision(enemy);

            if (isTopTouching && char.speedY < 0) {
                enemy.hit();
                char.speedY = 20;

                if (enemy.isDead()) {
                    enemy.playDeath();
                }
            } else if (isSideTouching) {
                char.hit();
            }
        });
    }

    /**
     * Check collision between two objects using their `offset` and size.
     *
     * @param {Object} obj1 - First object (must have x,y,width,height).
     * @param {Object} obj2 - Second object (must have x,y,width,height).
     * @returns {boolean} True if the objects' hitboxes overlap.
     */
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

    /**
     * Render the entire game world (background, objects, UI) and schedule next frame.
     */
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

        const endboss = this.level.enemies.find(e => e instanceof Endboss);

        this.bottleStatusBar.x = 20;
        this.bottleStatusBar.y = 100;
        this.addtoMap(this.bottleStatusBar);



        if (endboss && Math.abs(this.character.x - endboss.x) < 800) {
            this.addtoMap(this.endbossStatusBar);
        }

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Add multiple objects to the render map by drawing each of them.
     *
     * @param {Array} objects - Array of drawable objects.
     */
    addobjectstoMap(objects) {
        if (!objects) return;
        objects.forEach(o => this.addtoMap(o));
    }

    /**
     * Draw a single object on the canvas and optionally its frame.
     *
     * @param {Object} mo - Drawable/movable object to render.
     */
    addtoMap(mo) {
        if (!mo) return;
        if (mo.otherDirection !== undefined && mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (typeof mo.drawFrame === 'function') mo.drawFrame(this.ctx);
        if (mo.otherDirection !== undefined && mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flip the rendering horizontally for an object (used for facing direction).
     *
     * @param {Object} mo - Object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restore canvas state after a horizontal flip and revert the object's X sign.
     *
     * @param {Object} mo - Previously flipped object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
