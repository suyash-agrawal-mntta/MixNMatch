export interface SoundEvent {
  key: string
  timestamp: number // Time in milliseconds from the start of the loop
}

export interface LoopState {
  events: SoundEvent[]
  isRecording: boolean
  isPlaying: boolean
  bpm: number
}

export interface SoundCategory {
  name: string
  color: string
  keys: string[]
}

export interface PadConfig {
  key: string
  label: string
  category: string
  color: string
}

export interface AudioEngine {
  context: AudioContext | null
  masterGain: GainNode | null
  compressor: DynamicsCompressorNode | null
  analyser: AnalyserNode | null
  isInitialized: boolean
}

export interface SequencerCallbacks {
  onEventTriggered?: (key: string) => void
}
