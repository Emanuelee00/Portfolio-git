import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 6, 28);

let _controls = null;

export function initControls(domElement) {
  _controls = new OrbitControls(camera, domElement);
  _controls.enableDamping = true;
  _controls.dampingFactor = 0.06;
  _controls.enableZoom    = true;
  _controls.minDistance   = 4;
  _controls.maxDistance   = 55;
  _controls.enablePan     = false;
  _controls.autoRotate    = false;
  return _controls;
}

const _targetPos    = new THREE.Vector3(0, 6, 28);
const _targetLookAt = new THREE.Vector3(0, 0, 0);
let   _animating    = false;
let   _onComplete   = null;

export function moveCameraTo(position, lookAt, onComplete = null) {
  _targetPos.copy(position);
  _targetLookAt.copy(lookAt);
  _animating  = true;
  _onComplete = onComplete;
  if (_controls) _controls.enabled = false;
}

export function updateCamera() {
  if (_animating) {
    camera.position.lerp(_targetPos, 0.045);
    if (_controls) _controls.target.lerp(_targetLookAt, 0.045);

    if (camera.position.distanceTo(_targetPos) < 0.08) {
      camera.position.copy(_targetPos);
      if (_controls) {
        _controls.target.copy(_targetLookAt);
        _controls.enabled = true;
        _controls.enableDamping = false;
        _controls.update();
        _controls.enableDamping = true;
      }
      _animating = false;
      if (_onComplete) { _onComplete(); _onComplete = null; }
    }
    return;
  }
  if (_controls) _controls.update();
}
