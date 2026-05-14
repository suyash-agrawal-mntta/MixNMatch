import React, { useRef, useEffect, useCallback } from 'react'
import { KEY_CONFIG } from '@/lib/constants'

interface Effect {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  maxRadius: number
  alpha: number
  color: string
  birthTime: number
  lifetime: number
  type: 'ring' | 'triangle' | 'wave' | 'starburst'
  angle: number
}

interface VisualizerProps {
  width: number
  height: number
  onTriggered: (key: string) => void
}

export const Visualizer: React.FC<VisualizerProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const effectsRef = useRef<Effect[]>([])
  const animationRef = useRef<number>(0)
  const padPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map())

  const registerPadPosition = useCallback((key: string, x: number, y: number) => {
    padPositionsRef.current.set(key, { x, y })
  }, [])

  useEffect(() => {
    (window as any).registerPadPosition = registerPadPosition
    return () => {
      delete (window as any).registerPadPosition
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

      let type: Effect['type'] = 'ring'
      if (color === '#00f0ff') type = 'ring'
      else if (color === '#a0ff00') type = 'triangle'
      else if (color === '#ff00aa') type = 'wave'
      else if (color === '#aa00ff') type = 'starburst'

      if (type === 'ring') {
        effectsRef.current.push({
          x: emitX, y: emitY, vx: 0, vy: 0,
          radius: 10, maxRadius: 100 + Math.random() * 50,
          alpha: 0.8, color, birthTime: performance.now(), lifetime: 1000,
          type, angle: 0
        })
      } else if (type === 'triangle') {
        const count = 3 + Math.floor(Math.random() * 3)
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 2 + Math.random() * 4
          effectsRef.current.push({
            x: emitX, y: emitY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            radius: 10 + Math.random() * 20, maxRadius: 0,
            alpha: 1, color, birthTime: performance.now(), lifetime: 800 + Math.random() * 400,
            type, angle: Math.random() * Math.PI * 2
          })
        }
      } else if (type === 'wave') {
        const count = 5 + Math.floor(Math.random() * 5)
        for (let i = 0; i < count; i++) {
          const dir = Math.random() > 0.5 ? 1 : -1
          const speed = 1 + Math.random() * 3
          effectsRef.current.push({
            x: emitX, y: emitY, vx: dir * speed, vy: 0,
            radius: 20 + Math.random() * 60, maxRadius: 0, // height of wave
            alpha: 0.8, color, birthTime: performance.now(), lifetime: 800,
            type, angle: 0
          })
        }
      } else if (type === 'starburst') {
        const count = 8 + Math.floor(Math.random() * 8)
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 3 + Math.random() * 6
          effectsRef.current.push({
            x: emitX, y: emitY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            radius: 2 + Math.random() * 4, maxRadius: 0,
            alpha: 1, color, birthTime: performance.now(), lifetime: 600 + Math.random() * 400,
            type, angle
          })
        }
      }

      if (effectsRef.current.length > 200) {
        effectsRef.current = effectsRef.current.slice(-200)
      }
    }

    window.addEventListener('sound-triggered' as any, handleKeyTriggered)
    return () => {
      window.removeEventListener('sound-triggered' as any, handleKeyTriggered)
    }
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const now = performance.now()

      effectsRef.current = effectsRef.current.filter(effect => {
        const age = now - effect.birthTime
        if (age >= effect.lifetime) return false
        const progress = age / effect.lifetime
        effect.alpha = 1 - progress
        
        effect.x += effect.vx
        effect.y += effect.vy
        
        ctx.globalAlpha = effect.alpha
        ctx.strokeStyle = effect.color
        ctx.fillStyle = effect.color

        if (effect.type === 'ring') {
          effect.radius = effect.maxRadius * Math.pow(progress, 0.5) // smooth expansion
          ctx.beginPath()
          ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2)
          ctx.lineWidth = 4 * (1 - progress)
          ctx.stroke()
          
          // inner ring
          ctx.beginPath()
          ctx.arc(effect.x, effect.y, effect.radius * 0.7, 0, Math.PI * 2)
          ctx.lineWidth = 2 * (1 - progress)
          ctx.stroke()
        } 
        else if (effect.type === 'triangle') {
          effect.vx *= 0.95
          effect.vy *= 0.95
          effect.angle += 0.05
          
          ctx.save()
          ctx.translate(effect.x, effect.y)
          ctx.rotate(effect.angle)
          ctx.beginPath()
          ctx.moveTo(0, -effect.radius)
          ctx.lineTo(effect.radius * 0.866, effect.radius * 0.5)
          ctx.lineTo(-effect.radius * 0.866, effect.radius * 0.5)
          ctx.closePath()
          
          if (Math.random() > 0.5) {
            ctx.fill()
          } else {
            ctx.lineWidth = 2
            ctx.stroke()
          }
          ctx.restore()
        }
        else if (effect.type === 'wave') {
          effect.vx *= 0.98
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(effect.x, effect.y - effect.radius * (1 - progress))
          ctx.lineTo(effect.x, effect.y + effect.radius * (1 - progress))
          ctx.stroke()
          
          ctx.globalAlpha = effect.alpha * 0.3
          ctx.lineWidth = 12
          ctx.beginPath()
          ctx.moveTo(effect.x, effect.y - effect.radius * (1 - progress))
          ctx.lineTo(effect.x, effect.y + effect.radius * (1 - progress))
          ctx.stroke()
        }
        else if (effect.type === 'starburst') {
          effect.vx *= 0.92
          effect.vy *= 0.92
          ctx.beginPath()
          ctx.moveTo(effect.x, effect.y)
          ctx.lineTo(effect.x - effect.vx * 4, effect.y - effect.vy * 4) // streak trail
          ctx.lineWidth = 3
          ctx.stroke()
          
          // star glow
          ctx.beginPath()
          ctx.arc(effect.x, effect.y, effect.radius * (1-progress), 0, Math.PI * 2)
          ctx.fill()
        }

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
