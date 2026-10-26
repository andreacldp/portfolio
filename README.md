# Andrea De la Peña Contreras — Portfolio

React + Vite, no UI libraries. Hero animation is plain Canvas 2D (`src/lib/heroGalaxy.js`).

## Edit content
Everything (text, projects, experience, skills, links) lives in `src/data/content.js`.
Replace the `[LINK]` / `[EMAIL]` placeholders. To add a project, copy one object in `projects`.

## Design tokens
Colors, fonts, spacing: `src/styles/tokens.css`.

## Scripts
```bash
npm install
npm run dev         # local dev server
npm run build       # production build → dist/
npm run standalone  # single-file preview → dist-standalone/index.html
```

## Structure
```
src/
  components/  Nav, Hero, About, Projects, Experience, Skills, Contact, Footer (+ Frame, SectionHeader, Svg)
  data/        content.js
  lib/         heroGalaxy.js (canvas engine), glyphs.js (line art + constellations), useReveal.js, links.js
  styles/      tokens.css, base.css, components.css
```
