/**
 * Beatpad Component — QWERTY Layout
 *
 * 4 rows with distinct neon color themes:
 * - Row 1 (Q-P): DRUMS — Cyan
 * - Row 2 (A-L): KICKS/BASS — Magenta
 * - Row 3 (Z-.): SYNTH/FX — Lime
 * - Row 4 (1-0): ONE-SHOTS — Purple
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { KEY_CONFIG, ROW_META } from '@/lib/constants'
import { PadConfig } from '@/types'

interface BeatpadProps {
  onKeyPress: (key: string) => void
  isInitialized: boolean
}

export const Beatpad: React.FC<BeatpadProps> = ({ onKeyPress, isInitialized }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const padRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Keyboard input
  useEffect(() => {
    if (!isInitialized) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (!KEY_CONFIG.some(k => k.key === key)) return
      if (e.repeat) return

      e.preventDefault()
      setActiveKeys(prev => new Set(prev).add(key))
      onKeyPress(key)
      triggerVisual(key)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (!KEY_CONFIG.some(k => k.key === key)) return
      setActiveKeys(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isInitialized, onKeyPress])

  const triggerVisual = useCallback((key: string) => {
    const padEl = padRefs.current.get(key)
    if (padEl) {
      const rect = padEl.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const registerFn = (window as unknown as { registerPadPosition?: (key: string, x: number, y: number) => void }).registerPadPosition
      if (registerFn) registerFn(key, centerX, centerY)
    }
    window.dispatchEvent(new CustomEvent('sound-triggered', { detail: { key } }))
  }, [])

  const handlePadInteraction = useCallback((key: string, isStart: boolean) => {
    if (isStart) {
      setActiveKeys(prev => new Set(prev).add(key))
      onKeyPress(key)
      triggerVisual(key)
    } else {
      setActiveKeys(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }, [onKeyPress, triggerVisual])

  // Split keys into rows
  const rows: PadConfig[][] = [
    KEY_CONFIG.slice(0, 10),   // Q-P (10)
    KEY_CONFIG.slice(10, 19),  // A-L (9)
    KEY_CONFIG.slice(19, 28),  // Z-. (9)
    KEY_CONFIG.slice(28, 38),  // 1-0 (10)
  ]

  const rowKeys = ['ROW1', 'ROW2', 'ROW3', 'ROW4'] as const

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, rowIndex) => {
        const meta = ROW_META[rowKeys[rowIndex]]
        return (
          <div key={rowIndex}>
            {/* Row label */}
            <div
              className="text-xs font-mono tracking-widest mb-2 text-center uppercase"
              style={{ color: meta.theme }}
            >
              {meta.label}
            </div>

            {/* Row background panel */}
            <div
              className="flex gap-2 p-3 rounded-xl justify-center"
              style={{ backgroundColor: meta.bg }}
            >
              {row.map(pad => {
                const isActive = activeKeys.has(pad.key)
                return (
                  <div
                    key={pad.key}
                    ref={(el) => {
                      if (el) padRefs.current.set(pad.key, el)
                    }}
                    className={`
                      relative w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14
                      rounded-xl cursor-pointer select-none
                      flex items-center justify-center
                      font-mono text-sm font-bold
                      transition-all duration-75
                      ${isActive ? 'scale-95 z-10' : 'hover:scale-105 hover:brightness-110'}
                    `}
                    style={{
                      backgroundColor: isActive ? pad.color : '#12121a',
                      color: isActive ? '#08080c' : meta.theme,
                      boxShadow: isActive
                        ? `0 0 15px ${pad.color}, 0 0 30px ${pad.color}60, inset 0 0 12px rgba(255,255,255,0.25)`
                        : `inset 0 0 0 1px ${meta.theme}20`,
                    }}
                    onMouseDown={() => handlePadInteraction(pad.key, true)}
                    onMouseUp={() => handlePadInteraction(pad.key, false)}
                    onMouseLeave={() => {
                      if (activeKeys.has(pad.key)) {
                        handlePadInteraction(pad.key, false)
                      }
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handlePadInteraction(pad.key, true)
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      handlePadInteraction(pad.key, false)
                    }}
                  >
                    <span
                      className="relative z-10"
                      style={{ textShadow: isActive ? 'none' : `0 0 8px ${meta.theme}` }}
                    >
                      {pad.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
