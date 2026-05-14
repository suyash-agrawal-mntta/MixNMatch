'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-[#091016] text-white p-8 font-sans relative overflow-y-auto">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}></div>

      <div className="max-w-4xl mx-auto relative z-10 h-full flex flex-col justify-center">
        <a href="/" className="inline-flex items-center gap-2 text-[#00f0ff] hover:text-[#ff00aa] transition-colors font-bold tracking-widest mb-8 uppercase text-sm">
          <ArrowLeft size={16} /> Back to Mixer
        </a>

        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ff00aa]">
            ABOUT MIXNMATCH
          </h1>
          <div className="w-24 h-1 bg-[#ff00aa] shadow-[0_0_15px_#ff00aa]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              MixNMatch is a professional-grade, browser-based EDM looper and beatpad designed for live performance and rapid musical sketching.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Built with the cutting-edge <span className="text-[#00f0ff]">Web Audio API</span>, it allows users to trigger synthesized sounds in real-time with zero latency using their QWERTY keyboard. The integrated sequencer supports live overdubbing, allowing you to build complex layers of drums, bass, and synths in seconds.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
            <h3 className="text-[#00f0ff] font-bold tracking-widest mb-6 uppercase text-sm">Tech Stack</h3>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Framework</span>
                <span className="text-white">Next.js 16</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Styling</span>
                <span className="text-white">Tailwind CSS v4</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Audio Engine</span>
                <span className="text-white">Web Audio API</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Icons</span>
                <span className="text-white">Lucide React</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Deployment</span>
                <span className="text-white">Vercel</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-white font-bold tracking-widest mb-4 uppercase text-sm">The Vision</h3>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Music creation should be as intuitive as typing. MixNMatch removes the friction between inspiration and sound, turning every keyboard into a powerful instrument. Whether you're a professional producer or a casual listener, the barrier to entry for making great music has never been lower.
          </p>
        </div>
      </div>
    </main>
  )
}
