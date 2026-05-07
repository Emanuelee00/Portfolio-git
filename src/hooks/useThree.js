import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { scene, initRenderer, renderer } from '../core/Scene.js';
import { camera, initControls, moveCameraTo, updateCamera, isCameraAnimating } from '../core/Camera.js';
import { setupLights } from '../core/Lights.js';
import { createStars } from '../objects/Stars.js';
import { createNebula } from '../objects/Nebula.js';
import { Galaxy } from '../objects/Galaxy.js';
import { getIntersects } from '../utils/Picker.js';

const HOME_POS    = new THREE.Vector3(0, 6, 28);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

export function useThree(canvasRef, callbacks) {
  const cbRef = useRef(callbacks);
  useEffect(() => { cbRef.current = callbacks; });

  const galaxiesRef     = useRef([]);
  const activeGalaxyRef = useRef(null);
  const stateRef        = useRef('space');

  const selectGalaxyRef    = useRef(() => {});
  const closeGalaxyRef     = useRef(() => {});
  const navigateToWorldRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    initRenderer(canvas);
    initControls(renderer.domElement);

    setupLights();
    createStars();
    createNebula();
    createNebula();

    const galaxies = cbRef.current.galaxyData.map(d => new Galaxy(d));
    galaxiesRef.current = galaxies;

    // ─── Helpers ─────────────────────────────────────────────────────────
    function getClickable() {
      if (stateRef.current === 'galaxy' && activeGalaxyRef.current) {
        return [
          ...activeGalaxyRef.current.getWorldHitboxes(),
          ...galaxies.filter(g => g !== activeGalaxyRef.current).map(g => g.getHitbox()),
        ];
      }
      return galaxies.map(g => g.getHitbox());
    }

    function getAllHoverable() {
      if (stateRef.current === 'galaxy' && activeGalaxyRef.current) {
        return [
          ...activeGalaxyRef.current.getWorldHitboxes(),
          ...galaxies.filter(g => g !== activeGalaxyRef.current).map(g => g.getHitbox()),
        ];
      }
      return galaxies.map(g => g.getHitbox());
    }

    function openGalaxy(galaxy) {
      activeGalaxyRef.current = galaxy;
      stateRef.current = 'galaxy';
      galaxy.open();
      const p = galaxy.group.position;
      moveCameraTo(new THREE.Vector3(p.x, p.y + 4, p.z + 11), p.clone());
      cbRef.current.onGalaxyOpen?.(galaxy.data);
    }

    function closeGalaxy() {
      if (activeGalaxyRef.current) {
        activeGalaxyRef.current.close();
        activeGalaxyRef.current = null;
      }
      stateRef.current = 'space';
      moveCameraTo(HOME_POS.clone(), HOME_TARGET.clone());
      cbRef.current.onGalaxyClose?.();
    }

    function selectGalaxy(id) {
      const target = galaxiesRef.current.find(g => g.data.id === id);
      if (!target) return;
      if (activeGalaxyRef.current) {
        activeGalaxyRef.current.close();
        activeGalaxyRef.current = null;
        stateRef.current = 'space';
      }
      openGalaxy(target);
    }

    function navigateToWorld(galaxyId, worldId) {
      const galaxy = galaxiesRef.current.find(g => g.data.id === galaxyId);
      if (!galaxy) return;

      if (activeGalaxyRef.current !== galaxy) {
        if (activeGalaxyRef.current) activeGalaxyRef.current.close();
        openGalaxy(galaxy);
      }

      const world = galaxy.worlds.find(w => w.data.id === worldId);
      if (!world) return;

      const worldPos = new THREE.Vector3();
      world.mesh.getWorldPosition(worldPos);
      moveCameraTo(
        worldPos.clone().add(new THREE.Vector3(0, 2.5, 5)),
        worldPos.clone()
      );
    }

    selectGalaxyRef.current    = selectGalaxy;
    closeGalaxyRef.current     = closeGalaxy;
    navigateToWorldRef.current = navigateToWorld;

    // ─── Events ───────────────────────────────────────────────────────────
    renderer.domElement.addEventListener('click', e => {
      if (!cbRef.current.isActive) return;
      const hits = getIntersects(e.clientX, e.clientY, getClickable());
      if (!hits.length) return;
      const { type, galaxyRef, worldRef } = hits[0].object.userData;
      if (type === 'galaxy') selectGalaxy(galaxyRef.data.id);
      if (type === 'world') {
        const lang = cbRef.current.lang;
        const galaxyObj = galaxies.find(g => g.worlds.includes(worldRef));
        const galaxyName = galaxyObj
          ? (galaxyObj.data.name[lang] ?? galaxyObj.data.name.en)
          : '';
        cbRef.current.onWorldClick?.({ ...worldRef.data, galaxyName });
      }
    });

    let _mouseX = -9999, _mouseY = -9999, _mouseDirty = false;
    renderer.domElement.addEventListener('mousemove', e => {
      _mouseX = e.clientX; _mouseY = e.clientY; _mouseDirty = true;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ─── Render loop ──────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      galaxies.forEach(g => g.update(time));
      updateCamera();

      if (cbRef.current.isActive && _mouseDirty) {
        _mouseDirty = false;
        const hits = getIntersects(_mouseX, _mouseY, getAllHoverable());
        if (!hits.length) {
          cbRef.current.onHoverEnd?.();
        } else {
          const { type, galaxyRef, worldRef } = hits[0].object.userData;
          const lang = cbRef.current.lang;
          let label = '';
          if (type === 'galaxy' && galaxyRef)
            label = galaxyRef.data.name[lang] ?? galaxyRef.data.name.en;
          if (type === 'world' && worldRef)
            label = worldRef.data.name[lang] ?? worldRef.data.name.en;
          cbRef.current.onHover?.(label, _mouseX, _mouseY);
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      // Clear scene to prevent object doubling on HMR reload
      while (scene.children.length > 0) scene.remove(scene.children[0]);
      renderer?.dispose();
    };
  }, []);

  return {
    selectGalaxy:    id           => selectGalaxyRef.current(id),
    closeGalaxy:     ()           => closeGalaxyRef.current(),
    navigateToWorld: (gId, wId)   => navigateToWorldRef.current(gId, wId),
  };
}
