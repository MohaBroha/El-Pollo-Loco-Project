const startBtn = document.getElementById('startButton');
const playAgainBtn = document.getElementById('playAgainBtn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const muteBtn = document.getElementById('mute-btn');
const settingsBtn = document.getElementById('settings-btn');
const controlsOverlay = document.getElementById('controls-overlay');

let uiButtons = [fullscreenBtn, muteBtn, settingsBtn];
let uiTimeout;
let muted = false;
let buttonActive = false;

function removeFocus(btn) {
    btn.blur();
}

startBtn.addEventListener('click', () => {
    buttonActive = true;
    startBtn.style.display = 'none';
    playAgainBtn.style.display = 'none';
    if (typeof init === 'function') init();
    removeFocus(startBtn);
    buttonActive = false;
});

playAgainBtn.addEventListener('click', () => {
    buttonActive = true;
    if (typeof restartGame === 'function') restartGame();
    playAgainBtn.style.display = 'none';
    removeFocus(playAgainBtn);
    buttonActive = false;
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

    Sound.mutedAll = !Sound.mutedAll;
    Sound.muteAll(Sound.mutedAll);

    muted = Sound.mutedAll;
    muteBtn.textContent = muted ? '🔈' : '🔇';

    removeFocus(muteBtn);
    buttonActive = false;
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement === muteBtn) {
        e.preventDefault();
    }
});

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    controlsOverlay.classList.toggle('show');
});

document.getElementById('close-controls').addEventListener('click', (e) => {
    e.stopPropagation();
    controlsOverlay.classList.remove('show');
});

document.addEventListener('click', (e) => {
    if (!controlsOverlay.contains(e.target) && e.target !== settingsBtn) {
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

function showUI() {
    uiButtons.forEach(btn => btn.classList.add('show-ui'));
    uiButtons.forEach(btn => btn.classList.remove('hide-ui'));
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(hideUI, 2000);
}

function hideUI() {
    if (!document.fullscreenElement) return;
    uiButtons.forEach(btn => btn.classList.add('hide-ui'));
    uiButtons.forEach(btn => btn.classList.remove('show-ui'));
}
