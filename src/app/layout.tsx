import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MixNMatch - EDM Beatpad & Live-Looping Sequencer',
  description: 'Interactive browser-based EDM beatpad with keyboard-triggered sounds and real-time live-looping sequencer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
