import * as THREE from 'three';
import { scene } from '../core/Scene.js';

function starLayer(count, spread, sizeMin, sizeMax, colors) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const sz  = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;

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
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 1.0 - smoothstep(0.15, 0.5, d);
        gl_FragColor = vec4(vColor, a);
      }
    `,
  });

  scene.add(new THREE.Points(geo, mat));
}

export function createStars() {
  const white  = new THREE.Color(1.00, 1.00, 1.00);
  const blueW  = new THREE.Color(0.78, 0.88, 1.00);
  const paleB  = new THREE.Color(0.60, 0.75, 1.00);
  const warmW  = new THREE.Color(1.00, 0.96, 0.82);
  const orange = new THREE.Color(1.00, 0.75, 0.45);

  // Distant dim background
  starLayer(9000, 280, 0.2, 0.7, [white, blueW, paleB]);
  // Mid-field — slight color variation
  starLayer(3000, 200, 0.5, 1.6, [white, blueW, warmW]);
  // Foreground — brighter, warmer mix
  starLayer(800,  140, 1.0, 3.0, [white, warmW, orange, blueW]);
}
