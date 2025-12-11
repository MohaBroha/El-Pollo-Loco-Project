let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameEnded = false;
let allIntervals = [];

let bgMusic;

let startScreenImage = new Image();
startScreenImage.src = 'img/img/9_intro_outro_screens/start/startscreen_1.png';

let startScreenAnimationId;

function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    allIntervals.push(id);
    return id;
}

function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);

    startScreenAnimationId = requestAnimationFrame(drawStartScreen);

}

function init() {
    Sound.init();
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    cancelAnimationFrame(startScreenAnimationId);

    initLevel();
    world = new World(canvas, keyboard);

    gameStarted = true;
    gameEnded = false;

    bgMusic = Sound.playSound('audio/juego-peligroso-background-latin-vlog-music-for-video-stories-379503.mp3');

}





function restartGame() {
    gameEnded = false;

    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;

    Sound.muteAll(false);

    allIntervals.forEach(id => clearInterval(id));
    allIntervals = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initLevel();
    world = new World(canvas, keyboard);

    gameStarted = true;

    bgMusic.play();
}


function showEndScreen(won = false) {
    gameEnded = true;

    if (bgMusic) bgMusic.pause();

    if (won) {
        Sound.GOOD_RESULT.play();
    } else {
        Sound.GAME_OVER.play();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.75;

    const img = new Image();
    img.src = won
        ? 'img/img/You won, you lost/You Won A.png'
        : 'img/img/You won, you lost/Game Over.png';

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        document.getElementById('playAgainBtn').style.display = 'block';
    };
}

window.onload = () => {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawStartScreen();
};

window.addEventListener("keydown", (e) => {
    if (!gameStarted || gameEnded || buttonActive) return;
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
    if (!gameStarted || gameEnded || buttonActive) return;
    switch (e.keyCode) {
        case 39: keyboard.RIGHT = false; break;
        case 37: keyboard.LEFT = false; break;
        case 38: keyboard.UP = false; break;
        case 40: keyboard.DOWN = false; break;
        case 32: keyboard.SPACE = false; break;
        case 68: keyboard.D = false; break;
    }
});
