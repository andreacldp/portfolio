// ─────────────────────────────────────────────────────────────
//  Hero animation: Fibonacci squares → golden spiral → galaxy.
//  Plain canvas 2D, no dependencies. Works in React or vanilla.
//
//  const hero = createHeroGalaxy(canvas, { onReveal });
//  hero.skip();     // jump to the final frame
//  hero.destroy();  // remove listeners / stop the loop
// ─────────────────────────────────────────────────────────────

const PHI = (1 + Math.sqrt(5)) / 2;
const FIB = [1, 1, 2, 3, 5, 8, 13, 21];
const HALF_PI = Math.PI / 2;

const COL = {
  cream: '233,223,200',
  white: '246,243,236',
  pink: '244,182,200',
};

// Timeline in ms
const T = {
  stars: [0, 700],
  sq0: 250, sqStagger: 250, sqDraw: 420,
  spiral0: 1500, spiralDur: 2600,
  migrate: 1400,
  galaxy0: 3500, galaxyDur: 1700,
  glow: [3700, 5600],
  reveal: 5000,
  rot0: 5200,
  end: 6600,
};

// Seeded RNG so the galaxy looks the same on every visit
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const prog = (t, a, b) => clamp01((t - a) / (b - a));

// ── Geometry (in "Fibonacci units") ──────────────────────────
function buildTiling() {
  const squares = [{ x: 0, y: 0, s: 1, d: 0 }];
  let bx = 0, by = 0, bw = 1, bh = 1;
  for (let i = 1; i < FIB.length; i++) {
    const s = FIB[i], d = i % 4;
    let x, y;
    if (d === 1) { x = bx + bw; y = by; }        // right
    else if (d === 2) { x = bx; y = by - s; }    // above
    else if (d === 3) { x = bx - s; y = by; }    // left
    else { x = bx; y = by + bh; }                // below
    squares.push({ x, y, s, d });
    const nx = Math.min(bx, x), ny = Math.min(by, y);
    bw = Math.max(bx + bw, x + s) - nx;
    bh = Math.max(by + bh, y + s) - ny;
    bx = nx; by = ny;
  }
  // Quarter arcs: centre corner depends on placement direction
  const arcs = [];
  let px = 0, py = 0;
  for (const q of squares) {
    const c =
      q.d === 0 ? [q.x + q.s, q.y] :
      q.d === 1 ? [q.x, q.y] :
      q.d === 2 ? [q.x, q.y + q.s] :
                  [q.x + q.s, q.y + q.s];
    const a0 = Math.atan2(py - c[1], px - c[0]);
    arcs.push({ cx: c[0], cy: c[1], r: q.s, a0 });
    px = c[0] + q.s * Math.cos(a0 - HALF_PI);
    py = c[1] + q.s * Math.sin(a0 - HALF_PI);
  }
  // Spiral "eye": intersection of the two main diagonals
  const B = { x: bx, y: by, w: bw, h: bh };
  const big = squares[squares.length - 1];
  const sub = { x: big.x + big.s, y: by, w: bw - big.s, h: bh };
  const eye = intersect(
    [B.x, B.y], [B.x + B.w, B.y + B.h],
    [sub.x, sub.y + sub.h], [sub.x + sub.w, sub.y]
  );
  return { squares, arcs, bbox: B, eye };
}

