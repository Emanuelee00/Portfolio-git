export default function Modal({ data, lang, onClose, t }) {
  const { name, description, tech = [], github, demo, color, galaxyName } = data;
  const hex = color ? '#' + color.toString(16).padStart(6, '0') : '#4f8fff';
  const label = typeof name === 'object' ? (name[lang] ?? name.en) : name;
  const desc  = typeof description === 'object' ? (description[lang] ?? description.en) : description;

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <button className="modal-close" aria-label={t('close')} onClick={onClose}>✕</button>
        <div className="modal-header">
          <div className="planet-icon" style={{ background: hex, boxShadow: `0 0 20px ${hex}` }} />
          <div>
            <h2>{label}</h2>
            {galaxyName && <p className="modal-galaxy">{galaxyName}</p>}
          </div>
        </div>
        <p>{desc}</p>
        <div className="tech-tags">
          {tech.map(tag => <span key={tag} className="tech-tag">{tag}</span>)}
        </div>
        <div className="modal-links">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6, verticalAlign: -2 }}>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="btn-primary">{t('live')}</a>
          )}
        </div>
      </div>
    </div>
  );
}
