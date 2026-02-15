uniform sampler2D tDiffuse;
uniform vec2 uHand1;
uniform vec2 uHand2;
uniform bool uIsDual;
uniform float uAspect;
uniform float uTime;

varying vec2 vUv;

float ring(vec2 uv, vec2 center, float r) {
    float d = abs(length(uv - center) - r);
    return smoothstep(0.005, 0.0, d);
}

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    
    vec2 uv = vUv;
    uv.x *= uAspect;
    
    vec2 h1 = uHand1; h1.x *= uAspect;
    vec2 h2 = uHand2; h2.x *= uAspect;
    
    vec3 ui = vec3(0.0);
    
    // Always draw Hand 1 Target
    ui += ring(uv, h1, 0.06) * vec3(1.0, 1.0, 1.0); // White Ring
    
    // Draw Hand 2 Target if active
    if (uIsDual) {
        ui += ring(uv, h2, 0.06) * vec3(0.0, 1.0, 1.0); // Cyan Ring
    }
    
    // Add UI on top
    gl_FragColor = color + vec4(ui, 0.0);
}