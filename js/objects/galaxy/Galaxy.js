import * as THREE from 'three';
import { scene }       from '../../core/Scene.js';
import { createWorld } from '../worlds/WorldFactory.js';
import { buildDisk }   from './Disk.js';
import { buildCore }   from './Core.js';
import { buildParticles } from './Particles.js';
import { buildHaze }   from './Haze.js';

export class Galaxy {
  constructor(data) {
    this.data   = data;
    this.isOpen = false;

    this.group = new THREE.Group();
    this.group.position.set(...data.position);
    // Per-galaxy tilt — makes each one look unique
    this.group.rotation.x = (data.position[0] * 0.03) % 0.25;
    this.group.rotation.z = (data.position[1] * 0.04) % 0.15;

    const seed = data.position[0] * 13.7 + data.position[2] * 7.3;

    this._haze      = buildHaze(this.group, data, seed);
    this._disk      = buildDisk(this.group, data, seed);
    this._coreData  = buildCore(this.group, data);
    this._particles = buildParticles(this.group, data);
    this._buildHitbox();
    this._buildWorlds();

    scene.add(this.group);
  }

  // ── Hitbox ──────────────────────────────────────────────────────────
  _buildHitbox() {
    const geo = new THREE.SphereGeometry(2.8, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitbox = new THREE.Mesh(geo, mat);
    this.hitbox.userData = { type: 'galaxy', galaxyRef: this };
    this.group.add(this.hitbox);
  }

  _buildWorlds() {
    this.worlds = this.data.worlds.map(d => createWorld(d, this.group));
  }

  // ── Public API ──────────────────────────────────────────────────────
  getHitbox()        { return this.hitbox; }
  getWorldHitboxes() { return this.worlds.map(w => w.hitbox); }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  // ── Update ──────────────────────────────────────────────────────────
  update(time) {
    // Very slow rotation — makes the galaxy feel alive
    this.group.rotation.y += 0.00055;

    // Glow shell pulse
    const pulse = (Math.sin(time * 1.9) + 1) * 0.5;
    this._coreData.shells.forEach((s, i) => {
      const base = [0.42, 0.16, 0.05][i];
      s.material.opacity = base * (0.65 + pulse * 0.70);
    });

    // Particle rotation (slightly faster than group)
    this._particles.rotation.y = time * 0.055;
    this._coreData.coreCloud.rotation.y = time * 0.10;

    this.worlds.forEach(w => w.update(time));
  }
}
