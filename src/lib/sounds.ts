/**
 * Sound Synthesis Functions for MixNMatch
 *
 * All sounds are generated programmatically using the Web Audio API.
 * Uses oscillators for tonal sounds and noise generators for percussion.
 */

export type SoundType = 'kick' | 'snare' | 'hihat' | 'synth' | 'bass' | 'fx' | 'perc' | 'reserved'

/**
 * Creates a noise buffer for percussive sounds
 */
const createNoiseBuffer = (context: AudioContext, duration: number): AudioBuffer => {
  const sampleRate = context.sampleRate
  const bufferSize = sampleRate * duration
  const buffer = context.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

// === KICK VARIATIONS ===

/** SubKick - Deep sub bass kick */
const playSubKick = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(80, time)
  osc.frequency.exponentialRampToValueAtTime(30, time + 0.15)
  gain.gain.setValueAtTime(1, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.4)
}

/** Kick - Standard EDM kick */
const playKick = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, time)
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.08)
  gain.gain.setValueAtTime(1, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.3)
}

/** KickDrive - Punchy kicked with drive */
const playKickDrive = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  const distortion = context.createWaveShaper()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, time)
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.1)
  gain.gain.setValueAtTime(1.2, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25)
  // Subtle distortion curve
  const curve = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1
    curve[i] = Math.tanh(x * 1.5)
  }
  distortion.curve = curve
  osc.connect(distortion)
  distortion.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.25)
}

/** KickDeep - Deep sub-heavy kick */
const playKickDeep = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const osc2 = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc2.type = 'sine'
  osc.frequency.setValueAtTime(120, time)
  osc.frequency.exponentialRampToValueAtTime(35, time + 0.12)
  osc2.frequency.setValueAtTime(60, time)
  osc2.frequency.exponentialRampToValueAtTime(25, time + 0.15)
  gain.gain.setValueAtTime(0.9, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)
  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc2.start(time)
  osc.stop(time + 0.35)
  osc2.stop(time + 0.35)
}

// === SNARE VARIATIONS ===

/** Snare - Classic snare */
const playSnare = (context: AudioContext, destination: AudioNode, time: number): void => {
  const bodyOsc = context.createOscillator()
  const bodyGain = context.createGain()
  bodyOsc.type = 'sine'
  bodyOsc.frequency.setValueAtTime(180, time)
  bodyOsc.frequency.exponentialRampToValueAtTime(100, time + 0.05)
  bodyGain.gain.setValueAtTime(0.7, time)
  bodyGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
  bodyOsc.connect(bodyGain)
  bodyGain.connect(destination)

  const noiseBuffer = createNoiseBuffer(context, 0.2)
  const noise = context.createBufferSource()
  const noiseGain = context.createGain()
  const noiseFilter = context.createBiquadFilter()
  noise.buffer = noiseBuffer
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.setValueAtTime(3000, time)
  noiseGain.gain.setValueAtTime(0.5, time)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(destination)

  bodyOsc.start(time)
  bodyOsc.stop(time + 0.15)
  noise.start(time)
  noise.stop(time + 0.2)
}

/** SnareSnap - Tight snappy snare */
const playSnareSnap = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.15)
  const noise = context.createBufferSource()
  const noiseGain = context.createGain()
  const noiseFilter = context.createBiquadFilter()
  noise.buffer = noiseBuffer
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.setValueAtTime(5000, time)
  noiseGain.gain.setValueAtTime(0.6, time)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.15)
}

/** Clap - Electronic clap */
const playClap = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.3)
  const noise = context.createBufferSource()
  const noiseGain = context.createGain()
  const filter = context.createBiquadFilter()
  noise.buffer = noiseBuffer
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1200, time)
  filter.Q.setValueAtTime(2, time)
  // Multiple attacks for clap texture
  noiseGain.gain.setValueAtTime(0, time)
  noiseGain.gain.linearRampToValueAtTime(0.5, time + 0.01)
  noiseGain.gain.linearRampToValueAtTime(0.2, time + 0.02)
  noiseGain.gain.linearRampToValueAtTime(0.5, time + 0.03)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.25)
  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.3)
}

