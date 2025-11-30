class ThrowableObject extends MovableObject {
    speedY = 15;
    acceleration = 1;
    direction = 1;

    constructor(x, y) {
        super().loadImage('img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');

        this.x = x;
        this.y = y;

        this.width = 40;
        this.height = 50;

        this.offset = { top: 10, bottom: 10, left: 10, right: 10 };

        this.throw();
    }


    throw() {
        this.speedY = 14;
        this.applyGravity();

        setInterval(() => {
            this.x += 10 * this.direction;
        }, 25);
    }
}
