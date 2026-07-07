/**
 * PickupBottle ist ein einsammelbares Objekt im Spiel.
 * Sie kann vom Spieler aufgenommen und später geworfen werden.
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
     * Erstellt eine neue einsammelbare Flasche.
     *
     * @param {number} x X-Position
     * @param {number} y Y-Position
     * @param {number} imageIndex Auswahl des Bildes
     */
    constructor(x, y, imageIndex = 0) {
        super().loadImage(PickupBottle.images[imageIndex]);
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
    }

    /**
     * Zeichnet die Flasche nur wenn sie noch nicht eingesammelt wurde.
     *
     * @param {CanvasRenderingContext2D} ctx Canvas Context
     */
    draw(ctx) {
        if (!this.collected) {
            super.draw(ctx);
        }
    }

    /**
     * Generiert automatisch Flaschen über die komplette Levelstrecke.
     *
     * @param {number} startX Startposition
     * @param {number} endX Endposition
     * @param {number} groundY Höhe am Boden
     * @returns {PickupBottle[]} Array von Flaschen
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