/** SnareFat - Layered fat snare */
const playSnareFat = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const oscGain = context.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(200, time)
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.03)
  oscGain.gain.setValueAtTime(0.6, time)
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12)
  osc.connect(oscGain)
  oscGain.connect(destination)

  const noiseBuffer = createNoiseBuffer(context, 0.2)
  const noise = context.createBufferSource()
  const noiseGain = context.createGain()
  const noiseFilter = context.createBiquadFilter()
  noise.buffer = noiseBuffer
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(2500, time)
  noiseFilter.Q.setValueAtTime(1, time)
  noiseGain.gain.setValueAtTime(0.5, time)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.18)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(destination)

  osc.start(time)
  osc.stop(time + 0.12)
  noise.start(time)
  noise.stop(time + 0.2)
}

/** SnareRim - Snare rim shot */
const playSnareRim = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const oscGain = context.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(400, time)
  osc.frequency.exponentialRampToValueAtTime(200, time + 0.02)
  oscGain.gain.setValueAtTime(0.8, time)
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
  osc.connect(oscGain)
  oscGain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.05)
}

// === HIHAT VARIATIONS ===

/** HiHatClosed - Tight closed hihat */
const playHiHatClosed = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.08)
  const noise = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(8000, time)
  gain.gain.setValueAtTime(0.25, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.08)
}

/** HiHatOpen - Open hihat with longer decay */
const playHiHatOpen = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.4)
  const noise = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(6000, time)
  gain.gain.setValueAtTime(0.2, time)
  gain.gain.setValueAtTime(0.2, time + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.4)
}

// === SYNTH VARIATIONS ===

/** SynthLead - Bright lead synth */
const playSynthLead = (context: AudioContext, destination: AudioNode, time: number, variation: number): void => {
  const osc = context.createOscillator()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  osc.type = variation % 2 === 0 ? 'sawtooth' : 'square'
  osc.frequency.setValueAtTime(330 + (variation * 55), time)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(800, time)
  filter.frequency.exponentialRampToValueAtTime(3000, time + 0.1)
  filter.frequency.exponentialRampToValueAtTime(800, time + 0.3)
  filter.Q.setValueAtTime(4, time)
  gain.gain.setValueAtTime(0.25, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.35)
}

/** SynthPad - Warm pad synth */
const playSynthPad = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const osc2 = context.createOscillator()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  osc.type = 'sawtooth'
  osc2.type = 'sawtooth'
  osc.frequency.setValueAtTime(165, time)
  osc2.frequency.setValueAtTime(166, time) // slight detune
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(400, time)
  filter.frequency.linearRampToValueAtTime(1200, time + 0.2)
  filter.frequency.linearRampToValueAtTime(600, time + 0.5)
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(0.2, time + 0.1)
  gain.gain.linearRampToValueAtTime(0.15, time + 0.4)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6)
  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc2.start(time)
  osc.stop(time + 0.6)
  osc2.stop(time + 0.6)
}

/** SynthPluck - Plucked synth */
const playSynthPluck = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(440, time)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(3000, time)
  filter.frequency.exponentialRampToValueAtTime(300, time + 0.15)
  gain.gain.setValueAtTime(0.4, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.2)
}

// === BASS VARIATIONS ===

/** BassSub - Sub bass */
const playBassSub = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(55, time)
  gain.gain.setValueAtTime(0.7, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.5)
}

/** Bass - Standard bass */
const playBass = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(82.5, time)
  gain.gain.setValueAtTime(0.6, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.4)
}

