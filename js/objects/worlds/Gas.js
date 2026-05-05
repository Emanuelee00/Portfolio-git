import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Gas extends World {
  _buildMesh() {
    const col = new THREE.Color(this.data.color);
    const c1  = col.clone();
    const c2  = col.clone().lerp(new THREE.Color(1, 1, 1), 0.45);
    const c3  = col.clone().multiplyScalar(0.45).lerp(new THREE.Color(0.75, 0.55, 0.15), 0.5);

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.56, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: { uC1: { value: c1 }, uC2: { value: c2 }, uC3: { value: c3 } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uC1,uC2,uC3;
          ${NOISE}
          void main(){
            float turb=fbm(vUv*5.0)*0.10;
            float b1=sin((vUv.y+turb)*22.0)*0.5+0.5;
            float b2=sin((vUv.y+turb*1.8)*9.0+1.5)*0.5+0.5;
            vec3 col=mix(uC1,uC2,b1);
            col=mix(col,uC3,b2*0.38);
            gl_FragColor=vec4(col,1.0);
          }
        `,
      })
    );

    // Saturn-like ring (orbits with planet as child of mesh)
    const ringGeo = new THREE.RingGeometry(0.74, 1.18, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: col.clone().lerp(new THREE.Color(1, 1, 1), 0.3),
      transparent: true, opacity: 0.38,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.38;
    this.mesh.add(ring);

    for (const [r, o] of [[0.66, 0.22], [1.05, 0.07]]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: this.data.color, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    }
  }
}
