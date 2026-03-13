/**
 * Procedural Sound Engine for a Systems/Sci-fi aesthetic.
 * Uses Web Audio API to generate high-tech UI sounds without external assets.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.2; // Master volume
    this.enabled = true;
  }

  // A sharp, high-tech UI click
  playClick() {
    if (!this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // A subtle "tick" for scrolling thresholds
  playScroll() {
    if (!this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.02);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  // A burst of "data" sounds for the boot sequence
  playBoot() {
    if (!this.enabled) return;
    const duration = 2.5;
    const now = this.ctx.currentTime;
    
    for (let i = 0; i < 15; i++) {
      const time = now + Math.random() * duration;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = Math.random() > 0.5 ? 'sine' : 'square';
      osc.frequency.setValueAtTime(400 + Math.random() * 2000, time);
      
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  // Subtle ambient drone
  playAmbient() {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    
    // Low frequency drone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, now);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(55.5, now);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 2); // Fade in
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.start();
    osc2.start();
    
    this.ambient = { osc1, osc2, gain };
  }

  stopAmbient() {
    if (this.ambient) {
      const now = this.ctx.currentTime;
      this.ambient.gain.linearRampToValueAtTime(0, now + 1);
      setTimeout(() => {
        this.ambient.osc1.stop();
        this.ambient.osc2.stop();
        this.ambient = null;
      }, 1000);
    }
  }
}

export const soundEngine = new SoundEngine();
