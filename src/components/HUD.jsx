import GalaxyNav from './GalaxyNav';

export default function HUD({ activeGalaxy, galaxies, lang, onGalaxySelect, onWorldSelect, t }) {
  return (
    <div className="hud">
      <div className="hud-left">
        <GalaxyNav galaxies={galaxies} lang={lang} onGalaxySelect={onGalaxySelect} onWorldSelect={onWorldSelect} t={t} />
      </div>
      {activeGalaxy && (
        <div className="galaxy-label">
          {activeGalaxy.name[lang] ?? activeGalaxy.name.en}
        </div>
      )}
    </div>
  );
}
