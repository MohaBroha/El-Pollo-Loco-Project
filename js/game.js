let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let bgMusic = new Sound('audio/juego-peligroso-background-latin-vlog-music-for-video-stories-379503.mp3');
let gameStarted = false;

let startScreenImage = new Image();
startScreenImage.src = 'img/img/9_intro_outro_screens/start/startscreen_1.png';

function drawStartScreen() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawStartScreen);
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Startscreen nicht mehr animieren
    cancelAnimationFrame(drawStartScreen);

    // Welt starten
    world = new World(canvas, keyboard);

    gameStarted = true;

    // Musik starten
    bgMusic.play();
}

// Button Event
const startBtn = document.getElementById('startButton');
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    init();
});

// Startscreen anzeigen, bis auf Start gedrückt
window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawStartScreen();
}

// Keyboard-Events nur, wenn Spiel gestartet
window.addEventListener("keydown", (e) => {
    if (!gameStarted) return;
    switch (e.keyCode) {
        case 39: keyboard.RIGHT = true; break;
        case 37: keyboard.LEFT = true; break;
        case 38: keyboard.UP = true; break;
        case 40: keyboard.DOWN = true; break;
        case 32: keyboard.SPACE = true; break;
        case 68: keyboard.D = true; break;
    }
});

window.addEventListener("keyup", (e) => {
    if (!gameStarted) return;
    switch (e.keyCode) {
        case 39: keyboard.RIGHT = false; break;
        case 37: keyboard.LEFT = false; break;
        case 38: keyboard.UP = false; break;
        case 40: keyboard.DOWN = false; break;
        case 32: keyboard.SPACE = false; break;
        case 68: keyboard.D = false; break;
    }
});
