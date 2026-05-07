import { useState } from 'react';

export default function Overlay({ onEnter, t }) {
  const [fading, setFading] = useState(false);

  function handleEnter() {
    setFading(true);
    setTimeout(onEnter, 600);
  }

  return (
    <div className={`overlay${fading ? ' fade-out' : ''}`}>
      <div className="overlay-content">
        <h1 className="title">Emanuele<br /><span>Ielmini</span></h1>
        <p className="subtitle">{t('subtitle')}</p>
        <p className="description">{t('description')}</p>
        <button className="btn-primary" onClick={handleEnter}>{t('explore')}</button>
        <div className="dev-notice">
          <span className="dev-notice-icon">◌</span>
          <span>{t('dev_notice')}</span>
        </div>
      </div>
      <p className="scroll-hint">{t('hint')}</p>
    </div>
  );
}
