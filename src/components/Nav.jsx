import { useEffect, useState } from 'react';
import { profile } from '../data/content.js';
import { lotusSVG } from '../lib/glyphs.js';
import { href, external } from '../lib/links.js';

const LINKS = [
  ['01', 'About', '#about'],
  ['02', 'Projects', '#projects'],
  ['03', 'Experience', '#experience'],
  ['04', 'Skills', '#skills'],
  ['05', 'Contact', '#contact'],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="Main">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand mono">
          <span dangerouslySetInnerHTML={{ __html: lotusSVG() }} />
          {profile.initials}
        </a>
        <div className="nav__links mono">
          {LINKS.map(([n, label, to]) => (
            <a key={to} href={to}><span>{n}</span>{label}</a>
          ))}
        </div>
        <a className="btn" href={href(profile.cv)} {...external(profile.cv)}>CV ↓</a>
      </div>
    </nav>
  );
}
