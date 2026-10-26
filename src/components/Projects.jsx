import Frame from './Frame.jsx';
import SectionHeader from './SectionHeader.jsx';
import Svg from './Svg.jsx';
import { projects } from '../data/content.js';
import { glyphSVG } from '../lib/glyphs.js';
import { href, external, isPlaceholder } from '../lib/links.js';

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader num="02" label="Projects" coord={`${projects.length} objects catalogued`}>
          Observation <em>log</em>
        </SectionHeader>
        <div className="log">
          {projects.map((p) => (
            <Frame as="article" className="obj reveal" key={p.id}>
              <div>
                <div className="obj__id mono">{p.id}</div>
                <div className="obj__meta mono">
                  <span><b>TYPE</b><br />{p.type}</span>
                  <span><b>FIELD</b><br />{p.field}</span>
                  <span><b>STATUS</b><br />{p.status}</span>
                </div>
              </div>
              <div>
                <h3 className="obj__title">{p.title}</h3>
                <p className="obj__desc">{p.description}</p>
                <ul className="obj__stack" aria-label="Stack">
                  {p.stack.map((s) => <li className="chip" key={s}>{s}</li>)}
                </ul>
                <div className="obj__link">
                  <a className={`link ${isPlaceholder(p.repo) ? 'is-placeholder' : ''}`}
                     href={href(p.repo)} {...external(p.repo)}>
                    Repository {isPlaceholder(p.repo) ? p.repo : '↗'}
                  </a>
                </div>
              </div>
              <Svg className="obj__glyph" markup={glyphSVG(p.glyph)} />
            </Frame>
          ))}
        </div>
        <p className="log__more mono reveal">— more objects under observation —</p>
      </div>
    </section>
  );
}
