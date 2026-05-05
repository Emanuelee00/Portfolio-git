const translations = {
  en: {
    badge:       'Developer',
    subtitle:    'Full Stack Developer & Creative Coder',
    description: 'Each galaxy is a collection of projects. Navigate through space and discover my digital universe.',
    explore:     'Explore the Universe',
    hint:        'Click on galaxies to explore',
    back:        '← Back',
    live:        'Live Demo',
    close:       'Close',
    galaxies:    'Galaxies',
    dev_notice:  'Some galaxies are still under development'
  },
  fr: {
    badge:       'Développeur',
    subtitle:    'Développeur Full Stack & Codeur Créatif',
    description: 'Chaque galaxie est un ensemble de projets. Naviguez dans l\'espace et découvrez mon univers numérique.',
    explore:     'Explorer l\'Univers',
    hint:        'Cliquez sur les galaxies pour explorer',
    back:        '← Retour',
    live:        'Démo en direct',
    close:       'Fermer',
    galaxies:    'Galaxies',
    dev_notice:  'Certaines galaxies sont encore en développement'
  },
  it: {
    badge:       'Developer',
    subtitle:    'Full Stack Developer & Creative Coder',
    description: 'Ogni galassia è un insieme di progetti. Naviga nello spazio e scopri il mio universo digitale.',
    explore:     "Esplora l'Universo",
    hint:        'Clicca sulle galassie per esplorare',
    back:        '← Indietro',
    live:        'Live Demo',
    close:       'Chiudi',
    galaxies:    'Galassie',
    dev_notice:  'Alcune galassie sono ancora in fase di sviluppo'
  }
};

export const i18n = {
  lang: 'en',

  t(key) {
    return translations[this.lang]?.[key] ?? translations.en[key] ?? key;
  },

  setLang(lang) {
    if (translations[lang]) this.lang = lang;
  },

  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = this.t(key);
      if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', val);
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
    document.documentElement.lang = this.lang;
  }
};
