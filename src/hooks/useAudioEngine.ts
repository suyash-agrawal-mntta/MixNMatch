/**
 * useAudioEngine - Custom Hook for Web Audio API Management
 *
 * This hook manages the AudioContext lifecycle and provides
 * methods for playing sounds and accessing audio analysis data.
 *
 * Key responsibilities:
 * 1. Lazily initialize AudioContext on first user interaction (required by browsers)
 * 2. Create master audio chain: source -> compressor -> analyser -> master gain -> destination
 * 3. Provide playSound function for triggering synthesized sounds
 * 4. Expose analyser node for visualizer amplitude data
 */

import { useRef, useCallback, useState } from 'react'
import { playSound } from '@/lib/sounds'
import { AudioEngine } from '@/types'

export interface UseAudioEngineReturn {
  isInitialized: boolean
  analyser: AnalyserNode | null
  initialize: () => void
  playSound: (key: string, variation?: number) => void
  getAudioContext: () => AudioContext | null
  getDestination: () => AudioNode | null
}

export const useAudioEngine = (): UseAudioEngineReturn => {
  // Use refs to store audio nodes (refs don't trigger re-renders)
  const engineRef = useRef<AudioEngine>({
    context: null,
    masterGain: null,
    compressor: null,
    analyser: null,
    isInitialized: false,
  })

  const [isInitialized, setIsInitialized] = useState(false)

  /**
   * Initialize the Web Audio API context and audio chain
   *
   * Audio Chain:
   * [Sound Sources] -> [Compressor] -> [Analyser] -> [Master Gain] -> [Destination]
   *
   * - Compressor: Prevents clipping when multiple sounds play simultaneously
   * - Analyser: Provides FFT data for the visualizer
   * - Master Gain: Overall volume control
   */
  const initialize = useCallback(() => {
    // Don't re-initialize if already done
    if (engineRef.current.isInitialized) return

    try {
      // Create AudioContext - the core of Web Audio API
      // We use the standard AudioContext, not webkit prefix
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const context = new AudioContextClass()

      // Create master gain node for volume control
      const masterGain = context.createGain()
      masterGain.gain.setValueAtTime(0.8, context.currentTime) // 80% volume

      // Create compressor to prevent clipping
      // threshold: -24dB, knee: 30dB, ratio: 12:1, attack: 0.003s, release: 0.25s
      const compressor = context.createDynamicsCompressor()
      compressor.threshold.setValueAtTime(-24, context.currentTime)
      compressor.knee.setValueAtTime(30, context.currentTime)
      compressor.ratio.setValueAtTime(12, context.currentTime)
      compressor.attack.setValueAtTime(0.003, context.currentTime)
      compressor.release.setValueAtTime(0.25, context.currentTime)

      // Create analyser for visualizer FFT data
      // fftSize of 256 gives us 128 frequency bins
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8 // Smooth out the values for better visuals

      // Build the audio chain:
      // compressor -> analyser -> masterGain -> destination (speakers)
      compressor.connect(analyser)
      analyser.connect(masterGain)
      masterGain.connect(context.destination)

      // Store references
      engineRef.current = {
        context,
        masterGain,
        compressor,
        analyser,
        isInitialized: true,
      }

      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize Web Audio API:', error)
    }
  }, [])

  /**
   * Play a synthesized sound for the given key
   *
   * @param key - The key pressed (A-Z, 0-9)
   * @param variation - Optional variation index for sounds with multiple variants
   */
  const playSoundCallback = useCallback((key: string, variation: number = 0) => {
    const engine = engineRef.current

    if (!engine.context || !engine.compressor) {
      console.warn('Audio engine not initialized')
      return
    }

    // Use AudioContext.currentTime for precise scheduling
    // This is the "wall clock" time in seconds
    const now = engine.context.currentTime

    // Play the sound, routing to the compressor (before analyser/master gain)
    playSound(engine.context, engine.compressor, key, now, variation)
  }, [])

  /**
   * Get the AudioContext for external use (e.g., sequencer timing)
   */
  const getAudioContext = useCallback(() => {
    return engineRef.current.context
  }, [])

  /**
   * Get the master destination node for routing
   */
  const getDestination = useCallback(() => {
    return engineRef.current.compressor
  }, [])

  return {
    isInitialized,
    analyser: engineRef.current.analyser,
    initialize,
    playSound: playSoundCallback,
    getAudioContext,
    getDestination,
  }
}
