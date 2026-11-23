#!/usr/bin/env node
/* Checks every colour pairing the red pen system uses for text against WCAG.
   Body text needs 4.5 to 1, large display text needs 3 to 1. Every value is a
   swatch in Gmail's compose colour grid, plus Gmail's default text colour, so
   a hex is never adjusted to make a pairing pass. The pairing is dropped. */
"use strict";
const fs = require("fs");
const path = require("path");
const T = { paper: "#FFFFFF", paperAlt: "#F3F3F3", lineSoft: "#EEEEEE", line: "#CCCCCC", ink: "#222222", inkMid: "#444444", inkSoft: "#666666", accent: "#CC0000", accentDeep: "#990000", accentTint: "#F4CCCC", accentOnDark: "#EA9999", dark: "#222222", white: "#FFFFFF" };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const l1 = lum(hex(a)), l2 = lum(hex(b)); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

/* 1. the tokens in the stylesheet are the tokens checked here */
const css = fs.readFileSync(path.join(__dirname, "..", "assets/styles.css"), "utf8");
const NAMES = { paper: "--paper", paperAlt: "--paper-alt", lineSoft: "--line-soft", line: "--line", ink: "--ink", inkMid: "--ink-mid", inkSoft: "--ink-soft", accent: "--accent", accentDeep: "--accent-deep", accentTint: "--accent-tint", accentOnDark: "--accent-on-dark", dark: "--dark" };
let fail = 0;
for (const [key, name] of Object.entries(NAMES)) {
  const m = new RegExp(name.replace(/-/g, "\\-") + ":\\s*(#[0-9A-Fa-f]{6})").exec(css);
  if (!m || m[1].toUpperCase() !== T[key]) { fail++; console.log(`TOKEN ${name} is ${m ? m[1] : "missing"} in assets/styles.css, expected ${T[key]}`); }
}

/* 2. the pairings in use */
const pairs = [
  ["ink on paper (headings and body)", T.ink, T.paper, 4.5],
  ["ink on paper alt (the alternate band)", T.ink, T.paperAlt, 4.5],
  ["ink mid on paper (secondary text)", T.inkMid, T.paper, 4.5],
  ["ink mid on paper alt", T.inkMid, T.paperAlt, 4.5],
  ["ink soft on paper (labels, captions, placeholders)", T.inkSoft, T.paper, 4.5],
  ["ink soft on paper alt", T.inkSoft, T.paperAlt, 4.5],
  ["accent on paper (links, pen notes)", T.accent, T.paper, 4.5],
  ["accent on paper alt", T.accent, T.paperAlt, 4.5],
  ["accent deep on paper (link hover)", T.accentDeep, T.paper, 4.5],
  ["accent deep on paper alt", T.accentDeep, T.paperAlt, 4.5],
  ["white on accent (the button)", T.white, T.accent, 4.5],
  ["white on accent deep (the button, hover and pressed)", T.white, T.accentDeep, 4.5],
  ["ink on accent tint (the highlighter)", T.ink, T.accentTint, 4.5],
  ["white on dark (the dark band)", T.white, T.dark, 4.5],
  ["line on dark (labels and secondary text on the dark band)", T.line, T.dark, 4.5],
  ["accent on dark tone on dark (pen marks and links on the dark band)", T.accentOnDark, T.dark, 4.5],
  ["ink on paper inside the dark band (the form box)", T.ink, T.paper, 4.5],
  ["display: ink on paper alt (headings on the alternate band)", T.ink, T.paperAlt, 3]
];
console.log("Pairing".padEnd(68) + "Ratio   Needs  Result");
for (const [name, fg, bg, need] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= need;
  if (!ok) fail++;
  console.log(name.padEnd(68) + r.toFixed(2).padStart(5) + "   " + need.toFixed(1) + "    " + (ok ? "pass" : "FAIL"));
}

/* 3. the pairings the system forbids. They are listed so the reason stays on record. */
const never = [
  ["accent as text on dark", T.accent, T.dark],
  ["#999999 as text on paper", "#999999", T.paper],
  ["line as text on paper", T.line, T.paper],
  ["accent on dark tone on ink mid, so cards on the dark band stay on dark", T.accentOnDark, T.inkMid]
];
console.log("\nNever used as text");
for (const [name, fg, bg] of never) console.log(name.padEnd(68) + ratio(fg, bg).toFixed(2).padStart(5) + "   too low");

console.log(fail ? `\n${fail} problem(s).` : "\nEvery pairing passes.");
process.exit(fail ? 1 : 0);
