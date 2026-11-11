// src/audio.js — Synthesized Web Audio API Sound Engine for Dhaka Streets: Open World
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
    this.masterVolume = 0.65;
    this.sfxVolume = 0.8;

    // Continuous oscillators & nodes
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineGain = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenActive = false;
    this.sirenPhase = 0;

    this.rainNoiseNode = null;
    this.rainGain = null;
    this.ambienceTimer = 0;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.setupEngineSound();
      this.setupSirenSound();
      this.setupRainAmbience();
      this.initialized = true;
    } catch (e) {
      // Fallback if Web Audio blocked
    }
  }

  resume() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(mute) {
    this.muted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.muted ? 0 : this.masterVolume,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  setVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (!this.muted && this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  setupEngineSound() {
    if (!this.ctx) return;
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 240;

    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc2.type = 'triangle';
    this.engineOsc1.frequency.value = 45;
    this.engineOsc2.frequency.value = 90;

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.engineOsc1.start();
    this.engineOsc2.start();
  }

  setupSirenSound() {
    if (!this.ctx) return;
    this.sirenGain = this.ctx.createGain();
    this.sirenGain.gain.value = 0;

    this.sirenOsc = this.ctx.createOscillator();
    this.sirenOsc.type = 'square';
    this.sirenOsc.frequency.value = 650;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900;

    this.sirenOsc.connect(filter);
    filter.connect(this.sirenGain);
    this.sirenGain.connect(this.masterGain);
    this.sirenOsc.start();
  }

  setupRainAmbience() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 0.7;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0;

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    whiteNoise.start();
  }

  updateEngine(inVehicle, speedRatio, vehicleType) {
    if (!this.initialized || !this.ctx || !this.engineGain) return;
    const now = this.ctx.currentTime;

    if (!inVehicle || vehicleType === 'rickshaw') {
      // Cycle rickshaw has subtle chain whir instead of combustion engine
      if (inVehicle && vehicleType === 'rickshaw' && Math.abs(speedRatio) > 0.05) {
        this.engineOsc1.type = 'sine';
        this.engineOsc2.type = 'triangle';
        const base = 110 + Math.abs(speedRatio) * 140;
        this.engineOsc1.frequency.setTargetAtTime(base, now, 0.08);
        this.engineOsc2.frequency.setTargetAtTime(base * 1.5, now, 0.08);
        this.engineGain.gain.setTargetAtTime(0.03 * this.sfxVolume, now, 0.1);
      } else {
        this.engineGain.gain.setTargetAtTime(0, now, 0.1);
      }
      return;
    }

    const absSpeed = Math.abs(speedRatio);
    let baseFreq = 48;
    let modFreq = 110;
    let filterFreq = 260;
    let vol = 0.12;

    if (vehicleType === 'cng') {
      // Iconic 2-stroke / 4-stroke single cylinder putt-putt
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'square';
      baseFreq = 58 + absSpeed * 125;
      modFreq = baseFreq * 0.5;
      filterFreq = 480 + absSpeed * 600;
      vol = 0.13;
    } else if (vehicleType === 'bus' || vehicleType === 'minibus') {
      // Deep heavy diesel rumble
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'sawtooth';
      baseFreq = 32 + absSpeed * 65;
      modFreq = baseFreq * 1.5;
      filterFreq = 180 + absSpeed * 280;
      vol = 0.16;
    } else if (vehicleType === 'motorcycle' || vehicleType === 'sports_bike' || vehicleType === 'scooter') {
      // High-revving bike
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'triangle';
      baseFreq = 72 + absSpeed * 195;
      modFreq = baseFreq * 2.0;
      filterFreq = 520 + absSpeed * 900;
      vol = 0.12;
    } else if (vehicleType === 'sports_car') {
      // Aggressive V8
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'sawtooth';
      baseFreq = 55 + absSpeed * 185;
      modFreq = baseFreq * 1.25;
      filterFreq = 400 + absSpeed * 950;
      vol = 0.15;
    } else {
      // Sedan, SUV, Taxi
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'triangle';
      baseFreq = 44 + absSpeed * 120;
      modFreq = baseFreq * 1.5;
      filterFreq = 260 + absSpeed * 520;
      vol = 0.11;
    }

    this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.06);
    this.engineOsc2.frequency.setTargetAtTime(modFreq, now, 0.06);
    this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.08);
    this.engineGain.gain.setTargetAtTime(vol * this.sfxVolume, now, 0.08);
  }

  updateWorldAudio(dt, wantedLevel, weather, nearestPoliceDist) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Police Siren modulation
    if (wantedLevel >= 1 && nearestPoliceDist < 180) {
      this.sirenPhase += dt * (wantedLevel >= 3 ? 4.5 : 2.8);
      const wail = 620 + Math.sin(this.sirenPhase * Math.PI * 2) * 260;
      this.sirenOsc.frequency.setTargetAtTime(wail, now, 0.04);
      const prox = Math.max(0.02, 1 - nearestPoliceDist / 180);
      this.sirenGain.gain.setTargetAtTime(prox * 0.12 * this.sfxVolume, now, 0.08);
    } else {
      this.sirenGain.gain.setTargetAtTime(0, now, 0.15);
    }

    // Rain audio
    if (this.rainGain) {
      const targetRain = weather === 'rain' ? 0.14 * this.sfxVolume : 0;
      this.rainGain.gain.setTargetAtTime(targetRain, now, 0.3);
    }

    // Ambient distant Dhaka horns & rickshaw bells
    this.ambienceTimer -= dt;
    if (this.ambienceTimer <= 0) {
      this.ambienceTimer = 2.8 + Math.random() * 4.5;
      const r = Math.random();
      if (r < 0.4) {
        this.playHorn('rickshaw', 0.18);
      } else if (r < 0.75) {
        this.playHorn('cng', 0.14);
      } else {
        this.playHorn('bus', 0.12);
      }
    }
  }

  playHorn(vehicleType = 'sedan', distanceScale = 1.0) {
    this.resume();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.connect(this.masterGain);

    if (vehicleType === 'rickshaw') {
      // Authentic double "Tring-Tring!" bell sound
      [0, 0.13].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2450, now + offset);
        osc.frequency.exponentialRampToValueAtTime(2850, now + offset + 0.09);
        bGain.gain.setValueAtTime(0.22 * distanceScale * this.sfxVolume, now + offset);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);
        osc.connect(bGain);
        bGain.connect(this.masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.24);
      });
      return;
    }

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    if (vehicleType === 'bus' || vehicleType === 'minibus') {
      // Deep Dhaka bus dual-tone air horn
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(185, now);
      osc2.frequency.setValueAtTime(233, now);
    } else if (vehicleType === 'cng' || vehicleType === 'scooter') {
      // Sharp nasal horn
      osc1.type = 'square';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(490, now);
      osc2.frequency.setValueAtTime(515, now);
    } else {
      // Car / Bike dual-tone horn
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(390, now);
      osc2.frequency.setValueAtTime(485, now);
    }

    gain.gain.setValueAtTime(0.2 * distanceScale * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

    osc1.connect(gain);
    osc2.connect(gain);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  }

  playCollision(intensity = 0.6) {
    this.resume();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.22);

    gain.gain.setValueAtTime(Math.min(0.4, intensity * 0.35) * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playChime(type = 'ui') {
    this.resume();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    if (type === 'mission_complete') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.11);
        g.gain.setValueAtTime(0.22 * this.sfxVolume, now + i * 0.11);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.35);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now + i * 0.11);
        osc.stop(now + i * 0.11 + 0.36);
      });
    } else if (type === 'checkpoint') {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      g.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'camera_shutter') {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      g.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      g.gain.setValueAtTime(0.12 * this.sfxVolume, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.11);
    }
  }
}
