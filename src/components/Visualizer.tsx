/**
 * Visualizer Component — Enhanced canvas-based reactive visuals
 *
 * Features:
 * - Expanding rings from pad positions on key trigger
 * - Color-coded particle bursts by row theme
 * - Subtle ambient background pulse
 * - Smooth 60fps rendering with requestAnimationFrame
 */

import React, { useRef, useEffect, useCallback } from 'react'
import { KEY_CONFIG } from '@/lib/constants'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
  birthTime: number
  lifetime: number
}

interface Ring {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  color: string
  birthTime: number
  lifetime: number
}

interface VisualizerProps {
  width: number
  height: number
  onTriggered: (key: string) => void
}

export const Visualizer: React.FC<VisualizerProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const ringsRef = useRef<Ring[]>([])
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const padPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map())

  const registerPadPosition = useCallback((key: string, x: number, y: number) => {
    padPositionsRef.current.set(key, { x, y })
  }, [])

  useEffect(() => {
    (window as unknown as { registerPadPosition: typeof registerPadPosition }).registerPadPosition = registerPadPosition
    return () => {
      delete (window as unknown as { registerPadPosition?: typeof registerPadPosition }).registerPadPosition
    }
  }, [registerPadPosition])

  useEffect(() => {
    const handleKeyTriggered = (event: CustomEvent<{ key: string }>) => {
      const key = event.detail.key.toUpperCase()
      const config = KEY_CONFIG.find(k => k.key === key)
      const color = config?.color || '#ffffff'

      const padPos = padPositionsRef.current.get(key)
      const emitX = padPos?.x ?? width / 2
      const emitY = padPos?.y ?? height / 2

      // Add expanding ring
      ringsRef.current.push({
        x: emitX,
        y: emitY,
        radius: 8,
        maxRadius: 120 + Math.random() * 80,
        alpha: 0.7,
        color,
        birthTime: performance.now(),
        lifetime: 1200,
      })

      // Add particles
      const particleCount = 6 + Math.floor(Math.random() * 4)
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3
        const speed = 1.5 + Math.random() * 2.5
        particlesRef.current.push({
          x: emitX,
          y: emitY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 3,
          alpha: 1,
          color,
          birthTime: performance.now(),
          lifetime: 600 + Math.random() * 400,
        })
      }

      // Limit effects
      if (particlesRef.current.length > 80) {
        particlesRef.current = particlesRef.current.slice(-80)
      }
      if (ringsRef.current.length > 40) {
        ringsRef.current = ringsRef.current.slice(-40)
      }
    }

    window.addEventListener('sound-triggered' as never, handleKeyTriggered as EventListener)
    return () => {
      window.removeEventListener('sound-triggered' as never, handleKeyTriggered as EventListener)
    }
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = (timestamp: number) => {
      lastTimeRef.current = timestamp

      // Clear
      ctx.fillStyle = '#08080c'
      ctx.fillRect(0, 0, width, height)

      // Subtle ambient radial gradient
      const ambient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7)
      ambient.addColorStop(0, 'rgba(15, 15, 25, 0.6)')
      ambient.addColorStop(1, 'rgba(8, 8, 12, 0)')
      ctx.fillStyle = ambient
      ctx.fillRect(0, 0, width, height)

      const now = performance.now()

      // Draw rings
      ringsRef.current = ringsRef.current.filter(ring => {
        const age = now - ring.birthTime
        if (age >= ring.lifetime) return false
        const progress = age / ring.lifetime
        ring.radius = ring.maxRadius * progress
        ring.alpha = 0.6 * (1 - progress)

        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.globalAlpha = ring.alpha
        ctx.lineWidth = 2
        ctx.stroke()

        // Inner bright edge
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius * 0.85, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.globalAlpha = ring.alpha * 0.4
        ctx.lineWidth = 6
        ctx.stroke()

        return true
      })

      // Draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        const age = now - particle.birthTime
        if (age >= particle.lifetime) return false
        const progress = age / particle.lifetime
        particle.alpha = 1 - progress
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.97
        particle.vy *= 0.97

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha * 0.2
        ctx.fill()

        return true
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(render)
    }

    animationRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationRef.current)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
