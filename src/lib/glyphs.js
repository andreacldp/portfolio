// Small line-art SVGs for project cards + constellation layout for skills.
// They return plain SVG strings so React and the standalone HTML share them.

const STROKE = 'var(--c-line-strong)';
const ACCENT = 'var(--c-accent)';
const f = (n) => +n.toFixed(2);

function seismic() {
  let paths = '';
  const fault = (y) => 46 + (y - 20) * 0.45; // fault line x as function of y
  for (let k = 0; k < 7; k++) {
    const y0 = 24 + k * 11;
    let left = '', right = '';
    for (let x = 8; x <= 112; x += 4) {
      const y = y0 + Math.sin(x * 0.09 + k * 0.7) * 2.2;
      const fx = fault(y);
      if (x < fx) left += `${left ? 'L' : 'M'}${x} ${f(y)}`;
      else right += `${right ? 'L' : 'M'}${x} ${f(y + 6)}`;
    }
    paths += `<path d="${left}"/><path d="${right}"/>`;
  }
  return `<svg viewBox="0 0 120 120" fill="none" stroke="${STROKE}" stroke-width=".8" aria-hidden="true">
    ${paths}
    <path d="M47 12 L92 112" stroke="${ACCENT}" stroke-dasharray="3 3"/>
    <circle cx="69.5" cy="62" r="2" fill="${ACCENT}" stroke="none"/>
    <path d="M71 61 L98 46 H112" stroke-width=".6"/>
    <text x="112" y="43" text-anchor="end" class="glyph-label">FAULT</text>
  </svg>`;
}

function air() {
  let dots = '';
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2, r = 8 + rnd() * 44;
    const x = 60 + Math.cos(a) * r, y = 60 + Math.sin(a) * r * 0.55;
    dots += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + rnd() * 1.2)}" fill="var(--c-cream)" stroke="none" opacity="${f(0.3 + rnd() * 0.6)}"/>`;
  }
  return `<svg viewBox="0 0 120 120" fill="none" stroke="${STROKE}" stroke-width=".8" aria-hidden="true">
    <ellipse cx="60" cy="60" rx="52" ry="28"/>
    <ellipse cx="60" cy="60" rx="34" ry="18" stroke-dasharray="2 3"/>
    <ellipse cx="60" cy="60" rx="16" ry="9"/>
    ${dots}
    <circle cx="60" cy="60" r="2.4" fill="${ACCENT}" stroke="none"/>
    <path d="M94 47 L104 30 H114" stroke-width=".6"/>
    <text x="114" y="27" text-anchor="end" class="glyph-label">PM2.5</text>
    <path d="M30 76 L20 94 H8" stroke-width=".6"/>
    <text x="8" y="104" class="glyph-label">PM10</text>
  </svg>`;
}

function spiral() {
  // mini Fibonacci tiling, unit = 3.4px, fitted to the box
  const sq = [[0, 0, 1], [1, 0, 1], [0, -2, 2], [-3, -2, 3], [-3, 1, 5], [2, -2, 8], [-3, -15, 13]];
  const u = 3.6, ox = 60 - 3.5 * u, oy = 66 + 1.5 * u;
  const centers = [[1, 0], [1, 0], [0, 0], [0, 1], [2, 1], [2, -2], [-3, -2]];
  let rects = '', arcs = '';
  let px = 0, py = 0;
  sq.forEach(([x, y, s], i) => {
    rects += `<rect x="${f(ox + x * u)}" y="${f(oy + y * u)}" width="${f(s * u)}" height="${f(s * u)}"/>`;
    const [cx, cy] = centers[i];
    const a0 = Math.atan2(py - cy, px - cx);
    const nx = cx + s * Math.cos(a0 - Math.PI / 2), ny = cy + s * Math.sin(a0 - Math.PI / 2);
    arcs += `${i ? '' : `M${f(ox + px * u)} ${f(oy + py * u)}`}A${f(s * u)} ${f(s * u)} 0 0 0 ${f(ox + nx * u)} ${f(oy + ny * u)}`;
    px = nx; py = ny;
  });
  return `<svg viewBox="0 0 120 120" fill="none" stroke="${STROKE}" stroke-width=".7" aria-hidden="true">
    <g opacity=".7">${rects}</g>
    <path d="${arcs}" stroke="var(--c-cream)" stroke-width=".9"/>
    <circle cx="${f(ox + 0.6 * u)}" cy="${f(oy + 0.2 * u)}" r="2" fill="${ACCENT}" stroke="none"/>
    <text x="8" y="112" class="glyph-label">φ ≈ 1.618</text>
  </svg>`;
}

function orbit() {
  return `<svg viewBox="0 0 120 120" fill="none" stroke="${STROKE}" stroke-width=".8" aria-hidden="true">
    <circle cx="60" cy="60" r="12"/>
    <ellipse cx="60" cy="60" rx="48" ry="20" transform="rotate(-18 60 60)"/>
    <ellipse cx="60" cy="60" rx="30" ry="30" stroke-dasharray="2 3"/>
    <circle cx="103" cy="46" r="3" fill="var(--c-cream)" stroke="none"/>
    <circle cx="60" cy="60" r="2.4" fill="${ACCENT}" stroke="none"/>
  </svg>`;
}

const GLYPHS = { seismic, air, spiral, orbit };
export const glyphSVG = (name) => (GLYPHS[name] || orbit)();

// Constellation: one star per row, zig-zagging x so lines read as a constellation
// while labels never collide.
export function constellation(items, seed = 1) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const rowH = 34, top = 22;
  const pts = items.map((label, i) => ({
    label,
    x: f(18 + rnd() * 70),
    y: top + i * rowH,
    r: f(1.6 + rnd() * 1.6),
  }));
  const h = top + (items.length - 1) * rowH + 22;
  return { pts, w: 320, h };
}

export function constellationSVG(items, seed, title) {
  const { pts, w, h } = constellation(items, seed);
  const lines = pts.slice(1).map((p, i) =>
    `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${p.x}" y2="${p.y}"/>`).join('');
  const stars = pts.map((p, i) => `
    <circle cx="${p.x}" cy="${p.y}" r="${p.r + 4}" class="star-halo"/>
    <circle cx="${p.x}" cy="${p.y}" r="${p.r}" class="${i === 0 ? 'star star--alpha' : 'star'}"/>
    <path d="M${p.x + 8} ${p.y} H${p.x + 22}" class="star-tick"/>
    <text x="${p.x + 28}" y="${p.y}" dominant-baseline="middle" class="star-label">${p.label}</text>
    <text x="${w - 4}" y="${p.y}" dominant-baseline="middle" text-anchor="end" class="star-index">${String.fromCharCode(945 + i)}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}: ${items.join(', ')}">
    <g class="star-lines">${lines}</g>${stars}</svg>`;
}

// Pixel lotus mark (same motif as the GitHub profile accent)
const LOTUS = [
  '.....#.....',
  '....###....',
  '.#..###..#.',
  '.##.###.##.',
  '..#######..',
  '#..#####..#',
  '.#########.',
  '...#####...',
];
export function lotusSVG(color = 'var(--c-accent)') {
  let r = '';
  LOTUS.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '#') r += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }));
  return `<svg viewBox="-0.5 -1.5 12 11" fill="${color}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
