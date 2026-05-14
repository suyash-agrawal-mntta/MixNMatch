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
  setMasterVolume: (val: number) => void
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
   */
  const initialize = useCallback(() => {
    // Don't re-initialize if already done
    if (engineRef.current.isInitialized) return

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const context = new AudioContextClass()

      const masterGain = context.createGain()
      masterGain.gain.setValueAtTime(0.8, context.currentTime) // 80% volume

      const compressor = context.createDynamicsCompressor()
      compressor.threshold.setValueAtTime(-24, context.currentTime)
      compressor.knee.setValueAtTime(30, context.currentTime)
      compressor.ratio.setValueAtTime(12, context.currentTime)
      compressor.attack.setValueAtTime(0.003, context.currentTime)
      compressor.release.setValueAtTime(0.25, context.currentTime)

      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8

      compressor.connect(analyser)
      analyser.connect(masterGain)
      masterGain.connect(context.destination)

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

  const playSoundCallback = useCallback((key: string, variation: number = 0) => {
    const engine = engineRef.current

    if (!engine.context || !engine.compressor) {
      return
    }

    const now = engine.context.currentTime
    playSound(engine.context, engine.compressor, key, now, variation)
  }, [])

  const getAudioContext = useCallback(() => {
    return engineRef.current.context
  }, [])

  const getDestination = useCallback(() => {
    return engineRef.current.compressor
  }, [])

  const setMasterVolume = useCallback((val: number) => {
    const engine = engineRef.current
    if (engine.masterGain && engine.context) {
      // Linear scale is fine for this demo, mapping 0-100 to 0.0-1.0
      engine.masterGain.gain.setTargetAtTime(val / 100, engine.context.currentTime, 0.05)
    }
  }, [])

  return {
    isInitialized,
    analyser: engineRef.current.analyser,
    initialize,
    playSound: playSoundCallback,
    getAudioContext,
    getDestination,
    setMasterVolume
  }
}
