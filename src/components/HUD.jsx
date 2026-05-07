import GalaxyNav from './GalaxyNav';

export default function HUD({ activeGalaxy, galaxies, lang, onBack, onGalaxySelect, t }) {
  return (
    <div className="hud">
      <div className="hud-left">
        {activeGalaxy && (
          <button className="back-btn" onClick={onBack}>{t('back')}</button>
        )}
        <GalaxyNav galaxies={galaxies} lang={lang} onSelect={onGalaxySelect} t={t} />
      </div>
      {activeGalaxy && (
        <div className="galaxy-label">
          {activeGalaxy.name[lang] ?? activeGalaxy.name.en}
        </div>
      )}
    </div>
  );
}
