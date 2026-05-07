import { useRef, useState } from 'react';
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

  const [phase,        setPhase]        = useState('idle');   // idle | space
  const [lang,         setLang]         = useState('en');
  const [activeGalaxy, setActiveGalaxy] = useState(null);     // galaxy data object
  const [modal,        setModal]        = useState(null);     // project data
  const [tooltip,      setTooltip]      = useState({ visible: false, text: '', x: 0, y: 0 });

  const t = key => translate(key, lang);

  const { selectGalaxy, closeGalaxy } = useThree(canvasRef, {
    isActive:    phase === 'space',
    lang,
    galaxyData,
    onGalaxyOpen:  data  => setActiveGalaxy(data),
    onGalaxyClose: ()    => setActiveGalaxy(null),
    onWorldClick:  data  => setModal(data),
    onHover:       (text, x, y) => setTooltip({ visible: true,  text, x, y }),
    onHoverEnd:    ()    => setTooltip({ visible: false, text: '', x: 0, y: 0 }),
  });

  function handleBack() {
    closeGalaxy();
  }

  return (
    <>
      <canvas ref={canvasRef} id="canvas" />
      <LangSwitch lang={lang} onChange={setLang} />

      {phase === 'idle' && (
        <Overlay onEnter={() => setPhase('space')} t={t} />
      )}

      {phase === 'space' && (
        <HUD
          activeGalaxy={activeGalaxy}
          galaxies={galaxyData}
          lang={lang}
          onBack={handleBack}
          onGalaxySelect={selectGalaxy}
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
