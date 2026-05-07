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
    const inner = col.clone().lerp(new THREE.Color(1, 1, 1), 0.5);

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: { uC1: { value: col }, uC2: { value: inner } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uC1,uC2;
          ${NOISE}
          void main(){
            float n=fbm(vUv*7.0);
            vec3 col=mix(uC1,uC2,n*n);
            col*=0.8+n*0.6;
            gl_FragColor=vec4(col,1.0);
          }
        `,
      })
    );

    // Layered planet glows
    for (const [r, o] of [[0.50, 0.35], [0.80, 0.12], [1.20, 0.04]]) {
      this.mesh.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshBasicMaterial({ color: this.data.color, transparent: true, opacity: o,
          side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
      ));
    }

    // Surrounding particle cloud (static, child of mesh so it orbits with planet)
    const N = 300;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 0.6 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: col } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=3.5*(200./-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform vec3 uColor;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(uColor,0.6*(1.-smoothstep(0.,.5,d)));}`,
    });
    this.mesh.add(new THREE.Points(geo, mat));
  }

  _animate(time) {
    // Gently rotate the particle cloud
    if (this.mesh.children[3]) this.mesh.children[3].rotation.y = time * 0.15;
  }
}
