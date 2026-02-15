uniform sampler2D tDiffuse;
uniform sampler2D tRain;
uniform sampler2D tMusic;
uniform float uTime;
uniform float uEnergy;
uniform vec2 uBoxMin;
uniform vec2 uBoxMax;
uniform bool uIsDual;
uniform int uMode; // 0=Glitch, 1=Rain, 2=Static, 3=Music

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// 1. GLITCH
vec3 effectGlitch(vec2 uv, vec3 base) {
    float shift = 0.02 * uEnergy;
    float r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
    float gray = dot(vec3(r,g,b), vec3(0.299, 0.587, 0.114));
    gray = pow(gray, 1.5);
    gray = smoothstep(0.1, 0.9, gray);
    float scanline = sin(uv.y * 800.0 + uTime * 10.0);
    return vec3(gray) * (0.8 + 0.2 * scanline) * vec3(0.6, 0.9, 1.0); 
}

// 2. RAIN (Flipped UV)
vec3 effectRain(vec2 uv, vec3 base) {
    vec2 videoUV = vec2(1.0 - uv.x, uv.y);
    vec4 rainPixel = texture2D(tRain, videoUV);
    vec3 c = rainPixel.rgb;
    
    // Keying
    float isGreen = step(c.r + 0.1, c.g) * step(c.b + 0.1, c.g);
    float mask = 1.0 - isGreen;
    
    // Spill removal
    if (c.g > c.r && c.g > c.b) c.g = (c.r + c.b) * 0.5;
    
    c *= 2.0; 
    
    return mix(base * 0.3, c, mask);
}

// 3. MUSIC VIDEO (Transparent Blend)
vec3 effectMusic(vec2 uv, vec3 base) {
    vec2 videoUV = vec2(1.0 - uv.x, uv.y);
    vec3 vid = texture2D(tMusic, videoUV).rgb;
    
    // BLEND LOGIC:
    // mix(base, vid, 0.5) means 50% Face, 50% Video.
    // Adjust 0.5 to 0.7 for more video, or 0.3 for more face.
    vec3 blended = mix(base, vid, 0.5);
    
    // Add subtle scanlines to tie it together
    float scan = sin(uv.y * 600.0) * 0.05;
    
    return blended + scan;
}

// 4. STATIC
vec3 effectStatic(vec2 uv, vec3 base) {
    float n = rand(uv + uTime);
    float stripe = step(0.5, sin(uv.y * 100.0 + uTime * 20.0));
    vec3 noiseCol = vec3(n);
    if (n > 0.9) noiseCol = vec3(1.0, 0.0, 0.0); 
    return mix(base, noiseCol, 0.5 * stripe);
}

void main() {
    vec2 uv = vUv;
    vec4 baseColor = texture2D(tDiffuse, uv);
    
    float inBox = step(uBoxMin.x, uv.x) * step(uv.x, uBoxMax.x) * step(uBoxMin.y, uv.y) * step(uv.y, uBoxMax.y);
    if (!uIsDual) inBox = 0.0;

    vec3 effectColor = vec3(0.0);
    
    if (uMode == 0) effectColor = effectGlitch(uv, baseColor.rgb);
    else if (uMode == 1) effectColor = effectRain(uv, baseColor.rgb);
    else if (uMode == 2) effectColor = effectStatic(uv, baseColor.rgb);
    else if (uMode == 3) effectColor = effectMusic(uv, baseColor.rgb);
    
    vec3 finalColor = mix(baseColor.rgb, effectColor, inBox);
    
    if (inBox > 0.0) {
        float borderSize = 0.005;
        float dx = min(abs(uv.x - uBoxMin.x), abs(uv.x - uBoxMax.x));
        float dy = min(abs(uv.y - uBoxMin.y), abs(uv.y - uBoxMax.y));
        if (dx < borderSize || dy < borderSize) finalColor = vec3(1.0);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}