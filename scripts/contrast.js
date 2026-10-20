#!/usr/bin/env node
/* Checks every colour pairing the stylesheet uses for text against WCAG.
   Body text needs 4.5 to 1, large display text needs 3 to 1. */
"use strict";
const T = { accent: "#D98A2B", accentDeep: "#8A5410", accentSoft: "#E8B25C", paper: "#F1F4EC", paperHi: "#F9FBF6", paperDeep: "#E7ECDF", parchment: "#DCE4D2", inkDeep: "#16241C", inkDeep2: "#1F3327", ink: "#202A22", inkMid: "#4B5A4E", inkFaint: "#5C6A5E", ok: "#2F6B45", err: "#A23B1E", errDark: "#F4B8A6", white: "#FFFFFF" };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const lum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const onDarkMid = over(hex(T.paper), 0.74, hex(T.inkDeep));
const onDarkMid2 = over(hex(T.paper), 0.74, hex(T.inkDeep2));
const footBottom = over(hex(T.paper), 0.65, hex(T.inkDeep));
const placeholderLight = hex(T.inkFaint);
const placeholderDark = onDarkMid2;

const pairs = [
  ["ink on paper (body)", T.ink, T.paper, 4.5],
  ["ink on paper deep (body, tint sections)", T.ink, T.paperDeep, 4.5],
  ["ink on paper hi (sheets)", T.ink, T.paperHi, 4.5],
  ["ink mid on paper (secondary text)", T.inkMid, T.paper, 4.5],
  ["ink mid on paper deep", T.inkMid, T.paperDeep, 4.5],
  ["ink mid on paper hi", T.inkMid, T.paperHi, 4.5],
  ["ink faint on paper (labels, metadata)", T.inkFaint, T.paper, 4.5],
  ["ink faint on paper deep", T.inkFaint, T.paperDeep, 4.5],
  ["ink faint on paper hi", T.inkFaint, T.paperHi, 4.5],
  ["ink deep on paper (headings)", T.inkDeep, T.paper, 4.5],
  ["ink deep on paper deep", T.inkDeep, T.paperDeep, 4.5],
  ["ink deep on parchment (segmented control, ticks)", T.inkDeep, T.parchment, 4.5],
  ["accent deep on paper (links, eyebrows)", T.accentDeep, T.paper, 4.5],
  ["accent deep on paper deep", T.accentDeep, T.paperDeep, 4.5],
  ["accent deep on paper hi", T.accentDeep, T.paperHi, 4.5],
  ["paper on ink deep (dark sections)", T.paper, T.inkDeep, 4.5],
  ["paper on ink deep 2 (cards on dark)", T.paper, T.inkDeep2, 4.5],
  ["on dark mid on ink deep (secondary on dark)", onDarkMid, T.inkDeep, 4.5],
  ["on dark mid on ink deep 2", onDarkMid2, T.inkDeep2, 4.5],
  ["accent soft on ink deep (accent on dark)", T.accentSoft, T.inkDeep, 4.5],
  ["accent soft on ink deep 2", T.accentSoft, T.inkDeep2, 4.5],
  ["ink deep on accent soft (light button hover, chip)", T.inkDeep, T.accentSoft, 4.5],
  ["paper on accent deep (primary button hover)", T.paper, T.accentDeep, 4.5],
  ["ok green on paper hi (report deltas)", T.ok, T.paperHi, 4.5],
  ["error on paper hi (form errors)", T.err, T.paperHi, 4.5],
  ["error on paper (form errors)", T.err, T.paper, 4.5],
  ["error light on ink deep 2 (form errors on dark)", T.errDark, T.inkDeep2, 4.5],
  ["footer bottom line on ink deep", footBottom, T.inkDeep, 4.5],
  ["placeholder on paper", placeholderLight, T.paper, 4.5],
  ["placeholder on ink deep 2", placeholderDark, T.inkDeep2, 4.5],
  ["paper on ink deep at 78% (image overlay tags)", T.paper, over(hex(T.inkDeep), 0.78, hex(T.parchment)), 4.5],
  ["display: accent soft on ink deep (big numbers)", T.accentSoft, T.inkDeep, 3],
  ["display: ink deep on paper deep (headings on tint)", T.inkDeep, T.paperDeep, 3]
];
let fail = 0;
console.log("Pairing".padEnd(56) + "Ratio   Needs  Result");
for (const [name, fg, bg, need] of pairs) {
  const a = typeof fg === "string" ? hex(fg) : fg, b = typeof bg === "string" ? hex(bg) : bg;
  const r = ratio(a, b);
  const ok = r >= need;
  if (!ok) fail++;
  console.log(name.padEnd(56) + r.toFixed(2).padStart(5) + "   " + need.toFixed(1) + "    " + (ok ? "pass" : "FAIL"));
}
console.log(fail ? `\n${fail} pairing(s) fail.` : "\nEvery pairing passes.");
process.exit(fail ? 1 : 0);
