import * as THREE from 'three';
import { World } from './World.js';

const NOISE = `
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.;a*=.5;}return v;}
`;

export class Desert extends World {
  _buildMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 32, 32),
      new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv;
          ${NOISE}
          void main(){
            float n=fbm(vUv*4.5);
            float dune=sin(vUv.x*18.0+n*4.0)*0.5+0.5;
            float detail=sn(vUv*20.0)*0.5+0.5;
            vec3 shadow=vec3(0.52,0.34,0.08);
            vec3 sand=vec3(0.88,0.66,0.22);
            vec3 highlight=vec3(1.0,0.90,0.55);
            vec3 col=mix(shadow,sand,n);
            col=mix(col,highlight,dune*0.30);
            col=mix(col,shadow*0.7,detail*0.12);
            gl_FragColor=vec4(col,1.0);
          }
        `,
      })
    );

    for (const [r, o, c] of [
      [0.43, 0.16, 0xddaa44],
      [0.62, 0.05, 0xeecc77],
    ]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    }
  }
}
