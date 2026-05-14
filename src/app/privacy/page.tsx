'use client'

import React from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-[#091016] text-white p-8 font-sans relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}></div>

      <div className="max-w-3xl mx-auto relative z-10 h-full flex flex-col justify-center">
        <a href="/" className="inline-flex items-center gap-2 text-[#00f0ff] hover:text-[#ff00aa] transition-colors font-bold tracking-widest mb-6 uppercase text-sm">
          <ArrowLeft size={16} /> Back to Mixer
        </a>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="text-[#00f0ff]" size={32} />
            <h1 className="text-4xl font-black tracking-tighter text-white">
              PRIVACY POLICY
            </h1>
          </div>
          <div className="w-24 h-1 bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]"></div>
        </div>

        <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
          <section>
            <h3 className="text-white font-bold tracking-widest mb-2 uppercase text-xs">No Data Collection</h3>
            <p>
              MixNMatch is a client-side application. We do not collect, store, or transmit any personal data, audio recordings, or keyboard input to any external servers. All audio processing and sequencing happens entirely within your browser using the Web Audio API.
            </p>
          </section>

          <section>
            <h3 className="text-white font-bold tracking-widest mb-2 uppercase text-xs">Cookies & Tracking</h3>
            <p>
              We do not use tracking cookies, analytics scripts, or any third-party tracking services. Your musical creations stay on your machine.
            </p>
          </section>

          <section>
            <h3 className="text-white font-bold tracking-widest mb-2 uppercase text-xs">Local Storage</h3>
            <p>
              The application may use browser <span className="text-[#00f0ff]">localStorage</span> to temporarily save your session settings (like volume or BPM) to provide a consistent experience across refreshes. This data never leaves your device.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-4 italic mt-4">
            <p className="text-xs">
              Last Updated: May 2026. This policy is as simple as our commitment to privacy: What happens in the looper, stays in the looper.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
