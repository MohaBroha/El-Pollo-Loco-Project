class AudioManager {
    constructor() {
        if (AudioManager.instance) return AudioManager.instance;

        this.music = null;
        this.muted = false;
        this.volume = 1;

        // 🔥 wichtig: MUSS immer existieren
        this.activeSounds = {};

        AudioManager.instance = this;
    }

    // 🎧 SOUND EFFECTS
    playSound(name) {
        if (this.muted) return;

        const file = AUDIO_LIBRARY[name];
        if (!file) return;

        const audio = new Audio(`audio/${file}`);
        audio.volume = this.volume;
        audio.currentTime = 0;

        audio.play().catch(() => { });

        // nur tracken wenn wichtig (optional cleanup möglich)
        this.activeSounds[name] = audio;
    }

    // 🎵 MUSIC
    playMusic(name, loop = true) {
        const file = AUDIO_LIBRARY[name];
        if (!file) return;

        // alte Musik sauber stoppen
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }

        this.music = new Audio(`audio/${file}`);
        this.music.loop = loop;
        this.music.volume = this.volume;

        this.music.play().catch(() => { });

        // Sounds resetten bei Musikwechsel
        this.activeSounds = {};
    }

    stopMusic() {
        if (!this.music) return;

        this.music.pause();
        this.music.currentTime = 0;
    }

    stopSound(name) {
        const audio = this.activeSounds[name];
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        delete this.activeSounds[name];
    }

    toggleMute(state) {
        this.muted = state;

        if (state) {
            this.muteAll();
        } else {
            this.unmuteAll();
        }
    }
    // 🔇 MUTE
    muteAll() {
        this.muted = true;

        if (this.music) {
            this.music.pause();
        }

        // alle Sounds stoppen
        Object.values(this.activeSounds).forEach(a => {
            a.pause();
        });
    }

    unmuteAll() {
        this.muted = false;

        if (this.music) {
            this.music.play().catch(() => { });
        }
    }

    // 🔊 VOLUME CONTROL
    setVolume(value) {
        this.volume = value;

        if (this.music) {
            this.music.volume = value;
        }

        Object.values(this.activeSounds).forEach(a => {
            a.volume = value;
        });
    }
}