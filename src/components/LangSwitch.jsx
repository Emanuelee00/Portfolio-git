export default function LangSwitch({ lang, onChange }) {
  const langs = ['en', 'fr', 'it'];
  return (
    <div className="lang-switch">
      {langs.map((l, i) => (
        <span key={l} style={{ display: 'contents' }}>
          {i > 0 && <span>/</span>}
          <button
            className={`lang-btn${lang === l ? ' active' : ''}`}
            onClick={() => onChange(l)}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
