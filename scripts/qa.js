#!/usr/bin/env node
/* Loads pages in headless Chrome at several widths, records console errors,
   checks for horizontal overflow, collects links and takes screenshots.

   node scripts/qa.js --base http://localhost:4455 --out qa --widths 360,1440 --shots / /freeweek/
   flags: --reduced-motion   emulate prefers-reduced-motion
          --no-js            disable JavaScript
          --dark-shots       also screenshot with the mobile preset
   Without --shots every page in sitemap.xml plus 404.html is checked and nothing is captured. */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const ROOT = path.join(__dirname, "..");

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const base = opt("--base", "http://localhost:4455");
const out = opt("--out", path.join(os.tmpdir(), "pn-qa"));
const widths = opt("--widths", "360,1440").split(",").map(Number);
const shotsIdx = argv.indexOf("--shots");
const shotPaths = shotsIdx >= 0 ? argv.slice(shotsIdx + 1).filter((a) => a.startsWith("/")) : [];
const reduced = flag("--reduced-motion");
const noJs = flag("--no-js");

let pages = shotPaths.slice();
if (!pages.length) {
  const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  pages.push("/404.html", "/hire/");
  const eps = require("../assets/data/whatif.js").filter((e) => e.sample).map((e) => `/whatif/${e.slug}/`);
  pages.push(...eps);
}

const chrome = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].filter(Boolean).find((c) => fs.existsSync(c));
if (!chrome) { console.error("Chrome not found"); process.exit(1); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pn-qa-"));

function launch() {
  return new Promise((resolve, reject) => {
    const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", "--remote-debugging-port=0", `--user-data-dir=${path.join(tmp, "profile")}`, "about:blank"], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => { err += d; const m = err.match(/DevTools listening on (ws:\/\/\S+)/); if (m) resolve({ proc: p, ws: m[1] }); });
    p.on("exit", (c) => reject(new Error("Chrome exited " + c)));
    setTimeout(() => reject(new Error("Chrome did not start")), 20000);
  });
}
class CDP {
  constructor(url) { this.url = url; this.id = 0; this.pending = new Map(); this.handlers = []; }
  connect() { return new Promise((res, rej) => { this.ws = new WebSocket(this.url); this.ws.onopen = res; this.ws.onerror = rej; this.ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && this.pending.has(msg.id)) { const p = this.pending.get(msg.id); this.pending.delete(msg.id); msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result); } else if (msg.method) this.handlers.forEach((h) => h(msg)); }; }); }
  send(method, params, sessionId) { const id = ++this.id; return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify(Object.assign({ id, method, params: params || {} }, sessionId ? { sessionId } : {}))); }); }
}

async function main() {
  const { proc, ws } = await launch();
  const cdp = new CDP(ws); await cdp.connect();
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const S = (m, p) => cdp.send(m, p, sessionId);
  await S("Page.enable"); await S("Runtime.enable"); await S("Log.enable"); await S("Network.enable");
  if (noJs) await S("Emulation.setScriptExecutionDisabled", { value: true });
  if (reduced) await S("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const errors = [];
  const failed = [];
  cdp.handlers.push((msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails.text + " " + ((msg.params.exceptionDetails.exception || {}).description || ""));
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") errors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
    if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") errors.push(msg.params.entry.text + " " + (msg.params.entry.url || ""));
    if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400 && msg.params.response.url.startsWith(base)) failed.push(msg.params.response.status + " " + msg.params.response.url);
  });
  fs.mkdirSync(out, { recursive: true });
  const report = [];
  for (const p of pages) {
    for (const w of widths) {
      errors.length = 0; failed.length = 0;
      await S("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
      const loaded = new Promise((res) => { const h = (msg) => { if (msg.method === "Page.loadEventFired" && msg.sessionId === sessionId) { cdp.handlers.splice(cdp.handlers.indexOf(h), 1); res(); } }; cdp.handlers.push(h); });
      await S("Page.navigate", { url: base + p });
      await loaded;
      await new Promise((r) => setTimeout(r, noJs ? 300 : 900));
      const metrics = await S("Runtime.evaluate", { expression: "JSON.stringify({sw:document.documentElement.scrollWidth,iw:window.innerWidth,sh:document.documentElement.scrollHeight,links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),title:document.title,sheets:(getComputedStyle(document.body).fontFamily.indexOf('Manrope')>=0?1:0)})", returnByValue: true });
      const m = JSON.parse(metrics.result.value);
      const overflow = m.sw > m.iw;
      if (!m.sheets) errors.push("stylesheet did not load");
      const line = { page: p, width: w, overflow, errors: errors.slice(), failed: failed.slice(), links: m.links, height: m.sh };
      report.push(line);
      const mark = overflow || errors.length || failed.length ? "!!" : "ok";
      console.log(`${mark} ${String(w).padStart(4)} ${p}${overflow ? `  OVERFLOW ${m.sw}>${m.iw}` : ""}${errors.length ? `  ${errors.length} console error(s)` : ""}${failed.length ? `  ${failed.length} failed request(s)` : ""}`);
      errors.forEach((e) => console.log("      " + e.slice(0, 200)));
      failed.forEach((e) => console.log("      " + e));
      if (shotPaths.length) {
        /* the fixed header and bottom bar would repeat in a tall capture, so pin them for the shot */
        await S("Runtime.evaluate", { expression: "(function(){var t=document.getElementById('top');if(t){t.style.position='absolute';t.style.transform='none';}var d=document.getElementById('dock');if(d)d.style.display='none';})()" });
        const MAX = 8000;
        const parts = Math.max(1, Math.ceil(m.sh / MAX));
        const base = (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "-")) + `-${w}${reduced ? "-reduced" : ""}${noJs ? "-nojs" : ""}`;
        await S("Emulation.setDeviceMetricsOverride", { width: w, height: Math.min(m.sh, MAX), deviceScaleFactor: 1, mobile: w < 768 });
        await new Promise((r) => setTimeout(r, 400));
        for (let i = 0; i < parts; i++) {
          const y = i * MAX, h = Math.min(MAX, m.sh - y);
          const shot = await S("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y, width: w, height: h, scale: 1 } });
          fs.writeFileSync(path.join(out, base + (parts > 1 ? `-p${i + 1}` : "") + ".png"), Buffer.from(shot.data, "base64"));
        }
      }
    }
  }
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 1));
  const bad = report.filter((r) => r.overflow || r.errors.length || r.failed.length);
  console.log(`\n${report.length} page loads, ${bad.length} with problems. Report in ${out}/report.json`);
  await new Promise((res) => { proc.on("exit", res); proc.kill(); setTimeout(res, 3000); });
  for (let i = 0; i < 5; i++) { try { fs.rmSync(tmp, { recursive: true, force: true }); break; } catch (e) { await new Promise((r) => setTimeout(r, 300)); } }
  process.exit(bad.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
