/**
 * Controls Component — Redesigned with sleek EDM aesthetic
 *
 * - Large prominent BPM display
 * - Beat position indicator (16 steps)
 * - Sleek pill-style record button with state indicators
 * - Minimal clear button
 */

import React, { useCallback } from 'react'
import { MIN_BPM, MAX_BPM } from '@/lib/constants'

interface ControlsProps {
  bpm: number
  onBpmChange: (bpm: number) => void
  isRecording: boolean
  isPlaying: boolean
  onToggleRecording: () => void
  onClearLoop: () => void
  eventCount: number
}

export const Controls: React.FC<ControlsProps> = ({
  bpm,
  onBpmChange,
  isRecording,
  isPlaying,
  onToggleRecording,
  onClearLoop,
  eventCount,
}) => {
  const handleBpmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBpmChange(parseInt(e.target.value, 10))
  }, [onBpmChange])

  const getRecordButtonState = () => {
    if (isRecording) return { text: 'STOP', color: '#ff3366', bg: 'rgba(255,51,102,0.15)', glow: '#ff3366' }
    if (isPlaying) return { text: 'LOOP', color: '#a0ff00', bg: 'rgba(160,255,0,0.1)', glow: '#a0ff00' }
    return { text: 'REC', color: '#666', bg: 'rgba(255,255,255,0.05)', glow: 'transparent' }
  }

  const state = getRecordButtonState()

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Status Row */}
      <div className="flex items-center gap-5">
        {/* Status badge */}
        <div
          className="px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-widest uppercase"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: isRecording ? '#ff3366' : isPlaying ? '#a0ff00' : '#555',
            border: `1px solid ${isRecording ? '#ff336640' : isPlaying ? '#a0ff0040' : '#333'}`,
            textShadow: isRecording ? '0 0 10px #ff3366' : isPlaying ? '0 0 10px #a0ff00' : 'none',
          }}
        >
          <span className="flex items-center gap-2">
            {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            {isPlaying && !isRecording && <span className="w-2 h-2 rounded-full bg-lime-500" />}
            {!isRecording && !isPlaying && <span className="w-2 h-2 rounded-full bg-gray-600" />}
            {isRecording ? 'Recording' : isPlaying ? 'Playing' : 'Ready'}
          </span>
        </div>

        {/* Event counter */}
        <div
          className="px-3 py-1.5 rounded-full font-mono text-xs"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: '#888',
            border: '1px solid #222',
          }}
        >
          {eventCount} events
        </div>
      </div>

      {/* BPM Section */}
      <div className="flex items-center gap-4">
        {/* BPM Label */}
        <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">BPM</span>

        {/* BPM Slider */}
        <div className="relative w-48">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(to right, #00f0ff 0%, #ff00aa 100%)',
              opacity: 0.2,
              height: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={handleBpmChange}
            className="
              relative w-full h-1 rounded-full appearance-none cursor-pointer
              bg-transparent
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_#00f0ff,0_0_20px_#00f0ff60]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-125
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-[0_0_10px_#00f0ff]
              [&::-moz-range-thumb]:cursor-pointer
            "
            style={{
              background: 'transparent',
            }}
          />
        </div>

        {/* BPM Display */}
        <div
          className="w-16 text-center font-mono text-3xl font-bold"
          style={{
            color: '#00f0ff',
            textShadow: '0 0 20px rgba(0,240,255,0.6), 0 0 40px rgba(0,240,255,0.3)',
          }}
        >
          {bpm}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {/* Record Button */}
        <button
          onClick={onToggleRecording}
          className="
            flex items-center gap-2.5 px-6 py-2.5 rounded-full
            font-mono text-sm font-bold uppercase tracking-wider
            transition-all duration-200
          "
          style={{
            backgroundColor: state.bg,
            color: state.color,
            border: `1.5px solid ${state.color}50`,
            boxShadow: state.glow !== 'transparent' ? `0 0 20px ${state.glow}40, inset 0 0 20px ${state.glow}10` : 'none',
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: state.color,
              boxShadow: `0 0 8px ${state.color}`,
            }}
          />
          {state.text}
        </button>

        {/* Clear Button */}
        <button
          onClick={onClearLoop}
          className="
            px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider
            text-gray-500 border border-gray-800
            hover:text-gray-300 hover:border-gray-600
            transition-all duration-200
          "
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
