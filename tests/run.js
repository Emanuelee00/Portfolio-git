#!/usr/bin/env node
// Test suite: verifica struttura file, HTML e contenuto moduli
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf-8');
const exists = f => fs.existsSync(path.join(ROOT, f));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌  ${name}`);
    console.log(`       → ${e.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// ─── File existence ───────────────────────────────────────────────────
console.log('\n📁  File existence\n');

const requiredFiles = [
  'index.html',
  'style.css',
  'js/main.js',
  'js/config/data.js',
  'js/config/i18n.js',
  'js/core/Scene.js',
  'js/core/Camera.js',
  'js/core/Lights.js',
  'js/objects/Stars.js',
  'js/objects/Galaxy.js',
  'js/objects/World.js',
  'js/ui/UI.js',
  'js/utils/Picker.js'
];

requiredFiles.forEach(f => {
  test(`Exists: ${f}`, () => assert(exists(f), `File not found: ${f}`));
});

// ─── HTML structure ───────────────────────────────────────────────────
console.log('\n🧱  HTML structure\n');

test('canvas#canvas exists', () => assert(read('index.html').includes('id="canvas"'), 'Missing canvas'));
test('overlay exists', ()     => assert(read('index.html').includes('id="overlay"'), 'Missing overlay'));
test('hud exists', ()         => assert(read('index.html').includes('id="hud"'), 'Missing hud'));
test('modal exists', ()       => assert(read('index.html').includes('id="modal"'), 'Missing modal'));
test('enter-btn exists', ()   => assert(read('index.html').includes('id="enter-btn"'), 'Missing enter-btn'));
test('back-btn exists', ()    => assert(read('index.html').includes('id="back-btn"'), 'Missing back-btn'));
test('modal-close exists', () => assert(read('index.html').includes('id="modal-close"'), 'Missing modal-close'));
test('lang-btn exists', ()    => assert(read('index.html').includes('lang-btn'), 'Missing language buttons'));
test('FR lang button',        () => assert(read('index.html').includes('data-lang="fr"'), 'Missing FR lang button'));
test('EN lang button',        () => assert(read('index.html').includes('data-lang="en"'), 'Missing EN lang button'));
test('IT lang button',        () => assert(read('index.html').includes('data-lang="it"'), 'Missing IT lang button'));
test('EN is default active',  () => assert(/<button class="lang-btn active" data-lang="en"/.test(read('index.html')), 'EN must be default active'));
test('html lang="en"',        () => assert(read('index.html').includes('<html lang="en"'), 'html lang must be en'));
test('data-i18n attributes',  () => assert(read('index.html').includes('data-i18n'), 'Missing i18n attributes'));
test('js/main.js script tag', () => assert(read('index.html').includes('js/main.js'), 'Missing main.js script'));
test('style.css link', ()     => assert(read('index.html').includes('style.css'), 'Missing style.css link'));
test('importmap present',     () => assert(read('index.html').includes('type="importmap"'), 'Missing importmap'));
test('importmap maps three',  () => assert(read('index.html').includes('"three"'), 'importmap must map "three"'));
test('importmap maps addons', () => assert(read('index.html').includes('"three/addons/"'), 'importmap must map three/addons/'));

// ─── CSS ─────────────────────────────────────────────────────────────
console.log('\n🎨  CSS\n');

test('CSS --bg variable',        () => assert(read('style.css').includes('--bg'), 'Missing --bg'));
test('CSS .overlay',             () => assert(read('style.css').includes('.overlay'), 'Missing .overlay'));
test('CSS .modal',               () => assert(read('style.css').includes('.modal'), 'Missing .modal'));
test('CSS .btn-primary',         () => assert(read('style.css').includes('.btn-primary'), 'Missing .btn-primary'));
test('CSS .lang-btn',            () => assert(read('style.css').includes('.lang-btn'), 'Missing .lang-btn'));
test('CSS @keyframes fadeInUp',  () => assert(read('style.css').includes('fadeInUp'), 'Missing fadeInUp keyframe'));
test('CSS .hidden utility',      () => assert(read('style.css').includes('.hidden'), 'Missing .hidden'));

// ─── i18n ─────────────────────────────────────────────────────────────
console.log('\n🌐  i18n\n');

test('Has Italian translations',  () => assert(/['"]?it['"]?\s*:/.test(read('js/config/i18n.js')), 'Missing IT lang'));
test('Has English translations',  () => assert(/['"]?en['"]?\s*:/.test(read('js/config/i18n.js')), 'Missing EN lang'));
test('Has French translations',   () => assert(/['"]?fr['"]?\s*:/.test(read('js/config/i18n.js')), 'Missing FR lang'));
test('Default lang is English',   () => assert(read('js/config/i18n.js').includes("lang: 'en'"), "Default lang must be 'en'"));
test('Exports i18n object',       () => assert(read('js/config/i18n.js').includes('export const i18n'), 'Missing i18n export'));
test('Has t() method',            () => assert(read('js/config/i18n.js').includes('t(key)') || read('js/config/i18n.js').includes('t (key)'), 'Missing t()'));
test('Has setLang() method',      () => assert(read('js/config/i18n.js').includes('setLang'), 'Missing setLang()'));
test('Has applyToDOM() method',   () => assert(read('js/config/i18n.js').includes('applyToDOM'), 'Missing applyToDOM()'));
test('Fallback to English',       () => assert(read('js/config/i18n.js').includes('translations.en'), 'Missing English fallback'));

// ─── data.js ──────────────────────────────────────────────────────────
console.log('\n📊  data.js\n');

const data = read('js/config/data.js');
test('Exports galaxies array',  () => assert(data.includes('export const galaxies'), 'Missing galaxies export'));
test('Has at least 2 galaxies', () => assert((data.match(/id:/g) || []).length >= 2, 'Need at least 2 galaxies'));
test('Has worlds field',        () => assert(data.includes('worlds'), 'Missing worlds'));
test('Has github links',        () => assert(data.includes('github'), 'Missing github'));
test('Has orbitRadius',         () => assert(data.includes('orbitRadius'), 'Missing orbitRadius'));
test('Has IT names',            () => assert(/['"]?it['"]?\s*:/.test(data), 'Missing IT names in data'));
test('Has EN names',            () => assert(/['"]?en['"]?\s*:/.test(data), 'Missing EN names in data'));
test('Has FR names',            () => assert(/['"]?fr['"]?\s*:/.test(data), 'Missing FR names in data'));

// ─── Classes ──────────────────────────────────────────────────────────
console.log('\n🏗️   Classes\n');

test('Galaxy class exported',  () => assert(read('js/objects/Galaxy.js').includes('export class Galaxy'), 'Missing Galaxy export'));
test('World class exported',   () => assert(read('js/objects/World.js').includes('export class World'), 'Missing World export'));
test('Galaxy has open()',      () => assert(read('js/objects/Galaxy.js').includes('open()'), 'Missing Galaxy.open()'));
test('Galaxy has close()',     () => assert(read('js/objects/Galaxy.js').includes('close()'), 'Missing Galaxy.close()'));
test('Galaxy has update()',    () => assert(read('js/objects/Galaxy.js').includes('update(time)'), 'Missing Galaxy.update()'));
test('World has update()',     () => assert(read('js/objects/World.js').includes('update(time)'), 'Missing World.update()'));
test('World has setVisible()', () => assert(read('js/objects/World.js').includes('setVisible'), 'Missing World.setVisible()'));
test('World has hitbox',       () => assert(read('js/objects/World.js').includes('this.hitbox'), 'Missing World hitbox'));

// ─── UI & Utils ───────────────────────────────────────────────────────
console.log('\n🖥️   UI & Utils\n');

test('UI exports showModal',   () => assert(read('js/ui/UI.js').includes('showModal'), 'Missing showModal'));
test('UI exports initUI',      () => assert(read('js/ui/UI.js').includes('export function initUI'), 'Missing initUI export'));
test('UI exports showTooltip', () => assert(read('js/ui/UI.js').includes('showTooltip'), 'Missing showTooltip'));
test('Picker exports getIntersects', () => assert(read('js/utils/Picker.js').includes('export function getIntersects'), 'Missing getIntersects'));

// ─── main.js ──────────────────────────────────────────────────────────
console.log('\n⚙️   main.js\n');

const main = read('js/main.js');
test('Has requestAnimationFrame', () => assert(main.includes('requestAnimationFrame'), 'Missing animation loop'));
test('Has STATE machine',         () => assert(main.includes('STATE'), 'Missing STATE machine'));
test('Imports Galaxy',            () => assert(main.includes("from './objects/Galaxy.js'"), 'Missing Galaxy import'));
test('Imports UI',                () => assert(main.includes("from './ui/UI.js'"), 'Missing UI import'));
test('Handles click event',       () => assert(main.includes("'click'"), 'Missing click listener'));
test('Handles resize event',      () => assert(main.includes("'resize'"), 'Missing resize listener'));

// ─── Imports (bare specifiers, no raw CDN URLs) ───────────────────────
console.log('\n📦  Imports\n');

const jsFiles = [
  'js/main.js', 'js/core/Scene.js', 'js/core/Camera.js', 'js/core/Lights.js',
  'js/objects/Stars.js', 'js/objects/Galaxy.js', 'js/objects/World.js', 'js/utils/Picker.js'
];
jsFiles.forEach(f => {
  test(`No raw CDN URL in ${f}`, () =>
    assert(!read(f).includes('cdn.jsdelivr.net'), `${f} must use bare specifier, not CDN URL`)
  );
});
test('Camera uses three/addons/ for OrbitControls', () =>
  assert(read('js/core/Camera.js').includes("from 'three/addons/controls/OrbitControls.js'"), 'Missing three/addons import')
);

// ─── Obsolete files removed ───────────────────────────────────────────
console.log('\n🗑️   Obsolete files removed\n');

const obsolete = [
  'js/three.js', 'js/ship/Ship.js', 'js/scene.js', 'js/camera.js',
  'js/renderer.js', 'js/lights.js', 'js/animate.js', 'style1.css'
];
obsolete.forEach(f => {
  test(`Removed: ${f}`, () =>
    assert(!exists(f), `File ${f} should be deleted`)
  );
});

// ─── Summary ──────────────────────────────────────────────────────────
const total = passed + failed;
console.log(`\n${'─'.repeat(50)}`);
console.log(`📊  ${passed}/${total} tests passed\n`);

if (failed > 0) {
  console.log(`❌  ${failed} test(s) failed — vedi sopra per dettagli\n`);
  process.exit(1);
} else {
  console.log('✅  Tutti i test sono passati! Pronto per il deploy su Vercel.\n');
}
