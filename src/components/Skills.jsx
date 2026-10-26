import Frame from './Frame.jsx';
import SectionHeader from './SectionHeader.jsx';
import Svg from './Svg.jsx';
import { skills } from '../data/content.js';
import { constellationSVG } from '../lib/glyphs.js';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader num="04" label="Skills" coord="3 systems mapped">
          Instruments on <em>board</em>
        </SectionHeader>
        <div className="skills__grid">
          {skills.map((g, i) => (
            <Frame className="sky reveal" key={g.group}>
              <div className="sky__head">
                <h3 className="sky__title">{g.group}</h3>
                <span className="sky__code mono">{g.code}</span>
              </div>
              <Svg markup={constellationSVG(g.items, i + 3, g.group)} />
            </Frame>
          ))}
        </div>
      </div>
    </section>
  );
}
