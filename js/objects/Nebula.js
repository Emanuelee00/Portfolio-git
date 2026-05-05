import * as THREE from 'three';
import { scene } from '../core/Scene.js';

// FBM-based shader plane — looks like real nebula clouds, not particles
const VERT = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FRAG = `
  varying vec2 vUv;
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform float uScale;
  uniform vec2  uSeed;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*sn(p);p*=2.1;a*=.5;}return v;}

  void main(){
    vec2 uv = vUv + uSeed;
    float c1 = fbm(uv * uScale);
    float c2 = fbm(uv * uScale * 0.65 + vec2(c1) * 1.5); // domain warp
    float cloud = c1 * 0.45 + c2 * 0.55;

    vec2 cent = vUv - 0.5;
    float mask = 1.0 - smoothstep(0.18, 0.5, length(cent));

    float alpha = pow(cloud, 1.7) * mask * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function nebulaPlane(w, h, x, y, z, rx, ry, color, opacity, scale) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:   { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uScale:   { value: scale },
      uSeed:    { value: new THREE.Vector2(Math.random() * 8 + 1, Math.random() * 8 + 1) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.x = rx;
  mesh.rotation.y = ry;
  scene.add(mesh);
}

export function createNebula() {
  // Purple / violet canopy
  nebulaPlane( 95,  72,   4,  22, -155,  0.14,  0.04, '#5030a8', 0.55, 2.6);
  nebulaPlane( 62,  46,  12,  30, -148,  0.08, -0.06, '#3855c5', 0.45, 3.4);

  // Blue arc bottom-left
  nebulaPlane(105,  80, -58, -22, -165,  0.22,  0.10, '#1540a5', 0.60, 2.3);
  nebulaPlane( 65,  50, -50, -12, -155,  0.14, -0.07, '#3080d0', 0.42, 3.1);

  // Orange / rust right pillar
  nebulaPlane( 78, 100,  72,   8, -170, -0.10,  0.12, '#b83010', 0.55, 2.9);
  nebulaPlane( 52,  65,  78,  20, -160, -0.04, -0.10, '#d05520', 0.40, 3.6);

  // Pink / magenta centre glow
  nebulaPlane( 70,  55,   0,  10, -135,  0.06,  0.00, '#b02555', 0.52, 3.1);
  nebulaPlane( 48,  36,   5,  16, -128, -0.05,  0.04, '#c84070', 0.38, 3.9);

  // Large very faint background wash
  nebulaPlane(210, 155,   0,   4, -195,  0.00,  0.00, '#1a0a50', 0.40, 1.6);
}
