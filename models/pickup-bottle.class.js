class PickupBottle extends MovableObject {
    static images = [
        'img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y, imageIndex = 0) {
        super().loadImage(PickupBottle.images[imageIndex]);
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };
        this.collected = false;
    }

    draw(ctx) {
        if (!this.collected) {
            super.draw(ctx);
        }
    }

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
