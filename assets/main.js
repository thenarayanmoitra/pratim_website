/* pratimnarayan.com, interactions. No dependencies. */
(function () {
  "use strict";

  /* ============================================================
     SETTINGS. The only lines you should ever need to change.
     ============================================================ */
  var CONFIG = {
    calLink: "pratimnarayan/discovery-call",       // cal.com/<this>
    calOrigin: "https://cal.com",
    formspree: "https://formspree.io/f/mwvzowbe",   // records every audit, CV and checklist request
    sendFileEndpoint: "/api/send-file",             // emails the CV or checklist
    email: "pratimxnarayan@gmail.com"
  };

  var root = document.documentElement;
  root.classList.remove("no-js");
  var hasIO = "IntersectionObserver" in window;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function track(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  }
  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }
  function tween(ms, fn, done) {
    if (reduceMotion) { fn(1); if (done) done(); return; }
    var start = null;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min((t - start) / ms, 1);
      fn(easeOut(k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    }
    requestAnimationFrame(step);
  }
  function once(el, threshold, fn) {
    if (!el) return;
    if (!hasIO) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); fn(); }
    }, { threshold: threshold });
    io.observe(el);
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav hairline, reading progress, current section ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  if (nav) {
    var ticking = false;
    var onScroll = function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle("scrolled", y > 8);
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty("--p", max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
      }
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  var navLinks = $$(".nav__links a");
  if (navLinks.length && hasIO) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = byId[en.target.id];
        if (link) link.classList.toggle("is-here", en.isIntersecting);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) so.observe(s);
    });
  }

  /* ---------- scroll reveals, one shot ---------- */
  var revealEls = $$(".reveal");
  if (hasIO && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ============================================================
     RESULTS. The one number that counts up, when it's on screen.
     ============================================================ */
  var growth = document.getElementById("growth");
  var growthCount = document.getElementById("growthCount");
  if (growth && growthCount) {
    var from = parseFloat(growthCount.getAttribute("data-from"));
    var to = parseFloat(growthCount.getAttribute("data-to"));
    if (hasIO && !reduceMotion) growthCount.textContent = from.toFixed(2) + "K";
    once(growth, 0.45, function () {
      setTimeout(function () {
        tween(1800, function (k) {
          growthCount.textContent = (from + (to - from) * k).toFixed(2) + "K";
        }, function () { growth.classList.add("counted"); });
      }, reduceMotion ? 0 : 250);
    });
  }

  /* ============================================================
     CONCEPT POSTERS. A sideways strip, then a full carousel viewer.
     ============================================================ */
  var strip = document.getElementById("strip");
  var stripBar = document.getElementById("stripBar");
  var stripArrows = $$("[data-strip]");
  if (strip) {
    var syncStrip = function () {
      var max = strip.scrollWidth - strip.clientWidth;
      var x = strip.scrollLeft;
      if (stripBar) stripBar.style.setProperty("--s", Math.max(strip.clientWidth / strip.scrollWidth, Math.min((x + strip.clientWidth) / strip.scrollWidth, 1)).toFixed(4));
      stripArrows.forEach(function (b) {
        var dir = +b.getAttribute("data-strip");
        b.disabled = dir < 0 ? x <= 4 : x >= max - 4;
      });
    };
    strip.addEventListener("scroll", function () { requestAnimationFrame(syncStrip); }, { passive: true });
    window.addEventListener("resize", syncStrip);
    syncStrip();
    stripArrows.forEach(function (b) {
      b.addEventListener("click", function () {
        var card = strip.querySelector(".poster");
        var step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(strip).columnGap || 20) : 320;
        var n = Math.max(1, Math.floor(strip.clientWidth / step) - 1);
        strip.scrollBy({ left: +b.getAttribute("data-strip") * step * n, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbTrack = document.getElementById("lbTrack");
    var lbTitle = document.getElementById("lbTitle");
    var lbCount = document.getElementById("lbCount");
    var lbDots = document.getElementById("lbDots");
    var lbPrev = document.getElementById("lbPrev");
    var lbNext = document.getElementById("lbNext");
    var lbTotal = 0, lbIndex = 0;

    var lbSync = function () {
      var w = lbTrack.clientWidth || 1;
      lbIndex = Math.max(0, Math.min(lbTotal - 1, Math.round(lbTrack.scrollLeft / w)));
      lbCount.textContent = (lbIndex + 1) + " of " + lbTotal;
      $$("i", lbDots).forEach(function (d, i) { d.classList.toggle("on", i === lbIndex); });
      lbPrev.disabled = lbIndex === 0;
      lbNext.disabled = lbIndex === lbTotal - 1;
    };
    var lbGo = function (i) {
      i = Math.max(0, Math.min(lbTotal - 1, i));
      lbTrack.scrollTo({ left: i * lbTrack.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    };
    var lbClose = function () {
      if (!lb.open) return;
      lb.classList.add("is-closing");
      setTimeout(function () { lb.classList.remove("is-closing"); lb.close(); }, reduceMotion ? 0 : 220);
    };

    $$(".poster__open").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var set = btn.getAttribute("data-set");
        lbTotal = +btn.getAttribute("data-count");
        lbTitle.textContent = btn.getAttribute("data-title");
        lbTrack.innerHTML = "";
        lbDots.innerHTML = "";
        for (var i = 1; i <= lbTotal; i++) {
          var li = document.createElement("li");
          var img = document.createElement("img");
          img.src = "assets/concepts/" + set + "-" + i + "-1080.webp";
          img.srcset = "assets/concepts/" + set + "-" + i + "-560.webp 560w, assets/concepts/" + set + "-" + i + "-1080.webp 1080w";
          img.sizes = "(max-width: 720px) 92vw, 60vh";
          img.width = 1080; img.height = 1350;
          img.alt = btn.getAttribute("data-title") + ", concept slide " + i + " of " + lbTotal;
          if (i > 2) img.loading = "lazy";
          img.decoding = "async";
          li.appendChild(img);
          lbTrack.appendChild(li);
          lbDots.appendChild(document.createElement("i"));
        }
        root.classList.add("lb-open");
        lb.showModal();
        lbTrack.scrollLeft = 0;
        lbSync();
        lbTrack.focus({ preventScroll: true });
        track("concept_open", { set: set });
      });
    });
    lbTrack.addEventListener("scroll", function () { requestAnimationFrame(lbSync); }, { passive: true });
    lbPrev.addEventListener("click", function () { lbGo(lbIndex - 1); });
    lbNext.addEventListener("click", function () { lbGo(lbIndex + 1); });
    document.getElementById("lbClose").addEventListener("click", lbClose);
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); lbGo(lbIndex + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); lbGo(lbIndex - 1); }
    });
    lb.addEventListener("cancel", function (e) { e.preventDefault(); lbClose(); });
    lb.addEventListener("close", function () { root.classList.remove("lb-open"); });
    /* a tap on the dark space around a slide closes the viewer */
    lbTrack.addEventListener("click", function (e) { if (e.target.tagName === "LI") lbClose(); });
  }

  /* ============================================================
     SAMPLE AUDIT. Tabs flip between pages of the report.
     ============================================================ */
  var viewer = document.getElementById("viewer");
  if (viewer) {
    var tabs = $$('[role="tab"]', viewer);
    var sheets = $$(".sheet", viewer);
    var first = sheets[0];

    /* hold the first page's meters back until the viewer is on screen */
    if (hasIO && !reduceMotion && first) {
      first.classList.remove("is-active");
      once(viewer, 0.25, function () { first.classList.add("is-active"); });
    }

    var showTab = function (tab, focus) {
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (!panel || tab.getAttribute("aria-selected") === "true") { if (focus) tab.focus(); return; }
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      sheets.forEach(function (s) {
        if (s === panel) return;
        s.hidden = true;
        s.classList.remove("is-active", "is-entering");
      });
      panel.hidden = false;
      void panel.offsetWidth;
      panel.classList.add("is-entering");
      requestAnimationFrame(function () { panel.classList.add("is-active"); });
      if (focus) tab.focus();
      var bar = tab.parentNode;
      if (bar.scrollWidth > bar.clientWidth) {
        bar.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: reduceMotion ? "auto" : "smooth" });
      }
      track("audit_sample_tab", { page: tab.querySelector(".vtab__name").textContent });
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { showTab(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowDown" || k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowUp" || k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === "Home") n = tabs[0];
        if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); showTab(n, true); }
      });
    });
  }

  /* ============================================================
     THE MONTHLY REPORT. One page, switched by client type.
     Sample numbers only, labelled as such on the page.
     ============================================================ */
  var REPORTS = {
    assoc: {
      who: "Sample travel association",
      measure: "New member signups, event registrations, sponsor visibility and newsletter growth.",
      stats: [["18", "new member signups", "up 7 on August"], ["214", "summit registrations", "up 31%"], ["4,180", "newsletter subscribers", "up 260"]],
      drove: ["Member spotlight carousels on LinkedIn, reshared by the members themselves", "The early bird reminder email, opened by 46% of the list"],
      next: ["Sponsor posts move to Tuesdays, when members are most active", "A registration link goes on every speaker post"]
    },
    dmc: {
      who: "Sample DMC",
      measure: "Enquiries and bookings, traced through tracked links from every post and email.",
      stats: [["41", "enquiries from social and email", "up 15 on August"], ["7", "bookings traced to a post or email", "up 4"], ["4.2%", "email click rate", "up 1.1 points"]],
      drove: ["The packing list Reel that ended on comment BASECAMP", "A spring departures email to past guests"],
      next: ["A second guide for autumn treks, to grow the list", "Static quote posts are retired, they reached almost no one"]
    },
    hotel: {
      who: "Sample boutique hotel",
      measure: "Direct booking clicks against the OTAs, plus bookings from email offers.",
      stats: [["486", "direct booking clicks", "up 18%"], ["34%", "of bookings made direct", "up 5 points on the OTAs"], ["23", "bookings from the email offer", "new this month"]],
      drove: ["The monsoon offer email to past guests", "Room tour Reels with a link to book direct"],
      next: ["A weekday offer for remote workers", "A book direct button on every Instagram highlight"]
    }
  };
  var page = document.getElementById("reportPage");
  var segs = $$(".seg__btn");
  if (page && segs.length) {
    var setList = function (id, items) {
      var ul = document.getElementById(id);
      ul.innerHTML = "";
      items.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    };
    var countTo = function (el, text) {
      var m = text.match(/^([\d,]*\.?\d+)(.*)$/);
      if (!m) { el.textContent = text; return; }
      var target = parseFloat(m[1].replace(/,/g, "")), dec = (m[1].split(".")[1] || "").length, suffix = m[2];
      tween(700, function (k) {
        var v = target * k;
        el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-GB")) + suffix;
      });
    };
    var showReport = function (btn, focus) {
      var r = REPORTS[btn.getAttribute("data-report")];
      if (!r) return;
      segs.forEach(function (s) {
        var on = s === btn;
        s.setAttribute("aria-selected", on ? "true" : "false");
        s.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      document.getElementById("rpWho").textContent = r.who;
      document.getElementById("reportMeasure").textContent = r.measure;
      r.stats.forEach(function (s, i) {
        countTo(document.getElementById("rs" + (i + 1) + "v"), s[0]);
        document.getElementById("rs" + (i + 1) + "k").textContent = s[1];
        document.getElementById("rs" + (i + 1) + "d").textContent = s[2];
      });
      setList("rpDrove", r.drove);
      setList("rpNext", r.next);
      page.classList.remove("is-swapping");
      void page.offsetWidth;
      page.classList.add("is-swapping");
      track("report_type", { type: btn.getAttribute("data-report") });
    };
    segs.forEach(function (btn, i) {
      btn.addEventListener("click", function () { showReport(btn, false); });
      btn.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = segs[(i + 1) % segs.length];
        if (e.key === "ArrowLeft") n = segs[(i - 1 + segs.length) % segs.length];
        if (n) { e.preventDefault(); showReport(n, true); }
      });
    });
  }

  /* ============================================================
     SELF CHECK. Seven questions, a score out of 10, then the audit.
     ============================================================ */
  var checkQs = document.getElementById("checkQs");
  var auditForm = document.getElementById("auditForm");
  if (checkQs) {
    var qs = $$(".q", checkQs);
    var stepEl = document.getElementById("checkStep");
    var backBtn = document.getElementById("checkBack");
    var bar = document.getElementById("checkBar");
    var play = document.getElementById("checkPlay");
    var result = document.getElementById("checkResult");
    var current = 0, advancing = null, started = false;
    var C = 2 * Math.PI * 52;

    var answered = function () { return qs.filter(function (q) { return q.querySelector("input:checked"); }).length; };
    var goTo = function (i, back) {
      qs.forEach(function (q, j) {
        q.classList.toggle("is-active", j === i);
        q.classList.toggle("is-back", j === i && !!back);
      });
      current = i;
      stepEl.textContent = "Question " + (i + 1) + " of " + qs.length;
      backBtn.hidden = i === 0;
      bar.style.setProperty("--q", (answered() / qs.length).toFixed(3));
    };

    var VERDICTS = [
      [8, "You're in good shape. The audit will find the smaller wins, and there are always a few."],
      [5, "Solid in places and leaking in others. The audit shows exactly where, with the numbers."],
      [0, "There's plenty of easy ground to win back. The audit shows you where to start."]
    ];

    var showResult = function () {
      var sum = 0, gaps = [];
      qs.forEach(function (q) {
        var input = q.querySelector("input:checked");
        var v = input ? parseFloat(input.value) : 0;
        sum += v;
        if (v < 1) gaps.push({ v: v, area: q.getAttribute("data-area"), text: q.getAttribute("data-gap") });
      });
      var score = Math.round(sum / qs.length * 10);
      gaps.sort(function (a, b) { return a.v - b.v; });

      var verdict = VERDICTS.filter(function (v) { return score >= v[0]; })[0][1];
      document.getElementById("checkVerdict").textContent = verdict;
      document.getElementById("checkScoreText").textContent = "You scored " + score + " out of 10.";
      var list = document.getElementById("checkGaps");
      list.innerHTML = "";
      (gaps.length ? gaps.slice(0, 3) : [{ area: "No gaps on these seven", text: "The full audit goes a lot deeper than seven questions." }]).forEach(function (g) {
        var li = document.createElement("li");
        var b = document.createElement("b");
        b.textContent = g.area;
        li.appendChild(b);
        li.appendChild(document.createTextNode(g.text));
        list.appendChild(li);
      });

      play.hidden = true;
      result.hidden = false;
      result.focus({ preventScroll: true });
      var fill = document.getElementById("dialFill");
      var num = document.getElementById("dialNum");
      fill.style.strokeDasharray = C.toFixed(2);
      fill.style.strokeDashoffset = C.toFixed(2);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { fill.style.strokeDashoffset = (C * (1 - score / 10)).toFixed(2); });
      });
      tween(1400, function (k) { num.textContent = Math.round(score * k); });

      if (auditForm) auditForm.elements.selfcheck_score.value = score + " out of 10";
      track("selfcheck_complete", { score: score });
    };

    checkQs.addEventListener("change", function (e) {
      if (e.target.type !== "radio") return;
      if (!started) { started = true; track("selfcheck_start"); }
      bar.style.setProperty("--q", (answered() / qs.length).toFixed(3));
      clearTimeout(advancing);
      advancing = setTimeout(function () {
        if (current < qs.length - 1) goTo(current + 1);
        else showResult();
      }, reduceMotion ? 80 : 320);
    });
    backBtn.addEventListener("click", function () {
      clearTimeout(advancing);
      if (current > 0) goTo(current - 1, true);
      var q = qs[current].querySelector("input:checked") || qs[current].querySelector("input");
      if (q) q.focus();
    });
    document.getElementById("checkAgain").addEventListener("click", function () {
      $$("input", checkQs).forEach(function (i) { i.checked = false; });
      result.hidden = true;
      play.hidden = false;
      goTo(0);
      qs[0].querySelector("input").focus();
    });
    goTo(0);
  }

  /* ============================================================
     THE AUDIT REQUEST
     Every "Request a free audit" button is a plain link to #request,
     so it works with no JavaScript. With it, the page glides there
     and, on a desktop, the cursor lands in the first field.
     ============================================================ */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-audit]");
    if (!a) return;
    track("audit_cta_click", { placement: a.getAttribute("data-audit") });
    var target = document.getElementById("request");
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", "#request");
    if (finePointer && auditForm && !auditForm.hidden) {
      setTimeout(function () { auditForm.elements.name.focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
    }
  });

  if (auditForm) {
    var aStatus = auditForm.querySelector(".form__status");
    var aBtn = auditForm.querySelector('button[type="submit"]');
    var done = document.getElementById("auditDone");

    var setErr = function (input, msg) {
      var field = input.closest(".field");
      var err = field.querySelector(".field__err");
      if (msg) {
        input.setAttribute("aria-invalid", "true");
        if (!err) {
          err = document.createElement("span");
          err.className = "field__err";
          err.id = input.id + "Err";
          field.appendChild(err);
          input.setAttribute("aria-describedby", err.id);
        }
        err.textContent = msg;
      } else {
        input.removeAttribute("aria-invalid");
        if (err) err.textContent = "";
      }
    };
    var cleanUrl = function (v) {
      v = v.trim().replace(/\s+/g, "");
      if (!v) return "";
      if (!/^https?:\/\//i.test(v)) v = "https://" + v;
      return /^https?:\/\/[^\/\s]+\.[^\/\s]{2,}/i.test(v) ? v : null;
    };

    $$("input, select", auditForm).forEach(function (el) {
      el.addEventListener("input", function () { setErr(el, ""); });
      el.addEventListener("change", function () { setErr(el, ""); });
    });

    auditForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = auditForm.elements;
      var bad = null;
      var name = f.name.value.trim();
      var email = f.email.value.trim();
      var site = cleanUrl(f.website.value);

      if (!name) { setErr(f.name, "Tell me what to call you."); bad = bad || f.name; }
      if (!EMAIL_RE.test(email)) { setErr(f.email, "That email doesn't look quite right."); bad = bad || f.email; }
      if (!site) { setErr(f.website, "Add your website, like yourbrand.com"); bad = bad || f.website; }
      if (!f.organisation.value) { setErr(f.organisation, "Pick the closest one."); bad = bad || f.organisation; }
      if (bad) { bad.focus(); return; }

      if (f.company_website.value) { auditForm.hidden = true; done.hidden = false; return; }

      aBtn.disabled = true;
      aStatus.textContent = "Sending…";
      var fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("website", site);
      fd.append("organisation", f.organisation.value);
      fd.append("request", "Free audit");
      if (f.selfcheck_score.value) fd.append("selfcheck_score", f.selfcheck_score.value);
      fd.append("_subject", "Audit request from " + name + ", " + site.replace(/^https?:\/\//i, ""));
      fd.append("_replyto", email);

      fetch(CONFIG.formspree, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; })
        .then(function (ok) {
          if (ok) {
            auditForm.hidden = true;
            done.hidden = false;
            done.focus({ preventScroll: true });
            done.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
            track("generate_lead", { lead_type: "audit", organisation: f.organisation.value });
          } else {
            aBtn.disabled = false;
            aStatus.innerHTML = "";
            aStatus.appendChild(document.createTextNode("That didn't go through. Email your website to "));
            var link = document.createElement("a");
            link.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Free audit request") + "&body=" + encodeURIComponent("Website " + site);
            link.textContent = CONFIG.email;
            aStatus.appendChild(link);
            aStatus.appendChild(document.createTextNode(" and I'll start on it."));
          }
        });
    });
  }

  /* ---------- mobile dock ----------
     Shows once the hero has scrolled away. Hides again wherever the
     audit button is already on screen, so the same ask never shows twice. */
  var dock = document.getElementById("dock");
  var hero = document.getElementById("top");
  var hideAt = $$('#request, #book, .btn[data-audit]:not([data-audit="nav"]):not([data-audit="dock"]):not([data-audit="hero"])');
  var requestBox = document.getElementById("request");
  if (requestBox && hasIO) {
    new IntersectionObserver(function (e) {
      document.body.classList.toggle("at-request", e[0].isIntersecting);
    }, { threshold: 0.2 }).observe(requestBox);
  }
  if (dock && hero && hasIO) {
    var pastHero = false, covered = [];
    var setDock = function () {
      var show = pastHero && !covered.some(Boolean);
      dock.classList.toggle("show", show);
      document.body.classList.toggle("dock-on", show);
      dock.setAttribute("aria-hidden", show ? "false" : "true");
      var a = dock.querySelector("a");
      if (a) a.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; setDock(); }).observe(hero);
    var dockIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { covered[hideAt.indexOf(en.target)] = en.isIntersecting; });
      setDock();
    }, { threshold: 0.12 });
    hideAt.forEach(function (el) { dockIO.observe(el); });
  }

  /* ============================================================
     BOOKING
     Every "Book a call" button is a plain link to cal.com, so it
     works with no JavaScript at all. Once the Cal embed has loaded,
     clicks open the calendar in a popup instead and the visitor never
     leaves the page. Until then, the link opens in a new tab.
     ============================================================ */
  var NS = "discovery-call";
  var calReady = false;
  var calRequested = false;

  function loadCal() {
    if (calRequested) return;
    calRequested = true;
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          var s = d.createElement("script");
          s.src = A; s.async = true;
          s.onload = function () { calReady = true; };
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else { p(cal, ar); }
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", NS, { origin: CONFIG.calOrigin });
    window.Cal.ns[NS]("ui", {
      cssVarsPerTheme: { light: { "cal-brand": "#16241C" }, dark: { "cal-brand": "#E8B25C" } },
      hideEventTypeDetails: false,
      layout: "month_view"
    });
  }

  /* Warm the embed up on the first sign of intent, or after the page
     has settled, so the hero never waits on a third party script. */
  ["pointerover", "touchstart", "focusin"].forEach(function (type) {
    document.addEventListener(type, function onIntent(e) {
      if (e.target.closest && e.target.closest("[data-book]")) {
        loadCal();
        document.removeEventListener(type, onIntent, true);
      }
    }, { capture: true, passive: true });
  });
  window.addEventListener("load", function () {
    var later = window.requestIdleCallback || function (fn) { return setTimeout(fn, 2500); };
    later(loadCal, { timeout: 4000 });
  });

  /* the hire page's picker feeds the booking notes */
  var selectedEngagement = "";
  function bookingNotes() {
    var phrases = { "Full time": "full time work", "Part time": "part time work", "A project": "a project" };
    return selectedEngagement ? "Interested in " + (phrases[selectedEngagement] || selectedEngagement.toLowerCase()) : "";
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-book]");
    if (!a) return;
    var placement = a.getAttribute("data-book");
    track("book_call_click", { placement: placement, engagement: selectedEngagement || "none" });

    /* modifier clicks keep normal link behaviour */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    if (!calReady || !window.Cal || !window.Cal.ns || !window.Cal.ns[NS]) return;

    e.preventDefault();
    var config = { layout: "month_view" };
    var notes = placement === "hire" ? bookingNotes() : "";
    if (notes) config.notes = notes;
    window.Cal.ns[NS]("modal", { calLink: CONFIG.calLink, config: config });
  });

  var hireBook = document.getElementById("hireBook");
  var hireNote = document.getElementById("hireNote");
  $$('input[name="engagement"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (!radio.checked) return;
      selectedEngagement = radio.value;
      track("engagement_select", { engagement: selectedEngagement });
      if (hireBook) hireBook.href = "https://cal.com/" + CONFIG.calLink + "?notes=" + encodeURIComponent(bookingNotes());
      if (hireNote) hireNote.textContent = selectedEngagement + " it is. That goes into your booking, so we start in the right place.";
    });
  });

  /* ============================================================
     EMAIL CAPTURE, for the CV and the checklist
     Two requests go out together. Formspree records the lead in your
     inbox no matter what. The Netlify function emails the file to the
     visitor. If the function is not set up yet, the visitor is told
     you will send it personally, and the Formspree email reminds you.
     ============================================================ */
  var COPY = {
    cv: {
      sent: "Sent. My CV is on its way to your inbox. If you don't see it in a couple of minutes, check your spam or promotions folder.",
      manual: "Got it. I'll email you my CV personally within one working day.",
      subject: "CV request from pratimnarayan.com"
    },
    guide: {
      sent: "Sent. The checklist is on its way to your inbox. If you don't see it in a couple of minutes, check your spam or promotions folder.",
      manual: "Got it. I'll email you the checklist personally within one working day.",
      subject: "Checklist request from pratimnarayan.com"
    }
  };

  $$("form.capture").forEach(function (form) {
    var kind = form.getAttribute("data-kind");
    var copy = COPY[kind];
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector(".capture__status");
    var btn = form.querySelector('button[type="submit"]');
    var honeypot = form.querySelector(".hp");
    if (!copy || !input) return;

    input.addEventListener("input", function () {
      input.removeAttribute("aria-invalid");
      if (status && !form.classList.contains("is-done")) status.textContent = "";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = input.value.trim();

      if (!EMAIL_RE.test(email)) {
        input.setAttribute("aria-invalid", "true");
        status.textContent = "That email doesn't look quite right. Check it and try again.";
        input.focus();
        return;
      }
      if (honeypot && honeypot.value) {
        form.classList.add("is-done");
        status.textContent = copy.sent;
        return;
      }

      btn.disabled = true;
      status.textContent = "Sending…";

      var fd = new FormData();
      fd.append("email", email);
      fd.append("request", kind === "cv" ? "CV" : "Checklist");
      if (selectedEngagement) fd.append("engagement", selectedEngagement);
      fd.append("_subject", copy.subject);

      var recorded = fetch(CONFIG.formspree, {
        method: "POST", body: fd, headers: { Accept: "application/json" }
      }).then(function (r) { return r.ok; }).catch(function () { return false; });

      var delivered = fetch(CONFIG.sendFileEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: kind, email: email, engagement: selectedEngagement })
      }).then(function (r) { return r.ok; }).catch(function () { return false; });

      Promise.all([recorded, delivered]).then(function (res) {
        var wasRecorded = res[0], wasDelivered = res[1];
        if (wasDelivered || wasRecorded) {
          form.classList.add("is-done");
          status.textContent = wasDelivered ? copy.sent : copy.manual;
          track("generate_lead", { lead_type: kind, delivered: wasDelivered });
        } else {
          btn.disabled = false;
          status.innerHTML = "";
          status.appendChild(document.createTextNode("That didn't go through. Email me at "));
          var link = document.createElement("a");
          link.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(copy.subject);
          link.textContent = CONFIG.email;
          status.appendChild(link);
          status.appendChild(document.createTextNode(" and I'll send it straight over."));
        }
      });
    });
  });
})();
