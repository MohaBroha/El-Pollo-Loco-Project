/** @type {Level} */
let level1;

/**
 * Initialisiert Level 1 mit Gegnern, Wolken, Hintergrund, Münzen und Flaschen.
 * Erstellt die komplette Spielwelt-Konfiguration.
 */
function initLevel() {
    level1 = new Level(
        [
            new Chicken(2000),
            new Chicken(1300),
            new Chicken(500),
            new Chicken(),
            new Chicken(1500),
            new Chicken(2900),

            new SmallChicken(800),
            new SmallChicken(),
            new SmallChicken(600),
            new SmallChicken(800),
            new SmallChicken(200),
            new SmallChicken(1600),

            new Endboss(3600)
        ],

        [
            new Cloud()
        ],

        [
            new BackgroundObjects('img/img/5_background/layers/air.png', -720 * 3),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/2.png', -720 * 3),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/2.png', -720 * 3),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/2.png', -720 * 3),

            new BackgroundObjects('img/img/5_background/layers/air.png', -720 * 2),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/1.png', -720 * 2),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/1.png', -720 * 2),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/1.png', -720 * 2),

            new BackgroundObjects('img/img/5_background/layers/air.png', -720),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/2.png', -720),

            new BackgroundObjects('img/img/5_background/layers/air.png', 0),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/2.png', 720),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720 * 2),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/1.png', 720 * 2),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/1.png', 720 * 2),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/1.png', 720 * 2),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720 * 3),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/2.png', 720 * 3),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/2.png', 720 * 3),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/2.png', 720 * 3),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720 * 4),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/1.png', 720 * 4),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/1.png', 720 * 4),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/1.png', 720 * 4),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720 * 5),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/2.png', 720 * 5),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/2.png', 720 * 5),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/2.png', 720 * 5),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720 * 6),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/1.png', 720 * 6),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/1.png', 720 * 6),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/1.png', 720 * 6),

            new BackgroundObjects('img/img/5_background/layers/air.png', 720 * 7),
            new BackgroundObjects('img/img/5_background/layers/3_third_layer/2.png', 720 * 7),
            new BackgroundObjects('img/img/5_background/layers/2_second_layer/2.png', 720 * 7),
            new BackgroundObjects('img/img/5_background/layers/1_first_layer/2.png', 720 * 7)
        ],

        Coin.generateCoins(100, 720 * 7, 150),

        PickupBottle.generateBottles(200, 720 * 7)
    );
}