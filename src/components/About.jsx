import Frame from './Frame.jsx';
import SectionHeader from './SectionHeader.jsx';
import { about } from '../data/content.js';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader num="01" label="About" coord="25.68°N 100.31°W">
          Curious by default, <em>rigorous</em> by training.
        </SectionHeader>
        <div className="about__grid">
          <div className="about__text reveal">
            {about.paragraphs.map((p) => <p key={p.slice(0, 16)}>{p}</p>)}
            <p className="about__sig mono">— A.D.P.C.</p>
          </div>
          <Frame className="panel reveal">
            <div className="panel__head mono">
              <span>DATA PANEL</span><span>ID: ADP-2028</span>
            </div>
            <dl>
              {about.panel.map(([k, v]) => (
                <div className="panel__row" key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <p className="panel__status mono"><span className="dot" />{about.status}</p>
            <p className="panel__prompt">&gt; whoami<span className="blink">_</span></p>
          </Frame>
        </div>
      </div>
    </section>
  );
}
