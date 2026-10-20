/* Small helpers shared by every template. No dependencies. */
"use strict";

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const attr = (s) => esc(s);
const when = (cond, s) => (cond ? (typeof s === "function" ? s() : s) : "");
const map = (arr, fn) => (arr || []).map(fn).join("\n");
const trim = (html) => html.replace(/^\s+$/gm, "").replace(/\n{3,}/g, "\n\n");

/* 2026-10-11 -> 11 October 2026 */
function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

const TYPE_KEYS = {
  "Tourism association": "association",
  "DMC or tour operator": "dmc",
  "Hotel or resort": "hotel",
  "Tourism board": "board",
  "Travel academy": "academy",
  "Travel media and events": "media",
  "Airline or booking platform": "platform",
  "Other travel brand": "other"
};
const TYPE_LABELS = Object.fromEntries(Object.entries(TYPE_KEYS).map(([k, v]) => [v, k]));
const typeKey = (label) => TYPE_KEYS[label] || "other";

/* The arrow used inside buttons and text links, one stroke weight everywhere. */
const ARROW = '<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"/></svg>';

/* Line icons, 24 by 24, drawn with one stroke weight. icon("calendar") */
const ICON_PATHS = {
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13h2M14 13h2M8 16.5h2"/>',
  layers: '<path d="M12 3.5 3 8l9 4.5L21 8z"/><path d="m3 12 9 4.5 9-4.5M3 16l9 4.5 9-4.5"/>',
  play: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  send: '<path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4z"/>',
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m7.5 15 4-4.5 3 3 5-6"/>',
  users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.6-3.8 3.2-6 6.5-6s5.9 2.2 6.5 6"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.4c2 .8 3.2 2.8 3.5 5.6"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  bed: '<path d="M3 18.5V6M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-7V14"/><circle cx="7" cy="10.5" r="1.8"/>',
  flag: '<path d="M5 21V4M5 4.5h11l-2 4 2 4H5"/>',
  cap: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c3.5 2.5 7.5 2.5 11 0v-5M21.5 9v5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  inbox: '<path d="M3.5 13.5 6 5h12l2.5 8.5V19h-17z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  megaphone: '<path d="M3.5 10v4h3l9 4.5v-13l-9 4.5z"/><path d="M6.5 14l1.5 5.5h2.5M19 9.5a3.5 3.5 0 0 1 0 5"/>',
  browser: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 8.5h18M6 6.3h.5M8.5 6.3H9"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.3 2.7 2.7L16 9.5"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5C10.5 5 7 4.5 7 6.5s3 2 5 2zm0 0c1.5-3.5 5-4 5-2s-3 2-5 2z"/>',
  sparkle: '<path d="M12 3.5c.8 4.4 2.6 6.4 7 7.5-4.4 1.1-6.2 3.1-7 8-.8-4.9-2.6-6.9-7-8 4.4-1.1 6.2-3.1 7-7.5z"/>',
  award: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
  book: '<path d="M4 5.5c2.5-1 5.5-1 8 .5v13.5c-2.5-1.5-5.5-1.5-8-.5zM20 5.5c-2.5-1-5.5-1-8 .5v13.5c2.5-1.5 5.5-1.5 8-.5z"/>',
  drag: '<path d="M12 4v16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
  arrowup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  spark: '<path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/>'
};
const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;

/* <picture> with webp sources and a jpeg fallback.
   base: path without the size and extension, for example /assets/concepts/bhutan-1
   widths: the exported widths, the first one is the fallback jpeg */
function picture({ base, alt, width, height, sizes, eager = false, widths = [560, 1080], cls = "", style = "", jpg = true, decoding }) {
  const srcset = widths.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
  const fallback = jpg ? `${base}-${widths[0]}.jpg` : `${base}-${widths[0]}.webp`;
  const loading = eager === "high" || eager === true ? ' fetchpriority="high"' : eager === "eager" ? "" : ' loading="lazy"';
  const dec = decoding ? ` decoding="${decoding}"` : (eager ? "" : ' decoding="async"');
  return `<picture${cls ? ` class="${cls}"` : ""}${style ? ` style="${attr(style)}"` : ""}>
<source type="image/webp" srcset="${srcset}" sizes="${sizes}">
<img src="${fallback}" width="${width}" height="${height}" alt="${attr(alt)}" sizes="${sizes}"${loading}${dec}>
</picture>`;
}

/* Deterministic pseudo random numbers, so every build draws the same contours. */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return (s >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

module.exports = { esc, attr, when, map, trim, fmtDate, typeKey, TYPE_KEYS, TYPE_LABELS, ARROW, icon, picture, rng, hashString };
