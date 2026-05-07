import { useState, useEffect, useRef } from 'react';

export default function GalaxyNav({ galaxies, lang, onGalaxySelect, onWorldSelect, t }) {
  const [open,     setOpen]     = useState(true);
  const [expanded, setExpanded] = useState(
    () => Object.fromEntries(galaxies.map(g => [g.id, true]))
  );
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  function toggleFolder(id, e) {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    onGalaxySelect(id);
  }

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
            const hex   = '#' + g.color.toString(16).padStart(6, '0');
            const label = g.name[lang] ?? g.name.en;
            const isExp = !!expanded[g.id];

            return (
              <li key={g.id}>
                <button
                  className="galaxy-nav-item galaxy-nav-folder"
                  onClick={e => toggleFolder(g.id, e)}
                >
                  <span className="galaxy-nav-dot" style={{ background: hex, boxShadow: `0 0 6px ${hex}` }} />
                  <span className="galaxy-nav-folder-label">{label}</span>
                  <svg className={`galaxy-nav-chevron galaxy-nav-folder-chevron${isExp ? ' open' : ''}`} width="10" height="10" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </button>

                {isExp && (
                  <ul className="galaxy-nav-sublist">
                    {g.worlds.map(w => (
                      <li key={w.id}>
                        <button
                          className="galaxy-nav-subitem"
                          onClick={e => { e.stopPropagation(); onWorldSelect(g.id, w.id); }}
                        >
                          <span className="galaxy-nav-subdot" style={{ background: hex }} />
                          <span>{w.name[lang] ?? w.name.en}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
