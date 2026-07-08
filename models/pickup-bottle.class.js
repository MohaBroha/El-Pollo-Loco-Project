/**
 * Pickup bottle that can be collected by the player and later thrown.
 */
class PickupBottle extends MovableObject {

    /**
     * Bilder für Flaschen auf dem Boden
     */
    static images = [
        'img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Create a pickup bottle at the specified coordinates.
     *
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} [imageIndex=0] - Index selecting the bottle image.
     */
    constructor(x, y, imageIndex = 0) {
        super().loadImage(PickupBottle.images[imageIndex]);
        this.loadImages(PickupBottle.images);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 70;
        this.offset = {
            top: 30,
            bottom: 30,
            left: 30,
            right: 30
        };
        this.collected = false;
        this.animate();
    }

    /**
     * Draw the bottle only if it has not been collected.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     */
    draw(ctx) {
        if (!this.collected) {
            super.draw(ctx);
        }
    }

    /**
    * Plays the bottle animation.
    */
    animate() {
        setStoppableInterval(() => {
            if (!this.collected) {
                this.playAnimation(PickupBottle.images);
            }
        }, 300);
    }

    /**
     * Generate bottles across the level range at varying intervals.
     *
     * @param {number} [startX=200] - Start X coordinate.
     * @param {number} [endX=5040] - End X coordinate.
     * @param {number} [groundY=400] - Ground Y coordinate to place bottles.
     * @returns {PickupBottle[]} Array of generated bottles.
     */
    static generateBottles(startX = 200, endX = 720 * 7, groundY = 400) {
        const bottles = [];
        let x = startX;

        while (x <= endX) {
            const imageIndex = Math.floor(Math.random() * PickupBottle.images.length);
            bottles.push(new PickupBottle(x, groundY, imageIndex));

            x += 200 + Math.random() * 350;
        }

        return bottles;
    }
}