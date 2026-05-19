# 🎧 MixNMatch

> A browser-based interactive EDM beatpad & live-looping sequencer powered entirely by real-time Web Audio API synthesis. Zero latency, no audio files, pure browser-driven electronic music.

🚀 **Live Site:** [https://mix-n-match-ten.vercel.app/](https://mix-n-match-ten.vercel.app/)

---

## ✨ Features

- **🎹 36-Key Interactive Beatpad**: Use keys `A-Z` and `0-9` to trigger professionally tuned EDM synthesizers, deep sub-basses, crisp drums, and sweeping FX.
- **🔁 Rapid Live-Looping Sequencer**: A seamless 1-bar looping engine supporting instant **Start/Stop** recording, live overdubbing, and loop playback with a **Play/Pause** toggle.
- **⚡ Zero-Latency Synthesis**: Built entirely on the Web Audio API using oscillators, custom ADSR envelopes, filters, and noise-generators for responsive performance.
- **✨ Neon 2D Canvas Visualizer**: An ambient particle visualizer where concentric rings, waves, and starbursts dynamically react to notes and master amplitude output.
- **🎛️ BPM Controller**: Real-time tempo adjustment (60–200 BPM) with instant synchronization of the looping clock.
- **📱 Cyberpunk Glassmorphism UI**: Beautiful, fully-responsive dashboard with curated neon colors and smooth glowing transitions.

---

## 🎨 Sound Category Guide

Pads are color-coded by instrument families with custom visualizer responses:

| Category | Keys | Visual Color | Visual Effect |
|---|---|---|---|
| **Drums** | `Q` to `P` | 🩵 Neon Cyan | Expanding Rings |
| **Synth / FX** | `Z` to `M` | 💚 Lime Green | Orbiting Triangles |
| **Kicks / Bass** | `A` to `L` | 🩷 Hot Pink | Dynamic Vertical Waves |
| **One-Shots** | `1` to `0` | 💜 Electric Violet | Starburst Streaks |

---

## ⌨️ Controls & Shortcuts

| Action | Shortcut Key | UI Button |
|---|---|---|
| **Trigger Beatpads** | `A`–`Z`, `0`–`9` | Click individual pad |
| **Toggle Recording** | *N/A* | **Start / Stop** |
| **Toggle Loop Playback** | `Space` | **Loop Playback (Play / Pause)** |
| **Clear Sequence** | `Escape` | **Clear** |

---

## 🛠️ Technical Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio Engine:** HTML5 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Icons:** Inline optimized SVGs (Lucide-based specs)

---

## 🚀 Getting Started Locally

Follow these steps to run MixNMatch in your local development environment:

### Prerequisites

Make sure you have Node.js (version 18 or above) installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/suyashagrawal2004/MixNMatch.git
   cd MixNMatch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Launch the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Privacy Policy

All music processing, sequencing, and visualizer rendering are performed 100% locally in your web browser. No audio data, keyboard inputs, or personal information are collected or sent to any external server. 

---

## 👤 Author

**Suyash Agrawal** - *AI Product Manager & Developer*
- 🌐 [Portfolio](https://suyashagrawal2004.github.io/)
- 💼 [LinkedIn](https://www.linkedin.com/in/suyashagrawal2004/)
- 💻 [GitHub](https://github.com/suyashagrawal2004)
- ✉️ [Email](mailto:dm.suyash.a@gmail.com)
