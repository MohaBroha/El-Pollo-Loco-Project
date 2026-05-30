/**
 * MovableObject ist die Basis für alle beweglichen Objekte im Spiel.
 * Sie enthält Physik (Gravity), Kollisionen, Bewegung und Lebenslogik.
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
     * Aktiviert Gravitation und lässt das Objekt fallen.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Prüft ob das Objekt in der Luft ist.
     *
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Allgemeine Kollisionsprüfung mit Shrink-Faktor.
     *
     * @param {MovableObject} mo anderes Objekt
     * @param {number} shrink Verkleinerung der Hitbox
     * @returns {boolean}
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
     * Seitliche Kollisionserkennung
     *
     * @param {MovableObject} mo anderes Objekt
     * @returns {boolean}
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
     * Kollision von oben (Sprung auf Gegner)
     *
     * @param {MovableObject} mo anderes Objekt
     * @returns {boolean}
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
     * Reduziert Energie bei Treffer
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
     * Prüft ob Objekt kürzlich getroffen wurde
     *
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Prüft ob Objekt tot ist
     *
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0 || this.isKilled;
    }

    /**
     * Spielt Animation Frames ab
     *
     * @param {string[]} images Bildarray
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Bewegung nach rechts
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Bewegung nach links
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Sprungbewegung
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Prüft ob Objekt angreifen kann
     *
     * @returns {boolean}
     */
    isAttacking() {
        if (!this.world || !this.world.character) return false;
        return this.x - this.world.character.x < 400 && this.energy > 0;
    }

    /**
     * Gibt Angriffshitbox zurück
     *
     * @returns {{x:number,y:number,width:number,height:number}}
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
     * Spielt Todeszustand aus
     */
    playDeath() {
        if (this.isKilled) return;

        this.isKilled = true;

        if (this.deathImage) {
            this.loadImage(this.deathImage);
        }
    }
}