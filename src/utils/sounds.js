/**
 * Procedural Sound Engine for a Systems/Sci-fi aesthetic.
 * Uses Web Audio API to generate high-tech, cinematic UI sounds.
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
    
    // Add soft clipping distortion for a 'cinematic' crunch
    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.makeDistortionCurve(15);
    shaper.oversample = '4x';
    
    // Add a global reverb/delay for a spacious feel
    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.12;
    const delayGain = this.ctx.createGain();
    delayGain.gain.value = 0.15;
    
    this.masterGain.connect(shaper);
    shaper.connect(this.ctx.destination);
    
    this.masterGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(shaper);
    
    this.masterGain.gain.value = 0.5;
    this.enabled = true;
  }

  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Deep, smooth cinematic bass impact
  playPowerOn() {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    
    // Low sub thud
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(1.0, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 1.2);

    // Mid atmosphere bloom
    const midOsc = this.ctx.createOscillator();
    const midGain = this.ctx.createGain();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(150, now);
    midOsc.frequency.exponentialRampToValueAtTime(50, now + 2.0);
    midGain.gain.setValueAtTime(0, now);
    midGain.gain.linearRampToValueAtTime(0.15, now + 0.2);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    
    // Add warm filtering
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 1.0);
    
    midOsc.connect(filter);
    filter.connect(midGain);
    midGain.connect(this.masterGain);
    midOsc.start(now);
    midOsc.stop(now + 2.0);
  }

  // Smooth, subtle cinematic UI click
  playClick() {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Use a sine wave for less harshness, quickly pitched down
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Subtle holographic glass tick for scroll
  playScroll() {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2500, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Data processing burst noise (sci-fi terminal logic)
  playBoot() {
    if (!this.enabled) return;
    const duration = 2.0;
    const now = this.ctx.currentTime;
    
    for (let i = 0; i < 25; i++) {
      const time = now + Math.random() * duration;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 4000, time);
      
      gain.gain.setValueAtTime(0.03, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  // Cinematic brooding drone (Space Station Feel)
  playAmbient() {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(45, now);
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(22.5, now); // Very low sub frequency
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    
    // Slow sweeping filter for movement
    filter.frequency.linearRampToValueAtTime(250, now + 15);
    filter.frequency.linearRampToValueAtTime(120, now + 30);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 4);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.start(now);
    osc2.start(now);
    
    this.ambient = { osc1, osc2, gain };
  }

  // Futuristic electronic 'hum' or 'bloop' for hover
  playHover() {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Suspend context when tab is inactive
  suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  // Resume context when tab is active again
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

export const soundEngine = new SoundEngine();
