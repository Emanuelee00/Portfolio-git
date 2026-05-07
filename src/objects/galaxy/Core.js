import * as THREE from 'three';

export function buildCore(group, data) {
  const galColor = new THREE.Color(data.color);
  const warm     = new THREE.Color(1.00, 0.78, 0.42); // amber nucleus like real galaxies
  const mid      = galColor.clone().lerp(warm, 0.45);

  // ── Star cloud: exponential density falloff, flattened in Y ───────────
  const N   = 900;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const sz  = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    // Exponential radial distribution — most stars near center
    const r     = Math.pow(Math.random(), 2.8) * 2.0;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);

    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.22; // flatten bulge
    pos[i * 3 + 2] = r * Math.cos(phi);

    // warm white at center → galaxy color outward
    const t = r / 2.0;
    const c = warm.clone().lerp(mid, Math.min(t * 2.2, 1.0));
    col[i * 3]     = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;

    sz[i] = Math.max(0.03, (0.20 - t * 0.14) * (0.5 + Math.random()));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sz,  1));

  const coreCloud = new THREE.Points(geo, new THREE.ShaderMaterial({
    vertexColors: true, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size; varying vec3 vColor;
      void main(){
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (320.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 0.58 * (1.0 - smoothstep(0.0, 0.5, d));
        gl_FragColor = vec4(vColor, a);
      }
    `,
  }));
  group.add(coreCloud);

  // ── Single bright nucleus point ────────────────────────────────────────
  const nucleusGeo = new THREE.BufferGeometry();
  nucleusGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
  group.add(new THREE.Points(nucleusGeo, new THREE.ShaderMaterial({
    uniforms: { uColor: { value: warm.clone() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader:   `uniform vec3 uColor;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=13.0*(320./-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform vec3 uColor;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=0.75*(1.0-smoothstep(0.0,.5,d));gl_FragColor=vec4(uColor,a);}`,
  })));

  // ── Oblate glow shells — flattened in Y to match the disk ─────────────
  const shellDefs = [
    { r: 0.32, o: 0.32, c: warm,     fy: 0.65 },
    { r: 1.10, o: 0.10, c: mid,      fy: 0.40 },
    { r: 2.60, o: 0.03, c: galColor, fy: 0.25 },
  ];

  const shells = shellDefs.map(({ r, o, c, fy }) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 20, 20),
      new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: o,
        side: THREE.BackSide, depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    mesh.scale.y = fy;
    group.add(mesh);
    return mesh;
  });

  return { coreCloud, shells };
}
