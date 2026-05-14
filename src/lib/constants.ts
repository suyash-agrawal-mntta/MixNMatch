import { PadConfig } from '@/types'

/**
 * QWERTY Layout — 4 rows × 9 columns
 *
 * Row 1 (Q-P): DRUMS — Cyan theme
 * Row 2 (A-L): KICKS/BASS — Magenta theme
 * Row 3 (Z-./comma): SYNTH/FX — Lime theme
 * Row 4 (1-0): ONE-SHOTS — Purple theme
 */
export const KEY_CONFIG: PadConfig[] = [
  // === ROW 1: DRUMS (Q-P) — Cyan theme ===
  { key: 'Q', label: 'Q', category: 'kick', color: '#00f0ff' },
  { key: 'W', label: 'W', category: 'kick', color: '#00f0ff' },
  { key: 'E', label: 'E', category: 'kick', color: '#00f0ff' },
  { key: 'R', label: 'R', category: 'snare', color: '#00f0ff' },
  { key: 'T', label: 'T', category: 'snare', color: '#00f0ff' },
  { key: 'Y', label: 'Y', category: 'snare', color: '#00f0ff' },
  { key: 'U', label: 'U', category: 'hihat', color: '#00f0ff' },
  { key: 'I', label: 'I', category: 'hihat', color: '#00f0ff' },
  { key: 'O', label: 'O', category: 'perc', color: '#00f0ff' },
  { key: 'P', label: 'P', category: 'perc', color: '#00f0ff' },

  // === ROW 2: KICKS/BASS (A-L) — Magenta theme ===
  { key: 'A', label: 'A', category: 'kick', color: '#ff00aa' },
  { key: 'S', label: 'S', category: 'kick', color: '#ff00aa' },
  { key: 'D', label: 'D', category: 'kick', color: '#ff00aa' },
  { key: 'F', label: 'F', category: 'snare', color: '#ff00aa' },
  { key: 'G', label: 'G', category: 'snare', color: '#ff00aa' },
  { key: 'H', label: 'H', category: 'hihat', color: '#ff00aa' },
  { key: 'J', label: 'J', category: 'hihat', color: '#ff00aa' },
  { key: 'K', label: 'K', category: 'bass', color: '#ff00aa' },
  { key: 'L', label: 'L', category: 'bass', color: '#ff00aa' },

  // === ROW 3: SYNTH/FX (Z-./comma) — Lime theme ===
  { key: 'Z', label: 'Z', category: 'bass', color: '#a0ff00' },
  { key: 'X', label: 'X', category: 'synth', color: '#a0ff00' },
  { key: 'C', label: 'C', category: 'synth', color: '#a0ff00' },
  { key: 'V', label: 'V', category: 'synth', color: '#a0ff00' },
  { key: 'B', label: 'B', category: 'fx', color: '#a0ff00' },
  { key: 'N', label: 'N', category: 'fx', color: '#a0ff00' },
  { key: 'M', label: 'M', category: 'fx', color: '#a0ff00' },
  { key: ',', label: ',', category: 'fx', color: '#a0ff00' },
  { key: '.', label: '.', category: 'perc', color: '#a0ff00' },

  // === ROW 4: ONE-SHOTS (1-0) — Purple theme ===
  { key: '1', label: '1', category: 'perc', color: '#aa00ff' },
  { key: '2', label: '2', category: 'perc', color: '#aa00ff' },
  { key: '3', label: '3', category: 'perc', color: '#aa00ff' },
  { key: '4', label: '4', category: 'perc', color: '#aa00ff' },
  { key: '5', label: '5', category: 'perc', color: '#aa00ff' },
  { key: '6', label: '6', category: 'perc', color: '#aa00ff' },
  { key: '7', label: '7', category: 'perc', color: '#aa00ff' },
  { key: '8', label: '8', category: 'perc', color: '#aa00ff' },
  { key: '9', label: '9', category: 'reserved', color: '#aa00ff' },
  { key: '0', label: '0', category: 'reserved', color: '#aa00ff' },
]

// Row grouping indices for Beatpad component
export const ROW_INDICES = {
  ROW1: KEY_CONFIG.slice(0, 10), // Q-P (10 keys)
  ROW2: KEY_CONFIG.slice(10, 19), // A-L (9 keys)
  ROW3: KEY_CONFIG.slice(19, 28), // Z-. (9 keys)
  ROW4: KEY_CONFIG.slice(28, 38), // 1-0 (10 keys)
} as const

// Row metadata for theming
export const ROW_META = {
  ROW1: { label: 'DRUMS', theme: '#00f0ff', bg: 'rgba(0,240,255,0.05)' },
  ROW2: { label: 'KICKS / BASS', theme: '#ff00aa', bg: 'rgba(255,0,170,0.05)' },
  ROW3: { label: 'SYNTH / FX', theme: '#a0ff00', bg: 'rgba(160,255,0,0.05)' },
  ROW4: { label: 'ONE-SHOTS', theme: '#aa00ff', bg: 'rgba(170,0,255,0.05)' },
} as const

// Audio timing constants
export const DEFAULT_BPM = 128
export const MIN_BPM = 60
export const MAX_BPM = 200
export const BEATS_PER_BAR = 4
export const BARS_PER_LOOP = 1

// Calculate timing in milliseconds
export const getBeatDuration = (bpm: number): number => 60000 / bpm
export const getBarDuration = (bpm: number): number => getBeatDuration(bpm) * BEATS_PER_BAR
export const getLoopDuration = (bpm: number): number => getBarDuration(bpm) * BARS_PER_LOOP

// Visualizer constants
export const VISUALIZER_FPS = 60
export const PARTICLE_LIFETIME = 1500 // ms
export const MAX_PARTICLES = 100
export const CIRCLE_INITIAL_RADIUS = 10
export const CIRCLE_MAX_RADIUS = 200

// Audio scheduling constants
export const SCHEDULE_AHEAD_TIME = 0.1 // seconds - how far ahead to schedule
export const SCHEDULE_INTERVAL = 25 // ms - how often to check for scheduling
