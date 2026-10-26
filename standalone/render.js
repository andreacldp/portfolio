// Vanilla renderer used only for the single-file preview (dist-standalone/index.html).
// Mirrors the React components in src/components.
(function () {
  const ph = (v) => !v || v.startsWith('[');
  const hrefOf = (v) => (ph(v) ? '#' : v);
  const ext = (v) => (!ph(v) && /^https?:/.test(v) ? ' target="_blank" rel="noreferrer"' : '');
  const corners = '<span class="frame__c frame__c--tl"></span><span class="frame__c frame__c--tr"></span><span class="frame__c frame__c--bl"></span><span class="frame__c frame__c--br"></span>';
  const head = (num, label, coord, title) => `
    <header class="sec-head reveal"><div class="sec-head__meta mono"><span class="num">§ ${num}</span><span>${label}</span><span class="rule"></span><span>${coord}</span></div>
    <h2 class="sec-head__title">${title}</h2></header>`;

  const nav = `<nav class="nav" aria-label="Main"><div class="container nav__inner">
    <a href="#top" class="nav__brand mono"><span>${lotusSVG()}</span>${profile.initials}</a>
    <div class="nav__links mono">${[['01','About','#about'],['02','Projects','#projects'],['03','Experience','#experience'],['04','Skills','#skills'],['05','Contact','#contact']].map(([n,l,h]) => `<a href="${h}"><span>${n}</span>${l}</a>`).join('')}</div>
    <a class="btn" href="${hrefOf(profile.cv)}"${ext(profile.cv)}>CV ↓</a></div></nav>`;

  const hero = `<section id="top" class="hero" aria-label="Introduction">
    <canvas class="hero__canvas" aria-hidden="true"></canvas>
    <div class="hero__frame frame" aria-hidden="true">${corners}
      <div class="hero__hud hero__hud--tl mono"><div><b>TARGET:</b>data science</div><div class="hide-m"><b>TYPE:</b>golden spiral · Sc galaxy</div><div class="show-m"><b>STATUS:</b>building<span class="blink">▮</span></div></div>
      <div class="hero__hud hero__hud--tr mono"><div>RA 16h 18m 03.4s</div><div>DEC +31° 41′ 59.2″</div></div>
      <div class="hero__hud hero__hud--br mono"><div><b>STATUS:</b>building<span class="blink">▮</span></div><div><b>SEQ:</b>1·1·2·3·5·8·13·21</div></div>
    </div>
    <div class="hero__content">
      <p class="hero__eyebrow mono">Observation log · Monterrey, MX · 2026</p>
      <h1 class="hero__name">${profile.name}</h1>
      <p class="hero__tagline">${profile.tagline}</p>
      <p class="hero__sub">${profile.sub}</p>
      <div class="hero__ctas"><a class="btn btn--solid" href="#projects">View projects →</a><a class="btn" href="${hrefOf(profile.cv)}"${ext(profile.cv)}>Download CV ↓</a></div>
    </div>
    <button class="hero__skip mono">Skip intro ▸▸</button></section>`;

  const aboutS = `<section id="about" class="section"><div class="container">
    ${head('01', 'About', '25.68°N 100.31°W', 'Curious by default, <em>rigorous</em> by training.')}
    <div class="about__grid"><div class="about__text reveal">${about.paragraphs.map((p) => `<p>${p}</p>`).join('')}<p class="about__sig mono">— A.D.P.C.</p></div>
    <div class="frame panel reveal">${corners}<div class="panel__head mono"><span>DATA PANEL</span><span>ID: ADP-2028</span></div>
    <dl>${about.panel.map(([k, v]) => `<div class="panel__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <p class="panel__status mono"><span class="dot"></span>${about.status}</p><p class="panel__prompt">&gt; whoami<span class="blink">_</span></p></div></div></div></section>`;

  const projS = `<section id="projects" class="section"><div class="container">
    ${head('02', 'Projects', `${projects.length} objects catalogued`, 'Observation <em>log</em>')}
    <div class="log">${projects.map((p) => `<article class="frame obj reveal">${corners}
      <div><div class="obj__id mono">${p.id}</div><div class="obj__meta mono"><span><b>TYPE</b><br>${p.type}</span><span><b>FIELD</b><br>${p.field}</span><span><b>STATUS</b><br>${p.status}</span></div></div>
      <div><h3 class="obj__title">${p.title}</h3><p class="obj__desc">${p.description}</p>
      <ul class="obj__stack" aria-label="Stack">${p.stack.map((s) => `<li class="chip">${s}</li>`).join('')}</ul>
      <div class="obj__link"><a class="link ${ph(p.repo) ? 'is-placeholder' : ''}" href="${hrefOf(p.repo)}"${ext(p.repo)}>Repository ${ph(p.repo) ? p.repo : '↗'}</a></div></div>
      <div class="obj__glyph">${glyphSVG(p.glyph)}</div></article>`).join('')}</div>
    <p class="log__more mono reveal">— more objects under observation —</p></div></section>`;

  const node = (i) => `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="var(--c-bg)" stroke="var(--c-line-strong)" stroke-width=".8" ${i ? 'stroke-dasharray="2 3"' : ''}/><circle cx="20" cy="20" r="3.2" fill="${i === 0 ? 'var(--c-accent)' : 'var(--c-cream)'}"/><g class="planet"><circle cx="37" cy="20" r="2.2" fill="var(--c-white)"/></g></svg>`;
  const expS = `<section id="experience" class="section"><div class="container">
    ${head('03', 'Experience &amp; Leadership', 't → present', 'Orbits &amp; <em>trajectories</em>')}
    <ol class="timeline">${experience.map((e, i) => `<li class="orbit-item reveal"><div class="orbit-item__when mono">${e.period}</div><div class="orbit-item__node">${node(i)}</div>
      <div class="orbit-item__body"><div class="orbit-item__kind mono">Orbit 0${i + 1} · ${e.kind}</div><h3 class="orbit-item__role">${e.role}</h3>
      <p class="orbit-item__org">${e.org} <span>· ${e.place}</span></p><p class="orbit-item__desc">${e.description}</p></div></li>`).join('')}</ol></div></section>`;

  const skillS = `<section id="skills" class="section"><div class="container">
    ${head('04', 'Skills', '3 systems mapped', 'Instruments on <em>board</em>')}
    <div class="skills__grid">${skills.map((g, i) => `<div class="frame sky reveal">${corners}<div class="sky__head"><h3 class="sky__title">${g.group}</h3><span class="sky__code mono">${g.code}</span></div>
      <div>${constellationSVG(g.items, i + 3, g.group)}</div></div>`).join('')}</div></div></section>`;

  const mail = ph(profile.email) ? profile.email : `mailto:${profile.email}`;
  const channels = [['EMAIL', profile.email, mail], ['GITHUB', profile.githubLabel, profile.github], ['LINKEDIN', profile.linkedin, profile.linkedin]];
  const contactS = `<section id="contact" class="section"><div class="container">
    ${head('05', 'Contact', 'channel open', 'Open a <em>channel</em>.')}
    <div class="contact__grid"><div class="reveal"><p class="contact__lead">${contact.lead}</p>
    <div class="contact__ctas"><a class="btn btn--solid" href="${hrefOf(profile.cv)}"${ext(profile.cv)}>Download CV ↓ ${ph(profile.cv) ? profile.cv : ''}</a></div></div>
    <div class="channels reveal">${channels.map(([k, l, h]) => `<a class="channel ${ph(h) ? 'is-placeholder' : ''}" href="${hrefOf(h)}"${ext(h)}><span>${k}</span><span>${l}</span><span class="arrow">→</span></a>`).join('')}</div></div></div></section>`;

  const footer = `<footer class="footer"><div class="container footer__inner mono"><span>${lotusSVG()}© ${new Date().getFullYear()} ${profile.name}</span><span>Built with React + Vite · F(n) = F(n−1) + F(n−2)</span><a href="#top">Back to origin ↑</a></div></footer>`;

  document.getElementById('root').innerHTML = nav + '<main>' + hero + aboutS + projS + expS + skillS + contactS + '</main>' + footer;

  // Behaviour
  const navEl = document.querySelector('.nav');
  const onScroll = () => navEl.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const heroEl = document.querySelector('.hero');
  const engine = createHeroGalaxy(heroEl.querySelector('canvas'), { onReveal: () => heroEl.classList.add('is-revealed') });
  heroEl.querySelector('.hero__skip').addEventListener('click', () => engine.skip());

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
