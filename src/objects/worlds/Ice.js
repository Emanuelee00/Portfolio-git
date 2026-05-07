import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Ice extends World {
  _buildMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.40, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv;
          ${NOISE}
          void main(){
            float n=fbm(vUv*10.0);
            // crack network: dark lines where fract(n*4) is near 0
            float crack=smoothstep(0.0,0.12,fract(n*4.5));
            vec3 base=mix(vec3(0.72,0.88,1.0),vec3(0.92,0.96,1.0),n);
            vec3 crackCol=vec3(0.25,0.42,0.75);
            vec3 col=mix(crackCol,base,crack);
            col*=0.9+n*0.3; // brightness variation
            gl_FragColor=vec4(col,1.0);
          }
        `,
      })
    );

    // Bright icy glow — blue-white
    for (const [r, o, c] of [
      [0.52, 0.30, 0x88ccff],
      [0.78, 0.12, 0x99ddff],
      [1.10, 0.04, 0xaaeeff],
    ]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    }
  }
}
