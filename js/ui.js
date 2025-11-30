
const playBtn = document.getElementById('play-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const settingsBtn = document.getElementById('settings-btn');
const controlsOverlay = document.getElementById('controls-overlay');
const closeControlsBtn = document.getElementById('close-controls');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');


let muted = false;


playBtn.addEventListener('click', () => {
    console.log('Play gedrückt!');
    init();
});


fullscreenBtn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});


settingsBtn.addEventListener('click', () => {
    controlsOverlay.classList.add('show');
});

closeControlsBtn.addEventListener('click', () => {
    controlsOverlay.classList.remove('show');
});


muteBtn.addEventListener('click', () => {
    bgMusic.toggleMute();
    muted = bgMusic.isMuted();
    muteBtn.textContent = muted ? '🔈 An' : '🔇 Lautlos';
    console.log(muted ? 'Sound aus' : 'Sound an');
});


bgMusic.setVolume(volumeSlider.value);

volumeSlider.addEventListener('input', () => {
    const vol = parseFloat(volumeSlider.value);
    bgMusic.setVolume(vol);
    console.log('Volume:', vol);
});
