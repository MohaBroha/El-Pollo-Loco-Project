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
 * Create a stoppable interval and record its id for later clearing.
 *
 * @param {Function} fn - Function to execute on each tick.
 * @param {number} time - Interval time in milliseconds.
 * @returns {number} Interval id returned by `setInterval`.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    allIntervals.push(id);
    return id;
}

/**
 * Draw the animated start screen and schedule the next frame.
 */
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);

    startScreenAnimationId = requestAnimationFrame(drawStartScreen);
}

/**
 * Initialize the game canvas, level and world instance.
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
 * Restart the game by resetting state, stopping sounds and reinitializing the world.
 */
function restartGame() {
    gameEnded = false;
    endScreenShown = false;
    document.getElementById("touch-buttons").style.display = "flex";
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
 * Show the end screen (victory or game over) and play the appropriate sound.
 *
 * @param {boolean} [won=false] - True for victory screen, false for game over.
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
        document.getElementById('touch-buttons').style.display = 'none';
        document.getElementById('playAgainBtn').style.display = 'block';
        document.getElementById('mainMenuBtn').style.display = 'block';
    };
}

/**
 * Entry point after the page has loaded: start the start-screen animation.
 */
window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawStartScreen();
};

/**
 * Bind touch and mouse events of an on-screen button to a keyboard state key.
 *
 * @param {string} buttonId - DOM id of the touch button element.
 * @param {string} keyName - Name of the Keyboard property to toggle (e.g. 'LEFT').
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