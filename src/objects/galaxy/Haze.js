import * as THREE from 'three';

// Outer blue/purple haze planes — float around the disk at slight angles
// to create the diffuse nebula gas seen in galaxy photos

const VERT = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FRAG = `
  varying vec2 vUv;
  uniform vec2  uSeed;
  uniform vec3  uColor;
  uniform float uOpacity;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sn(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*sn(p);p*=2.1;a*=.5;}return v;}

  void main(){
    vec2 c = vUv - 0.5;
    float n1 = fbm(vUv * 2.8 + uSeed);
    float n2 = fbm(vUv * 2.0 + vec2(n1) * 1.2 + uSeed * 1.6);
    float cloud = n1 * 0.4 + n2 * 0.6;

    float mask = 1.0 - smoothstep(0.15, 0.5, length(c));
    float alpha = pow(cloud, 1.9) * mask * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function hazePlane(group, size, x, y, z, rx, ry, color, opacity, seed) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSeed:    { value: new THREE.Vector2(seed, seed * 1.6 + 2.3) },
      uColor:   { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: VERT, fragmentShader: FRAG,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.x = rx;
  mesh.rotation.y = ry;
  group.add(mesh);
  return mesh;
}

export function buildHaze(group, data, seed) {
  const col = new THREE.Color(data.color);
  // Dark/deep version of the galaxy color for the haze
  const hazeCol = col.clone().multiplyScalar(0.35).lerp(new THREE.Color(0.05, 0.08, 0.40), 0.55);

  const planes = [
    // Main haze disk (larger than the spiral disk, very faint)
    hazePlane(group, 16, 0, 0, 0, -Math.PI / 2, 0, hazeCol, 0.50, seed),
    // Tilted wisps above/below
    hazePlane(group, 10, 0.5,  0.6, 0.3,  0.55, 0.12, hazeCol, 0.30, seed + 3.1),
    hazePlane(group,  9, -0.3, -0.5, 0.2, -0.48, -0.10, hazeCol, 0.28, seed + 6.7),
    // Faint outer glow plane
    hazePlane(group, 20, 0, 0.1, 0, -Math.PI / 2 + 0.08, 0.05, hazeCol, 0.18, seed + 9.3),
  ];

  return planes;
}
