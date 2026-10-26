import SectionHeader from './SectionHeader.jsx';
import { experience } from '../data/content.js';

const Node = ({ i }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="17" fill="var(--c-bg)" stroke="var(--c-line-strong)" strokeWidth=".8" strokeDasharray={i ? '2 3' : undefined} />
    <circle cx="20" cy="20" r="3.2" fill={i === 0 ? 'var(--c-accent)' : 'var(--c-cream)'} />
    <g className="planet"><circle cx="37" cy="20" r="2.2" fill="var(--c-white)" /></g>
  </svg>
);

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeader num="03" label="Experience & Leadership" coord="t → present">
          Orbits &amp; <em>trajectories</em>
        </SectionHeader>
        <ol className="timeline">
          {experience.map((e, i) => (
            <li className="orbit-item reveal" key={e.org + e.role}>
              <div className="orbit-item__when mono">{e.period}</div>
              <div className="orbit-item__node"><Node i={i} /></div>
              <div className="orbit-item__body">
                <div className="orbit-item__kind mono">Orbit 0{i + 1} · {e.kind}</div>
                <h3 className="orbit-item__role">{e.role}</h3>
                <p className="orbit-item__org">{e.org} <span>· {e.place}</span></p>
                <p className="orbit-item__desc">{e.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
