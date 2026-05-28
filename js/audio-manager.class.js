class AudioManager {
    constructor() {
        if (AudioManager.instance) return AudioManager.instance;

        this.music = null;
        this.muted = false;
        this.volume = 1;

        this.activeSounds = [];
        this.soundLocks = {};

        // 🎮 GAME STATE CONTROL
        this.gameEnded = false;

        AudioManager.instance = this;
    }



    playSound(name, force = false) {
        if (this.muted) return;

        const endSounds = ["bossDeath", "gameOver", "victory"];

        if (this.gameEnded && !force && !endSounds.includes(name)) {
            return;
        }

        const entry = AUDIO_LIBRARY[name];
        if (!entry) return;

        // 🔒 LOCK erst NACH Validierung
        if (!force && this.soundLocks[name]) return;

        this.soundLocks[name] = true;

        setTimeout(() => {
            this.soundLocks[name] = false;
        }, 300);

        const file = typeof entry === "string" ? entry : entry.file;

        const soundVolume =
            typeof entry === "object" && entry.volume != null
                ? entry.volume
                : this.volume;

        const audio = new Audio(`audio/${file}`);
        audio.volume = soundVolume;
        audio.muted = this.muted;
        audio.currentTime = 0;

        audio.addEventListener('ended', () => this._removeActiveSound(audio));

        audio.play().catch(() => { });

        this.activeSounds.push({ name, audio });
    }

    _removeActiveSound(audio) {
        this.activeSounds = this.activeSounds.filter(item => item.audio !== audio);
    }

    // 🎵 MUSIC
    playMusic(name, loop = true) {
        if (this.gameEnded) return;

        const entry = AUDIO_LIBRARY[name];
        if (!entry) return;

        const file = typeof entry === "string" ? entry : entry.file;

        const musicVolume =
            typeof entry === "object" && entry.volume != null
                ? entry.volume
                : this.volume;

        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }

        this.music = new Audio(`audio/${file}`);
        this.music.loop = loop;
        this.music.volume = musicVolume;
        this.music.muted = this.muted;

        this.music.play().catch(() => { });
    }

    // 🧹 STOP ALL AUDIO
    stopAll() {
        this.stopMusic();

        this.activeSounds.forEach(item => {
            item.audio.pause();
            item.audio.currentTime = 0;
        });

        this.activeSounds = [];
    }

    stopMusic() {
        if (!this.music) return;

        this.music.pause();
        this.music.currentTime = 0;
    }

    setGameEnded(state) {
        this.gameEnded = state;
        if (state) {
            this.stopMusic();
        }
    }

    stopSound(name) {
        const soundsToStop = this.activeSounds.filter(item => item.name === name);
        if (soundsToStop.length === 0) return;

        soundsToStop.forEach(item => {
            item.audio.pause();
            item.audio.currentTime = 0;
        });

        this.activeSounds = this.activeSounds.filter(item => item.name !== name);
    }

    // 🔇 MUTE SYSTEM
    toggleMute(state) {
        this.muted = state;

        if (state) this.muteAll();
        else this.unmuteAll();
    }

    muteAll() {
        this.muted = true;

        if (this.music) {
            this.music.pause();
        }

        this.activeSounds.forEach(item => {
            item.audio.pause();
        });
    }

    unmuteAll() {
        this.muted = false;

        if (this.music) {
            this.music.play().catch(() => { });
        }

        this.activeSounds.forEach(item => {
            item.audio.play().catch(() => { });
        });
    }

    // 🔊 VOLUME CONTROL
    setVolume(value) {
        this.volume = value;

        if (this.music) {
            this.music.volume = value;
        }

        this.activeSounds.forEach(item => {
            item.audio.volume = value;
        });
    }
}