function intersect(p1, p2, p3, p4) {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return {
    x: (a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d,
    y: (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d,
  };
}

function spiralPoint(arcs, u) {
  const i = Math.min(arcs.length - 1, Math.floor(u));
  const t = u - i;
  const a = arcs[i];
  const ang = a.a0 - t * HALF_PI;
  return { x: a.cx + a.r * Math.cos(ang), y: a.cy + a.r * Math.sin(ang) };
}

function gauss(rnd) {
  const u = Math.max(1e-9, rnd()), v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function buildParticles(geo, count) {
  const rnd = mulberry32(1618);
  const { arcs, eye } = geo;
  const N = arcs.length;
  const out = [];
  const pickColor = (r) => {
    const k = rnd();
    if (r < 1.8) return k < 0.45 ? 'pink' : 'white';
    return k < 0.07 ? 'pink' : k < 0.35 ? 'white' : 'cream';
  };
  const push = (fx, fy, bx, by, birth, kind, alphaBase) => {
    const dx = fx - eye.x, dy = fy - eye.y;
    const r = Math.hypot(dx, dy);
    let alpha = alphaBase * (0.55 + 0.45 * rnd());
    if (r > 15) alpha *= Math.exp(-(r - 15) / 8);
    out.push({
      r, a: Math.atan2(dy, dx),
      bx, by, birth, kind,
      alpha,
      size: 0.6 + Math.pow(rnd(), 3) * 1.7,
      col: pickColor(r),
      tw: rnd() * Math.PI * 2,
    });
  };

  const nArm1 = Math.round(count * 0.46);
  const nArm2 = Math.round(count * 0.24);
  const nDisk = Math.round(count * 0.16);
  const nBulge = count - nArm1 - nArm2 - nDisk;

  // Arm 1 — born on the golden spiral as it is traced
  for (let i = 0; i < nArm1; i++) {
    const u = 0.1 + (N - 0.1) * Math.pow(rnd(), 0.85);
    const p = spiralPoint(arcs, u);
    const dx = p.x - eye.x, dy = p.y - eye.y;
    const rr = Math.hypot(dx, dy) || 1;
    const sig = 0.055 * rr + 0.1;
    const n = gauss(rnd) * sig, tg = gauss(rnd) * sig * 0.6;
    const fx = p.x + (dx / rr) * n - (dy / rr) * tg;
    const fy = p.y + (dy / rr) * n + (dx / rr) * tg;
    push(fx, fy, p.x, p.y, T.spiral0 + (u / N) * T.spiralDur, 'arm', 1);
  }
  // Arm 2 — mirror of arm 1 through the eye (shorter)
  for (let i = 0; i < nArm2; i++) {
    const u = 0.1 + (N - 1.3) * Math.pow(rnd(), 0.85);
    const p0 = spiralPoint(arcs, u);
    const p = { x: 2 * eye.x - p0.x, y: 2 * eye.y - p0.y };
    const dx = p.x - eye.x, dy = p.y - eye.y;
    const rr = Math.hypot(dx, dy) || 1;
    const sig = 0.055 * rr + 0.1;
    const n = gauss(rnd) * sig, tg = gauss(rnd) * sig * 0.6;
    const fx = p.x + (dx / rr) * n - (dy / rr) * tg;
    const fy = p.y + (dy / rr) * n + (dx / rr) * tg;
    push(fx, fy, eye.x + (fx - eye.x) * 0.8, eye.y + (fy - eye.y) * 0.8,
      T.galaxy0 + rnd() * T.galaxyDur, 'field', 0.9);
  }
  // Disk — faint diffuse stars
  for (let i = 0; i < nDisk; i++) {
    const r = Math.min(18, -Math.log(Math.max(1e-6, rnd())) * 4.2);
    const a = rnd() * Math.PI * 2;
    const fx = eye.x + r * Math.cos(a), fy = eye.y + r * Math.sin(a) * 0.92;
    push(fx, fy, eye.x + (fx - eye.x) * 0.8, eye.y + (fy - eye.y) * 0.8,
      T.galaxy0 + rnd() * T.galaxyDur, 'field', 0.38);
  }
  // Bulge — dense core
  for (let i = 0; i < nBulge; i++) {
    const r = Math.abs(gauss(rnd)) * 0.95;
    const a = rnd() * Math.PI * 2;
    const fx = eye.x + r * Math.cos(a), fy = eye.y + r * Math.sin(a);
    push(fx, fy, eye.x, eye.y, T.galaxy0 + 300 + rnd() * T.galaxyDur, 'field', 0.95);
  }
  return out;
}

// ── Main ─────────────────────────────────────────────────────
export function createHeroGalaxy(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = opts.reducedMotion ?? mqReduce.matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const onReveal = opts.onReveal || (() => {});

  const geo = buildTiling();
  let W = 0, H = 0, dpr = 1, S = 20, ox = 0, oy = 0, mobile = false;
  let particles = [];
  let starLayer = null, twinkles = [];
  let clock = reduce ? T.end + 1 : 0;
  let last = 0, raf = 0, running = false, visible = true, revealed = false;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function layout() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    mobile = W < 900;
    const B = geo.bbox;
    let rx, ry, rw, rh;
    if (mobile) {
      rx = 20; rw = W - 40; ry = Math.max(H * 0.17, 150); rh = H * 0.31;
    } else {
      rx = W * 0.47; rw = W * 0.53 - Math.max(48, W * 0.05); ry = H * 0.17; rh = H * 0.6;
    }
    S = Math.min(rw / B.w, rh / B.h);
    ox = rx + (rw - B.w * S) / 2 - B.x * S;
    oy = ry + (rh - B.h * S) / 2 - B.y * S;

    const count = mobile ? 950 : 1900;
    if (particles.length !== count) particles = buildParticles(geo, count);
    buildStars();
  }

  function buildStars() {
    const rnd = mulberry32(31415);
    starLayer = document.createElement('canvas');
    starLayer.width = canvas.width; starLayer.height = canvas.height;
    const s = starLayer.getContext('2d');
    s.scale(dpr, dpr);
    const n = Math.round((W * H) / 2300);
    for (let i = 0; i < n; i++) {
      const x = rnd() * W, y = rnd() * H;
      const r = Math.pow(rnd(), 4) * 1.1 + 0.25;
      s.fillStyle = `rgba(${rnd() < 0.08 ? COL.pink : COL.white},${0.15 + rnd() * 0.55})`;
      s.beginPath(); s.arc(x, y, r, 0, Math.PI * 2); s.fill();
    }
    twinkles = Array.from({ length: Math.round(n * 0.05) }, () => ({
      x: rnd() * W, y: rnd() * H, p: rnd() * Math.PI * 2, sp: 0.6 + rnd() * 1.4,
    }));
  }

  const X = (ux, off) => ox + ux * S + off.x;
  const Y = (uy, off) => oy + uy * S + off.y;

  function rotation(t) {
    if (reduce) return 0;
    const dt = Math.max(0, t - T.rot0) / 1000;
    const w = (Math.PI * 2) / 260; // one turn ≈ 4.3 min
    const tau = 3;
    return w * (dt - tau * (1 - Math.exp(-dt / tau)));
  }

  // ── Draw helpers ──
  function partialRect(x, y, w, h, p) {
    const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
    let len = p * 4;
    ctx.moveTo(x, y);
    for (let i = 1; i < 5 && len > 0; i++) {
      const f = Math.min(1, len);
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      len -= 1;
    }
  }

  function drawAnnotation(ax, ay, dx, dy, lines, p, accent) {
    if (p <= 0) return;
    const fs = mobile ? 9 : 10.5;
    ctx.font = `${fs}px "IBM Plex Mono", ui-monospace, monospace`;
    const tw = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if (ax + dx + tw + 10 > W - 8) dx = -Math.abs(dx);
    if (ax + dx - tw - 10 < 8 && dx < 0) dx = Math.abs(dx);
    const ex = ax + dx * 0.55, ey = ay + dy;
    const lx = ax + dx, ly = ay + dy;
    const lp = easeOut(clamp01(p * 1.6));
    ctx.strokeStyle = `rgba(${COL.cream},0.45)`;
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    const seg1 = Math.min(1, lp * 2), seg2 = clamp01(lp * 2 - 1);
    ctx.lineTo(ax + (ex - ax) * seg1, ay + (ey - ay) * seg1);
    if (seg2 > 0) ctx.lineTo(ex + (lx - ex) * seg2, ey);
    ctx.stroke();
    ctx.fillStyle = `rgba(${accent ? COL.pink : COL.cream},${0.9 * lp})`;
    ctx.beginPath(); ctx.arc(ax, ay, 2, 0, Math.PI * 2); ctx.fill();
    const tp = clamp01(p * 1.6 - 0.6);
    if (tp > 0) {
      ctx.fillStyle = `rgba(${COL.cream},${0.85 * tp})`;
      ctx.textAlign = dx < 0 ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      const tx = lx + (dx < 0 ? -6 : 6);
      lines.forEach((l, i) => {
        if (i > 0) ctx.fillStyle = `rgba(${COL.cream},${0.5 * tp})`;
        ctx.fillText(l, tx, ly + i * (fs + 4));
      });
    }
  }

  // ── Frame ──
  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const par = (k) => ({ x: -mouse.x * k, y: -mouse.y * k });
    const offStars = par(5), offGrid = par(10), offGal = par(18);

    // Stars
    const sp = prog(t, ...T.stars);
    ctx.globalAlpha = sp;
    ctx.drawImage(starLayer, offStars.x, offStars.y, W, H);
    ctx.globalAlpha = 1;
    const secs = t / 1000;
    for (const s of twinkles) {
      const a = (0.25 + 0.5 * (0.5 + 0.5 * Math.sin(secs * s.sp + s.p))) * sp;
      ctx.fillStyle = `rgba(${COL.white},${a})`;
      ctx.fillRect(s.x + offStars.x, s.y + offStars.y, 1.2, 1.2);
    }

    const ex = X(geo.eye.x, offGal), ey = Y(geo.eye.y, offGal);

    // Glow
    const g = easeInOut(prog(t, ...T.glow));
    if (g > 0) {
      const breath = reduce ? 1 : 1 + 0.06 * Math.sin(secs * 0.8);
      const R = 5.5 * S * breath;
      const grad = ctx.createRadialGradient(ex, ey, 0, ex, ey, R);
      grad.addColorStop(0, `rgba(255,232,238,${0.85 * g})`);
      grad.addColorStop(0.07, `rgba(${COL.pink},${0.5 * g})`);
      grad.addColorStop(0.3, `rgba(${COL.pink},${0.13 * g})`);
      grad.addColorStop(1, `rgba(${COL.pink},0)`);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad;
      ctx.fillRect(ex - R, ey - R, R * 2, R * 2);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Fibonacci squares
    const settle = prog(t, T.rot0, T.end); // fade grid back a little at the end
    ctx.lineWidth = 0.8;
    const numFs = mobile ? 8 : 9.5;
    ctx.font = `${numFs}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    geo.squares.forEach((q, i) => {
      const p = easeInOut(prog(t, T.sq0 + i * T.sqStagger, T.sq0 + i * T.sqStagger + T.sqDraw));
      if (p <= 0) return;
      const x = X(q.x, offGrid), y = Y(q.y, offGrid), w = q.s * S;
      ctx.strokeStyle = `rgba(${COL.cream},${0.42 - 0.14 * settle})`;
      ctx.beginPath(); partialRect(x, y, w, w, p); ctx.stroke();
      if (p >= 1 && w >= 11) {
        const na = prog(t, T.sq0 + i * T.sqStagger + T.sqDraw, T.sq0 + i * T.sqStagger + T.sqDraw + 300);
        ctx.fillStyle = `rgba(${COL.cream},${0.7 * na})`;
        ctx.fillText(String(q.s), x + 3, y + 3);
      }
    });

    // Golden spiral
    const su = prog(t, T.spiral0, T.spiral0 + T.spiralDur) * geo.arcs.length;
    if (su > 0) {
      ctx.strokeStyle = `rgba(${COL.cream},${0.8 - 0.25 * settle})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < geo.arcs.length && i < su; i++) {
        const a = geo.arcs[i];
        const f = Math.min(1, su - i);
        ctx.arc(X(a.cx, offGrid), Y(a.cy, offGrid), a.r * S, a.a0, a.a0 - f * HALF_PI, true);
      }
      ctx.stroke();
      if (su < geo.arcs.length) {
        const h = spiralPoint(geo.arcs, su);
        ctx.fillStyle = `rgba(${COL.pink},0.95)`;
        ctx.beginPath(); ctx.arc(X(h.x, offGrid), Y(h.y, offGrid), 2.4, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Galaxy particles
    const rot = rotation(t);
    ctx.globalCompositeOperation = 'lighter';
    let curCol = '';
    for (const pt of particles) {
      if (t < pt.birth) continue;
      const m = easeOut(clamp01((t - pt.birth) / T.migrate));
      const ang = pt.a + rot * (1 + 0.9 / (1 + pt.r * 0.35));
      let ux = geo.eye.x + pt.r * Math.cos(ang);
      let uy = geo.eye.y + pt.r * Math.sin(ang);
      if (m < 1) { ux = pt.bx + (ux - pt.bx) * m; uy = pt.by + (uy - pt.by) * m; }
      const flash = pt.kind === 'arm' ? 1 + (1 - m) * 0.8 : m;
      let a = pt.alpha * Math.min(1, flash);
      if (!reduce) a *= 0.85 + 0.15 * Math.sin(secs * 1.3 + pt.tw);
      if (a < 0.02) continue;
      if (pt.col !== curCol) { curCol = pt.col; ctx.fillStyle = `rgb(${COL[curCol]})`; }
      ctx.globalAlpha = a;
      const sz = pt.size;
      ctx.fillRect(X(ux, offGal) - sz / 2, Y(uy, offGal) - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // Reticle on the core
    const rp = prog(t, T.glow[0] + 400, T.glow[0] + 1200);
    if (rp > 0) {
      ctx.strokeStyle = `rgba(${COL.cream},${0.55 * rp})`;
      ctx.lineWidth = 0.75;
      const rr = 14;
      ctx.beginPath();
      ctx.arc(ex, ey, rr, 0, Math.PI * 2 * easeOut(rp));
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        ctx.moveTo(ex + dx * (rr + 3), ey + dy * (rr + 3));
        ctx.lineTo(ex + dx * (rr + 9), ey + dy * (rr + 9));
      }
      ctx.stroke();
    }

    // Annotations (canvas-anchored to the geometry)
    const top6 = geo.squares[6];
    const arcPt = spiralPoint(geo.arcs, 6.55);
    const ann = (start) => prog(t, start, start + 900);
    drawAnnotation(X(top6.x, offGrid), Y(top6.y, offGrid), 46, -26,
      ['F(n) = F(n−1) + F(n−2)'], ann(T.sq0 + 6 * T.sqStagger));
    drawAnnotation(ex, ey, mobile ? 50 : 84, mobile ? 34 : 64,
      ['CORE', `x ${geo.eye.x.toFixed(3)}  y ${geo.eye.y.toFixed(3)}`], ann(T.glow[0] + 600), true);
    if (!mobile) {
      drawAnnotation(X(arcPt.x, offGrid), Y(arcPt.y, offGrid), 60, -18,
        [`φ ≈ ${PHI.toFixed(6)}`, 'r(θ) = a · φ^(2θ/π)'], ann(T.spiral0 + 1900));
      drawAnnotation(X(geo.bbox.x + geo.bbox.w, offGrid), Y(geo.bbox.y + geo.bbox.h, offGrid), -40, 26,
        ['lim F(n+1)/F(n) = φ'], ann(T.sq0 + 7 * T.sqStagger + 200));
    }
  }

  function frame(now) {
    raf = 0;
    if (!running) return;
    const dt = last ? Math.min(50, now - last) : 16;
    last = now;
    clock += dt;
    if (!revealed && clock >= T.reveal) { revealed = true; onReveal(); }
    draw(clock);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (reduce || running || !visible) return;
    running = true; last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // ── Events ──
  const onResize = () => { layout(); if (!running) draw(clock); };
  const onMove = (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  });

  layout();
  let ro = null;
  if ('ResizeObserver' in window) { ro = new ResizeObserver(onResize); ro.observe(canvas); }
  else window.addEventListener('resize', onResize);
  if (!reduce && finePointer) window.addEventListener('pointermove', onMove, { passive: true });

  if (reduce) {
    revealed = true; onReveal();
    draw(clock);
    if (document.fonts) document.fonts.ready.then(() => draw(clock));
  } else {
    io.observe(canvas);
    start();
  }

  return {
    skip() {
      if (clock < T.end) clock = T.end;
      if (!revealed) { revealed = true; onReveal(); }
      if (!running) draw(clock);
    },
    destroy() {
      stop(); io.disconnect();
      ro ? ro.disconnect() : window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    },
  };
}
