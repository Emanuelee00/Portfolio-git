import * as THREE from 'three';
import { camera } from '../core/Camera.js';

const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2();

export function getIntersects(clientX, clientY, objects) {
  mouse.x =  (clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(objects, true);
}
