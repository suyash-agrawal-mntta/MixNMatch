# MixNMatch - EDM Beatpad & Live-Looping Sequencer

## 1. Project Overview

**Project Name:** MixNMatch
**Type:** Interactive Music Production Web App
**Core Functionality:** Browser-based EDM beatpad with keyboard-triggered sounds and real-time live-looping sequencer
**Target Users:** Music enthusiasts, EDM fans, live performers, producers

---

## 2. Visual & Rendering Specification

### Scene Setup
- **Canvas Visualizer:** Full-viewport canvas behind the UI, transparent overlay
- **Layout:** Centered beatpad grid with controls above and visualizer behind

### Color Palette
- **Background:** Deep charcoal `#0a0a0f` with subtle radial gradient
- **Primary Neon:** Electric cyan `#00f0ff`
- **Secondary Neon:** Hot magenta `#ff00aa`
- **Accent:** Lime green `#a0ff00`
- **Warning/Record:** Crimson red `#ff3366`
- **Muted Gray:** `#1a1a24` for inactive pads
- **Text:** White `#ffffff` with varying opacity

### Typography
- **Font Family:** "JetBrains Mono" for key labels (monospace, techy feel)
- **Fallback:** system-ui monospace
- **Key Labels:** Bold, uppercase, centered in pads

### Beatpad Grid
- 4 rows × 9 columns (A-Z = 26 keys, 0-9 = 10 keys = 36 total, fitting 4×9 grid)
- Keys displayed: A-I (row 1), J-R (row 2), S-Z (row 3), 0-9 (row 4)
- Inactive state: Dark gray `#1a1a24` with subtle border
- Active/triggered state: Neon glow with color based on sound category
- Hover state: Subtle brightness increase

### Sound Category Colors
- **Kick/Bass (A, J, S, 1):** Cyan `#00f0ff`
- **Snare/Clap (B, K, T, 2):** Magenta `#ff00aa`
- **Hi-Hat/Perc (C, L, U, 3):** Yellow `#ffee00`
- **Synth/Lead (D, M, V, 4):** Green `#a0ff00`
- **Special/FX (E, N, W, 5):** Orange `#ff8800`
- **Reserved (F, O, X, 6):** Purple `#aa00ff`
- **G, P, Y, 7:** Pink `#ff0088`
- **H, Q, Z, 8:** Teal `#00ffaa`
- **I, R, 0, 9:** White `#ffffff`

### Controls UI
- **BPM Slider:** Range 60-200, default 128, displayed as digital readout
- **Loop Toggle Button:** Large, prominent, glows red when recording
- **Clear Loop Button:** Secondary styling, clears all recorded events
- **Status Display:** Shows "Recording", "Playing", or "Stopped" state

---

## 3. Audio Specification

### Web Audio Architecture
- Single AudioContext instance, created on first user interaction
- Master GainNode for volume control
- CompressorNode for preventing clipping
- AnalyserNode for visualizer amplitude data

### Synthesized Sound Definitions (No external files)

| Key | Sound Type | Synthesis Method |
|-----|------------|-------------------|
| A | Kick | Sine osc 150Hz→50Hz, fast decay |
| J | Kick | Deep sine 100Hz→40Hz |
| S | Snare | White noise + sine body |
| K | Snare | Tight noise burst |
| D | Hi-Hat | High-pass filtered noise |
| L | Hi-Hat | Short metallic noise |
| M | Synth | Square wave with filter sweep |
| N | Synth | Sawtooth with resonance |
| V | Bass | Sub sine with long decay |
| W | Bass | Wobble bass (LFO modulated) |
| X | FX | Noise sweep up |
| C | FX | Noise sweep down |
| 0-9 | Perc variations | Varied noise bursts, toms, etc. |

### Audio Timing Math
- **BPM:** Beats per minute (default 128)
- **Beat Duration:** 60000ms / BPM = ~468.75ms at 128 BPM
- **Bar Duration:** Beat Duration × 4 = ~1875ms at 128 BPM
- **Loop Length:** 4 bars = ~7500ms at 128 BPM
- **Schedule Lookahead:** 100ms (schedules notes slightly ahead for precision)
- **Schedule Interval:** 25ms (how often to check and schedule)

