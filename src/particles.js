// src/particles.js
import * as THREE from 'three';

const particleVertex = `
uniform float uTime;
uniform float uEnergy;
attribute float aRandom;
attribute float aSize;

varying float vAlpha;

void main() {
    vec3 pos = position;
    
    // Ambient floating motion
    pos.y += sin(uTime * 2.0 + aRandom * 10.0) * 0.05 * uEnergy;
    pos.x += cos(uTime * 1.5 + aRandom * 10.0) * 0.02;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size attenuation (bigger when close)
    gl_PointSize = (aSize * 4.0 * (1.0 + uEnergy * 2.0)) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Fade out based on depth/energy
    vAlpha = 0.5 + 0.5 * sin(uTime * 5.0 + aRandom * 20.0);
}
`;

const particleFragment = `
varying float vAlpha;

void main() {
    // Draw circular particle
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;

    // Sharp center, soft edge
    float glow = 1.0 - (ll * 2.0);
    glow = pow(glow, 2.0);

    // Cyan/White data color
    gl_FragColor = vec4(0.4, 0.9, 1.0, vAlpha * glow);
}
`;

export class DataParticles {
    constructor(scene) {
        const count = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count);
        const sizes = new Float32Array(count);

        for(let i=0; i<count; i++) {
            // Spread particles in a wide volume
            positions[i*3] = (Math.random() - 0.5) * 4; // X
            positions[i*3+1] = (Math.random() - 0.5) * 2; // Y
            positions[i*3+2] = (Math.random() - 0.5) * 2; // Z
            
            randoms[i] = Math.random();
            sizes[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uEnergy: { value: 0 }
            },
            vertexShader: particleVertex,
            fragmentShader: particleFragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.mesh = new THREE.Points(geometry, this.material);
        scene.add(this.mesh);
    }

    update(time, energy) {
        this.material.uniforms.uTime.value = time;
        this.material.uniforms.uEnergy.value = energy;
        // Slowly rotate the whole cloud
        this.mesh.rotation.y = time * 0.05;
    }
}