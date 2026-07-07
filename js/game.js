/**
 * Canvas Rendering-Kontext.
 * @type {HTMLCanvasElement}
 */
let canvas;

/** @type {CanvasRenderingContext2D} */
let ctx;

/** @type {World} */
let world;

/** @type {Keyboard} */
let keyboard = new Keyboard();

/** @type {boolean} */
let gameStarted = false;

/** @type {boolean} */
let gameEnded = false;

/** @type {number[]} */
let allIntervals = [];

/** @type {boolean} */
let endScreenShown = false; // Schutz, um mehrfaches Anzeigen des Endscreens zu verhindern

/** @type {AudioManager} */
const audioManager = new AudioManager();

/** @type {HTMLImageElement} */
let startScreenImage = new Image();
startScreenImage.src = 'img/img/9_intro_outro_screens/start/startscreen_1.png';

/** @type {number} */
let startScreenAnimationId;


/**
 * Erstellt ein stoppbares Intervall und speichert dessen ID.
 * @param {Function} fn
 * @param {number} time
 * @returns {number}
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    allIntervals.push(id);
    return id;
}

/**
 * Zeichnet den animierten Startbildschirm.
 */
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);

    startScreenAnimationId = requestAnimationFrame(drawStartScreen);
}

/**
 * Initialisiert die Spielwelt und das Canvas.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    cancelAnimationFrame(startScreenAnimationId);

    initLevel();
    world = new World(canvas, keyboard);

    gameStarted = true;
    gameEnded = false;
}

/**
 * Startet das Spiel neu und setzt alle Zustände zurück.
 */
function restartGame() {
    gameEnded = false;
    endScreenShown = false;
    audioManager.setGameEnded(false);
    audioManager.stopAll();

    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;

    allIntervals.forEach(id => clearInterval(id));
    allIntervals = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initLevel();
    world = new World(canvas, keyboard);

    gameStarted = true;
}

/**
 * Zeigt den Endscreen (Gewonnen oder Verloren).
 * @param {boolean} [won=false]
 */
function showEndScreen(won = false) {
    if (endScreenShown) return;
    endScreenShown = true;

    gameEnded = true;
    audioManager.setGameEnded(true);
    audioManager.stopAll();
    audioManager.playSound(won ? "victory" : "gameOver", true);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.75;

    const img = new Image();

    img.src = won
        ? 'img/img/You won, you lost/You Won B.png'
        : 'img/img/You won, you lost/Game Over.png';

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        document.getElementById('playAgainBtn').style.display = 'block';
        document.getElementById('mainMenuBtn').style.display = 'block';
    };
}

/**
 * Einstiegspunkt nach dem Laden der Seite.
 */
window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawStartScreen();
};

/**
 * Bindet Touch- und Maussteuerung an den Keyboard-Status.
 * @param {string} buttonId
 * @param {string} keyName
 */
function bindTouchButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const setKey = (value) => {
        if (!gameStarted || gameEnded || buttonActive) return;
        keyboard[keyName] = value;
    };

    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setKey(true);
    });
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        setKey(false);
    });
    button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        setKey(true);
    });
    button.addEventListener('mouseup', (e) => {
        e.preventDefault();
        setKey(false);
    });
}

window.addEventListener('load', () => {
    bindTouchButton('leftBtn', 'LEFT');
    bindTouchButton('rightBtn', 'RIGHT');
    bindTouchButton('jumpBtn', 'UP');
    bindTouchButton('throwBtn', 'D');
});

/**
 * Keyboard Keydown-Handler.
 */
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

/**
 * Keyboard Keyup-Handler.
 */
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