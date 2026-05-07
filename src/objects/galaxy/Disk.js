import * as THREE from 'three';

// ── The main visual: a shader plane that draws the spiral galaxy ──────────
// Uses domain-warped FBM + logarithmic spiral arms + radial color gradient

const VERT = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

const FRAG = `
  varying vec2 vUv;
  uniform vec2  uSeed;
  uniform vec3  uGalColor;

  const float PI   = 3.14159265;
  const float ARMS = 3.0;
  const float SPIN = 4.8;   // logarithmic spiral tightness

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){
    vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*sn(p);p*=2.1;a*=.5;}return v;}

  void main(){
    // Domain warp: perturb position for organic look
    vec2 c = vUv - 0.5;
    c += vec2(
      fbm(vUv * 3.2 + uSeed           ) - 0.5,
      fbm(vUv * 3.2 + uSeed + vec2(5.7, 3.1)) - 0.5
    ) * 0.045;

    float r = length(c);
    if (r > 0.5) discard;

    float theta = atan(c.y, c.x);

    // ── Spiral arm density ──────────────────────────────────────────────
    float armStr = 0.0;
    for (float i = 0.0; i < ARMS; i++) {
      float offset    = i * (2.0 * PI / ARMS);
      float spiralAng = SPIN * log(max(r, 0.008)) + offset;

      // Minimal angular distance to this arm
      float phase = mod(theta - spiralAng + 100.0 * PI, 2.0 * PI) - PI;
      float diff  = abs(phase);

      // Arms get wider and softer toward the edge
      float width = 0.18 + r * 1.55;
      armStr = max(armStr, 1.0 - smoothstep(0.0, width, diff));
    }

    // Add FBM noise to break arm uniformity
    float n   = fbm(c * 9.0 + uSeed * 0.6);
    armStr = armStr * 0.58 + armStr * n * 0.42;

    // ── Brightness ─────────────────────────────────────────────────────
    float falloff   = exp(-r * 5.2);
    float corePeak  = 0.90 * exp(-r * 30.0);  // very bright nucleus
    float interArm  = 0.22 * falloff;          // faint glow between arms

    float bright = armStr * falloff + corePeak + interArm;

    // ── Color gradient: warm white → galaxy color → purple → deep blue ─
    float t = clamp(r / 0.46, 0.0, 1.0);

    vec3 coreCol  = vec3(1.00, 0.97, 0.92);
    vec3 armCol   = clamp(uGalColor * 1.3, 0.0, 1.0);
    vec3 midCol   = mix(uGalColor * 0.75, vec3(0.45, 0.22, 0.82), 0.55);
    vec3 outerCol = vec3(0.07, 0.11, 0.50);

    vec3 col;
    if      (t < 0.14) col = mix(coreCol,  armCol,   t / 0.14);
    else if (t < 0.48) col = mix(armCol,   midCol,   (t - 0.14) / 0.34);
    else               col = mix(midCol,   outerCol, clamp((t - 0.48) / 0.52, 0.0, 1.0));

    float alpha = clamp(bright * 0.95, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function buildDisk(group, data, seed) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSeed:     { value: new THREE.Vector2(seed * 1.4, seed * 0.8) },
      uGalColor: { value: new THREE.Color(data.color) },
    },
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    side:        THREE.DoubleSide,
    vertexShader:   VERT,
    fragmentShader: FRAG,
  });

  // Plane covers radius 5.2 units → size = 5.2 * 2 / 0.5 = 20.8 but scale to 11.5 for density
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 11.5), mat);
  mesh.rotation.x = -Math.PI / 2;  // lie flat in XZ plane
  group.add(mesh);
  return mesh;
}
