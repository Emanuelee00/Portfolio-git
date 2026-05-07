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

const _animStart     = new THREE.Vector3();
const _arcMid        = new THREE.Vector3();
const _targetPos     = new THREE.Vector3(0, 6, 28);
const _targetLookAt  = new THREE.Vector3(0, 0, 0);
const _lookAtStart   = new THREE.Vector3(0, 0, 0);
const _lookAtCurrent = new THREE.Vector3(0, 0, 0);
let   _animating     = false;
let   _animT         = 0;
let   _onComplete    = null;

export function isCameraAnimating() { return _animating; }

export function moveCameraTo(position, lookAt, onComplete = null) {
  _animStart.copy(camera.position);
  // start look-at from wherever the camera is currently pointing
  _lookAtStart.copy(_lookAtCurrent);
  _targetPos.copy(position);
  _targetLookAt.copy(lookAt);
  _animT      = 0;
  _animating  = true;
  _onComplete = onComplete;
  if (_controls) {
    _controls.enableDamping = false;
    _controls.update();
    _controls.enableDamping = true;
    _controls.target.copy(lookAt);
    _controls.enabled = false;
  }
}

export function updateCamera() {
  if (_animating) {
    _animT = Math.min(1, _animT + 0.011);

    // ease-in-out
    const t = _animT < 0.5
      ? 2 * _animT * _animT
      : 1 - Math.pow(-2 * _animT + 2, 2) / 2;

    // quadratic bezier arc: control point lifted above midpoint
    _arcMid.lerpVectors(_animStart, _targetPos, 0.5);
    _arcMid.y += 7;

    camera.position.set(
      (1-t)*(1-t)*_animStart.x + 2*(1-t)*t*_arcMid.x + t*t*_targetPos.x,
      (1-t)*(1-t)*_animStart.y + 2*(1-t)*t*_arcMid.y + t*t*_targetPos.y,
      (1-t)*(1-t)*_animStart.z + 2*(1-t)*t*_arcMid.z + t*t*_targetPos.z
    );

    // smooth look-at: interpolate from start orientation to target
    _lookAtCurrent.lerpVectors(_lookAtStart, _targetLookAt, t);
    camera.lookAt(_lookAtCurrent);

    if (_animT >= 1) {
      camera.position.copy(_targetPos);
      _lookAtCurrent.copy(_targetLookAt);
      if (_controls) {
        _controls.target.copy(_targetLookAt);
        _controls.enabled = true;
        _controls.update();
      }
      _animating = false;
      if (_onComplete) { _onComplete(); _onComplete = null; }
    }
    return;
  }
  // track where controls are pointing so next animation starts from here
  if (_controls) {
    _lookAtCurrent.copy(_controls.target);
    _controls.update();
  }
}
