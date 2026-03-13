import { Howl, Howler } from 'howler';

class SoundEngine {
  constructor() {
    this.enabled = false;
    
    // Initialize Howls for the different sound effects
    this.sounds = {
      space: new Howl({
        src: ['/sounds/space.mp3'],
        loop: true,
        volume: 0.0, // Fade in later
        html5: false
      }),
      hover: new Howl({
        src: ['/sounds/hover.mp3'],
        volume: 0.3
      }),
      tap: new Howl({
        src: ['/sounds/tap.mp3'],
        volume: 0.5
      }),
      beep: new Howl({
        src: ['/sounds/beep.mp3'],
        volume: 0.2
      }),
      wosh: new Howl({
        src: ['/sounds/wosh.mp3'],
        volume: 0.8
      }),
      shutter: new Howl({
        src: ['/sounds/shutter.mp3'],
        volume: 0.2
      })
    };
  }

  init() {
    if (this.enabled) return;
    this.enabled = true;
    Howler.volume(0.8);
  }

  playHover() {
    if (!this.enabled) return;
    this.sounds.hover.play();
  }

  playClick() {
    if (!this.enabled) return;
    this.sounds.tap.play();
  }
  
  playBeep() {
    if (!this.enabled) return;
    this.sounds.beep.play();
  }

  playShutter() {
    if (!this.enabled) return;
    this.sounds.shutter.play();
  }

  playPowerOn() {
    if (!this.enabled) return;
    this.sounds.wosh.play();
  }

  playAmbient() {
    if (!this.enabled) return;
    const id = this.sounds.space.play();
    this.sounds.space.fade(0, 0.4, 2000, id);
    this.ambientId = id;
  }

  suspend() {
    if (!this.enabled) return;
    Howler.mute(true);
  }

  resume() {
    if (!this.enabled) return;
    Howler.mute(false);
  }
}

export const soundEngine = new SoundEngine();
