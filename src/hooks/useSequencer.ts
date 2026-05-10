/**
 * useSequencer - Custom Hook for Live-Looping Sequencer
 *
 * This hook manages the recording and playback of sequences with precise timing.
 *
 * CRITICAL TIMING MATH:
 *
 * The sequencer uses a fixed loop length (4 bars at the current BPM) and records
 * key press events as timestamps relative to the loop start. This allows for:
 *
 * 1. Dynamic loop injection - adding new sounds without stopping playback
 * 2. Perfect loop sync - all events align to the beat grid
 * 3. Simple playback - just check if any events fall within the current frame
 *
 * Loop Timing Calculation:
 * - BPM = Beats Per Minute (e.g., 128)
 * - Beat Duration = 60000ms / BPM (e.g., 468.75ms at 128 BPM)
 * - Bar Duration = Beat Duration × 4 (e.g., 1875ms at 128 BPM)
 * - Loop Duration = Bar Duration × 4 bars (e.g., 7500ms at 128 BPM)
 *
 * Event Recording:
 * - When user presses a key, we record: { key, timestamp }
 * - The timestamp is: (AudioContext.currentTime * 1000) % loopDuration
 *   This gives us ms within the current loop cycle
 *
 * Event Playback:
 * - Each animation frame, we calculate: loopPosition = (now - loopStartTime) % loopDuration
 * - Any event where event.timestamp falls within [loopPosition - frameDelta, loopPosition]
 *   should be triggered
 *
 * Lookahead Scheduling:
 * - We use a lookahead of 100ms (SCHEDULE_AHEAD_TIME) to ensure sounds
 *   are scheduled before they're heard, avoiding latency
 * - This is critical because requestAnimationFrame can have variable timing
 */

import { useRef, useCallback, useState, useEffect } from 'react'
import { playSound } from '@/lib/sounds'
import {
  DEFAULT_BPM,
  SCHEDULE_AHEAD_TIME,
  SCHEDULE_INTERVAL,
  getLoopDuration,
  getBeatDuration,
  BARS_PER_LOOP,
  BEATS_PER_BAR,
} from '@/lib/constants'
import { SoundEvent, SequencerCallbacks } from '@/types'

export interface UseSequencerReturn {
  isRecording: boolean
  isPlaying: boolean
  isRecordingRef: React.MutableRefObject<boolean>
  isPlayingRef: React.MutableRefObject<boolean>
  bpm: number
  events: SoundEvent[]
  loopDuration: number
  setBpm: (bpm: number) => void
  startRecording: () => void
  stopRecording: () => void
  toggleRecording: () => void
  clearLoop: () => void
  addEvent: (key: string) => void
  getAnalyserData: () => Uint8Array | null
  onEventTriggered: (callback: (key: string) => void) => void
}

