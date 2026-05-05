import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Lava extends World {
  _buildMesh() {
    this._mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `
        varying vec2 vUv; uniform float uTime;
        ${NOISE}
        void main(){
          vec2 uv=vUv+vec2(uTime*0.018,uTime*0.012);
          float n=fbm(uv*5.5);
          n=fbm(uv*4.0+vec2(n)*1.6); // domain warp for lava flow
          float vein=pow(n,2.2);
          vec3 dark=vec3(0.06,0.01,0.01);
          vec3 orange=vec3(1.0,0.32,0.0);
          vec3 bright=vec3(1.0,0.92,0.3);
          vec3 col=mix(dark,orange,vein);
          col=mix(col,bright,pow(vein,4.0)*1.5);
          gl_FragColor=vec4(col,1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), this._mat);

    for (const [r, o, c] of [
      [0.44, 0.25, 0xff4400],
      [0.65, 0.08, 0xff6600],
    ]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    }
  }

  _animate(time) {
    this._mat.uniforms.uTime.value = time;
  }
}
