import { useRef, useState, useEffect } from 'react';
import { galaxies as galaxyData } from './config/data.js';
import { t as translate } from './config/i18n.js';
import { useThree } from './hooks/useThree.js';

import LangSwitch from './components/LangSwitch.jsx';
import Overlay    from './components/Overlay.jsx';
import HUD        from './components/HUD.jsx';
import Tooltip    from './components/Tooltip.jsx';
import Modal      from './components/Modal.jsx';

export default function App() {
  const canvasRef = useRef(null);

  const [phase,        setPhase]        = useState('idle');
  const [lang,         setLang]         = useState('en');
  const [activeGalaxy, setActiveGalaxy] = useState(null);
  const [modal,        setModal]        = useState(null);
  const [tooltip,      setTooltip]      = useState({ visible: false, text: '', x: 0, y: 0 });

  const t = key => translate(key, lang);

  // Auto-detect language from IP, fallback to browser language
  useEffect(() => {
    const SUPPORTED = ['en', 'fr', 'it', 'es', 'de', 'pt'];
    const COUNTRY_MAP = {
      FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr',
      IT: 'it', SM: 'it', VA: 'it',
      ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es',
      DE: 'de', AT: 'de',
      PT: 'pt', BR: 'pt',
    };
    fetch('https://ip-api.com/json/?fields=countryCode')
      .then(r => r.json())
      .then(({ countryCode }) => {
        const detected = COUNTRY_MAP[countryCode] ?? 'en';
        setLang(detected);
      })
      .catch(() => {
        const browser = navigator.language?.slice(0, 2).toLowerCase();
        if (SUPPORTED.includes(browser)) setLang(browser);
      });
  }, []);

  const { selectGalaxy, closeGalaxy, navigateToWorld } = useThree(canvasRef, {
    isActive:    phase === 'space',
    lang,
    galaxyData,
    onGalaxyOpen:  data => setActiveGalaxy(data),
    onGalaxyClose: ()   => setActiveGalaxy(null),
    onWorldClick:  data => setModal(data),
    onHover:       (text, x, y) => setTooltip({ visible: true, text, x, y }),
    onHoverEnd:    ()   => setTooltip({ visible: false, text: '', x: 0, y: 0 }),
  });

  function enterSpace() {
    history.pushState({ scene: 'space' }, '');
    setPhase('space');
  }

  function backToLanding() {
    closeGalaxy();
    setActiveGalaxy(null);
    setPhase('idle');
  }

  // Browser back button → landing
  useEffect(() => {
    function onPopState() { backToLanding(); }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="canvas" />
      <LangSwitch lang={lang} onChange={setLang} />

      {phase === 'idle' && (
        <Overlay onEnter={enterSpace} t={t} />
      )}

      {phase === 'space' && (
        <HUD
          activeGalaxy={activeGalaxy}
          galaxies={galaxyData}
          lang={lang}
          onGalaxySelect={selectGalaxy}
          onWorldSelect={navigateToWorld}
          t={t}
        />
      )}

      <Tooltip {...tooltip} />

      {modal && (
        <Modal data={modal} lang={lang} onClose={() => setModal(null)} t={t} />
      )}
    </>
  );
}
