uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uStrength; // Controlled by hand gesture (e.g., pinch)

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv;
    
    // 1. Block Displacement (The "Datamosh" look)
    // Create a grid of blocks
    vec2 block = floor(uv * 20.0); // 20x20 grid
    float noise = rand(block + floor(uTime * 10.0)); // Noise changes 10 times/sec
    
    // Only displace some blocks
    float displacementStrength = 0.0;
    if (noise > 0.9 - (uStrength * 0.4)) { 
        displacementStrength = 0.05 * uStrength; 
    }
    
    // Shift RGB channels differently for glitch
    float r = texture2D(tDiffuse, uv + vec2(displacementStrength, 0.0)).r;
    float g = texture2D(tDiffuse, uv + vec2(-displacementStrength, 0.01)).g;
    float b = texture2D(tDiffuse, uv).b;
    
    // 2. Vertical Tearing
    float tear = 0.0;
    if (rand(vec2(uTime, uTime)) > 0.9) {
        if (abs(uv.y - rand(vec2(uTime * 2.0, 0.0))) < 0.1) {
             tear = 0.1;
        }
    }
    
    gl_FragColor = vec4(r + tear, g + tear, b + tear, 1.0);
}