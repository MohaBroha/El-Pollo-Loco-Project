/**
 * Base class for all moving objects in the game.
 * Implements simple physics (gravity), collision helpers, movement and life logic.
 */
class MovableObject extends DrawableObject {

    /**
     * Grundgeschwindigkeit der Bewegung
     */
    speed = 0.15;

    /**
     * Richtung der Bewegung (true = links)
     */
    otherDirection = false;

    /**
     * Vertikale Geschwindigkeit (Sprung / Fall)
     */
    speedY = 0;

    /**
     * Gravitation / Beschleunigung nach unten
     */
    acceleration = 2.5;

    /**
     * Lebensenergie des Objekts
     */
    energy = 100;

    /**
     * Zeitpunkt des letzten Treffers
     */
    lastHit = 0;

    /**
     * Aktuelles Animationsbild
     */
    currentImage = 0;

    /**
     * Bild für Todesszustand
     */
    deathImage = null;

    /**
     * Sound für Tod
     */
    deathSound = null;

    /**
     * Status ob Objekt endgültig zerstört wurde
     */
    isKilled = false;

    /**
     * Enable gravity for this object by updating vertical speed and position
     * at a fixed interval.
     */
    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Check whether the object is currently above the ground.
     * Throwable objects are always considered above ground for their flight.
     *
     * @returns {boolean} True if the object is above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Generic collision test using an optional shrink factor to make hitboxes
     * smaller than the drawn sprites.
     *
     * @param {MovableObject} mo - Other movable object to test against.
     * @param {number} [shrink=25] - Pixels to shrink the hitbox from each edge.
     * @returns {boolean} True if the objects collide.
     */
    isColliding(mo, shrink = 25) {
        return (
            this.x + this.width - shrink > mo.x + shrink &&
            this.x + shrink < mo.x + mo.width - shrink &&
            this.y + this.height - shrink > mo.y + shrink &&
            this.y + shrink < mo.y + mo.height - shrink
        );
    }

    /**
     * Detect a side collision between this object and another.
     *
     * @param {MovableObject} mo - Other movable object.
     * @returns {boolean} True if a side collision occurs.
     */
    isSideCollision(mo) {
        const shrink = 35;
        return (
            this.x + this.width - shrink > mo.x + shrink &&
            this.x + shrink < mo.x + mo.width - shrink &&
            this.y + this.height - shrink > mo.y + shrink &&
            this.y + shrink < mo.y + mo.height - shrink
        );
    }

    /**
     * Detect whether this object collides from the top of another object
     * (e.g. player jumping onto an enemy).
     *
     * @param {MovableObject} mo - Other movable object.
     * @returns {boolean} True if the top collision condition is met.
     */
    isTopCollision(mo) {
        const horizontalShrink = 15;
        return (
            this.x + this.width - horizontalShrink > mo.x + horizontalShrink &&
            this.x + horizontalShrink < mo.x + mo.width - horizontalShrink &&
            this.y + this.height >= mo.y &&
            this.y + this.height <= mo.y + 30
        );
    }

    /**
     * Reduce energy when hit and set last hit timestamp.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Determine whether the object is currently in a hurt (invulnerable)
     * state based on `lastHit` timestamp.
     *
     * @returns {boolean} True if the object was hit recently.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Check if the object is dead either by energy depletion or explicit
     * kill flag.
     *
     * @returns {boolean} True if the object is dead.
     */
    isDead() {
        return this.energy == 0 || this.isKilled;
    }

    /**
     * Cycle through provided image paths and update the current `img`
     * from the cache.
     *
     * @param {string[]} images - Array of image paths used for animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Move the object to the right by `this.speed` and set direction.
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Move the object to the left by `this.speed` and set direction.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Initiate a jump by setting a vertical speed.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Simple heuristic to determine whether this object should currently
     * attempt an attack (based on distance to character and remaining energy).
     *
     * @returns {boolean} True if the object is in attacking range/state.
     */
    isAttacking() {
        if (!this.world || !this.world.character) return false;
        return this.x - this.world.character.x < 400 && this.energy > 0;
    }

    /**
     * Return an expanded hitbox used for attack collision checks.
     *
     * @returns {{x:number,y:number,width:number,height:number}} Attack hitbox.
     */
    attackHitbox() {
        return {
            x: this.x - 50,
            y: this.y,
            width: this.width + 100,
            height: this.height
        };
    }

    /**
     * Mark object as killed and optionally switch to the death image.
     */
    playDeath() {
        if (this.isKilled) return;

        this.isKilled = true;

        if (this.deathImage) {
            this.loadImage(this.deathImage);
        }
    }
}