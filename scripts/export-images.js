#!/usr/bin/env node
/* ============================================================
   Renders the generated SVGs to WebP and JPEG with Chrome, over
   the DevTools protocol, with no npm dependencies. Node 22 or
   newer has WebSocket built in.

   node scripts/export-images.js jobs.json
   The jobs file is written by build.js. Each job is
   { svg: "assets/whatif/x/cover.svg", outputs: [{ file, w, h, format, quality }] }

   Set CHROME_PATH if Chrome is somewhere unusual.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const jobsFile = process.argv[2];
if (!jobsFile) { console.error("Usage: node scripts/export-images.js jobs.json"); process.exit(2); }
const jobs = JSON.parse(fs.readFileSync(jobsFile, "utf8"));

const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);
const chrome = candidates.find((c) => fs.existsSync(c));
if (!chrome) { console.error("Chrome not found. Set CHROME_PATH."); process.exit(1); }
if (typeof WebSocket === "undefined") { console.error("This script needs Node 22 or newer (built in WebSocket)."); process.exit(1); }

/* the site fonts, plus the open licence display fonts in src/fonts that only
   the remake slides use. src/ is never served, so they add nothing to the site. */
const FACES = [
  ["assets/fonts/spacegrotesk-var.woff2", "Space Grotesk", "300 700", "normal"],
  ["assets/fonts/manrope-var.woff2", "Manrope", "200 800", "normal"],
  ["assets/fonts/spacemono-400.woff2", "Space Mono", "400", "normal"],
  ["assets/fonts/fraunces-500-italic.woff2", "Fraunces", "500", "italic"],
  ["src/fonts/fraunces-var.woff2", "Fraunces", "300 900", "normal"],
  ["src/fonts/instrumentserif-400.woff2", "Instrument Serif", "400", "normal"],
  ["src/fonts/instrumentserif-400-italic.woff2", "Instrument Serif", "400", "italic"],
  ["src/fonts/anton-400.woff2", "Anton", "400", "normal"],
  ["src/fonts/bebasneue-400.woff2", "Bebas Neue", "400", "normal"],
  ["src/fonts/caveat-var.woff2", "Caveat", "400 700", "normal"]
];
const fontCss = FACES.filter(([f]) => fs.existsSync(path.join(ROOT, f))).map(([f, fam, weight, style]) =>
  `@font-face{font-family:'${fam}';src:url(file://${path.join(ROOT, f)}) format('woff2');font-weight:${weight};font-style:${style}}`).join("\n");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pn-export-"));
const profile = path.join(tmp, "profile");

function launch() {
  return new Promise((resolve, reject) => {
    const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--allow-file-access-from-files", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => {
      err += d.toString();
      const m = err.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) resolve({ proc: p, ws: m[1] });
    });
    p.on("exit", (code) => reject(new Error("Chrome exited " + code + "\n" + err)));
    setTimeout(() => reject(new Error("Chrome did not start in time\n" + err)), 20000);
  });
}

class CDP {
  constructor(url) { this.url = url; this.id = 0; this.pending = new Map(); this.events = []; }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (m) => {
        const msg = JSON.parse(m.data);
        if (msg.id && this.pending.has(msg.id)) { const { res, rej } = this.pending.get(msg.id); this.pending.delete(msg.id); msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result); }
        else if (msg.method) this.events.forEach((fn) => fn(msg));
      };
    });
  }
  send(method, params, sessionId) {
    const id = ++this.id;
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify(Object.assign({ id, method, params: params || {} }, sessionId ? { sessionId } : {}))); });
  }
  on(fn) { this.events.push(fn); }
  close() { this.ws.close(); }
}

async function main() {
  const { proc, ws } = await launch();
  const cdp = new CDP(ws);
  await cdp.connect();
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const S = (m, p) => cdp.send(m, p, sessionId);
  await S("Page.enable");
  await S("Runtime.enable");

  let count = 0;
  const started = Date.now();
  for (const job of jobs) {
    const svgText = job.html || fs.readFileSync(path.join(ROOT, job.svg), "utf8");
    await S("Emulation.setDefaultBackgroundColorOverride", job.transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
    for (const out of job.outputs) {
      const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
html,body{margin:0;padding:0;background:${job.transparent ? "transparent" : "#fff"}}svg{display:block;width:${out.w}px;height:${out.h}px}</style></head><body>${svgText.replace(/^<\?xml[^>]*>/, "")}</body></html>`;
      const harness = path.join(tmp, "page.html");
      fs.writeFileSync(harness, html);
      await S("Emulation.setDeviceMetricsOverride", { width: out.w, height: out.h, deviceScaleFactor: 1, mobile: false });
      const loaded = new Promise((res) => { const fn = (msg) => { if (msg.method === "Page.loadEventFired" && msg.sessionId === sessionId) { cdp.events.splice(cdp.events.indexOf(fn), 1); res(); } }; cdp.on(fn); });
      await S("Page.navigate", { url: "file://" + harness + "?v=" + (++count) });
      await loaded;
      await S("Runtime.evaluate", { expression: "document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))", awaitPromise: true });
      const shot = await S("Page.captureScreenshot", { format: out.format, quality: out.format === "png" ? undefined : out.quality, clip: { x: 0, y: 0, width: out.w, height: out.h, scale: 1 }, captureBeyondViewport: true });
      const file = path.join(ROOT, out.file);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
    }
    process.stdout.write(`  ${job.svg} → ${job.outputs.length} files\n`);
  }
  console.log(`Exported ${count} images in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
  cdp.close();
  await new Promise((res) => { proc.on("exit", res); proc.kill(); setTimeout(res, 3000); });
  for (let i = 0; i < 5; i++) { try { fs.rmSync(tmp, { recursive: true, force: true }); break; } catch (e) { await new Promise((r) => setTimeout(r, 300)); } }
}

main().catch((e) => { console.error(e); process.exit(1); });
