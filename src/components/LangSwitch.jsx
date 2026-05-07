import { useState, useEffect, useRef } from 'react';
import { LANGS } from '../config/i18n.js';

export default function LangSwitch({ lang, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  return (
    <div className="lang-switch" ref={ref}>
      <button
        className="lang-switch-btn"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>{lang.toUpperCase()}</span>
      </button>

      {open && (
        <ul className="lang-dropdown">
          {LANGS.map(l => (
            <li key={l.code}>
              <button
                className={`lang-option${lang === l.code ? ' active' : ''}`}
                onClick={() => { onChange(l.code); setOpen(false); }}
              >
                <span className="lang-option-code">{l.code.toUpperCase()}</span>
                <span className="lang-option-label">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
