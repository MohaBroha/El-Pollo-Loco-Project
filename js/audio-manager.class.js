/**
 * AudioManager (Singleton)
 * Verwaltet alle Spiel-Sounds und Hintergrundmusik.
 * Kontrolliert Mute, Lautstärke, Sound-Locks und Verhalten bei Spielende.
 */
class AudioManager {
    constructor() {
        if (AudioManager.instance) return AudioManager.instance;

        /** @type {HTMLAudioElement|null} */
        this.music = null;

        /** @type {boolean} */
        this.muted = false;

        /** @type {number} */
        this.volume = 1;

        /** @type {{name: string, audio: HTMLAudioElement}[]} */
        this.activeSounds = [];

        /** @type {Object<string, boolean>} */
        this.soundLocks = {};

        // 🎮 SPIELSTATUS-KONTROLLE

        /** @type {boolean} */
        this.gameEnded = false;

        AudioManager.instance = this;
    }

    /**
     * Spielt einen Soundeffekt ab.
     * @param {string} name - Sound-Schlüssel aus AUDIO_LIBRARY
     * @param {boolean} [force=false] - Ignoriert Locks und Spielstatus, falls true
     */
    playSound(name, force = false) {
        if (this.muted) return;

        const endSounds = ["bossDeath", "gameOver", "victory"];

        if (this.gameEnded && !force && !endSounds.includes(name)) {
            return;
        }

        const entry = AUDIO_LIBRARY[name];
        if (!entry) return;

        // 🔒 Lock erst nach Validierung
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

    /**
     * Entfernt einen beendeten Sound aus der aktiven Liste.
     * @private
     */
    _removeActiveSound(audio) {
        this.activeSounds = this.activeSounds.filter(item => item.audio !== audio);
    }

    /**
     * Spielt Hintergrundmusik ab.
     * @param {string} name - Musik-Schlüssel aus AUDIO_LIBRARY
     * @param {boolean} [loop=true]
     */
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

    /**
     * Stoppt alle Audio-Ausgaben (Musik + Sounds).
     */
    stopAll() {
        this.stopMusic();

        this.activeSounds.forEach(item => {
            item.audio.pause();
            item.audio.currentTime = 0;
        });

        this.activeSounds = [];
    }

    /**
     * Stoppt die Hintergrundmusik.
     */
    stopMusic() {
        if (!this.music) return;

        this.music.pause();
        this.music.currentTime = 0;
    }

    /**
     * Setzt den Spiel-Ende-Zustand.
     * @param {boolean} state
     */
    setGameEnded(state) {
        this.gameEnded = state;
        if (state) {
            this.stopMusic();
        }
    }

    /**
     * Stoppt einen bestimmten Sound anhand seines Namens.
     * @param {string} name
     */
    stopSound(name) {
        const soundsToStop = this.activeSounds.filter(item => item.name === name);
        if (soundsToStop.length === 0) return;

        soundsToStop.forEach(item => {
            item.audio.pause();
            item.audio.currentTime = 0;
        });

        this.activeSounds = this.activeSounds.filter(item => item.name !== name);
    }

    /**
     * Aktiviert oder deaktiviert Mute.
     * @param {boolean} state
     */
    toggleMute(state) {
        this.muted = state;

        if (state) this.muteAll();
        else this.unmuteAll();
    }

    /**
     * Stummschalten aller Sounds.
     */
    muteAll() {
        this.muted = true;

        if (this.music) {
            this.music.pause();
        }

        this.activeSounds.forEach(item => {
            item.audio.pause();
        });
    }

    /**
     * Hebt Stummschaltung auf und setzt Audio fort.
     */
    unmuteAll() {
        this.muted = false;

        if (this.music) {
            this.music.play().catch(() => { });
        }

        this.activeSounds.forEach(item => {
            item.audio.play().catch(() => { });
        });
    }

    /**
     * Setzt die globale Lautstärke für alle Audioquellen.
     * @param {number} value
     */
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