import { useEffect, useRef, useState } from 'react';
import { createHeroGalaxy } from '../lib/heroGalaxy.js';
import { profile } from '../data/content.js';
import { href, external } from '../lib/links.js';

export default function Hero() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const engine = createHeroGalaxy(canvasRef.current, { onReveal: () => setRevealed(true) });
    engineRef.current = engine;
    return () => engine.destroy();
  }, []);

  return (
    <section id="top" className={`hero ${revealed ? 'is-revealed' : ''}`} aria-label="Introduction">
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      <div className="hero__frame frame" aria-hidden="true">
        <span className="frame__c frame__c--tl" />
        <span className="frame__c frame__c--tr" />
        <span className="frame__c frame__c--bl" />
        <span className="frame__c frame__c--br" />
        <div className="hero__hud hero__hud--tl mono">
          <div><b>TARGET:</b>data science</div>
          <div className="hide-m"><b>TYPE:</b>golden spiral · Sc galaxy</div>
          <div className="show-m"><b>STATUS:</b>building<span className="blink">▮</span></div>
        </div>
        <div className="hero__hud hero__hud--tr mono">
          <div>RA 16h 18m 03.4s</div>
          <div>DEC +31° 41′ 59.2″</div>
        </div>
        <div className="hero__hud hero__hud--br mono">
          <div><b>STATUS:</b>building<span className="blink">▮</span></div>
          <div><b>SEQ:</b>1·1·2·3·5·8·13·21</div>
        </div>
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow mono">Observation log · Monterrey, MX · 2026</p>
        <h1 className="hero__name">{profile.name}</h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__sub">{profile.sub}</p>
        <div className="hero__ctas">
          <a className="btn btn--solid" href="#projects">View projects →</a>
        </div>
      </div>

      <button className="hero__skip mono" onClick={() => engineRef.current?.skip()}>
        Skip intro ▸▸
      </button>
    </section>
  );
}
