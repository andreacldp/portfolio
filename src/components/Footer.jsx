import { profile } from '../data/content.js';
import { lotusSVG } from '../lib/glyphs.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span><span dangerouslySetInnerHTML={{ __html: lotusSVG() }} />© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with React + Vite · F(n) = F(n−1) + F(n−2)</span>
        <a href="#top">Back to origin ↑</a>
      </div>
    </footer>
  );
}
