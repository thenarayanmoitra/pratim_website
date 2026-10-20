/* ============================================================
   SVG templates for the What If series.

   cover   the episode cover, 1080 by 1350. Two prints on the dark
           contour background, the post as it was behind and the
           remake in front, the drawn arrow between them and
           "What if" set large below.
   og      the Open Graph preview, 1200 by 630, same idea.
   before  the post as it was, rendered at 4 by 5 without cropping
           anything away, for the before and after slider.
   slide   one remake slide, 1080 by 1350, drawn in the moodboard
           style the episode tests. Twelve styles, see
           assets/data/styles.js.

   Text sits in foreignObject blocks so it wraps like HTML when
   Chrome renders the SVG to WebP and JPEG (scripts/export-images.js).
   Photos are referenced by absolute file URL at build time only.
   ============================================================ */
"use strict";
const { esc } = require("../lib.js");
const { contourPaths } = require("./contour.js");

const C = {
  accent: "#D98A2B", accentDeep: "#8A5410", accentSoft: "#E8B25C",
  paper: "#F1F4EC", paperHi: "#F9FBF6", paperDeep: "#E7ECDF", parchment: "#DCE4D2",
  inkDeep: "#16241C", inkDeep2: "#1F3327", ink: "#202A22", inkMid: "#4B5A4E", inkFaint: "#5C6A5E"
};
const F = {
  head: "'Space Grotesk', system-ui, sans-serif",
  body: "'Manrope', system-ui, sans-serif",
  mono: "'Space Mono', ui-monospace, monospace",
  mark: "'Fraunces', Georgia, serif",
  serif: "'Instrument Serif', Georgia, serif",
  soft: "'Fraunces', Georgia, serif",
  condensed: "'Bebas Neue', Impact, sans-serif",
  impact: "'Anton', Impact, sans-serif",
  hand: "'Caveat', cursive"
};
const XHTML = 'xmlns="http://www.w3.org/1999/xhtml"';
const W = 1080, H = 1350;

