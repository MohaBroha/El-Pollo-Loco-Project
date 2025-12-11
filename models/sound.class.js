class Sound {
    static cache = {};
    static mutedAll = false;

    constructor(path, loop = false, volume = 0.1) {
        if (Sound.cache[path]) {
            this.audio = Sound.cache[path].audio;
        } else {
            this.audio = new Audio(path);
            this.audio.loop = loop;
            this.audio.volume = volume;
            Sound.cache[path] = this;
        }
        this.loop = loop;
        this.volume = volume;
        this.path = path;

        this.audio.muted = Sound.mutedAll;
    }

    play() {
        if (!this.audio) return;
        this.audio.currentTime = 0;
        this.audio.play();
    }

    pause() {
        if (!this.audio) return;
        this.audio.pause();
    }

    stop() {
        if (!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    toggleMute() {
        if (!this.audio) return;
        this.audio.muted = !this.audio.muted;
    }

    isMuted() {
        return this.audio ? this.audio.muted : true;
    }

    setVolume(vol) {
        if (!this.audio) return;
        this.audio.volume = vol;
    }

    static stopAll() {
        if (!Sound.cache) return;
        for (let key in Sound.cache) {
            Sound.cache[key].stop();
        }
    }

    static muteAll(toggle) {
        Sound.mutedAll = toggle;
        for (let key in Sound.cache) {
            Sound.cache[key].audio.muted = toggle;
        }
    }

    static playSound(path, loop = false, volume = 0.1) {
        let soundInstance = Sound.cache[path] || new Sound(path, loop, volume);
        soundInstance.audio.muted = Sound.mutedAll;
        soundInstance.play();
        return soundInstance;
    }

    static init() {
        Sound.WALK = new Sound('audio/walk.mp3', false, 0.4);
        Sound.JUMP = new Sound('audio/jump.mp3', false, 0.5);
        Sound.SNORE = new Sound('audio/audio_snoring.mp3', false, 0.8);
        Sound.YAWN = new Sound('audio/yawning.mp3', false, 0.5);
        Sound.BGMUSIC1 = new Sound('audio/bgMusic-1.mp3', true, 0.1);
        Sound.DEAD = new Sound('audio/audio_chicken-dying.mp3', false, 0.6);
        Sound.COIN = new Sound('audio/mixkit-video-game-treasure-2066.wav', false, 0.1);
        Sound.BOSS1 = new Sound('audio/endboss_sound1.mp3', false, 0.7);
        Sound.SPLASH = new Sound('audio/splash1.mp3', false, 0.6);
        Sound.GAME_OVER = new Sound('audio/game-over-arcade-6435.mp3', false, 0.5);
        Sound.GOOD_RESULT = new Sound('audio/goodresult-82807.mp3', false, 0.5);
    }
}
