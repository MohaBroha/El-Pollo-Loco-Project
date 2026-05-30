/**
 * Coin ist ein einsammelbares Objekt im Spiel.
 * Sie animiert sich selbst und kann vom Spieler eingesammelt werden.
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

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.image.src = this.images[this.currentFrame];

        this.animate();
    }

    /**
     * Animiert die Coin (Dreh-Effekt)
     */
    animate() {
        setInterval(() => {
            this.currentFrame++;
            if (this.currentFrame >= this.images.length) this.currentFrame = 0;
            this.image.src = this.images[this.currentFrame];
        }, 200);
    }

    /**
     * Zeichnet die Coin nur wenn sie nicht eingesammelt wurde
     */
    draw(ctx) {
        if (!this.collected) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Erstellt mehrere Coins zwischen zwei Punkten
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