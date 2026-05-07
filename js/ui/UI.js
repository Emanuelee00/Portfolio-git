import { i18n } from '../config/i18n.js';

// ─── Element refs ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const els = {
  overlay:       $('overlay'),
  hud:           $('hud'),
  backBtn:       $('back-btn'),
  galaxyLabel:   $('galaxy-label'),
  tooltip:       $('tooltip'),
  modal:         $('modal'),
  modalClose:    $('modal-close'),
  modalTitle:    $('modal-title'),
  modalGalaxy:   $('modal-galaxy'),
  modalDesc:     $('modal-desc'),
  modalTags:     $('modal-tags'),
  modalIcon:     $('modal-icon'),
  modalGithub:   $('modal-github'),
  modalDemo:     $('modal-demo'),
  canvas:        $('canvas'),
  enterBtn:      $('enter-btn'),
  galaxyNav:     $('galaxy-nav'),
  galaxyNavBtn:  $('galaxy-nav-btn'),
  galaxyNavList: $('galaxy-nav-list')
};

// ─── Language switcher ─────────────────────────────────────────────────
let _onLangChange = null;

function bindLangSwitchers() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      i18n.setLang(btn.dataset.lang);
      document.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.lang === i18n.lang)
      );
      i18n.applyToDOM();
      if (_onLangChange) _onLangChange(i18n.lang);
    });
  });
}

export function onLangChange(cb) { _onLangChange = cb; }

// ─── Overlay ────────────────────────────────────────────────────────────
export function showOverlay() {
  els.overlay.classList.remove('hidden', 'fade-out');
}
export function hideOverlay()  {
  els.overlay.classList.add('fade-out');
  setTimeout(() => els.overlay.classList.add('hidden'), 600);
}

// ─── HUD ───────────────────────────────────────────────────────────────
export function showHUD()  {
  els.hud.classList.remove('hidden');
  setTimeout(() => openGalaxyNavDropdown(), 0);
}
export function hideHUD()  { els.hud.classList.add('hidden'); }

export function showBackBtn(label) {
  els.backBtn.classList.remove('hidden');
  els.galaxyLabel.classList.remove('hidden');
  els.galaxyLabel.textContent = label;
}
export function hideBackBtn()  {
  els.backBtn.classList.add('hidden');
  els.galaxyLabel.classList.add('hidden');
}

// ─── Tooltip ───────────────────────────────────────────────────────────
export function showTooltip(text, x, y) {
  els.tooltip.textContent = text;
  els.tooltip.style.left  = `${x + 18}px`;
  els.tooltip.style.top   = `${y - 12}px`;
  els.tooltip.classList.add('visible');
}
export function hideTooltip() { els.tooltip.classList.remove('visible'); }

// ─── Cursor ─────────────────────────────────────────────────────────────
export function setCursor(pointer) {
  els.canvas.style.cursor = pointer ? 'pointer' : 'default';
}

// ─── Modal ─────────────────────────────────────────────────────────────
export function showModal(worldData, galaxyName) {
  const lang = i18n.lang;
  els.modalTitle.textContent  = worldData.name[lang]        ?? worldData.name.en;
  els.modalDesc.textContent   = worldData.description[lang] ?? worldData.description.en;
  els.modalGalaxy.textContent = galaxyName;

  const hex = '#' + worldData.color.toString(16).padStart(6, '0');
  els.modalIcon.style.background = hex;
  els.modalIcon.style.boxShadow  = `0 0 18px ${hex}80`;

  els.modalTags.innerHTML = (worldData.tech ?? [])
    .map(t => `<span class="tech-tag">${t}</span>`)
    .join('');

  els.modalGithub.href = worldData.github ?? '#';

  if (worldData.demo) {
    els.modalDemo.href = worldData.demo;
    els.modalDemo.classList.remove('hidden');
    els.modalDemo.textContent = i18n.t('live');
  } else {
    els.modalDemo.classList.add('hidden');
  }

  els.modal.classList.remove('hidden');
}
export function hideModal() { els.modal.classList.add('hidden'); }

// ─── Galaxy Nav ─────────────────────────────────────────────────────────
let _galaxyNavData = [];

function renderGalaxyNavItems(onSelect) {
  els.galaxyNavList.innerHTML = _galaxyNavData.map(g => {
    const hex = '#' + g.color.toString(16).padStart(6, '0');
    const label = g.name[i18n.lang] ?? g.name.en;
    return `<li>
      <button class="galaxy-nav-item" data-galaxy-id="${g.id}">
        <span class="galaxy-nav-dot" style="background:${hex};box-shadow:0 0 6px ${hex}"></span>
        <span>${label}</span>
      </button>
    </li>`;
  }).join('');

  els.galaxyNavList.querySelectorAll('.galaxy-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      closeGalaxyNavDropdown();
      onSelect(item.dataset.galaxyId);
    });
  });
}

function openGalaxyNavDropdown() {
  els.galaxyNavList.classList.remove('hidden');
  els.galaxyNavBtn.classList.add('open');
}

function closeGalaxyNavDropdown() {
  els.galaxyNavList.classList.add('hidden');
  els.galaxyNavBtn.classList.remove('open');
}

export function initGalaxyNav(galaxyData, onSelect) {
  _galaxyNavData = galaxyData;
  renderGalaxyNavItems(onSelect);

  els.galaxyNavBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !els.galaxyNavList.classList.contains('hidden');
    isOpen ? closeGalaxyNavDropdown() : openGalaxyNavDropdown();
  });

  document.addEventListener('click', e => {
    if (!els.galaxyNav.contains(e.target)) closeGalaxyNavDropdown();
  });
}

export function updateGalaxyNavLang(onSelect) {
  renderGalaxyNavItems(onSelect);
}

// ─── Init ──────────────────────────────────────────────────────────────
export function initUI({ onEnter, onBack }) {
  bindLangSwitchers();
  i18n.applyToDOM();

  els.enterBtn.addEventListener('click', onEnter);
  els.backBtn.addEventListener('click', onBack);
  els.modalClose.addEventListener('click', hideModal);
  els.modal.addEventListener('click', e => { if (e.target === els.modal) hideModal(); });
}
