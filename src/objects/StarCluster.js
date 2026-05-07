import * as THREE from 'three';
import { scene } from '../core/Scene.js';

export function createStarCluster() {
  // Dense bright cluster — the glowing core visible in the photo
  const CENTER = new THREE.Vector3(4, 18, -92);

  function layer(count, radius, colors, sizeMin, sizeMax, opacity) {
    const geo  = new THREE.BufferGeometry();
    const pos  = new Float32Array(count * 3);
    const col  = new Float32Array(count * 3);
    const sz   = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Gaussian-sphere distribution
      const r = () => (Math.random() + Math.random() - 1) * radius;
      pos[i * 3]     = CENTER.x + r();
      pos[i * 3 + 1] = CENTER.y + r() * 0.85;
      pos[i * 3 + 2] = CENTER.z + r() * 0.6;

      const c = colors[Math.floor(Math.random() * colors.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sz, 1));

    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: opacity } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (500.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = uOpacity * (1.0 - smoothstep(0.15, 0.5, d));
          gl_FragColor = vec4(vColor, a);
        }
      `,
    });

    scene.add(new THREE.Points(geo, mat));
  }

  const white  = new THREE.Color(1.00, 1.00, 1.00);
  const blueW  = new THREE.Color(0.78, 0.88, 1.00);
  const paleB  = new THREE.Color(0.60, 0.78, 1.00);
  const warmW  = new THREE.Color(1.00, 0.95, 0.80);
  const yellow = new THREE.Color(1.00, 0.90, 0.60);

  // Outer halo — sparse and faint
  layer(1800, 22, [blueW, paleB, white], 0.5, 1.8, 0.55);
  // Mid ring — brighter
  layer(2500, 12, [white, blueW, warmW], 0.8, 2.5, 0.75);
  // Inner dense core
  layer(1500,  6, [white, warmW, yellow], 1.2, 3.5, 0.90);
  // Bright nucleus
  layer( 600,  2.5, [white, white, warmW], 2.0, 5.0, 1.00);

  // Soft glow halo behind the cluster (large faint blob)
  const haloGeo = new THREE.BufferGeometry();
  const haloPos = new Float32Array(800 * 3);
  for (let i = 0; i < 800; i++) {
    const r = () => (Math.random() + Math.random() - 1) * 30;
    haloPos[i * 3]     = CENTER.x + r();
    haloPos[i * 3 + 1] = CENTER.y + r() * 0.7;
    haloPos[i * 3 + 2] = CENTER.z + r() * 0.4;
  }
  haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
  const haloMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color('#8ab0ff') } },
    vertexShader: `
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 28.0 * (600.0 / -mv.z);
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
  scene.add(new THREE.Points(haloGeo, haloMat));
}
