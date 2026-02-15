# 🔮 Neural AR Engine

> A real-time, browser-based Augmented Reality video effects engine powered by MediaPipe and Three.js.
> **Designed & Built by [Sarthak Bhopale](https://github.com/1sarthak7)**

![Project Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) 
[![Live Demo](https://img.shields.io/badge/DEMO-LAUNCH_SYSTEM-00f7ff?style=for-the-badge&logo=google-chrome&logoColor=black)](https://1sarthak7.github.io/neural-ar/)

## ⚡ Overview

This project is a sophisticated AR experiment that uses **Computer Vision (MediaPipe)** to track hands in real-time and maps **WebGL Shaders (GLSL)** to the video feed. It features a custom post-processing pipeline that blends digital artifacts with physical reality.

**Key Tech Stack:**
* **Vision:** MediaPipe Hands (Dual-hand tracking)
* **Graphics:** Three.js (WebGL2 Renderer)
* **Shaders:** Custom GLSL (Chroma Key, Datamosh, Bloom)
* **Build:** Vite

## 🎮 Interaction Guide

The system uses specific hand gestures to trigger reality-bending effects.

| Gesture | Effect Mode | Description |
| :--- | :--- | :--- |
| **Open Hands** | 🔵 **Cyber Glitch** | Standard surveillance mode. Digital noise and scanlines appear between your hands. |
| **Peace Sign ✌️** | 🟢 **Rain Storm** | Triggers a chroma-keyed rain layer with spatial audio. |
| **Pinch 👌** | 🟣 **Music Video** | Overlays a music video texture blended holographically over your face. |
| **Fist ✊** | 🔴 **System Failure** | Heavy static noise and "access denied" red interference. |

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/1sarthak7/neural-ar.git](https://github.com/1sarthak7/neural-ar.git)
    cd neural-ar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🛠️ Architecture

* **`main.js`**: Core loop handling video inputs and audio triggers.
* **`gestureEngine.js`**: Math utility that converts raw landmark data into stabilized control signals (pinch strength, box area).
* **`postProcessing.js`**: Manages the `EffectComposer` stack (Bloom + Custom Shaders).
* **`surveillanceFrag.glsl`**: The "brain" of the visual effects. Contains pixel logic for Glitch, Rain, and Holograms.

## 👤 Author

**Sarthak Bhopale**
* [GitHub Profile](https://github.com/1sarthak7)

---
