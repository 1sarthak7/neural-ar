import * as THREE from 'three';
import { HandTracker } from './handTracking.js';
import { GestureEngine } from './gestureEngine.js';
import { FXPipeline } from './postProcessing.js';
import { DataParticles } from './particles.js'; 

// GLOBAL VARIABLES
let rainVideo, musicVideo;

async function initSystem() {
    // 1. HIDE OVERLAY
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';

    // 2. SETUP WEBCAM
    const video = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
    });
    video.srcObject = stream;
    await new Promise(r => video.onloadedmetadata = r);
    video.play();

    // 3. SETUP VIDEOS (Unlocked by User Click)
    rainVideo = document.createElement('video');
    rainVideo.src = import.meta.env.BASE_URL + 'rain.mp4';
    rainVideo.loop = true;
    rainVideo.muted = true; // Start muted
    rainVideo.playsInline = true;
    rainVideo.crossOrigin = 'anonymous';
    // Append hidden to DOM
    Object.assign(rainVideo.style, { position:'absolute', width:0, height:0, opacity:0, pointerEvents:'none' });
    document.body.appendChild(rainVideo);
    
    musicVideo = document.createElement('video');
    musicVideo.src = import.meta.env.BASE_URL + 'music.mp4';
    musicVideo.loop = true;
    musicVideo.muted = true; // Start muted
    musicVideo.playsInline = true;
    musicVideo.crossOrigin = 'anonymous';
    Object.assign(musicVideo.style, { position:'absolute', width:0, height:0, opacity:0, pointerEvents:'none' });
    document.body.appendChild(musicVideo);

    // FORCE START (Now allowed because user clicked)
    rainVideo.play();
    musicVideo.play();

    // 4. SETUP THREE.JS
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 2;

    const videoTexture = new THREE.VideoTexture(video);
    const bgQuad = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 4.5), 
        new THREE.MeshBasicMaterial({ map: videoTexture })
    );
    bgQuad.position.z = -2;
    scene.add(bgQuad);

    // 5. INIT LOGIC
    const tracker = new HandTracker();
    await tracker.init(video);
    
    const gestureEngine = new GestureEngine();
    const fxPipeline = new FXPipeline(renderer, scene, camera, window.innerWidth, window.innerHeight, rainVideo, musicVideo);
    const particles = new DataParticles(scene); 

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const landmarks = tracker.detect();
        const gestureData = gestureEngine.process(landmarks);

        // --- AUDIO CONTROLLER ---
        // Only unmute if 2 Hands are active AND specific gesture is made
        if (gestureData.isDualHand) {
            if (gestureData.mode === 1) {
                // Rain Mode (Pinch)
                rainVideo.muted = false;
                musicVideo.muted = true;
            } else if (gestureData.mode === 3) {
                // Music Mode (Peace)
                rainVideo.muted = true;
                musicVideo.muted = false;
            } else {
                // Glitch/Static Mode (Silence)
                rainVideo.muted = true;
                musicVideo.muted = true;
            }
        } else {
            // One Hand / No Hands
            rainVideo.muted = true;
            musicVideo.muted = true;
        }

        // Keep textures updating
        if(rainVideo.paused) rainVideo.play();
        if(musicVideo.paused) musicVideo.play();

        particles.update(time, gestureData.energy);
        fxPipeline.updateUniforms(time, gestureData);
        fxPipeline.render();
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        fxPipeline.resize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// LISTEN FOR CLICK
document.getElementById('start-btn').addEventListener('click', initSystem);