export const useSequencer = (
  getAudioContext: () => AudioContext | null,
  getDestination: () => AudioNode | null
): UseSequencerReturn => {
  // State for UI updates
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpmState] = useState(DEFAULT_BPM)
  const [events, setEvents] = useState<SoundEvent[]>([])

  // Refs for timing-critical values (don't trigger re-renders)
  const loopStartTimeRef = useRef<number>(0)
  const recordedEventsRef = useRef<SoundEvent[]>([])
  const isRecordingRef = useRef(false)
  const isPlayingRef = useRef(false)
  const bpmRef = useRef(DEFAULT_BPM)
  const lastTriggeredRef = useRef<Map<string, number>>(new Map()) // Track last triggered time per event

  // Callback ref for visualizer notifications
  const eventCallbackRef = useRef<((key: string) => void) | null>(null)

  // Analyser data ref
  const analyserDataRef = useRef<Uint8Array | null>(null)

  /**
   * Set BPM - updates both state and ref for timing calculations
   */
  const setBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(60, Math.min(200, newBpm))
    setBpmState(clampedBpm)
    bpmRef.current = clampedBpm
  }, [])

  /**
   * Calculate loop duration in milliseconds based on current BPM
   * Loop = 4 bars × 4 beats/bar = 16 beats total
   */
  const loopDuration = getLoopDuration(bpm)

  /**
   * Start recording mode
   * Clears previous events and begins capturing key presses
   */
  const startRecording = useCallback(() => {
    const context = getAudioContext()
    if (!context) return

    // Reset events
    recordedEventsRef.current = []
    setEvents([])

    // Start loop timer
    // We use AudioContext time as the reference for precise sync
    loopStartTimeRef.current = context.currentTime * 1000 // Convert to ms

    // Set recording state
    isRecordingRef.current = true
    setIsRecording(true)
    isPlayingRef.current = true
    setIsPlaying(true)
  }, [getAudioContext])

  /**
   * Stop recording mode
   * Loop continues to play back recorded sequence
   */
  const stopRecording = useCallback(() => {
    isRecordingRef.current = false
    setIsRecording(false)
    // Keep isPlaying true - loop continues
  }, [])

  /**
   * Toggle between recording and stopped states
   */
  const toggleRecording = useCallback(() => {
    if (isRecordingRef.current || !isPlayingRef.current) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [startRecording, stopRecording])

  /**
   * Clear all recorded events and stop playback
   */
  const clearLoop = useCallback(() => {
    isRecordingRef.current = false
    isPlayingRef.current = false
    setIsRecording(false)
    setIsPlaying(false)
    recordedEventsRef.current = []
    setEvents([])
    lastTriggeredRef.current.clear()
  }, [])

  /**
   * Add a key event to the recorded sequence
   *
   * The timestamp is calculated as the offset within the current loop cycle.
   * This is done using modulo arithmetic on the elapsed time since loop start.
   *
   * Formula: timestamp = (elapsedTime % loopDuration)
   *
   * This ensures:
   * 1. Events always fall within [0, loopDuration)
   * 2. When loop wraps around, events naturally align to the beat grid
   * 3. New events can be dynamically added and will play in the correct position
   */
  const addEvent = useCallback((key: string) => {
    const context = getAudioContext()
    if (!context) return

    // Calculate timestamp within the current loop cycle
    const currentTimeMs = context.currentTime * 1000
    const loopDurationMs = getLoopDuration(bpmRef.current)

    // Calculate position within the loop using modulo
    // This is the key to dynamic loop injection!
    const timestamp = (currentTimeMs - loopStartTimeRef.current) % loopDurationMs

    // Handle negative modulo (JavaScript edge case)
    const normalizedTimestamp = timestamp < 0 ? timestamp + loopDurationMs : timestamp

    const newEvent: SoundEvent = {
      key: key.toUpperCase(),
      timestamp: normalizedTimestamp,
    }

    // Add to recorded events
    recordedEventsRef.current = [...recordedEventsRef.current, newEvent]
    setEvents([...recordedEventsRef.current])
  }, [getAudioContext])

  /**
   * Playback scheduler - runs on each animation frame
   *
   * This is the core playback loop. Each frame we:
   * 1. Calculate current position in the loop
   * 2. Find any events that should trigger this frame
   * 3. Trigger sounds for those events
   *
   * The use of modulo arithmetic ensures events always trigger at the
   * correct position, even when the loop wraps around.
   */
  useEffect(() => {
    if (!isPlaying) return

    let animationFrameId: number
    let lastFrameTime = 0

    const tick = (timestamp: number) => {
      const context = getAudioContext()
      const destination = getDestination()

      if (!context || !destination) {
        animationFrameId = requestAnimationFrame(tick)
        return
      }

      // Store analyser data for visualizer
      // This is a bit of a hack - in production we'd pass the analyser properly
      analyserDataRef.current = null

      const currentTimeMs = context.currentTime * 1000
      const loopDurationMs = getLoopDuration(bpmRef.current)

      // Calculate current position in the loop
      // This is how far we are from the loop start point
      let loopPosition = (currentTimeMs - loopStartTimeRef.current) % loopDurationMs
      if (loopPosition < 0) loopPosition += loopDurationMs

      // On first frame, set lastFrameTime to current position
      if (lastFrameTime === 0) {
        lastFrameTime = loopPosition
      }

      // Calculate the time window for this frame
      // We use SCHEDULE_AHEAD_TIME to account for audio latency
      const frameDelta = loopPosition - lastFrameTime

      // Handle loop wraparound
      // If current position < last frame position, we wrapped around
      const eventsToCheck = frameDelta < 0
        ? recordedEventsRef.current
        : recordedEventsRef.current.filter(event => {
            // Check if event timestamp is within [lastFrameTime - lookahead, loopPosition]
            // But also include events slightly ahead (SCHEDULE_AHEAD_TIME)
            const adjustedLast = lastFrameTime - SCHEDULE_AHEAD_TIME
            return event.timestamp >= adjustedLast && event.timestamp <= loopPosition
          })

      // Trigger events that fall within this frame's time window
      for (const event of eventsToCheck) {
        // Deduplication: don't trigger the same event twice in one loop iteration
        const eventKey = `${event.key}-${Math.floor(event.timestamp / loopDurationMs * 100)}`
        const lastTriggered = lastTriggeredRef.current.get(eventKey)

        if (lastTriggered !== loopStartTimeRef.current) {
          // Calculate the exact time to schedule this sound
          // We need to convert from loop-relative ms to AudioContext time
          const timeUntilEvent = event.timestamp - loopPosition
          const scheduleTime = context.currentTime + (timeUntilEvent / 1000)

          // Only schedule if it's in the future (with small lookahead)
          if (scheduleTime >= context.currentTime - 0.05) {
            playSound(context, destination, event.key, Math.max(context.currentTime, scheduleTime))

            // Notify visualizer callback
            if (eventCallbackRef.current) {
              eventCallbackRef.current(event.key)
            }

            lastTriggeredRef.current.set(eventKey, loopStartTimeRef.current)
          }
        }
      }

      // Handle loop wraparound - reset tracking
      if (frameDelta < 0) {
        lastTriggeredRef.current.clear()
        loopStartTimeRef.current = currentTimeMs - loopPosition
      }

      lastFrameTime = loopPosition
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPlaying, getAudioContext, getDestination])

  /**
   * Register a callback for when events are triggered
   * Used by the visualizer to react to sounds
   */
  const onEventTriggered = useCallback((callback: (key: string) => void) => {
    eventCallbackRef.current = callback
  }, [])

  return {
    isRecording,
    isPlaying,
    isRecordingRef,
    isPlayingRef,
    bpm,
    events,
    loopDuration,
    setBpm,
    startRecording,
    stopRecording,
    toggleRecording,
    clearLoop,
    addEvent,
    getAnalyserData: () => analyserDataRef.current,
    onEventTriggered,
  }
}
