import * as THREE from 'three';

import { scene, renderer }               from './core/Scene.js';
import { camera, moveCameraTo, updateCamera } from './core/Camera.js';
import { setupLights }                   from './core/Lights.js';
import { createStars }                   from './objects/Stars.js';
import { createNebula }                  from './objects/Nebula.js';
import { Galaxy }                        from './objects/Galaxy.js';
import { galaxies as galaxyData }        from './config/data.js';
import { i18n }                          from './config/i18n.js';
import { getIntersects }                 from './utils/Picker.js';
import {
  initUI, showHUD, hideHUD, hideOverlay, showOverlay,
  showBackBtn, hideBackBtn,
  showTooltip, hideTooltip,
  showModal, setCursor, onLangChange,
  initGalaxyNav, updateGalaxyNavLang
} from './ui/UI.js';

// ─── State ─────────────────────────────────────────────────────────────
const STATE = { SPACE: 'space', GALAXY: 'galaxy' };
let state         = STATE.SPACE;
let activeGalaxy  = null;
let isSpaceActive = false;

// ─── Scene setup ───────────────────────────────────────────────────────
setupLights();
createStars();
createNebula();
createNebula();

const galaxies = galaxyData.map(d => new Galaxy(d));

// ─── Camera home position ──────────────────────────────────────────────
const HOME_POS    = new THREE.Vector3(0, 6, 28);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

// ─── Helpers ───────────────────────────────────────────────────────────
function getClickable() {
  if (!isSpaceActive) return [];
  if (state === STATE.GALAXY && activeGalaxy)
    return [
      ...activeGalaxy.getWorldHitboxes(),
      ...galaxies.filter(g => g !== activeGalaxy).map(g => g.getHitbox())
    ];
  return galaxies.map(g => g.getHitbox());
}

function getAllHoverable() {
  if (state === STATE.GALAXY && activeGalaxy) {
    return [
      ...activeGalaxy.getWorldHitboxes(),
      ...galaxies.filter(g => g !== activeGalaxy).map(g => g.getHitbox())
    ];
  }
  return galaxies.map(g => g.getHitbox());
}

// ─── Galaxy open / close ───────────────────────────────────────────────
function openGalaxy(galaxy) {
  activeGalaxy = galaxy;
  state        = STATE.GALAXY;
  galaxy.open();

  const p     = galaxy.group.position;
  const camTo = new THREE.Vector3(p.x, p.y + 4, p.z + 11);
  moveCameraTo(camTo, p.clone());

  const label = galaxy.data.name[i18n.lang] ?? galaxy.data.name.it;
  showBackBtn(label);
}

function closeGalaxy() {
  if (activeGalaxy) { activeGalaxy.close(); activeGalaxy = null; }
  state = STATE.SPACE;
  hideBackBtn();
  moveCameraTo(HOME_POS.clone(), HOME_TARGET.clone());
}

function openWorld(world) {
  const galaxy   = galaxies.find(g => g.worlds.includes(world));
  const galLabel = galaxy
    ? (galaxy.data.name[i18n.lang] ?? galaxy.data.name.it)
    : '';
  showModal(world.data, galLabel);
}

// ─── Events: click ────────────────────────────────────────────────────
renderer.domElement.addEventListener('click', e => {
  const hits = getIntersects(e.clientX, e.clientY, getClickable());
  if (!hits.length) return;

  const { type, galaxyRef, worldRef } = hits[0].object.userData;
  if (type === 'galaxy') onGalaxySelect(galaxyRef.data.id);
  if (type === 'world')  openWorld(worldRef);
});

// ─── Mouse position tracking (hover resolved in animation loop) ───────
let _mouseX = -9999, _mouseY = -9999, _mouseDirty = false;
renderer.domElement.addEventListener('mousemove', e => {
  _mouseX = e.clientX; _mouseY = e.clientY; _mouseDirty = true;
});

// ─── Events: resize ───────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Galaxy nav select handler ────────────────────────────────────────
function onGalaxySelect(id) {
  const target = galaxies.find(g => g.data.id === id);
  if (!target) return;
  // Close current galaxy without flying home first (avoids double moveCameraTo)
  if (activeGalaxy) {
    activeGalaxy.close();
    activeGalaxy = null;
    state = STATE.SPACE;
  }
  openGalaxy(target);
}

// ─── UI callbacks ────────────────────────────────────────────────────
initUI({
  onEnter() {
    hideOverlay();
    showHUD();
    isSpaceActive = true;
  },
  onBack() {
    closeGalaxy();
    showOverlay();
    hideHUD();
    isSpaceActive = false;
  }
});

initGalaxyNav(galaxyData, onGalaxySelect);

// ─── Language change ──────────────────────────────────────────────────
onLangChange(() => {
  if (state === STATE.GALAXY && activeGalaxy) {
    const label = activeGalaxy.data.name[i18n.lang] ?? activeGalaxy.data.name.en;
    showBackBtn(label);
  }
  updateGalaxyNavLang(onGalaxySelect);
});

// ─── Render loop ──────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  galaxies.forEach(g => g.update(time));
  updateCamera();

  // Hover check once per frame instead of every mousemove event
  if (isSpaceActive && _mouseDirty) {
    _mouseDirty = false;
    const hits = getIntersects(_mouseX, _mouseY, getAllHoverable());
    if (!hits.length) { hideTooltip(); setCursor(false); }
    else {
      const { type, galaxyRef, worldRef } = hits[0].object.userData;
      let label = '';
      if (type === 'galaxy' && galaxyRef)
        label = galaxyRef.data.name[i18n.lang] ?? galaxyRef.data.name.en;
      if (type === 'world' && worldRef)
        label = worldRef.data.name[i18n.lang] ?? worldRef.data.name.en;
      showTooltip(label, _mouseX, _mouseY);
      setCursor(true);
    }
  }

  renderer.render(scene, camera);
}

animate();
