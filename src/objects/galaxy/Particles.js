import * as THREE from 'three';

const ARMS   = 3;
const RADIUS = 5.2;
const SPIN   = 4.8;  // must match Disk.js

const VERT = `
  attribute float size;
  varying vec3 vColor;
  float hash(float n){return fract(sin(n)*43758.5453);}
  void main(){
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float flicker = 0.78 + hash(position.x + position.y * 3.1 + position.z * 7.3) * 0.44;
    gl_PointSize = size * (320.0 / -mv.z) * flicker;
    gl_Position  = projectionMatrix * mv;
  }
`;
const FRAG = `
  varying vec3 vColor;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow  = smoothstep(0.5, 0.0, d);
    vec3  col   = vColor * (0.95 + glow * 0.35);
    float alpha = glow * 0.60;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function buildParticles(group, data) {
  const COUNT = 2500;
  const pos   = new Float32Array(COUNT * 3);
  const col   = new Float32Array(COUNT * 3);
  const sz    = new Float32Array(COUNT);

  const white = new THREE.Color(1, 1, 1);
  const galC  = new THREE.Color(data.color);
  const outerC = galC.clone().multiplyScalar(0.12);

  const rnd = (e = 2.5) => Math.pow(Math.random(), e) * (Math.random() < 0.5 ? 1 : -1);

  for (let i = 0; i < COUNT; i++) {
    const r  = Math.pow(Math.random(), 0.52) * RADIUS;
    const t  = r / RADIUS;

    // Place particle on a spiral arm
    const arm       = (i % ARMS);
    const armOffset = arm * ((Math.PI * 2) / ARMS);
    // Match Disk.js spiral: SPIN * log(r_uv) where r_uv = r/11.5
    const spiral = SPIN * Math.log(Math.max(r / 11.5, 0.001));
    const noise  = (Math.random() - 0.5) * 0.55 * t;
    const angle  = armOffset + spiral + noise;

    const scatter = 0.10 + t * 0.58;
    pos[i * 3]     = Math.cos(angle) * r + rnd() * scatter;
    pos[i * 3 + 1] = rnd(4) * (0.08 + t * 0.28);
    pos[i * 3 + 2] = Math.sin(angle) * r + rnd() * scatter;

    // Color gradient matches disk: white → galaxy color → dark outer
    let c;
    if (t < 0.18)      c = white.clone().lerp(galC, t / 0.18);
    else               c = galC.clone().lerp(outerC, (t - 0.18) / 0.82);
    col[i * 3]     = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;

    sz[i] = Math.max(0.035, (0.19 - t * 0.13) * (0.55 + Math.random() * 0.9));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sz,  1));

  const pts = new THREE.Points(geo, new THREE.ShaderMaterial({
    vertexColors: true, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: VERT, fragmentShader: FRAG,
  }));
  group.add(pts);
  return pts;
}
