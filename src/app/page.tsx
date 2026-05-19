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
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { Visualizer } from '@/components/Visualizer'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useSequencer } from '@/hooks/useSequencer'
import { KEY_CONFIG } from '@/lib/constants'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
)
const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
)
const MailIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)
const PortfolioIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M15 9a3 3 0 0 0-6 0c0 4 6 3 6 7a3 3 0 0 1-6 0" /></svg>
)

export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [volume, setVolume] = useState(80)

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
    setMasterVolume,
  } = useAudioEngine()

  const {
    isRecording,
    isPlaying,
    isRecordingRef,
    bpm,
    events,
    setBpm,
    startRecording,
    stopRecording,
    toggleRecording,
    playLoop,
    stopPlayback,
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

  const handleKeyPressWithVisual = useCallback((key: string) => {
    if (!initialized) return
    playSound(key)
    if (isRecordingRef.current) {
      addEvent(key)
    }
    
    // Trigger visualizer
    window.dispatchEvent(new CustomEvent('sound-triggered', { detail: { key } }))
  }, [initialized, isRecordingRef, addEvent, playSound])

  useEffect(() => {
    if (!initialized) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (e.code === 'Space' || e.code === 'Escape' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault()
      }

      if (e.repeat) return

      if (KEY_CONFIG.some(k => k.key === key)) {
        handleKeyPressWithVisual(key)
      } else {
        switch (e.code) {
          case 'Space':
            toggleRecording()
            break
          case 'Escape':
            stopPlayback()
            break
          case 'ArrowUp':
            setBpm(bpm + 1)
            break
          case 'ArrowDown':
            setBpm(bpm - 1)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [initialized, toggleRecording, stopPlayback, bpm, setBpm, handleKeyPressWithVisual])

  useEffect(() => {
    if (!initialized) return
    onEventTriggered((key: string) => {
      window.dispatchEvent(new CustomEvent('sound-triggered', { detail: { key } }))
    })
  }, [initialized, onEventTriggered])

  // Register quadrant centers for visualizer
  useEffect(() => {
    const registerFn = (window as any).registerPadPosition
    if (registerFn) {
      const w = dimensions.width
      const h = dimensions.height
      const qCenters = {
        drums: { x: w * 0.25, y: h * 0.35 },
        synth: { x: w * 0.75, y: h * 0.35 },
        kicks: { x: w * 0.25, y: h * 0.65 },
        shots: { x: w * 0.75, y: h * 0.65 }
      }
      
      KEY_CONFIG.forEach(pad => {
        // Map key to quadrant
        // Q-P (0-9 in array) -> Drums
        // A-L (10-18) -> Kicks
        // Z-. (19-27) -> Synth
        // 1-0 (28-37) -> Shots
        let center = qCenters.drums
        const idx = KEY_CONFIG.indexOf(pad)
        if (idx >= 0 && idx < 10) center = qCenters.drums
        else if (idx >= 10 && idx < 19) center = qCenters.kicks
        else if (idx >= 19 && idx < 28) center = qCenters.synth
        else if (idx >= 28) center = qCenters.shots
        
        registerFn(pad.key, center.x, center.y)
      })
    }
  }, [dimensions])

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ backgroundColor: '#091016' }}
      onClick={handleFirstInteraction}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
        opacity: 0.5,
      }}></div>

      {/* Canvas Visualizer */}
      <Visualizer
        width={dimensions.width}
        height={dimensions.height}
        onTriggered={() => {}}
      />

      {/* Main UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-start pointer-events-auto w-full max-w-[1400px] mx-auto pt-2 px-4">
          {/* Key Sequence Suggestions */}
          <div className="w-64 text-left pointer-events-none pt-2">
            <h3 className="text-[#00f0ff] text-xs font-bold tracking-widest mb-2 opacity-80">SUGGESTED SEQUENCES:</h3>
            <ul className="text-gray-400 text-xs font-mono space-y-1 opacity-70">
              <li>• Q - R - E - U (House Beat)</li>
              <li>• A - F - K - 4 (Heavy Bass)</li>
              <li>• Q - T - X - M (Synth Groove)</li>
              <li>• W - Y - L - B (Techno Vibe)</li>
            </ul>
          </div>
          
          {/* Logo Center */}
          <div className="relative border border-[#00f0ff50] rounded-lg px-8 py-2 bg-[#00f0ff05] backdrop-blur-sm"
               style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#ff00aa] shadow-[0_0_10px_#ff00aa]"></div>
            <h1 className="text-3xl font-bold tracking-widest text-transparent" style={{ WebkitTextStroke: '1px #00f0ff', textShadow: '0 0 10px #00f0ff40' }}>
              MIX<span style={{ WebkitTextStroke: '1px #ff00aa', textShadow: '0 0 10px #ff00aa80' }}>N</span>MATCH
            </h1>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 border border-[#00f0ff50] rounded-lg px-6 py-2 bg-[#00f0ff05] backdrop-blur-sm"
               style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
            <div className="text-white text-xl font-bold font-mono">
              128 <span className="text-sm text-gray-400">BPM</span>
            </div>
            <div className="w-px h-6 bg-[#00f0ff50] mx-2"></div>
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <Volume2 size={16} />
              <input type="range" className="w-24 h-1 bg-[#00f0ff30] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#00f0ff] [&::-webkit-slider-thumb]:rounded-sm" min="0" max="100" value={volume} onChange={(e)=>{
                const val = parseInt(e.target.value);
                setVolume(val);
                setMasterVolume(val);
              }} />
            </div>
          </div>
        </div>

        {/* 4 QUADRANTS LABELS */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[25%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="text-[#00f0ff] font-bold tracking-widest text-xs sm:text-sm drop-shadow-[0_0_12px_#00f0ff]">DRUMS (Q-P)</span>
          </div>
          <div className="absolute left-[75%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="text-[#a0ff00] font-bold tracking-widest text-xs sm:text-sm drop-shadow-[0_0_12px_#a0ff00]">SYNTH / FX (Z-M)</span>
          </div>
          <div className="absolute left-[25%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="text-[#ff00aa] font-bold tracking-widest text-xs sm:text-sm drop-shadow-[0_0_12px_#ff00aa]">KICKS / BASS (A-L)</span>
          </div>
          <div className="absolute left-[75%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="text-[#aa00ff] font-bold tracking-widest text-xs sm:text-sm drop-shadow-[0_0_12px_#aa00ff]">ONE-SHOTS (1-0)</span>
          </div>
        </div>

        {/* CENTER INSTRUCTION TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-500 font-mono text-sm tracking-widest opacity-50 uppercase">
            Press keys on keyboard to play music
          </span>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex justify-between items-end pointer-events-auto w-full max-w-[1400px] mx-auto pb-32 px-4">
          <div className="flex gap-4">
            <button
              onClick={toggleRecording}
              className="px-8 py-3 rounded-lg border-2 font-bold tracking-widest transition-all"
              style={{
                borderColor: isRecording ? '#ff3366' : '#ff336650',
                color: '#ff3366',
                backgroundColor: isRecording ? '#ff336620' : 'transparent',
                boxShadow: isRecording ? '0 0 15px #ff336680' : 'none'
              }}
            >
              {isRecording ? 'STOP' : 'START'}
            </button>
            <button
              onClick={clearLoop}
              className="px-8 py-3 rounded-lg border-2 border-white font-bold tracking-widest transition-all"
              style={{
                backgroundColor: isPlaying ? 'transparent' : 'rgba(255,255,255,0.1)',
                color: isPlaying ? 'white' : '#ccc',
                borderColor: isPlaying ? 'white' : 'rgba(255,255,255,0.5)'
              }}
            >
              CLEAR
            </button>
            <button
              onClick={() => isPlaying ? stopPlayback() : playLoop()}
              className="flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-[#00f0ff] font-bold tracking-widest transition-all"
              style={{ 
                color: (isPlaying && !isRecording) ? '#091016' : '#00f0ff',
                backgroundColor: (isPlaying && !isRecording) ? '#00f0ff' : '#00f0ff10',
                boxShadow: (isPlaying && !isRecording) ? '0 0 20px #00f0ff80' : '0 0 15px #00f0ff40'
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              LOOP PLAYBACK
            </button>
          </div>

          <div className="flex items-center gap-4 border border-[#00f0ff50] rounded-lg px-6 py-3 bg-[#00f0ff05] backdrop-blur-sm opacity-40 grayscale pointer-events-none select-none">
            <div className="flex flex-col text-right pr-4 border-r border-[#00f0ff50]">
              <span className="text-gray-400 text-xs font-bold tracking-wider">1-BAR</span>
              <span className="text-white text-sm font-bold tracking-wider">LOOP</span>
            </div>
            <div className="w-48 h-8 flex items-center justify-center opacity-70">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full fill-white">
                <path d="M0,10 L2,10 L3,5 L4,15 L5,8 L6,12 L7,2 L8,18 L9,10 L10,10 L12,10 L13,14 L14,6 L15,10 L17,10 L18,7 L19,13 L20,10 L22,10 L23,4 L24,16 L25,10 L27,10 L28,8 L29,12 L30,10 L32,10 L33,2 L34,18 L35,6 L36,14 L37,10 L39,10 L40,5 L41,15 L42,10 L44,10 L45,8 L46,12 L47,10 L49,10 L50,3 L51,17 L52,9 L53,11 L54,10 L56,10 L57,6 L58,14 L59,10 L61,10 L62,4 L63,16 L64,8 L65,12 L66,10 L68,10 L69,5 L70,15 L71,10 L73,10 L74,7 L75,13 L76,10 L78,10 L79,2 L80,18 L81,6 L82,14 L83,10 L85,10 L86,8 L87,12 L88,10 L90,10 L91,5 L92,15 L93,10 L95,10 L96,8 L97,12 L98,10 L100,10" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M0,10 L100,10" stroke="#ff3366" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto bg-[#091016]/95 backdrop-blur-xl border-t border-white/5 py-4 px-8 flex flex-col gap-4 z-20">
        <div className="flex justify-between items-center w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-1">
            <a href="https://suyashagrawal2004.github.io/" target="_blank" rel="noreferrer" className="text-white text-xl font-black tracking-wider hover:text-[#00f0ff] transition-colors uppercase">
              SUYASH AGRAWAL
            </a>
            <span className="text-[#ff00aa] text-xs font-bold tracking-[0.2em] uppercase">
              AI Product Manager <span className="text-white/20 mx-2">&</span> Developer
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://suyashagrawal2004.github.io/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
              <PortfolioIcon size={16} /> PORTFOLIO
            </a>
            <a href="https://github.com/suyashagrawal2004" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
              <GithubIcon size={16} /> GITHUB
            </a>
            <a href="https://www.linkedin.com/in/suyashagrawal2004/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
              <LinkedinIcon size={16} /> LINKEDIN
            </a>
            <a href="mailto:dm.suyash.a@gmail.com" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
              <MailIcon size={16} /> GMAIL
            </a>
          </div>
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>
        
        <div className="flex justify-between items-center w-full max-w-[1400px] mx-auto text-[10px] font-bold tracking-widest text-white/40">
          <div className="flex gap-8">
            <a href="/about" className="hover:text-white/80 transition-colors">ABOUT MIXNMATCH</a>
            <a href="/privacy" className="hover:text-white/80 transition-colors">PRIVACY & LEGAL</a>
          </div>
          <div className="flex items-center gap-4">
            <span>BUILT WITH <span className="text-[#ff00aa]/80">AI</span> + <span className="text-[#00f0ff]/80">WEB AUDIO API</span> 🎧</span>
            <span className="text-white/20">•</span>
            <span>© 2026 MIXNMATCH</span>
          </div>
        </div>
      </div>

      {showOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#091016]/90 backdrop-blur-md pointer-events-auto">
          <button onClick={handleFirstInteraction} className="px-10 py-4 rounded-full border border-[#00f0ff] text-[#00f0ff] font-bold text-xl tracking-widest hover:bg-[#00f0ff20] hover:shadow-[0_0_30px_#00f0ff80] transition-all">
            INITIALIZE SYSTEM
          </button>
        </div>
      )}
    </main>
  )
}
