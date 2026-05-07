import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Storm extends World {
  _buildMesh() {
    this._mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `
        varying vec2 vUv; uniform float uTime;
        ${NOISE}
        void main(){
          vec2 uv = vUv;

          // Slow horizontal drift
          float drift = uTime * 0.008;
          float warp  = fbm(uv * 3.5 + vec2(drift, 0.0)) * 0.18;

          // Swirling bands
          float band = sin((uv.y + warp) * 18.0 + drift * 0.5) * 0.5 + 0.5;
          band = pow(band, 1.4);

          // Central storm vortex
          vec2  sc    = uv - vec2(0.38, 0.52);
          float angle = atan(sc.y, sc.x) + uTime * 0.12;
          float dist  = length(sc);
          float vortex = exp(-dist * 9.0) * (0.5 + 0.5 * sin(angle * 5.0 + dist * 12.0));

          // Colors: deep amber → orange → pale gold
          vec3 deep   = vec3(0.28, 0.10, 0.01);
          vec3 orange = vec3(0.95, 0.42, 0.05);
          vec3 gold   = vec3(1.00, 0.82, 0.38);

          vec3 col = mix(deep, orange, band);
          col = mix(col, gold,  vortex * 1.4);
          col *= 0.82 + fbm(uv * 7.0 + drift) * 0.36;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.50, 32, 32), this._mat);

    // Faint ring tilted differently from Gas
    const ringGeo = new THREE.RingGeometry(0.68, 0.95, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd97706, transparent: true, opacity: 0.22,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.28;
    ring.rotation.z = Math.PI * 0.08;
    this.mesh.add(ring);

    for (const [r, o] of [[0.62, 0.20], [1.0, 0.06]]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xf97316, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
        })
      ));
    }
  }

  _animate(time) {
    this._mat.uniforms.uTime.value = time;
  }
}
