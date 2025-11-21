class World {

    character = new Character();

    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];

    clouds = [
        new Cloud()
    ];

    backgroundObjects = [

        new BackgroundObjects('img/img/5_background/layers/3_third_layer/1.png', 100, 0,)
    ];

    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addobjectstoMap(this.backgroundObjects);
        this.addobjectstoMap(this.clouds);
        this.addobjectstoMap(this.enemies);
        this.addtoMap(this.character);






        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addobjectstoMap(objects) {
        objects.forEach(o => {
            this.addtoMap(o);
        });
    }

    addtoMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

    }
}


