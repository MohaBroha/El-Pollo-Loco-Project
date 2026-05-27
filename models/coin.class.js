class Coin extends MovableObject {
    width = 120;
    height = 120;
    collected = false;
    images = ['img/img/8_coin/coin_1.png', 'img/img/8_coin/coin_2.png'];
    currentFrame = 0;
    image = new Image();


    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.image.src = this.images[this.currentFrame];



        this.animate();
    }

    animate() {
        setInterval(() => {
            this.currentFrame++;
            if (this.currentFrame >= this.images.length) this.currentFrame = 0;
            this.image.src = this.images[this.currentFrame];
        }, 200);
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    static generateCoins(startX, endX, spacing) {
        const coins = [];
        for (let x = startX; x <= endX; x += spacing) {
            let y = 80 + Math.random() * 20;
            coins.push(new Coin(x, y));
        }
        return coins;
    }
}
