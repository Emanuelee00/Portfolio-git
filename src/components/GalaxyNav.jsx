import { useState, useEffect, useRef } from 'react';

export default function GalaxyNav({ galaxies, lang, onSelect, t }) {
  const [open, setOpen] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="galaxy-nav" ref={ref}>
      <button
        className={`galaxy-nav-btn${open ? ' open' : ''}`}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
      >
        <span>{t('galaxies')}</span>
        <svg className="galaxy-nav-chevron" width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
      {open && (
        <ul className="galaxy-nav-list">
          {galaxies.map(g => {
            const hex = '#' + g.color.toString(16).padStart(6, '0');
            const label = g.name[lang] ?? g.name.en;
            return (
              <li key={g.id}>
                <button
                  className="galaxy-nav-item"
                  onClick={() => { setOpen(false); onSelect(g.id); }}
                >
                  <span className="galaxy-nav-dot" style={{ background: hex, boxShadow: `0 0 6px ${hex}` }} />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
