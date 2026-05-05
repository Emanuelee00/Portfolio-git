import * as THREE from 'three';

export function buildCore(group, data) {
  // Dense particle cloud around the nucleus (no solid sphere — just glow)
  const N   = 400;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = () => (Math.random() + Math.random() - 1) * 0.6;
    pos[i * 3]     = r();
    pos[i * 3 + 1] = r() * 0.22;
    pos[i * 3 + 2] = r();
  }
  const cpGeo = new THREE.BufferGeometry();
  cpGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const cpColor = new THREE.Color(data.color).lerp(new THREE.Color(1, 1, 1), 0.68);
  const cpMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: cpColor } },
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=7.0*(320./-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform vec3 uColor;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=0.62*(1.-smoothstep(0.,.5,d));gl_FragColor=vec4(uColor,a);}`,
  });
  const coreCloud = new THREE.Points(cpGeo, cpMat);
  group.add(coreCloud);

  // Three nested glow shells — inner bright, outer very soft
  const shellDefs = [
    { r: 0.40, o: 0.42, c: 0xffffff   },  // white inner
    { r: 0.90, o: 0.16, c: data.color },
    { r: 2.20, o: 0.05, c: data.color },
  ];
  const shells = shellDefs.map(({ r, o, c }) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 16, 16),
      new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: o,
        side: THREE.BackSide, depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    group.add(mesh);
    return mesh;
  });

  return { coreCloud, shells };
}
