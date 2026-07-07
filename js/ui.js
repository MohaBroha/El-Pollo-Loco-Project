/** @type {HTMLButtonElement} */
const startBtn = document.getElementById('startButton');

/** @type {HTMLButtonElement} */
const playAgainBtn = document.getElementById('playAgainBtn');

/** @type {HTMLButtonElement} */
const fullscreenBtn = document.getElementById('fullscreen-btn');

/** @type {HTMLButtonElement} */
const muteBtn = document.getElementById('mute-btn');

/** @type {HTMLButtonElement} */
const infoBtn = document.getElementById('info-btn');

/** @type {HTMLElement} */
const controlsOverlay = document.getElementById('controls-overlay');

/** @type {HTMLElement[]} */
let uiButtons = [fullscreenBtn, muteBtn, infoBtn];

/** @type {number} */
let uiTimeout;

/** @type {boolean} */
let muted = false;

const savedMute = localStorage.getItem("muted");

if (savedMute !== null) {
    muted = savedMute === "true";
}

/** @type {boolean} */
let buttonActive = false;

muteBtn.textContent = muted ? "🔇" : "🔈";

if (audioManager) {
    audioManager.toggleMute(muted);
}

/**
 * Entfernt den Fokus von einem Button-Element.
 * @param {HTMLButtonElement} btn - Der Button, der den Fokus verlieren soll.
 */
function removeFocus(btn) {
    btn.blur();
}

startBtn.addEventListener('click', () => {
    buttonActive = true;
    startBtn.style.display = 'none';
    document.getElementById('touch-buttons').classList.add('show-touch-buttons');
    playAgainBtn.style.display = 'none';
    if (typeof init === 'function') init();
    removeFocus(startBtn);
    buttonActive = false;
});

playAgainBtn.addEventListener('click', () => {
    buttonActive = true;
    if (typeof restartGame === 'function') restartGame();
    playAgainBtn.style.display = 'none';
    document.getElementById('mainMenuBtn').style.display = 'none';
    removeFocus(playAgainBtn);
    buttonActive = false;
});

const mainMenuBtn = document.getElementById('mainMenuBtn');

mainMenuBtn.addEventListener('click', () => {
    location.reload();
});

fullscreenBtn.addEventListener('click', () => {
    buttonActive = true;
    let container = document.getElementById('startContainer');
    if (!document.fullscreenElement) container.requestFullscreen();
    else document.exitFullscreen();
    removeFocus(fullscreenBtn);
    buttonActive = false;
});

muteBtn.addEventListener('click', () => {
    buttonActive = true;

    muted = !muted;
    localStorage.setItem("muted", muted);

    if (audioManager && typeof audioManager.toggleMute === 'function') {
        audioManager.toggleMute(muted);
    } else if (Sound && audioManager.toggleMute) {
        audioManager.toggleMute(muted);
    }

    muteBtn.textContent = muted ? '🔇' : '🔈';

    removeFocus(muteBtn);
    buttonActive = false;
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement === muteBtn) {
        e.preventDefault();
    }
});

infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    controlsOverlay.classList.toggle('show');
});

document.getElementById('close-controls').addEventListener('click', (e) => {
    e.stopPropagation();
    controlsOverlay.classList.remove('show');
});

document.addEventListener('click', (e) => {
    if (!controlsOverlay.contains(e.target) && e.target !== infoBtn) {
        controlsOverlay.classList.remove('show');
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) showUI();
    else uiButtons.forEach(btn => btn.classList.remove('show-ui', 'hide-ui'));
});

document.addEventListener('mousemove', () => {
    if (document.fullscreenElement) showUI();
});

/**
 * Zeigt UI-Buttons im Vollbildmodus an.
 */
function showUI() {
    uiButtons.forEach(btn => btn.classList.add('show-ui'));
    uiButtons.forEach(btn => btn.classList.remove('hide-ui'));
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(hideUI, 2000);
}

/**
 * Versteckt UI-Buttons im Vollbildmodus.
 */
function hideUI() {
    if (!document.fullscreenElement) return;
    uiButtons.forEach(btn => btn.classList.add('hide-ui'));
    uiButtons.forEach(btn => btn.classList.remove('show-ui'));
}