// Builds a single self-contained HTML (CSS + JS inline) from the same sources as the React app.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const r = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const strip = (js) => js.replace(/^import .*$/gm, '').replace(/^export (const|function)/gm, '$1');
const css = ['src/styles/tokens.css', 'src/styles/base.css', 'src/styles/components.css'].map(r).join('\n');
const js = [strip(r('src/data/content.js')), strip(r('src/lib/glyphs.js')), strip(r('src/lib/heroGalaxy.js')), r('standalone/render.js')].join('\n');
const head = r('index.html').match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<link rel="icon"[^>]*>/, '');
const html = `<!doctype html>
<html lang="en">
<head>${head}<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>
${js}
</script>
</body>
</html>
`;
mkdirSync(new URL('../dist-standalone/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist-standalone/index.html', import.meta.url), html);
console.log('dist-standalone/index.html', (html.length / 1024).toFixed(1) + ' KB');
