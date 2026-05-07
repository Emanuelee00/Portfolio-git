import * as THREE from 'three';
import { scene } from './Scene.js';

export function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.08);
  scene.add(ambient);

  const blue = new THREE.PointLight(0x4f8fff, 3, 80);
  blue.position.set(-12, 10, 10);
  scene.add(blue);

  const purple = new THREE.PointLight(0xa855f7, 2, 80);
  purple.position.set(12, -5, 5);
  scene.add(purple);

  const orange = new THREE.PointLight(0xff6b35, 1.5, 60);
  orange.position.set(0, 8, -15);
  scene.add(orange);
}
