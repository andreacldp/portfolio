import SectionHeader from './SectionHeader.jsx';
import { profile, contact } from '../data/content.js';
import { href, external, isPlaceholder } from '../lib/links.js';

export default function Contact() {
  const email = isPlaceholder(profile.email) ? profile.email : `mailto:${profile.email}`;
  const channels = [
    ['EMAIL', profile.email, email],
    ['GITHUB', profile.githubLabel, profile.github],
    ['LINKEDIN', isPlaceholder(profile.linkedin) ? profile.linkedin : profile.linkedin.replace(/^https?:\/\/(www\.)?/, ''), profile.linkedin],
  ];
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader num="05" label="Contact" coord="channel open">
          Open a <em>channel</em>.
        </SectionHeader>
        <div className="contact__grid">
          <div className="reveal">
            <p className="contact__lead">{contact.lead}</p>
            <div className="contact__ctas">
              <a className="btn btn--solid" href={href(profile.cv)} {...external(profile.cv)}>
                Download CV ↓ {isPlaceholder(profile.cv) ? profile.cv : ''}
              </a>
            </div>
          </div>
          <div className="channels reveal">
            {channels.map(([k, label, to]) => (
              <a key={k} className={`channel ${isPlaceholder(to) ? 'is-placeholder' : ''}`}
                 href={href(to)} {...external(to)}>
                <span>{k}</span><span>{label}</span><span className="arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
