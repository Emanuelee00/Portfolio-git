import * as THREE from 'three';

export class World {
  constructor(data, parentGroup) {
    this.data  = data;
    this.angle = data.orbitOffset ?? 0;
    this.group = new THREE.Group();
    this._rings = [];

    this._buildMesh();
    this.group.add(this.mesh);

    // Hitbox orbits with the planet
    const hb = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hb.userData = { type: 'world', worldRef: this };
    this.hitbox = hb;
    this.mesh.add(hb);

    // Double orbit ring in parent space
    const r = data.orbitRadius;
    for (const [off, op] of [[0, 0.10], [0.05, 0.04]]) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.012 + off, r + 0.012 + off, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffffff, transparent: true, opacity: op,
          side: THREE.DoubleSide, depthWrite: false,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      this._rings.push(ring);
      parentGroup.add(ring);
    }

    parentGroup.add(this.group);
  }

  /** Subclasses create this.mesh here (no need to add to group) */
  _buildMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 32),
      new THREE.MeshBasicMaterial({ color: this.data.color })
    );
  }

  setVisible(v) {
    this.group.visible = v;
    this._rings.forEach(r => (r.visible = v));
  }

  update(time) {
    this.angle += this.data.orbitSpeed * 0.008;
    const r = this.data.orbitRadius;
    this.mesh.position.set(Math.cos(this.angle) * r, 0, Math.sin(this.angle) * r);
    this.mesh.rotation.y += 0.012;
    this._animate(time);
  }

  _animate(_t) {}
}
