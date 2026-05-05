import * as THREE from 'three';
import { scene } from '../core/Scene.js';

// Prominent individual stars with soft glow + sharp core + diffraction spikes
const POSITIONS = [
  // [x, y, z, color, glowRadius, coreSize]
  [ -60, -22, -95,  '#ffe8a0', 18, 5.5 ],   // warm yellow — bottom-left
  [  12,  18, -82,  '#ffffff', 22, 7.0 ],   // white — near cluster top
  [  55,   2, -110, '#ffe0b0', 14, 4.5 ],   // warm — mid right
  [ -25,  -8, -105, '#c0d8ff', 12, 4.0 ],   // blue-white — left
  [   2,  -6, -88,  '#ffffff', 16, 5.0 ],   // white — centre-bottom
];

function makeGlow(x, y, z, color, radius) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    const r = () => (Math.random() + Math.random() - 1) * radius;
    pos[i * 3]     = x + r();
    pos[i * 3 + 1] = y + r();
    pos[i * 3 + 2] = z + r() * 0.3;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 32.0 * (600.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 0.04 * (1.0 - smoothstep(0.0, 0.5, d));
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
  scene.add(new THREE.Points(geo, mat));
}

function makeCore(x, y, z, color, size) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x, y, z]), 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(new Float32Array([size]), 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (500.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 1.0 - smoothstep(0.0, 0.45, d);
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
  scene.add(new THREE.Points(geo, mat));
}

function makeSpike(x, y, z, color, length) {
  // Cross-shaped diffraction spike using a thin line of particles
  const N   = 60;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 4 * 3); // 4 arms
  const sz  = new Float32Array(N * 4);
  let idx   = 0;

  for (let arm = 0; arm < 4; arm++) {
    const angle = (arm * Math.PI) / 2;
    const dx    = Math.cos(angle);
    const dy    = Math.sin(angle);

    for (let j = 1; j <= N; j++) {
      const t  = j / N;
      const d  = t * length;
      pos[idx * 3]     = x + dx * d;
      pos[idx * 3 + 1] = y + dy * d;
      pos[idx * 3 + 2] = z;
      sz[idx]          = (1 - t) * 3.5 + 0.3;
      idx++;
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sz, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (500.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 0.7 * (1.0 - smoothstep(0.0, 0.5, d));
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
  scene.add(new THREE.Points(geo, mat));
}

export function createBrightStars() {
  for (const [x, y, z, color, glowR, coreSize] of POSITIONS) {
    makeGlow(x, y, z, color, glowR);
    makeCore(x, y, z, color, coreSize);
    makeSpike(x, y, z, color, glowR * 1.8);
  }
}
