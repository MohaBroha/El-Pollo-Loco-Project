/**
 * AudioManager (singleton).
 * Manages sound effects and background music, volume, mute state and sound locks.
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
     * Play a short sound effect identified by name from `AUDIO_LIBRARY`.
     * Sound playback respects the global mute and `gameEnded` state unless `force` is true.
     *
     * @param {string} name - Key in `AUDIO_LIBRARY` identifying the sound.
     * @param {boolean} [force=false] - If true, ignore locks and game-ended checks.
     */
    playSound(name, force = false) {
        if (this.muted) return;
        if (!this.canPlaySound(name, force)) {
            return;
        }

        const entry = AUDIO_LIBRARY[name];
        if (!entry) return;

        if (!force && this.soundLocks[name]) return;
        this.lockSound(name);

        const file = typeof entry === "string" ? entry : entry.file;

        const soundVolume =
            typeof entry === "object" && entry.volume != null
                ? entry.volume
                : this.volume;

        const audio = this.createAudio(file, soundVolume);

        audio.addEventListener('ended', () => this._removeActiveSound(audio));

        audio.play().catch(() => { });

        this.activeSounds.push({ name, audio });
    }

    /**
    * Checks whether a sound can be played.
    *
    * @param {string} name - The sound name.
    * @param {boolean} force - Whether playback should ignore restrictions.
    * @returns {boolean} True if the sound can be played.
    */
    canPlaySound(name, force) {
        const endSounds = ["bossDeath", "gameOver", "victory"];

        if (this.gameEnded && !force && !endSounds.includes(name)) {
            return false;
        }

        return true;
    }

    /**
    * Activates the sound lock for a short time.
    *
    * @param {string} name - The sound name.
    */
    lockSound(name) {
        this.soundLocks[name] = true;

        setTimeout(() => {
            this.soundLocks[name] = false;
        }, 300);
    }

    /**
    * Creates and configures an audio instance.
    *
    * @param {string} file - The audio file name.
    * @param {number} volume - The playback volume.
    * @returns {HTMLAudioElement} The configured audio instance.
    */
    createAudio(file, volume) {
        const audio = new Audio(`audio/${file}`);
        audio.volume = volume;
        audio.muted = this.muted;
        audio.currentTime = 0;

        return audio;
    }

    /**
     * Remove a finished audio element from the active sounds list.
     *
     * @private
     * @param {HTMLAudioElement} audio - Audio element that finished playback.
     */
    _removeActiveSound(audio) {
        this.activeSounds = this.activeSounds.filter(item => item.audio !== audio);
    }

    /**
     * Play background music identified by `name` from `AUDIO_LIBRARY`.
     * Replaces any currently playing music.
     *
     * @param {string} name - Key in `AUDIO_LIBRARY` for the music track.
     * @param {boolean} [loop=true] - Whether the music should loop.
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
     * Stop all audio playback including music and active sound effects.
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
     * Stop background music playback and reset the track to start.
     */
    stopMusic() {
        if (!this.music) return;

        this.music.pause();
        this.music.currentTime = 0;
    }

    /**
     * Set the game-ended state which affects whether some sounds are allowed to play.
     *
     * @param {boolean} state - True if the game has ended.
     */
    setGameEnded(state) {
        this.gameEnded = state;
        if (state) {
            this.stopMusic();
        }
    }

    /**
     * Stop all currently playing sounds that match the given name.
     *
     * @param {string} name - Name/key of the sound to stop.
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
     * Toggle global mute state.
     *
     * @param {boolean} state - True to mute, false to unmute.
     */
    toggleMute(state) {
        this.muted = state;

        if (state) this.muteAll();
        else this.unmuteAll();
    }

    /**
     * Mute all audio and pause currently playing tracks.
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
     * Unmute audio and resume paused tracks where possible.
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
     * Set the global volume for music and active sounds.
     *
     * @param {number} value - Volume value between 0.0 and 1.0.
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