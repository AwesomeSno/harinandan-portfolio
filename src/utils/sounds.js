import { Howl, Howler } from 'howler'

class SoundEngine {
  constructor() {
    this.enabled = false;
    
    this.sounds = {
      space: new Howl({ src: ['/sounds/space.mp3'], loop: true, volume: 0 }),
      tap: new Howl({ src: ['/sounds/tap.mp3'], volume: 0.3 }),
      hover: new Howl({ src: ['/sounds/hover.mp3'], volume: 0.2 }),
      beep: new Howl({ src: ['/sounds/beep.mp3'], volume: 0.15 }),
      wosh: new Howl({ src: ['/sounds/wosh.mp3'], volume: 0.8 }),
    };
  }

  init() {
    if (this.enabled) return;
    this.enabled = true;
    Howler.volume(1.0);
  }

  playPowerOn() {
    if (!this.enabled) return;
    this.sounds.wosh.play();
  }

  playClick() {
    if (!this.enabled) return;
    this.sounds.tap.play();
  }
  
  playBootLine() {
    if (!this.enabled) return;
    this.sounds.beep.play();
  }

  playScroll() {
    if (!this.enabled) return;
    // Lower volume and pitch down tap for scroll
    const id = this.sounds.tap.play();
    this.sounds.tap.volume(0.05, id);
    this.sounds.tap.rate(0.8, id);
  }

  playAmbient() {
    if (!this.enabled) return;
    if (!this.sounds.space.playing()) {
      this.sounds.space.play();
      this.sounds.space.fade(0, 0.4, 2000);
    }
  }

  playHover() {
    if (!this.enabled) return;
    // Don't restart if currently playing hover rapidly
    this.sounds.hover.play();
  }

  suspend() {
    if (this.enabled) {
      this.sounds.space.pause();
    }
  }

  resume() {
    if (this.enabled && !this.sounds.space.playing()) {
      this.sounds.space.play();
      this.sounds.space.fade(0, 0.4, 1000);
    }
  }
}

export const soundEngine = new SoundEngine();
