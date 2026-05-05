import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Rocky extends World {
  _buildMesh() {
    const col  = new THREE.Color(this.data.color);
    const dark = col.clone().multiplyScalar(0.18);

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: { uL: { value: col }, uD: { value: dark } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uL,uD;
          ${NOISE}
          void main(){
            float n=fbm(vUv*9.0);
            float crater=1.0-smoothstep(0.42,0.58,fract(sn(vUv*16.0)*2.5));
            vec3 col=mix(uD,uL,n)*(1.0-crater*0.55);
            gl_FragColor=vec4(col,1.0);
          }
        `,
      })
    );

    for (const [r, o] of [[0.46, 0.18], [0.68, 0.06]]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: this.data.color, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    }
  }
}
