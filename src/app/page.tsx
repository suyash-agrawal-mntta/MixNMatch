/**
 * MixNMatch - Main Page
 *
 * EDM Beatpad & Live-Looping Sequencer with QWERTY drum layout
 *
 * Keyboard Controls:
 * - Q-P: Drums (kicks, snares, claps, hi-hats, perc)
 * - A-L: Kicks/Bass variations
 * - Z-./comma: Synth/FX
 * - 1-0: One-shots (toms, cymbals, etc.)
 * - Space: Toggle record/loop
 * - Escape: Clear loop
 * - Up/Down: Adjust BPM
 */

'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Beatpad } from '@/components/Beatpad'
import { Visualizer } from '@/components/Visualizer'
import { Controls } from '@/components/Controls'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useSequencer } from '@/hooks/useSequencer'

export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)

  // Container ref for visualizer sizing
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const {
    isInitialized,
    initialize,
    playSound,
    getAudioContext,
    getDestination,
  } = useAudioEngine()

  const {
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
    onEventTriggered,
  } = useSequencer(getAudioContext, getDestination)

  const handleFirstInteraction = useCallback(() => {
    if (!initialized) {
      initialize()
      setInitialized(true)
      setShowOverlay(false)
    }
  }, [initialized, initialize])

  // FIX: Use isRecordingRef.current instead of stale isRecording state
  const handleKeyPress = useCallback((key: string) => {
    if (!initialized) return

    if (isRecordingRef.current) {
      // When recording: only store event, let loop playback handle it
      addEvent(key)
    } else {
      // When not recording: play immediately for tactile feedback
      playSound(key)
    }
  }, [initialized, isRecordingRef, addEvent, playSound])

  // Also handle immediate playback for visual feedback during recording
  const handleKeyPressWithVisual = useCallback((key: string) => {
    if (!initialized) return

    // Always play immediately for visual feedback
    playSound(key)

    if (isRecordingRef.current) {
      addEvent(key)
    }
  }, [initialized, isRecordingRef, addEvent, playSound])

  // Global keyboard shortcuts
  useEffect(() => {
    if (!initialized) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Escape' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault()
      }

      switch (e.code) {
        case 'Space':
          toggleRecording()
          break
        case 'Escape':
          clearLoop()
          break
        case 'ArrowUp':
          setBpm(bpm + 1)
          break
        case 'ArrowDown':
          setBpm(bpm - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [initialized, toggleRecording, clearLoop, bpm, setBpm])

  // Connect sequencer to visualizer
  useEffect(() => {
    if (!initialized) return
    onEventTriggered((key: string) => {
      window.dispatchEvent(new CustomEvent('sound-triggered', { detail: { key } }))
    })
  }, [initialized, onEventTriggered])

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden select-none"
      style={{ backgroundColor: '#08080c' }}
      onClick={handleFirstInteraction}
    >
      {/* Canvas Visualizer */}
      <Visualizer
        width={dimensions.width}
        height={dimensions.height}
        onTriggered={(key) => {}}
      />

      {/* Recording border indicator */}
      {isRecording && (
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            boxShadow: 'inset 0 0 0 3px #ff3366, inset 0 0 80px rgba(255, 51, 102, 0.25)',
            animation: 'recordPulse 0.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Main UI Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-6">
        {/* Title */}
        <div className="text-center">
          <h1
            className="text-5xl md:text-6xl font-bold tracking-[0.2em]"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #ff00aa 50%, #a0ff00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.4))',
            }}
          >
            MIXNMATCH
          </h1>
          <p className="text-gray-500 text-xs font-mono mt-2 tracking-widest uppercase">
            EDM Beatpad & Live Looper
          </p>
        </div>

        {/* Controls */}
        <Controls
          bpm={bpm}
          onBpmChange={setBpm}
          isRecording={isRecording}
          isPlaying={isPlaying}
          onToggleRecording={toggleRecording}
          onClearLoop={clearLoop}
          eventCount={events.length}
        />

        {/* Beatpad */}
        <Beatpad
          onKeyPress={handleKeyPressWithVisual}
          isInitialized={initialized}
        />

        {/* Footer */}
        <div className="flex items-center gap-6 text-gray-600 text-xs font-mono">
          <span>4-bar loop</span>
          <span className="text-gray-700">|</span>
          <span>{bpm} BPM</span>
          <span className="text-gray-700">|</span>
          <span>{Math.round(loopDuration / 1000)}s</span>
        </div>

        {/* Keyboard hints */}
        <div className="flex gap-4 text-gray-600 text-xs font-mono">
          <span className="px-2 py-1 bg-gray-900/50 rounded border border-gray-800">Q-P Drums</span>
          <span className="px-2 py-1 bg-gray-900/50 rounded border border-gray-800">A-L Bass</span>
          <span className="px-2 py-1 bg-gray-900/50 rounded border border-gray-800">Z-M FX</span>
          <span className="px-2 py-1 bg-gray-900/50 rounded border border-gray-800">1-0 Shots</span>
        </div>
      </div>

      {/* Start Overlay */}
      {showOverlay && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: '#08080c',
            background: 'radial-gradient(ellipse at center, #0f0f18 0%, #08080c 100%)',
          }}
        >
          <div className="text-center">
            <h1
              className="text-4xl font-bold tracking-[0.3em] mb-6"
              style={{
                background: 'linear-gradient(135deg, #00f0ff, #ff00aa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MIXNMATCH
            </h1>
            <button
              onClick={handleFirstInteraction}
              className="
                px-10 py-4 rounded-full
                bg-gradient-to-r from-cyan-500 to-pink-500
                text-black font-bold text-sm tracking-widest uppercase
                shadow-[0_0_40px_rgba(0,240,255,0.4),0_0_80px_rgba(255,0,170,0.3)]
                hover:shadow-[0_0_60px_rgba(0,240,255,0.6),0_0_100px_rgba(255,0,170,0.5)]
                hover:scale-105
                transition-all duration-300
              "
            >
              Start Session
            </button>
            <p className="text-gray-600 text-xs font-mono mt-4">
              Click to initialize audio engine
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
