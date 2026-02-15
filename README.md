<div align="center">

# 🔮 NEURAL AR ENGINE

> **A real-time, browser-based Augmented Reality video effects engine.** > Powered by MediaPipe, Three.js, and Custom GLSL Shaders.

[![Status](https://img.shields.io/badge/Status-Online-success?style=for-the-badge&logo=statuspage&logoColor=white)](https://1sarthak7.github.io/neural-ar/)
[![Version](https://img.shields.io/badge/Version-4.0-blue?style=for-the-badge&logo=git&logoColor=white)](https://github.com/1sarthak7/neural-ar)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

[**LAUNCH SYSTEM**](https://1sarthak7.github.io/neural-ar/)

---

### ⚡ OVERVIEW

This project is a sophisticated AR experiment that blends physical reality with digital artifacts. It uses **Computer Vision (MediaPipe)** to track hands in real-time and maps **WebGL Shaders** to the video feed. The core is a custom post-processing pipeline that handles chroma keying, datamoshing, and holographic compositing entirely on the GPU.

</div>

<div align="center">

## 🎮 GESTURE CONTROL & EFFECTS

The engine interprets hand gestures to trigger specific shader pipelines.

| Gesture | Mode Name | Visual Effect | Shader Tech Used |
| :--- | :--- | :--- | :--- |
| **Open Hands** | 🔵 **Cyber Glitch** | Digital noise, RGB splitting, and scanlines appear between hands. | `Datamosh`, `Chromatic Aberration`, `Scanlines` |
| **Peace Sign ✌️** | 🟢 **Rain Storm** | A chroma-keyed rain layer with spatial audio and brightness boost. | `Chroma Key (Green Screen)`, `Luma Boost`, `Alpha Blending` |
| **Pinch 👌** | 🟣 **Holo-Music** | Overlays a music video texture blended holographically over your face. | `UV Flipping`, `Screen Blend Mode`, `Texture Mapping` |
| **Fist ✊** | 🔴 **System Failure** | Heavy static noise and "access denied" red interference. | `Perlin Noise`, `Grain`, `Color Grading` |
| **Passive** | 🔆 **Cinematic** | Always-on effects to unify the look. | `Unreal Bloom`, `Vignette`, `Film Grain` |

<div align="center">
## 🛠️ SHADER ARCHITECTURE

The rendering pipeline is built on a modular stack:

1.  **Input Layer:** `Webcam Feed` + `Video Textures` (Rain/Music)
2.  **Tracking Layer:** `MediaPipe Hands` (Joint coordinates)
3.  **Simulation Layer:** `Three.js` Scene (3D Particles)
4.  **Composition Layer:** `EffectComposer`
    * **Pass 1:** Base Render
    * **Pass 2:** `SurveillanceShader` (The "Brain" - Handles Masking & Glitch)
    * **Pass 3:** `HUDShader` (Draws the Crosshairs)
    * **Pass 4:** `UnrealBloomPass` (Glow)

## 🚀 HOW TO RUN

```bash
# 1. Clone the repository
git clone [https://github.com/1sarthak7/neural-ar.git](https://github.com/1sarthak7/neural-ar.git)

# 2. Enter directory
cd neural-ar

# 3. Install dependencies
npm install

# 4. Start the engine
npm run dev.
```

## 💗 Crafted with Heart by  
### **Sarthak Bhopale**

<p>
  <a href="https://github.com/1sarthak7">
    <img src="https://img.shields.io/badge/Follow%20on-GitHub-ff69b4?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

</div>
</div>
