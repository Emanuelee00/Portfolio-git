import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer } from './Scene.js';

export const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 6, 28);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping   = true;
controls.dampingFactor   = 0.06;
controls.enableZoom      = true;
controls.minDistance     = 4;
controls.maxDistance     = 55;
controls.enablePan       = false;
controls.autoRotate      = false;

// ─── Smooth camera animation ──────────────────────────────────────────
const _targetPos    = new THREE.Vector3(0, 6, 28);
const _targetLookAt = new THREE.Vector3(0, 0, 0);
let   _animating    = false;
let   _onComplete   = null;

export function moveCameraTo(position, lookAt, onComplete = null) {
  _targetPos.copy(position);
  _targetLookAt.copy(lookAt);
  _animating   = true;
  _onComplete  = onComplete;
  controls.enabled = false;
}

export function updateCamera() {
  if (_animating) {
    camera.position.lerp(_targetPos, 0.045);
    controls.target.lerp(_targetLookAt, 0.045);

    if (camera.position.distanceTo(_targetPos) < 0.08) {
      camera.position.copy(_targetPos);
      controls.target.copy(_targetLookAt);
      _animating = false;
      controls.enabled = true;
      // Zero residual damping velocity so controls don't snap back
      controls.enableDamping = false;
      controls.update();
      controls.enableDamping = true;
      if (_onComplete) { _onComplete(); _onComplete = null; }
    }
    // Skip controls.update() during lerp — prevents it from fighting the animation
    return;
  }
  controls.update();
}
