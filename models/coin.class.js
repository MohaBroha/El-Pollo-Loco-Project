/**
 * Collectible coin object. Animates itself and can be collected by the player.
 */
class Coin extends MovableObject {

    /**
     * Größe der Coin
     */
    width = 120;
    height = 120;

    /**
     * Status ob Coin bereits eingesammelt wurde
     */
    collected = false;

    /**
     * Animationsbilder der Coin
     */
    images = ['img/img/8_coin/coin_1.png', 'img/img/8_coin/coin_2.png'];

    /**
     * Aktueller Animationsframe
     */
    currentFrame = 0;

    /**
     * Bildobjekt für Rendering
     */
    image = new Image();

    /**
     * Create a coin at the given position and start its animation loop.
     *
     * @param {number} x - X position of the coin.
     * @param {number} y - Y position of the coin.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.offset = {
            top: 35,
            bottom: 35,
            left: 35,
            right: 35
        };
        this.image.src = this.images[this.currentFrame];

        this.animate();
    }

    /**
     * Animate the coin by cycling through image frames.
     */
    animate() {
        setStoppableInterval(() => {
            this.currentFrame++;
            if (this.currentFrame >= this.images.length) this.currentFrame = 0;
            this.image.src = this.images[this.currentFrame];
        }, 200);
    }

    /**
     * Draw the coin if it has not been collected yet.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas context used for drawing.
     */
    draw(ctx) {
        if (!this.collected) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Generate multiple coins along a horizontal range with given spacing.
     *
     * @param {number} startX - Start X coordinate.
     * @param {number} endX - End X coordinate.
     * @param {number} spacing - Distance between successive coins.
     * @returns {Coin[]} Array of generated Coin objects.
     */
    static generateCoins(startX, endX, spacing) {
        const coins = [];
        for (let x = startX; x <= endX; x += spacing) {
            let y = 80 + Math.random() * 20;
            coins.push(new Coin(x, y));
        }
        return coins;
    }
}