import * as THREE from 'three';
import { Vec2EMA } from './utils/mathUtils.js';

export class GestureEngine {
    constructor() {
        this.smoothHand1 = new Vec2EMA(0.2);
        this.smoothHand2 = new Vec2EMA(0.2);
        
        this.data = {
            hand1: new THREE.Vector2(0.5, 0.5),
            hand2: new THREE.Vector2(0.5, 0.5),
            boxMin: new THREE.Vector2(0, 0),
            boxMax: new THREE.Vector2(0, 0),
            isDualHand: false,
            mode: 0, // 0=Glitch, 1=Rain, 2=Static, 3=Music
            energy: 0.0
        };
    }

    process(landmarks) {
        this.data.energy *= 0.95;

        if (!landmarks || landmarks.length === 0) {
            this.data.isDualHand = false;
            this.data.mode = 0;
            return this.data;
        }

        // --- HAND 1 ---
        const h1 = landmarks[0];
        const p1 = this.smoothHand1.update(h1[9].x, 1.0 - h1[9].y);
        this.data.hand1.set(p1.x, p1.y);

        // --- GESTURE DETECTION ---
        const wrist = h1[0];
        
        // Finger extension calculations
        const dIndex = Math.hypot(h1[8].x - wrist.x, h1[8].y - wrist.y);
        const dMiddle = Math.hypot(h1[12].x - wrist.x, h1[12].y - wrist.y);
        const dRing = Math.hypot(h1[16].x - wrist.x, h1[16].y - wrist.y);
        const dPinky = Math.hypot(h1[20].x - wrist.x, h1[20].y - wrist.y);
        
        // Pinch distance
        const pinchDist = Math.hypot(h1[4].x - h1[8].x, h1[4].y - h1[8].y);

        // 1. FIST (All closed)
        if (dIndex < 0.2 && dMiddle < 0.2 && dRing < 0.2 && dPinky < 0.2) {
            this.data.mode = 2; // Static
        } 
        // 2. PEACE SIGN (Index+Middle UP) -> NOW RAIN (Mode 1)
        else if (dIndex > 0.3 && dMiddle > 0.3 && dRing < 0.2 && dPinky < 0.2) {
            this.data.mode = 1; // <--- SWAPPED TO RAIN
        }
        // 3. PINCH (Index+Thumb Touch) -> NOW MUSIC (Mode 3)
        else if (pinchDist < 0.05) {
            this.data.mode = 3; // <--- SWAPPED TO MUSIC
        } 
        // 4. OPEN HAND
        else {
            this.data.mode = 0; // Glitch
        }

        // --- HAND 2 & BOX LOGIC ---
        if (landmarks.length > 1) {
            this.data.isDualHand = true;
            const h2 = landmarks[1];
            const p2 = this.smoothHand2.update(h2[9].x, 1.0 - h2[9].y);
            this.data.hand2.set(p2.x, p2.y);

            this.data.boxMin.x = Math.min(p1.x, p2.x);
            this.data.boxMin.y = Math.min(p1.y, p2.y);
            this.data.boxMax.x = Math.max(p1.x, p2.x);
            this.data.boxMax.y = Math.max(p1.y, p2.y);
            
            this.data.energy += 0.05;
        } else {
            this.data.isDualHand = false;
            this.data.boxMin.set(0,0);
            this.data.boxMax.set(0,0);
            this.data.hand2.copy(this.data.hand1);
        }

        this.data.energy = Math.min(this.data.energy, 1.0);
        return this.data;
    }
}