import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import vertexShader from './shaders/mainVertex.glsl?raw';
import surveilFrag from './shaders/surveillanceFrag.glsl?raw';
import hudFrag from './shaders/hudFrag.glsl?raw';

export class FXPipeline {
    constructor(renderer, scene, camera, width, height, rainVideoElement, musicVideoElement) {
        this.composer = new EffectComposer(renderer);
        this.composer.addPass(new RenderPass(scene, camera));

        // RAIN TEXTURE
        this.rainTexture = new THREE.VideoTexture(rainVideoElement);
        this.rainTexture.minFilter = THREE.LinearFilter;
        this.rainTexture.magFilter = THREE.LinearFilter;
        this.rainTexture.format = THREE.RGBAFormat;

        // MUSIC TEXTURE
        this.musicTexture = new THREE.VideoTexture(musicVideoElement);
        this.musicTexture.minFilter = THREE.LinearFilter;
        this.musicTexture.magFilter = THREE.LinearFilter;
        this.musicTexture.format = THREE.RGBAFormat;

        // SURVEILLANCE PASS
        this.surveilPass = new ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                tRain: { value: this.rainTexture },
                tMusic: { value: this.musicTexture }, // <--- New Uniform
                uTime: { value: 0 },
                uEnergy: { value: 0 },
                uBoxMin: { value: new THREE.Vector2(0, 0) },
                uBoxMax: { value: new THREE.Vector2(1, 1) },
                uIsDual: { value: false },
                uMode: { value: 0 }
            },
            vertexShader: vertexShader,
            fragmentShader: surveilFrag
        });
        this.composer.addPass(this.surveilPass);

        // HUD PASS
        this.hudPass = new ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                uHand1: { value: new THREE.Vector2(0.5, 0.5) },
                uHand2: { value: new THREE.Vector2(0.5, 0.5) },
                uIsDual: { value: false },
                uTime: { value: 0 },
                uAspect: { value: width / height }
            },
            vertexShader: vertexShader,
            fragmentShader: hudFrag
        });
        this.composer.addPass(this.hudPass);

        // BLOOM
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.4, 0.2, 0.85);
        this.composer.addPass(this.bloomPass);
    }

    updateUniforms(time, gestureData) {
        this.surveilPass.uniforms.uTime.value = time;
        this.surveilPass.uniforms.uEnergy.value = gestureData.energy;
        this.surveilPass.uniforms.uBoxMin.value.copy(gestureData.boxMin);
        this.surveilPass.uniforms.uBoxMax.value.copy(gestureData.boxMax);
        this.surveilPass.uniforms.uIsDual.value = gestureData.isDualHand;
        this.surveilPass.uniforms.uMode.value = gestureData.mode; 

        // Force updates
        if (this.rainTexture) this.rainTexture.needsUpdate = true;
        if (this.musicTexture) this.musicTexture.needsUpdate = true;

        this.hudPass.uniforms.uTime.value = time;
        this.hudPass.uniforms.uHand1.value.copy(gestureData.hand1);
        this.hudPass.uniforms.uHand2.value.copy(gestureData.hand2);
        this.hudPass.uniforms.uIsDual.value = gestureData.isDualHand;
    }

    render() {
        this.composer.render();
    }

    resize(width, height) {
        this.composer.setSize(width, height);
        this.hudPass.uniforms.uAspect.value = width / height;
    }
}