/** BassGrowl - Growling bass */
const playBassGrowl = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const osc2 = context.createOscillator()
  const gain = context.createGain()
  const distortion = context.createWaveShaper()
  osc.type = 'sawtooth'
  osc2.type = 'square'
  osc.frequency.setValueAtTime(55, time)
  osc2.frequency.setValueAtTime(55.5, time)
  const curve = new Float32Array(128)
  for (let i = 0; i < 128; i++) {
    const x = (i * 2) / 128 - 1
    curve[i] = Math.tanh(x * 3)
  }
  distortion.curve = curve
  gain.gain.setValueAtTime(0.5, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.45)
  osc.connect(distortion)
  osc2.connect(distortion)
  distortion.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc2.start(time)
  osc.stop(time + 0.45)
  osc2.stop(time + 0.45)
}

// === FX VARIATIONS ===

/** FXRise - Rising noise sweep */
const playFxRise = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.5)
  const noise = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(200, time)
  filter.frequency.exponentialRampToValueAtTime(6000, time + 0.4)
  filter.Q.setValueAtTime(8, time)
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(0.25, time + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.5)
}

/** FXDrop - Impact drop */
const playFxDrop = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(800, time)
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.3)
  gain.gain.setValueAtTime(0.5, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.3)
}

/** FXLaser - Laser/zap sound */
const playFxLaser = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(2000, time)
  osc.frequency.exponentialRampToValueAtTime(100, time + 0.12)
  gain.gain.setValueAtTime(0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.12)
}

/** FXNoise - Noise burst */
const playFxNoise = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.2)
  const noise = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(3000, time)
  filter.frequency.exponentialRampToValueAtTime(500, time + 0.15)
  filter.Q.setValueAtTime(5, time)
  gain.gain.setValueAtTime(0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.2)
}

// === PERCUSSION VARIATIONS ===

/** TomLo - Low tom */
const playTomLo = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(130, time)
  osc.frequency.exponentialRampToValueAtTime(80, time + 0.08)
  gain.gain.setValueAtTime(0.5, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.2)
}

/** TomMid - Mid tom */
const playTomMid = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, time)
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.08)
  gain.gain.setValueAtTime(0.5, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.2)
}

/** TomHi - High tom */
const playTomHi = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(300, time)
  osc.frequency.exponentialRampToValueAtTime(180, time + 0.08)
  gain.gain.setValueAtTime(0.5, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.18)
}

/** Cymbal - Cymbal crash/ride */
const playCymbal = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.8)
  const noise = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(5000, time)
  gain.gain.setValueAtTime(0.2, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.7)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.8)
}

/** Shaker - Shaker/percussive noise */
const playShaker = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.06)
  const noise = context.createBufferSource()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  gain.gain.setValueAtTime(0.2, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
  noise.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.06)
}

/** Cowbell - Cowbell */
const playCowbell = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const osc2 = context.createOscillator()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  osc.type = 'square'
  osc2.type = 'square'
  osc.frequency.setValueAtTime(587, time)
  osc2.frequency.setValueAtTime(845, time)
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(700, time)
  filter.Q.setValueAtTime(3, time)
  gain.gain.setValueAtTime(0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc2.start(time)
  osc.stop(time + 0.15)
  osc2.stop(time + 0.15)
}

/** Guiro - Guiro/long noise */
const playGuiro = (context: AudioContext, destination: AudioNode, time: number): void => {
  const noiseBuffer = createNoiseBuffer(context, 0.25)
  const noise = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  noise.buffer = noiseBuffer
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(2000, time)
  filter.Q.setValueAtTime(2, time)
  gain.gain.setValueAtTime(0.15, time)
  gain.gain.setValueAtTime(0.15, time + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(time)
  noise.stop(time + 0.25)
}

/** Clave - Clave rhythm */
const playClave = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(2500, time)
  osc.frequency.exponentialRampToValueAtTime(1500, time + 0.02)
  gain.gain.setValueAtTime(0.4, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.04)
}

