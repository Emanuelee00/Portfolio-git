import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Nebular extends World {
  _buildMesh() {
    const col   = new THREE.Color(this.data.color);
    const light = col.clone().lerp(new THREE.Color(1, 1, 1), 0.55);
    const dark  = col.clone().multiplyScalar(0.2);

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: {
          uC1: { value: col },
          uC2: { value: light },
          uC3: { value: dark },
        },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uC1,uC2,uC3;
          ${NOISE}
          void main(){
            float n1 = fbm(vUv * 5.0);
            float n2 = fbm(vUv * 9.0 + vec2(n1 * 2.0, 0.5));
            float n3 = fbm(vUv * 3.5 + vec2(0.3, n1));
            vec3 col = mix(uC3, uC1, n1);
            col = mix(col, uC2, n2 * n3 * 1.2);
            col *= 0.75 + n3 * 0.55;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      })
    );

    for (const [r, o] of [[0.54, 0.22], [0.88, 0.07]]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({
          color: this.data.color, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
        })
      ));
    }
  }
}
