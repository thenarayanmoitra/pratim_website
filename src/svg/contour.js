/* ============================================================
   The signature motif. A fine topographic contour pattern drawn
   from a smooth height field with marching squares, stitched into
   polylines and smoothed with quadratic curves. Deterministic for
   a given seed, so every build produces the same drawing.
   ============================================================ */
"use strict";
const { rng } = require("../lib.js");

function field(seed, w, h) {
  const r = rng(seed);
  const hills = [];
  const n = 5 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    hills.push({
      x: (r() * 1.3 - 0.15) * w,
      y: (r() * 1.3 - 0.15) * h,
      sx: (0.18 + r() * 0.3) * w,
      sy: (0.18 + r() * 0.3) * h,
      a: 0.5 + r() * 0.8
    });
  }
  const tiltX = (r() - 0.5) * 0.6, tiltY = (r() - 0.5) * 0.6;
  return (x, y) => {
    let v = tiltX * (x / w) + tiltY * (y / h);
    for (const k of hills) {
      const dx = (x - k.x) / k.sx, dy = (y - k.y) / k.sy;
      v += k.a * Math.exp(-(dx * dx + dy * dy));
    }
    return v;
  };
}

/* marching squares for one level, returns a list of polylines (arrays of [x,y]) */
function isolines(grid, cols, rows, cell, level) {
  const segs = [];
  const lerp = (a, b, va, vb) => a + (b - a) * ((level - va) / (vb - va || 1e-9));
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x0 = i * cell, y0 = j * cell, x1 = x0 + cell, y1 = y0 + cell;
      const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], d = grid[j + 1][i];
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const top = [lerp(x0, x1, a, b), y0], right = [x1, lerp(y0, y1, b, c)], bottom = [lerp(x0, x1, d, c), y1], left = [x0, lerp(y0, y1, a, d)];
      const add = (p, q) => segs.push([p, q]);
      switch (idx) {
        case 1: case 14: add(left, bottom); break;
        case 2: case 13: add(bottom, right); break;
        case 3: case 12: add(left, right); break;
        case 4: case 11: add(top, right); break;
        case 5: add(top, left); add(bottom, right); break;
        case 6: case 9: add(top, bottom); break;
        case 7: case 8: add(top, left); break;
        case 10: add(top, right); add(left, bottom); break;
      }
    }
  }
  /* stitch segments into polylines by matching endpoints */
  const key = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const ends = new Map();
  const polys = [];
  for (const [p, q] of segs) {
    const kp = key(p), kq = key(q);
    const lp = ends.get(kp), lq = ends.get(kq);
    if (lp && lq && lp.poly !== lq.poly) {
      const A = lp.poly, B = lq.poly;
      if (lp.end) { if (lq.end) B.reverse(); A.push(...B); }
      else { if (!lq.end) B.reverse(); A.unshift(...B); }
      ends.delete(kp); ends.delete(kq);
      for (const pt of [A[0], A[A.length - 1]]) ends.set(key(pt), { poly: A, end: pt === A[A.length - 1] });
      polys.splice(polys.indexOf(B), 1);
    } else if (lp) {
      if (lp.end) lp.poly.push(q); else lp.poly.unshift(q);
      ends.delete(kp); ends.set(kq, { poly: lp.poly, end: lp.end });
    } else if (lq) {
      if (lq.end) lq.poly.push(p); else lq.poly.unshift(p);
      ends.delete(kq); ends.set(kp, { poly: lq.poly, end: lq.end });
    } else {
      const poly = [p, q];
      polys.push(poly);
      ends.set(kp, { poly, end: false });
      ends.set(kq, { poly, end: true });
    }
  }
  return polys.filter((p) => p.length > 3);
}

/* a polyline as a smooth path through the midpoints */
function smoothPath(pts) {
  if (pts.length < 3) return "";
  const f = (n) => Math.round(n * 10) / 10;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`;
  }
  const last = pts[pts.length - 1];
  d += `L${f(last[0])} ${f(last[1])}`;
  return d;
}

/* returns the <path> elements for a canvas of w by h */
function contourPaths({ w = 1080, h = 1350, seed = 7, levels = 11, cell = 24, stroke = "currentColor", width = 1 }) {
  const f = field(seed, w, h);
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const grid = [];
  let min = Infinity, max = -Infinity;
  for (let j = 0; j <= rows; j++) {
    const row = [];
    for (let i = 0; i <= cols; i++) { const v = f(i * cell, j * cell); row.push(v); if (v < min) min = v; if (v > max) max = v; }
    grid.push(row);
  }
  const out = [];
  for (let k = 1; k <= levels; k++) {
    const level = min + (max - min) * (k / (levels + 1));
    for (const poly of isolines(grid, cols, rows, cell, level)) {
      const d = smoothPath(poly);
      if (d) out.push(d);
    }
  }
  return `<g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke">${out.map((d) => `<path d="${d}"/>`).join("")}</g>`;
}

/* a standalone SVG file for CSS backgrounds */
function contourSvg({ w = 1200, h = 1500, seed = 7, color = "#F1F4EC", opacity = 0.12, levels = 12, cell = 26 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
    `<g opacity="${opacity}">${contourPaths({ w, h, seed, levels, cell, stroke: color, width: 1 })}</g></svg>`;
}

module.exports = { contourPaths, contourSvg };