/* ---------- small helpers ---------- */
function fo(x, y, w, h, html, style = "") {
  return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div ${XHTML} style="width:${w}px;height:${h}px;${style}">${html}</div></foreignObject>`;
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const onColor = (hex) => (luminance(hex) > 0.4 ? "#141414" : "#FFFFFF");
function mix(hex, to, t) {
  const a = hexToRgb(hex), b = hexToRgb(to);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
const darken = (hex, t = 0.55) => mix(hex, "#000000", t);
const lighten = (hex, t = 0.82) => mix(hex, "#FFFFFF", t);
const rgba = (hex, a) => `rgba(${hexToRgb(hex).join(",")},${a})`;

function chipHtml(text, color, border, size = 24) {
  const pad = Math.round(size * 0.66), padx = Math.round(size * 0.9);
  return `<span style="display:inline-flex;align-items:center;gap:${Math.round(size / 2)}px;font:400 ${size}px/1 ${F.mono};letter-spacing:.16em;text-transform:uppercase;color:${color};border:1.5px solid ${border};border-radius:4px;padding:${pad}px ${padx}px ${pad - 1}px;white-space:nowrap"><span style="width:${Math.round(size * 0.38)}px;height:${Math.round(size * 0.38)}px;border-radius:50%;border:1.5px solid ${color};display:inline-block"></span>${esc(text)}</span>`;
}
function wordmark(color, accent, size) {
  return `<span style="font:italic 500 ${size}px/1 ${F.mark};color:${color};letter-spacing:-.01em;white-space:nowrap">pratim <span style="color:${accent}">n.</span> moitra</span>`;
}
function stripWhatIf(line) {
  return /^what if\s+/i.test(line) ? line.replace(/^what if\s+/i, "") : line;
}
/* the photo, cropped to fill a box. brand.photoFocus picks the part of the
   post that survives the crop (top, center, bottom), brand.photoZoom crops in,
   and brand.photoTreat "soft" blurs and darkens a designed poster so its own
   text dissolves into a colour wash under the new type. */
let photoCount = 0;
function photoRaw(href, x, y, w, h, fit = "slice", opt = {}) {
  const id = "p" + (++photoCount);
  const soft = opt.treat === "soft";
  let img;
  if (opt.crop && opt.dims) {
    /* an exact crop box, as fractions of the source, scaled to fill the frame */
    const c = opt.crop, d = opt.dims;
    const cx = c.x * d.w, cy = c.y * d.h, cw = c.w * d.w, ch = c.h * d.h;
    const scale = Math.max(w / cw, h / ch);
    const iw = d.w * scale, ih = d.h * scale;
    const ix = x - cx * scale + (w - cw * scale) / 2, iy = y - cy * scale + (h - ch * scale) / 2;
    img = `<image href="${esc(href)}" x="${ix.toFixed(1)}" y="${iy.toFixed(1)}" width="${iw.toFixed(1)}" height="${ih.toFixed(1)}" preserveAspectRatio="xMidYMid meet"${soft ? ` filter="url(#${id}f)"` : ""}/>`;
  } else {
    const focus = { top: "YMin", center: "YMid", bottom: "YMax" }[opt.focus || "center"] || "YMid";
    const zoom = fit === "slice" ? Math.max(1, +opt.zoom || 1) : 1;
    const zw = w * zoom, zh = h * zoom;
    const zx = x - (zw - w) / 2, zy = y - (zh - h) * (focus === "YMin" ? 0 : focus === "YMax" ? 1 : 0.5);
    img = `<image href="${esc(href)}" x="${zx}" y="${zy}" width="${zw}" height="${zh}" preserveAspectRatio="xMid${focus} ${fit}"${soft ? ` filter="url(#${id}f)"` : ""}/>`;
  }
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>${soft ? `<filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${opt.blur || 48}"/></filter>` : ""}</defs><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${opt.wash || "#0B1117"}"/>${img}${soft ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${opt.wash || "#0B1117"}" opacity="${opt.washOpacity == null ? 0.5 : opt.washOpacity}"/>` : ""}</g>`;
}
function defs(id, stops) {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient></defs>`;
}
/* headline size from length */
function sizeFor(len, big, mid, small, tiny) {
  return len <= 18 ? big : len <= 34 ? mid : len <= 56 ? small : tiny;
}

/* ============================================================
   THE COVER, 1080 by 1350
   Two prints on the dark contour field. The post as it was sits
   behind, small and tilted the other way. The remake sits in front,
   large, with the drawn arrow between them, and "What if" below.
   For a six slide episode the front print is the brand's photo
   in the style's own colour, since the first slide is drawn from it.
   ============================================================ */
function printFrame(x, y, w, h, rot, inner, opt = {}) {
  const pad = opt.pad == null ? 14 : opt.pad;
  const cx = x + w / 2, cy = y + h / 2;
  return `<g transform="rotate(${rot} ${cx} ${cy})"${opt.opacity != null ? ` opacity="${opt.opacity}"` : ""}>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${opt.paper || C.paperHi}" filter="url(#${opt.shadow || "sh"})"/>
${inner(x + pad, y + pad, w - pad * 2, h - pad * 2)}
<rect x="${x + pad}" y="${y + pad}" width="${w - pad * 2}" height="${h - pad * 2}" fill="none" stroke="rgba(22,36,28,.16)"/>
${opt.tag ? fo(x + pad + 14, y + pad + 14, w - pad * 2 - 28, 60, `<div style="display:flex;justify-content:${opt.tagAt === "right" ? "flex-end" : "flex-start"};align-items:flex-start"><span style="display:inline-flex;align-items:center;gap:14px;height:${Math.round((opt.tagSize || 20) * 2.3)}px;padding:0 ${Math.round((opt.tagSize || 20) * 0.9)}px;border-radius:6px;font:400 ${opt.tagSize || 20}px/1 ${F.mono};letter-spacing:.14em;text-transform:uppercase;color:${opt.tagColor || C.paper};background:${opt.tagBg || "rgba(22,36,28,.8)"};white-space:nowrap"><span>${esc(opt.tag)}</span>${opt.tagRight ? `<span style="opacity:.8">${esc(opt.tagRight)}</span>` : ""}</span></div>`) : ""}
</g>`;
}
/* the drawn route arrow, one curve and a head, in the accent */
function drawnArrow(x1, y1, x2, y2, bend, width = 5) {
  const mx = (x1 + x2) / 2 + bend, my = (y1 + y2) / 2 - Math.abs(bend) * 0.6;
  const dx = x2 - mx, dy = y2 - my, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  const h = 26;
  const hl = [x2 - h * (ux * Math.cos(0.5) - uy * Math.sin(0.5)), y2 - h * (uy * Math.cos(0.5) + ux * Math.sin(0.5))];
  const hr = [x2 - h * (ux * Math.cos(-0.5) - uy * Math.sin(-0.5)), y2 - h * (uy * Math.cos(-0.5) + ux * Math.sin(-0.5))];
  const f = (n) => Math.round(n * 10) / 10;
  return `<path d="M${x1} ${y1} Q ${f(mx)} ${f(my)}, ${x2} ${y2}" fill="none" stroke="${C.accentSoft}" stroke-width="${width}" stroke-linecap="round"/><path d="M${f(hl[0])} ${f(hl[1])} L${x2} ${y2} L${f(hr[0])} ${f(hr[1])}" fill="none" stroke="${C.accentSoft}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function afterInner(ep, href, remakeHref) {
  const b = ep.brand;
  if (remakeHref) return (x, y, w, h) => photoRaw(remakeHref, x, y, w, h, "slice", { dims: ep.remake.dims, crop: { x: 0, y: 0, w: 1, h: 1 } });
  const s = (STYLES[ep.style] || STYLES.photoposter)(b);
  const treat = { focus: b.photoFocus, zoom: b.photoZoom, treat: b.photoTreat, blur: b.photoBlur, wash: b.photoWash || s.bg, washOpacity: b.photoWashOpacity, crop: b.photoCrop, dims: b.dims };
  return (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${s.bg}"/>` + photoRaw(href, x, y, w, h, "slice", treat);
}
/* the post as it was keeps its whole frame, so a square or landscape post sits on a dark field */
function beforeInner(ep, href) {
  const d = ep.brand.dims || { w: 1080, h: 1350 };
  const fit = Math.abs(d.h / d.w - 1.25) > 0.08 ? "meet" : "slice";
  return (x, y, w, h) => photoRaw(href, x, y, w, h, fit, { focus: "center" });
}
function cover(ep, seed, href, remakeHref) {
  const rest = stripWhatIf(ep.coverLine);
  const react = ep.brand.engagement;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="30" stdDeviation="28" flood-color="#000" flood-opacity=".6"/></filter>
<filter id="sh2" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".5"/></filter>
<radialGradient id="glow" cx="78%" cy="30%" r="60%"><stop offset="0" stop-color="${C.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="${C.inkDeep}"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<g opacity=".11">${contourPaths({ w: W, h: H, seed, levels: 12, cell: 26, stroke: C.paper, width: 1.4 })}</g>
${fo(72, 64, 936, 80, `<div style="display:flex;justify-content:space-between;align-items:flex-start">${chipHtml(ep.clientType, C.paper, "rgba(241,244,236,.55)")}${chipHtml("Episode " + String(ep.number).padStart(2, "0"), C.accentSoft, "rgba(232,178,92,.6)")}</div>`)}
${printFrame(64, 196, 400, 500, -7, beforeInner(ep, href), { shadow: "sh2", opacity: .92, tag: "Before", tagRight: react, tagSize: 18, paper: C.paperDeep })}
${printFrame(392, 136, 624, 780, 3.5, afterInner(ep, href, remakeHref), { tag: "The remake", tagSize: 19, tagColor: C.inkDeep, tagBg: "rgba(232,178,92,.94)", tagAt: "right" })}
${drawnArrow(236, 742, 406, 880, -40, 6)}
${fo(72, 950, 936, 270, `<div style="display:flex;flex-direction:column;justify-content:flex-end;height:270px"><div style="font:500 176px/.9 ${F.head};letter-spacing:-.045em;color:${C.paper}">What if</div><div style="margin-top:22px;font:500 ${sizeFor(rest.length, 60, 54, 48, 42)}px/1.1 ${F.head};letter-spacing:-.03em;color:${C.accentSoft};max-width:920px;text-wrap:balance">${esc(rest)}</div></div>`)}
${fo(72, 1240, 936, 56, `<div style="display:flex;justify-content:space-between;align-items:center;height:56px">${wordmark(C.paper, C.accentSoft, 42)}<span style="font:400 23px/1 ${F.mono};letter-spacing:.08em;color:rgba(241,244,236,.62)">pratimnarayan.com/whatif</span></div>`)}
</svg>`;
}

/* ============================================================
   THE OPEN GRAPH PREVIEW, 1200 by 630, the same two prints
   ============================================================ */
function og(ep, seed, href, remakeHref) {
  const w = 1200, h = 630;
  const rest = stripWhatIf(ep.coverLine);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#000" flood-opacity=".6"/></filter>
<filter id="sh2" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#000" flood-opacity=".5"/></filter>
<radialGradient id="glow" cx="80%" cy="40%" r="55%"><stop offset="0" stop-color="${C.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="${C.inkDeep}"/>
<rect width="${w}" height="${h}" fill="url(#glow)"/>
<g opacity=".11">${contourPaths({ w, h, seed, levels: 10, cell: 26, stroke: C.paper, width: 1.3 })}</g>
${fo(64, 52, 580, 60, `<div style="display:flex;gap:12px;align-items:flex-start">${chipHtml(ep.clientType, C.paper, "rgba(241,244,236,.55)", 18)}${chipHtml("Episode " + String(ep.number).padStart(2, "0"), C.accentSoft, "rgba(232,178,92,.6)", 18)}</div>`)}
${printFrame(660, 150, 236, 295, -8, beforeInner(ep, href), { shadow: "sh2", opacity: .92, pad: 9, tag: "Before", tagSize: 13, paper: C.paperDeep })}
${printFrame(846, 60, 316, 395, 4, afterInner(ep, href, remakeHref), { pad: 9, tag: "The remake", tagSize: 13, tagColor: C.inkDeep, tagBg: "rgba(232,178,92,.94)", tagAt: "right" })}
${drawnArrow(760, 470, 868, 448, -24, 4)}
${fo(64, 150, 580, 380, `<div style="display:flex;flex-direction:column;justify-content:flex-end;height:380px"><div style="font:500 150px/.9 ${F.head};letter-spacing:-.045em;color:${C.paper}">What if</div><div style="margin-top:20px;font:500 ${sizeFor(rest.length, 46, 42, 36, 30)}px/1.1 ${F.head};letter-spacing:-.025em;color:${C.accentSoft};max-width:580px;text-wrap:balance">${esc(rest)}</div></div>`)}
${fo(64, 552, 1072, 44, `<div style="display:flex;justify-content:space-between;align-items:center;height:44px">${wordmark(C.paper, C.accentSoft, 34)}<span style="font:400 20px/1 ${F.mono};letter-spacing:.08em;color:rgba(241,244,236,.62)">pratimnarayan.com/whatif</span></div>`)}
</svg>`;
}

/* ============================================================
   THE POST AS IT IS, 1080 by 1350. Nothing is cropped away, so a
   square or 3 by 4 post sits on a dark field.
   ============================================================ */
function before(ep, href, ratio) {
  const fit = ratio && Math.abs(ratio - 1.25) > 0.08 ? "meet" : "slice";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#101614"/>
${photoRaw(href, 0, 0, W, H, fit)}
</svg>`;
}

/* ============================================================
   THE REMAKE SLIDES
   Each style is a palette plus a photo layout. A slide has a
   headline, an optional line, an optional list of items, an
   optional big stat, and photo true or false. The first slide is
   the hook, the last one the call to action.
   ============================================================ */
const STYLES = {
  quietlux: (b) => ({ bg: "#F3EFE6", fg: "#2B2A26", mid: "#6B675E", acc: b.color, headFont: F.soft, headWeight: 300, caseUpper: false, layout: "inset", tracking: "-.01em" }),
  editorial: (b) => ({ bg: b.dark || darken(b.color, 0.6), fg: "#F5F1E8", mid: "rgba(245,241,232,.78)", acc: b.color, headFont: F.serif, headWeight: 400, caseUpper: false, layout: "center", tracking: "-.01em" }),
  epic: (b) => ({ bg: "#101417", fg: "#FFFFFF", mid: "rgba(255,255,255,.8)", acc: b.color, headFont: F.head, headWeight: 700, caseUpper: false, layout: "bottom", tracking: "-.035em" }),
  moody: (b) => ({ bg: "#0E1316", fg: "#E9E6DF", mid: "rgba(233,230,223,.72)", acc: b.color, headFont: F.serif, headWeight: 400, caseUpper: false, layout: "lowcenter", tracking: "-.005em" }),
  documentary: (b) => ({ bg: "#F6F2E9", fg: "#1F2420", mid: "#5A5F58", acc: b.color, headFont: F.head, headWeight: 500, caseUpper: false, layout: "band", tracking: "-.025em" }),
  warm: (b) => ({ bg: "#F7EFE2", fg: "#3A2E24", mid: "#7A6A5B", acc: b.color, headFont: F.hand, headWeight: 600, caseUpper: false, layout: "polaroid", tracking: "0" }),
  creator: (b) => ({ bg: b.color, fg: onColor(b.color), mid: rgba(onColor(b.color), 0.78), acc: b.second || "#FFFFFF", headFont: F.head, headWeight: 700, caseUpper: false, layout: "caption", tracking: "-.03em" }),
  texthook: (b) => ({ bg: b.color, fg: onColor(b.color), mid: rgba(onColor(b.color), 0.78), acc: b.second || "#FFFFFF", headFont: F.head, headWeight: 700, caseUpper: false, layout: "hook", tracking: "-.035em" }),
  boldgraphic: (b) => ({ bg: b.color, fg: onColor(b.color), mid: rgba(onColor(b.color), 0.78), acc: b.second || onColor(b.color), headFont: F.impact, headWeight: 400, caseUpper: true, layout: "graphic", tracking: ".005em" }),
  meme: (b) => ({ bg: "#FFFFFF", fg: "#111111", mid: "#555555", acc: b.color, headFont: F.head, headWeight: 700, caseUpper: false, layout: "topbar", tracking: "-.03em" }),
  signature: (b) => ({ bg: b.pastel || lighten(b.color, 0.78), fg: darken(b.color, 0.35), mid: darken(b.color, 0.15), acc: b.color, headFont: F.condensed, headWeight: 400, caseUpper: true, layout: "frame", tracking: ".02em" }),
  photoposter: (b) => ({ bg: b.color, fg: onColor(b.color), mid: rgba(onColor(b.color), 0.78), acc: b.second || onColor(b.color), headFont: F.head, headWeight: 500, caseUpper: false, layout: "poster", tracking: "-.03em" })
};

function headHtml(s, text, px, color, extra = "") {
  const t = s.caseUpper ? text.toUpperCase() : text;
  return `<div style="font:${s.headWeight} ${px}px/${s.headFont === F.impact || s.headFont === F.condensed ? 1 : s.headFont === F.hand ? 1.1 : 1.04} ${s.headFont};letter-spacing:${s.tracking};color:${color};text-wrap:balance;${extra}">${esc(t)}</div>`;
}
function lineHtml(text, px, color, font = F.body, extra = "") {
  return `<div style="font:400 ${px}px/1.35 ${font};color:${color};${extra}">${esc(text)}</div>`;
}
function listHtml(items, px, color, acc, font = F.body) {
  return `<div style="display:flex;flex-direction:column;gap:${Math.round(px * 0.55)}px">${items.map((it, i) => `<div style="display:flex;gap:26px;align-items:flex-start;font:500 ${px}px/1.25 ${font};color:${color}"><span style="flex:none;font:400 ${Math.round(px * 0.6)}px/1 ${F.mono};color:${acc};padding-top:${Math.round(px * 0.25)}px">${String(i + 1).padStart(2, "0")}</span><span>${esc(it)}</span></div>`).join("")}</div>`;
}
function footerHtml(i, total, ep, color, border) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;height:60px;font:400 24px/1 ${F.mono};letter-spacing:.12em;text-transform:uppercase;color:${color}"><span>${i + 1} / ${total}</span><span>${esc(ep.brand.handle)}</span><span style="border:1.5px solid ${border};border-radius:4px;padding:12px 16px 11px;font-size:19px;letter-spacing:.14em">Concept by Pratim</span></div>`;
}
function statHtml(s, stat, color) {
  return `<div style="font:${s.headFont === F.impact || s.headFont === F.condensed ? 400 : 500} 260px/.9 ${s.headFont === F.hand ? F.head : s.headFont};letter-spacing:-.04em;color:${color}">${esc(stat)}</div>`;
}

/* the body of a slide, as HTML, in a box */
function body(s, sl, fg, mid, acc, sizes) {
  const parts = [];
  if (sl.kicker) parts.push(`<div style="font:400 24px/1 ${F.mono};letter-spacing:.18em;text-transform:uppercase;color:${acc};margin-bottom:30px">${esc(sl.kicker)}</div>`);
  if (sl.stat) parts.push(statHtml(s, sl.stat, fg) + `<div style="height:28px"></div>`);
  const hs = sl.stat ? sizes.small : sizeFor(sl.headline.length, sizes.big, sizes.mid, sizes.small, sizes.tiny);
  parts.push(headHtml(s, sl.headline, hs, fg));
  if (sl.line) parts.push(`<div style="height:${Math.round(hs * 0.42)}px"></div>` + lineHtml(sl.line, sizes.line, mid));
  if (sl.items && sl.items.length) parts.push(`<div style="height:${Math.round(hs * 0.5)}px"></div>` + listHtml(sl.items, sizes.item, fg, acc));
  return parts.join("");
}

function slide(ep, i, total, seed, href0) {
  const b = ep.brand;
  const treat = { focus: b.photoFocus, zoom: b.photoZoom, treat: b.photoTreat, blur: b.photoBlur, wash: b.photoWash, washOpacity: b.photoWashOpacity, crop: b.photoCrop, dims: b.dims };
  const href = href0;
  const photo = (h, x, y, w, hh, fit = "slice") => photoRaw(h, x, y, w, hh, fit, treat);
  const s = (STYLES[ep.style] || STYLES.photoposter)(b);
  const sl = ep.remakeSlides[i];
  const hasPhoto = !!sl.photo;
  const sizes = s.headFont === F.impact ? { big: 190, mid: 150, small: 112, tiny: 88, line: 40, item: 46 }
    : s.headFont === F.condensed ? { big: 220, mid: 170, small: 128, tiny: 100, line: 40, item: 48 }
    : s.headFont === F.hand ? { big: 150, mid: 120, small: 96, tiny: 78, line: 40, item: 46 }
    : s.headFont === F.serif || s.headFont === F.soft ? { big: 150, mid: 120, small: 96, tiny: 74, line: 40, item: 44 }
    : { big: 136, mid: 108, small: 86, tiny: 68, line: 42, item: 44 };
  const L = s.layout;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;

  if (!hasPhoto) {
    /* text slides, every style */
    out += `<rect width="${W}" height="${H}" fill="${s.bg}"/>`;
    if (L === "graphic" || L === "frame") out += `<rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="${rgba(s.fg, 0.25)}" stroke-width="2"/>`;
    if (L === "inset" || L === "band" || L === "polaroid") out += `<g opacity=".05">${contourPaths({ w: W, h: H, seed: seed + i * 17, levels: 10, cell: 28, stroke: s.fg, width: 1.2 })}</g>`;
    if (L === "topbar") out += `<rect x="0" y="0" width="${W}" height="24" fill="${s.acc}"/>`;
    const align = L === "center" || L === "lowcenter" || L === "inset" || L === "hook" ? "center" : "flex-start";
    const just = L === "lowcenter" || L === "bottom" || L === "caption" ? "flex-end" : "center";
    out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:${just};align-items:${align};text-align:${align === "center" ? "center" : "left"};height:1050px">${body(s, sl, s.fg, s.mid, s.acc, sizes)}</div>`);
    out += fo(96, 1230, 888, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.3)));
    return out + `</svg>`;
  }

  /* photo slides */
  const tone = s.bg;
  const white = "#FFFFFF";
  if (b.photoTreat === "soft") {
    /* the post has no clean photo, so it becomes a colour field under the type */
    out += photo(href, 0, 0, W, H);
    out += defs("gs", [[0, "#000", 0.1], [1, "#000", 0.45]]) + `<rect width="${W}" height="${H}" fill="url(#gs)"/>`;
    out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:1050px;text-shadow:0 3px 24px rgba(0,0,0,.45)">${sl.kicker ? `<div style="font:400 26px/1 ${F.mono};letter-spacing:.2em;text-transform:uppercase;color:${s.acc && s.acc !== s.fg ? s.acc : "rgba(255,255,255,.8)"};margin-bottom:34px">${esc(sl.kicker)}</div>` : ""}${sl.stat ? statHtml(s, sl.stat, white) + `<div style="height:28px"></div>` : ""}${headHtml(s, sl.headline, sl.stat ? sizes.small : sizeFor(sl.headline.length, sizes.big, sizes.mid, sizes.small, sizes.tiny), white)}${sl.line ? `<div style="margin-top:36px;font:500 40px/1.35 ${F.body};color:rgba(255,255,255,.9);max-width:820px">${esc(sl.line)}</div>` : ""}${sl.items ? `<div style="margin-top:40px">${listHtml(sl.items, 44, white, "rgba(255,255,255,.7)")}</div>` : ""}</div>`);
    out += fo(96, 1230, 888, 60, footerHtml(i, total, ep, "rgba(255,255,255,.8)", "rgba(255,255,255,.4)"));
    return out + `</svg>`;
  }
  if (L === "bottom" || L === "hook" || L === "caption" || L === "lowcenter" || L === "center") {
    out += photo(href, 0, 0, W, H);
    if (L === "lowcenter" || L === "center") out += `<rect width="${W}" height="${H}" fill="#06090B" opacity="${L === "lowcenter" ? ".42" : ".30"}"/>`;
    out += defs("g1", L === "center" ? [[0, "#000", 0.25], [0.5, "#000", 0.1], [1, "#000", 0.55]] : [[0, "#000", 0.08], [0.42, "#000", 0.08], [1, "#000", 0.82]]) + `<rect width="${W}" height="${H}" fill="url(#g1)"/>`;
    const ps = { ...sizes, line: 40 };
    if (L === "caption") {
      /* creator led, a burned in caption box like a phone edit */
      out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;height:1050px;gap:26px">${sl.kicker ? `<span style="display:inline-block;font:700 28px/1 ${F.head};letter-spacing:.06em;text-transform:uppercase;color:${onColor(s.acc)};background:${s.acc};padding:16px 22px;border-radius:8px">${esc(sl.kicker)}</span>` : ""}<div style="display:inline;font:700 ${sizeFor(sl.headline.length, 96, 80, 66, 54)}px/1.3 ${F.head};letter-spacing:-.02em;color:#111;background:#fff;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:6px 22px;border-radius:10px;text-wrap:balance">${esc(sl.headline)}</div>${sl.line ? `<div style="font:600 38px/1.35 ${F.body};color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6);max-width:820px">${esc(sl.line)}</div>` : ""}</div>`);
    } else if (L === "hook") {
      out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:1050px;text-shadow:0 4px 30px rgba(0,0,0,.55)">${sl.kicker ? `<div style="font:400 26px/1 ${F.mono};letter-spacing:.2em;text-transform:uppercase;color:${s.acc};margin-bottom:34px">${esc(sl.kicker)}</div>` : ""}${headHtml(s, sl.headline, sizeFor(sl.headline.length, 150, 120, 96, 76), white)}${sl.line ? `<div style="margin-top:36px;font:600 40px/1.35 ${F.body};color:rgba(255,255,255,.92);max-width:760px">${esc(sl.line)}</div>` : ""}</div>`);
    } else if (L === "center") {
      out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:1050px">${sl.kicker ? `<div style="font:400 26px/1 ${F.mono};letter-spacing:.2em;text-transform:uppercase;color:${white};opacity:.85;margin-bottom:34px">${esc(sl.kicker)}</div>` : ""}${headHtml(s, sl.headline, sizeFor(sl.headline.length, 170, 136, 108, 84), white)}${sl.line ? `<div style="margin-top:34px;font:italic 400 46px/1.3 ${F.serif};color:rgba(255,255,255,.9);max-width:760px">${esc(sl.line)}</div>` : ""}</div>`);
    } else if (L === "lowcenter") {
      out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:center;text-align:center;height:1050px;padding-bottom:40px">${sl.kicker ? `<div style="font:400 24px/1 ${F.mono};letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:30px">${esc(sl.kicker)}</div>` : ""}${headHtml(s, sl.headline, sizeFor(sl.headline.length, 140, 112, 92, 72), "#F1EEE6")}${sl.line ? `<div style="margin-top:30px;font:400 38px/1.4 ${F.body};color:rgba(241,238,230,.8);max-width:720px">${esc(sl.line)}</div>` : ""}</div>`);
    } else {
      /* bottom left, epic scenery */
      out += fo(96, 120, 888, 1050, `<div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;height:1050px">${sl.kicker ? `<div style="font:400 24px/1 ${F.mono};letter-spacing:.2em;text-transform:uppercase;color:${s.acc};margin-bottom:30px">${esc(sl.kicker)}</div>` : ""}<div style="width:96px;height:6px;background:${s.acc};margin-bottom:34px"></div>${headHtml(s, sl.headline, sizeFor(sl.headline.length, 140, 112, 90, 72), white)}${sl.line ? `<div style="margin-top:30px;font:500 ${ps.line}px/1.35 ${F.body};color:rgba(255,255,255,.88);max-width:780px">${esc(sl.line)}</div>` : ""}</div>`);
    }
    out += fo(96, 1230, 888, 60, footerHtml(i, total, ep, "rgba(255,255,255,.8)", "rgba(255,255,255,.4)"));
    return out + `</svg>`;
  }

  if (L === "band") {
    /* documentary, photo above a paper band with field notes */
    const bandY = 900;
    out += `<rect width="${W}" height="${H}" fill="${tone}"/>` + photo(href, 0, 0, W, bandY);
    out += fo(72, bandY + 48, 936, 300, `<div style="display:flex;flex-direction:column;justify-content:flex-start;height:300px">${sl.kicker ? `<div style="font:400 22px/1 ${F.mono};letter-spacing:.2em;text-transform:uppercase;color:${s.acc};margin-bottom:22px">${esc(sl.kicker)}</div>` : ""}${headHtml(s, sl.headline, sizeFor(sl.headline.length, 76, 64, 54, 46), s.fg)}${sl.line ? `<div style="margin-top:18px;font:400 32px/1.4 ${F.body};color:${s.mid};max-width:900px">${esc(sl.line)}</div>` : ""}</div>`);
    out += fo(72, 1250, 936, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.3)));
    return out + `</svg>`;
  }

  if (L === "poster") {
    /* photo poster done well, photo top, one headline in the band */
    const bandY = 940;
    out += `<rect width="${W}" height="${H}" fill="${s.bg}"/>` + photo(href, 0, 0, W, bandY);
    out += fo(72, bandY + 54, 936, 240, `<div style="display:flex;flex-direction:column;justify-content:center;height:240px">${headHtml(s, sl.headline, sizeFor(sl.headline.length, 84, 70, 58, 48), s.fg)}${sl.line ? `<div style="margin-top:18px;font:500 32px/1.35 ${F.body};color:${s.mid}">${esc(sl.line)}</div>` : ""}</div>`);
    out += fo(72, 1250, 936, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.35)));
    return out + `</svg>`;
  }

  if (L === "topbar") {
    /* meme, white bar of text above the photo */
    const barH = 420;
    out += `<rect width="${W}" height="${H}" fill="#fff"/><rect x="0" y="0" width="${W}" height="24" fill="${s.acc}"/>` + photo(href, 0, barH, W, H - barH);
    out += fo(72, 60, 936, barH - 90, `<div style="display:flex;flex-direction:column;justify-content:center;height:${barH - 90}px">${headHtml(s, sl.headline, sizeFor(sl.headline.length, 92, 76, 62, 50), "#111")}${sl.line ? `<div style="margin-top:16px;font:500 34px/1.35 ${F.body};color:#444">${esc(sl.line)}</div>` : ""}</div>`);
    out += fo(72, 1250, 936, 60, footerHtml(i, total, ep, "rgba(255,255,255,.85)", "rgba(255,255,255,.45)"));
    return out + `</svg>`;
  }

  if (L === "inset") {
    /* quiet luxury, the photo inset with air around it */
    out += `<rect width="${W}" height="${H}" fill="${s.bg}"/>` + photo(href, 120, 120, 840, 900);
    out += fo(120, 1050, 840, 160, `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:160px">${headHtml(s, sl.headline, sizeFor(sl.headline.length, 62, 54, 46, 40), s.fg)}${sl.line ? `<div style="margin-top:14px;font:400 28px/1.4 ${F.body};color:${s.mid};letter-spacing:.01em">${esc(sl.line)}</div>` : ""}</div>`);
    out += fo(120, 1240, 840, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.25)));
    return out + `</svg>`;
  }

  if (L === "frame") {
    /* signature colour, a thick colour frame around the photo */
    out += `<rect width="${W}" height="${H}" fill="${s.bg}"/>` + photo(href, 84, 84, 912, 1000);
    out += fo(84, 1110, 912, 110, `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:110px">${headHtml(s, sl.headline, sizeFor(sl.headline.length, 84, 72, 60, 50), s.fg)}${sl.line ? `<div style="margin-top:8px;font:400 26px/1.3 ${F.mono};letter-spacing:.14em;text-transform:uppercase;color:${s.mid}">${esc(sl.line)}</div>` : ""}</div>`);
    out += fo(84, 1240, 912, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.3)));
    return out + `</svg>`;
  }

  if (L === "polaroid") {
    /* warm lifestyle, a tilted print with a handwritten note */
    out += `<rect width="${W}" height="${H}" fill="${s.bg}"/><g opacity=".05">${contourPaths({ w: W, h: H, seed: seed + i * 17, levels: 10, cell: 28, stroke: s.fg, width: 1.2 })}</g>`;
    out += `<defs><filter id="ps" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#3A2E24" flood-opacity=".35"/></filter></defs>`;
    out += `<g transform="rotate(-3 540 540)"><rect x="150" y="96" width="780" height="860" fill="#FFFDF8" filter="url(#ps)"/>${photo(href, 180, 126, 720, 720)}</g>`;
    out += fo(120, 1030, 840, 190, `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:190px">${headHtml(s, sl.headline, sizeFor(sl.headline.length, 80, 68, 58, 48), s.fg)}${sl.line ? `<div style="margin-top:10px;font:500 30px/1.35 ${F.body};color:${s.mid}">${esc(sl.line)}</div>` : ""}</div>`);
    out += fo(120, 1240, 840, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.3)));
    return out + `</svg>`;
  }

  /* graphic, bold type with the photo as a tile */
  out += `<rect width="${W}" height="${H}" fill="${s.bg}"/><rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="${rgba(s.fg, 0.25)}" stroke-width="2"/>`;
  out += photo(href, 96, 96, 888, 560);
  out += fo(96, 700, 888, 500, `<div style="display:flex;flex-direction:column;justify-content:flex-start;height:500px">${sl.kicker ? `<div style="font:400 24px/1 ${F.mono};letter-spacing:.2em;text-transform:uppercase;color:${s.acc};margin-bottom:26px">${esc(sl.kicker)}</div>` : ""}${headHtml(s, sl.headline, sizeFor(sl.headline.length, 150, 120, 96, 76), s.fg)}${sl.line ? `<div style="margin-top:22px;font:500 36px/1.35 ${F.body};color:${s.mid};max-width:860px">${esc(sl.line)}</div>` : ""}</div>`);
  out += fo(96, 1230, 888, 60, footerHtml(i, total, ep, s.mid, rgba(s.fg, 0.3)));
  return out + `</svg>`;
}

module.exports = { cover, og, slide, before, STYLES };