### Loop Recording Logic
- Events stored as: `{ key, timestamp: number }` where timestamp is ms from loop start
- When recording: push event with `AudioContext.currentTime` offset
- When playing: scan events each frame, trigger if `currentTime` falls within frame window
- Dynamic injection: new events added to array, automatically played on next loop iteration

---

## 4. Simulation/Visualizer Specification

### Canvas Visualizer Approach
- **Type:** 2D Canvas with procedural animations
- **Background:** Dark gradient that subtly pulses with bass
- **Effect:** Expanding concentric circles from center on each beat
- **Color Response:** Circles colored by sound category
- **Amplitude Response:** Circle size/max-radius scales with analyser amplitude
- **Particle System:** Small particles emit from pad locations when triggered

### Visualizer Performance
- **Target FPS:** 60
- **Max Active Particles:** 100 (recycled pool)
- **Circle Lifetime:** 1.5 seconds with fade-out
- **Optimization:** Only redraw changed areas, use `requestAnimationFrame`

### Visual States
- **Idle:** Subtle ambient gradient animation (very slow color shift)
- **Key Pressed:** Flash effect on corresponding pad + burst from center
- **Recording:** Red pulsing border around canvas
- **Playing Loop:** Subtle pulse on each loop iteration

---

## 5. Interaction Specification

### Keyboard Controls
- **A-Z, 0-9:** Trigger sounds (keydown = sound on, keyup = sound off for sustained sounds)
- **Space:** Toggle record/loop
- **Escape:** Clear loop
- **Up/Down Arrows:** Adjust BPM (+/- 1)

### UI Controls
- **Mouse Click:** Same as keyboard press for pads
- **BPM Drag:** Slider for precise BPM control
- **Touch Support:** Touch pads for mobile compatibility

### Feedback
- **Visual:** Pad lights up, visualizer reacts
- **Audio:** Immediate sound playback
- **State:** Clear indicators for record mode and loop status

---

## 6. Technical Architecture

### File Structure
```
/src
  /app
    page.tsx          # Main page assembly
    layout.tsx        # Root layout with fonts
    globals.css       # Tailwind imports + custom styles
  /components
    Beatpad.tsx       # The 4x9 key grid component
    Visualizer.tsx    # Canvas visualizer component
    Controls.tsx      # BPM, loop toggle, clear button
  /hooks
    useAudioEngine.ts # Web Audio API + sound synthesis
    useSequencer.ts   # Loop recording + playback logic
  /lib
    sounds.ts         # Sound synthesis function definitions
    constants.ts      # Key mappings, colors, etc.
  /types
    index.ts          # TypeScript interfaces
```

### Custom Hooks

**useAudioEngine:**
- Creates/manages AudioContext
- Provides `playSound(key)` function
- Provides `getAnalyserNode()` for visualizer
- Handles audio cleanup on unmount

**useSequencer:**
- Manages loop state (idle, recording, playing)
- Records key press events with timestamps
- Schedules playback using AudioContext timing
- Returns: `{ events, isRecording, isPlaying, startRecording, stopRecording, clearLoop, addEvent }`
- Uses `requestAnimationFrame` + AudioContext timing for precise scheduling

---

## 7. Acceptance Criteria

1. ✅ Page loads without errors in Next.js development mode
2. ✅ Pressing keys A-Z and 0-9 produces distinct synthesized sounds
3. ✅ BPM slider adjusts tempo (60-200 range)
4. ✅ Loop toggle starts/stops recording and playback
5. ✅ Recorded sequence plays back in sync with BPM
6. ✅ New key presses during recording are added to live loop
7. ✅ Clear button removes all recorded events
8. ✅ Canvas visualizer shows reactive animations on sound
9. ✅ All pads display corresponding key labels
10. ✅ Dark theme with neon aesthetic is visually cohesive
11. ✅ No console errors during normal operation
12. ✅ Smooth 60fps visualizer performance