/** Perc - Generic perc */
const playPercGeneric = (context: AudioContext, destination: AudioNode, time: number, variation: number): void => {
  const frequencies = [400, 350, 300, 450]
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  const freq = frequencies[variation % frequencies.length]
  osc.frequency.setValueAtTime(freq, time)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.06)
  gain.gain.setValueAtTime(0.4, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.1)
}

// === RESERVED ===

/** Reserved - Muted placeholder */
const playReserved = (context: AudioContext, destination: AudioNode, time: number): void => {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, time)
  gain.gain.setValueAtTime(0.15, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
  osc.connect(gain)
  gain.connect(destination)
  osc.start(time)
  osc.stop(time + 0.1)
}

/**
 * Main sound play function — QWERTY layout routing
 *
 * Row 1 (Q-P): DRUMS
 * Row 2 (A-L): KICKS/BASS
 * Row 3 (Z-.): SYNTH/FX
 * Row 4 (1-0): ONE-SHOTS
 */
export const playSound = (
  context: AudioContext,
  destination: AudioNode,
  key: string,
  time: number,
  variation: number = 0
): void => {
  const k = key.toUpperCase()

  // === ROW 1: DRUMS (Q-P) ===
  if (k === 'Q') { playSubKick(context, destination, time); return }
  if (k === 'W') { playKick(context, destination, time); return }
  if (k === 'E') { playKickDrive(context, destination, time); return }
  if (k === 'R') { playSnare(context, destination, time); return }
  if (k === 'T') { playSnareSnap(context, destination, time); return }
  if (k === 'Y') { playClap(context, destination, time); return }
  if (k === 'U') { playHiHatClosed(context, destination, time); return }
  if (k === 'I') { playHiHatOpen(context, destination, time); return }
  if (k === 'O') { playPercGeneric(context, destination, time, 0); return }
  if (k === 'P') { playPercGeneric(context, destination, time, 1); return }

  // === ROW 2: KICKS/BASS (A-L) ===
  if (k === 'A') { playSubKick(context, destination, time); return }
  if (k === 'S') { playKick(context, destination, time); return }
  if (k === 'D') { playKickDeep(context, destination, time); return }
  if (k === 'F') { playSnareFat(context, destination, time); return }
  if (k === 'G') { playSnareRim(context, destination, time); return }
  if (k === 'H') { playHiHatClosed(context, destination, time); return }
  if (k === 'J') { playHiHatOpen(context, destination, time); return }
  if (k === 'K') { playBassSub(context, destination, time); return }
  if (k === 'L') { playBass(context, destination, time); return }

  // === ROW 3: SYNTH/FX (Z-. comma) ===
  if (k === 'Z') { playBassGrowl(context, destination, time); return }
  if (k === 'X') { playSynthLead(context, destination, time, 0); return }
  if (k === 'C') { playSynthPad(context, destination, time); return }
  if (k === 'V') { playSynthPluck(context, destination, time); return }
  if (k === 'B') { playFxRise(context, destination, time); return }
  if (k === 'N') { playFxDrop(context, destination, time); return }
  if (k === 'M') { playFxLaser(context, destination, time); return }
  if (k === ',') { playFxNoise(context, destination, time); return }
  if (k === '.') { playPercGeneric(context, destination, time, 2); return }

  // === ROW 4: ONE-SHOTS (1-0) ===
  if (k === '1') { playTomLo(context, destination, time); return }
  if (k === '2') { playTomMid(context, destination, time); return }
  if (k === '3') { playTomHi(context, destination, time); return }
  if (k === '4') { playCymbal(context, destination, time); return }
  if (k === '5') { playShaker(context, destination, time); return }
  if (k === '6') { playCowbell(context, destination, time); return }
  if (k === '7') { playGuiro(context, destination, time); return }
  if (k === '8') { playClave(context, destination, time); return }
  if (k === '9') { playReserved(context, destination, time); return }
  if (k === '0') { playReserved(context, destination, time); return }

  // Fallback
  playReserved(context, destination, time)
}
