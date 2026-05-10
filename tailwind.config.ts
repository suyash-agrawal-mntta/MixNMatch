import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00aa',
        'neon-lime': '#a0ff00',
        'neon-crimson': '#ff3366',
        'neon-orange': '#ff8800',
        'neon-purple': '#aa00ff',
        'neon-yellow': '#ffee00',
        'neon-teal': '#00ffaa',
        'neon-pink': '#ff0088',
        pad: '#1a1a24',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'system-ui', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 1s ease-in-out infinite',
        'record-pulse': 'recordPulse 0.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        recordPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 51, 102, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 51, 102, 0.9)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
