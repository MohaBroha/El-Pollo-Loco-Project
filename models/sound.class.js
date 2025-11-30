class Sound {
    constructor(path, loop = true, volume = 0.5) {
        this.audio = new Audio(path);
        this.audio.loop = loop;
        this.audio.volume = volume;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
    }

    isMuted() {
        return this.audio.muted;
    }

    setVolume(value) {
        this.audio.volume = value;
    }
}
