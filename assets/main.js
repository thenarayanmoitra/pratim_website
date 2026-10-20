/* pratimnarayan.com, interactions. No dependencies.
   Every page is complete before this runs. This file adds motion,
   the live clocks, the menu, the forms' inline states and tracking. */
(function () {
  "use strict";

  /* ============================================================
     SETTINGS. The only lines you should ever need to change.
     ============================================================ */
  var CONFIG = {
    calLink: "pratimnarayan/discovery-call",
    calOrigin: "https://cal.com",
    formspree: "https://formspree.io/f/mwvzowbe",
    sendFileEndpoint: "/api/send-file",
    email: "pratimxnarayan@gmail.com"
  };

  var root = document.documentElement;
  /* where the assets live, worked out from this script's own address, so the
     pages work from disk, from a subfolder and on the live site alike */
  var ASSET_BASE = (function () {
    try { return new URL("./", document.currentScript.src).href; } catch (e) { return "/assets/"; }
  })();
  var hasIO = "IntersectionObserver" in window;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function track(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  }
  function once(el, threshold, fn) {
    if (!el) return;
    if (!hasIO) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); fn(); }
    }, { threshold: threshold });
    io.observe(el);
  }
  function pageName() { return location.pathname; }

  $$(".epcard").forEach(function (card, i) { card.style.setProperty("--i", i % 5); });
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ============================================================
     LIVE CLOCKS. Hours and minutes with a dot, from the browser's
     own date formatting for each zone.
     ============================================================ */
  var clocks = $$("[data-clock]");
  if (clocks.length && window.Intl && Intl.DateTimeFormat) {
    var fmts = {};
    var timeIn = function (zone) {
      try {
        if (!fmts[zone]) fmts[zone] = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: zone });
        var parts = fmts[zone].formatToParts(new Date());
        var h = "", m = "", p = "";
        parts.forEach(function (x) {
          if (x.type === "hour") h = x.value;
          if (x.type === "minute") m = x.value;
          if (x.type === "dayPeriod") p = x.value.toLowerCase().replace(/\./g, "");
        });
        return h && m ? h + "." + m + (p ? " " + p : "") : "";
      } catch (e) { return ""; }
    };
    var tick = function () {
      clocks.forEach(function (el) {
        var t = timeIn(el.getAttribute("data-clock"));
        if (!t) return;
        var slot = el.querySelector(".pill__t");
        if (slot) slot.textContent = t;
        else el.textContent = el.getAttribute("data-place") + " " + t;
      });
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ============================================================
     HEADER. Shrinks on scroll. The menu is a full screen sheet.
     ============================================================ */
  var top = document.getElementById("top");
  var lastY = window.scrollY || 0;
  var dirDown = false;
  var scrollTicking = false;
  function onScroll() {
    scrollTicking = false;
    var y = window.scrollY || window.pageYOffset;
    if (top) top.classList.toggle("is-compact", y > 24);
    dirDown = y > lastY + 4 ? true : y < lastY - 4 ? false : dirDown;
    lastY = y;
    updateDock(y);
  }
  window.addEventListener("scroll", function () {
    if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  var menuBtn = document.getElementById("menuBtn");
  var sheet = document.getElementById("sheet");
  var menuClose = document.getElementById("menuClose");
  var inertable = [document.getElementById("top"), document.getElementById("main"), $(".footer"), document.getElementById("dock")].filter(Boolean);
  function openMenu() {
    if (!sheet || !sheet.hidden) return;
    sheet.hidden = false;
    sheet.classList.add("is-open");
    root.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    inertable.forEach(function (el) { el.inert = true; });
    (menuClose || sheet).focus();
  }
  function closeMenu(returnFocus) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    sheet.classList.remove("is-open");
    root.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    inertable.forEach(function (el) { el.inert = false; });
    if (returnFocus !== false) menuBtn.focus();
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener("click", openMenu);
    if (menuClose) menuClose.addEventListener("click", function () { closeMenu(true); });
    sheet.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (a) closeMenu(false);
    });
    sheet.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); closeMenu(true); return; }
      if (e.key !== "Tab") return;
      var focusables = $$("a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])", sheet);
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024) closeMenu(false); });
  }

  /* ============================================================
     THE MOBILE BOTTOM BAR. Shows after the first screen, slides
     away on the way down, back on the way up, hides over forms.
     ============================================================ */
  var dock = document.getElementById("dock");
  var dockMq = window.matchMedia ? window.matchMedia("(max-width: 720px)") : null;
  var formOnScreen = 0;
  var dockOn = false;
  function updateDock(y) {
    if (!dock || !dockMq || !dockMq.matches) return;
    var show = y > 280 && !dirDown && formOnScreen === 0;
    if (show === dockOn) return;
    dockOn = show;
    dock.classList.toggle("is-on", show);
    document.body.classList.toggle("dock-on", show);
    $$("a", dock).forEach(function (a) { a.tabIndex = show ? 0 : -1; });
  }
  if (dock && dockMq && dockMq.matches) {
    dock.hidden = false;
    if (hasIO) {
      var forms = $$("form:not(.capture--inline)");
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { formOnScreen += en.isIntersecting ? 1 : -1; });
        formOnScreen = Math.max(0, formOnScreen);
        updateDock(window.scrollY || 0);
      }, { threshold: 0.05 });
      forms.forEach(function (f) { fio.observe(f); });
    }
    updateDock(window.scrollY || 0);
  }

  /* ============================================================
     SECTION ENTRANCES. Nothing is hidden until this runs, and only
     what is below the first screen gets a start state.
     ============================================================ */
  var revealIO = null;
  function arm(el, i) {
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    }
    el.style.setProperty("--i", i || 0);
    el.classList.add("is-armed");
    revealIO.observe(el);
  }
  if (hasIO && !reduceMotion) {
    var vh = window.innerHeight;
    var below = function (el) { return el.getBoundingClientRect().top > vh * 0.92; };
    $$("[data-reveal]").forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      if (!kids.length || !below(kids[0])) return;
      kids.forEach(function (k, i) { arm(k, i); });
    });
    $$(".row__track").forEach(function (trk) {
      var kids = Array.prototype.slice.call(trk.children);
      if (!kids.length || !below(kids[0])) return;
      kids.forEach(function (k, i) { arm(k, i); });
    });
    $$(".head, .voice, .offer, .box, .route, .fw__stack, .tl__item, .ships__item, .about__photo, .ba, .scorecard, .bars, .facts__list > div, .howiwork__grid > div, .epgrid > .epcard, .promise, .timing, .report, .leadbox, .clocks, .latest__copy, .latest__ba, .epfeat__media, .epfeat__body, .gapchart, .gapmeter, .epchanged__art, .epchanged__body > *, .epgap__grid > div").forEach(function (el, n) {
      if (el.classList.contains("is-armed") || !below(el)) return;
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      arm(el, Math.min(sib, 4));
    });
  }

  /* ============================================================
     NUMBERS. The final number is in the HTML. When it comes into
     view it counts up from zero, keeping its prefix, suffix,
     commas and decimals. Numbers already on screen count on load.
     ============================================================ */
  if (hasIO && !reduceMotion && "requestAnimationFrame" in window) {
    $$("[data-num]").forEach(function (el) {
      var text = el.textContent.trim();
      var m = /^(.*?)([0-9][0-9,]*(?:\.[0-9]+)?)([^0-9]*)$/.exec(text);
      if (!m) return;
      var pre = m[1], raw = m[2], post = m[3];
      var target = parseFloat(raw.replace(/,/g, ""));
      if (!(target > 0)) return;
      var decimals = (raw.split(".")[1] || "").length;
      var commas = raw.indexOf(",") >= 0;
      var fmt = function (v) {
        var str = v.toFixed(decimals);
        if (commas) { var parts = str.split("."); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); str = parts.join("."); }
        return pre + str + post;
      };
      el.setAttribute("aria-label", text);
      el.style.minWidth = el.offsetWidth ? el.offsetWidth + "px" : "";
      el.textContent = fmt(0);
      var run = function () {
        var dur = 1300 + Math.min(700, raw.length * 90), t0 = null;
        var step = function (t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - k, 4);
          el.textContent = k < 1 ? fmt(target * e) : text;
          if (k < 1) requestAnimationFrame(step); else el.style.minWidth = "";
        };
        requestAnimationFrame(step);
      };
      var onScreen = el.getBoundingClientRect().top < window.innerHeight;
      if (onScreen) setTimeout(run, 650); else once(el, 0.5, run);
    });
  }

  /* ============================================================
     SCROLL PROGRESS. A thin line under the header, for browsers
     without scroll driven animations.
     ============================================================ */
  var prog = document.getElementById("progress");
  if (prog && !(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"))) {
    var setProg = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = "scaleX(" + (h > 0 ? Math.min(1, (window.scrollY || 0) / h) : 0) + ")";
    };
    window.addEventListener("scroll", function () { requestAnimationFrame(setProg); }, { passive: true });
    setProg();
  }

  /* ============================================================
     THE HERO PHONE. Tilts a few degrees toward a fine pointer.
     Dots follow the swipe.
     ============================================================ */
  var herowork = $("[data-tilt]");
  var phone = herowork && $(".phone", herowork);
  if (herowork && phone && finePointer && !reduceMotion && window.innerWidth > 880) {
    herowork.addEventListener("pointermove", function (e) {
      var r = herowork.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
      phone.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
    });
    herowork.addEventListener("pointerleave", function () {
      phone.style.setProperty("--ry", "0deg");
      phone.style.setProperty("--rx", "0deg");
    });
  }
  /* prints that tilt a few degrees toward a fine pointer */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt-card]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }
  var phoneTrack = $(".phone__track");
  var phoneDots = $$(".phone__dots i");
  if (phoneTrack && phoneDots.length) {
    phoneTrack.addEventListener("scroll", function () {
      requestAnimationFrame(function () {
        var i = Math.round(phoneTrack.scrollLeft / (phoneTrack.clientWidth || 1));
        phoneDots.forEach(function (d, n) { d.classList.toggle("on", n === i); });
      });
    }, { passive: true });
  }

  /* ============================================================
     HORIZONTAL ROWS. Native scrolling, arrows on desktop, a bar
     that shows how much is left. Never auto advance.
     ============================================================ */
  $$("[data-row]").forEach(function (row) {
    var trk = $(".row__track", row);
    var bar = $(".row__bar i", row);
    var arrows = $$("[data-dir]", row);
    if (!trk) return;
    var sync = function () {
      var max = trk.scrollWidth - trk.clientWidth;
      var x = trk.scrollLeft;
      if (bar) bar.style.setProperty("--s", Math.max(trk.clientWidth / trk.scrollWidth, Math.min((x + trk.clientWidth) / trk.scrollWidth, 1)).toFixed(4));
      arrows.forEach(function (b) {
        var dir = +b.getAttribute("data-dir");
        b.disabled = dir < 0 ? x <= 4 : x >= max - 4;
      });
    };
    trk.addEventListener("scroll", function () { requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    arrows.forEach(function (b) {
      b.addEventListener("click", function () {
        var card = trk.querySelector(".row__item");
        var step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(trk).columnGap || 20) : 320;
        var n = Math.max(1, Math.floor(trk.clientWidth / step) - 1);
        trk.scrollBy({ left: +b.getAttribute("data-dir") * step * n, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  });

  /* ============================================================
     BEFORE AND AFTER. A range input does the dragging, so touch,
     mouse and keyboard all work. The after image is clipped.
     ============================================================ */
  $$("[data-ba]").forEach(function (ba) {
    var range = $(".ba__range", ba);
    if (!range) return;
    var tracked = false;
    var set = function () {
      ba.style.setProperty("--split", range.value + "%");
      if (!tracked) { tracked = true; track("before_after_drag", { episode: ($("[data-episode]") || {}).getAttribute ? $("[data-episode]").getAttribute("data-episode") : "", where: range.id, page: pageName() }); }
    };
    range.addEventListener("input", set);
    range.addEventListener("change", set);
  });

  /* ============================================================
     CONCEPT POSTS. The full carousel viewer, moved by swipe,
     arrows or keyboard only.
     ============================================================ */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbTrack = document.getElementById("lbTrack");
    var lbTitle = document.getElementById("lbTitle");
    var lbCount = document.getElementById("lbCount");
    var lbDots = document.getElementById("lbDots");
    var lbPrev = document.getElementById("lbPrev");
    var lbNext = document.getElementById("lbNext");
    var lbTotal = 0, lbIndex = 0, lbOpener = null;
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
      setTimeout(function () { lb.classList.remove("is-closing"); lb.close(); if (lbOpener) lbOpener.focus(); }, reduceMotion ? 0 : 200);
    };
    $$(".poster__open").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var set = btn.getAttribute("data-set");
        lbOpener = btn;
        lbTotal = +btn.getAttribute("data-count");
        lbTitle.textContent = btn.getAttribute("data-title");
        lbTrack.innerHTML = "";
        lbDots.innerHTML = "";
        for (var i = 1; i <= lbTotal; i++) {
          var li = document.createElement("li");
          var img = document.createElement("img");
          img.src = ASSET_BASE + "concepts/" + set + "-" + i + "-1080.webp";
          img.srcset = ASSET_BASE + "concepts/" + set + "-" + i + "-560.webp 560w, " + ASSET_BASE + "concepts/" + set + "-" + i + "-1080.webp 1080w";
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
    lbTrack.addEventListener("click", function (e) { if (e.target.tagName === "LI") lbClose(); });
  }

  /* ============================================================
     THE SAMPLE AUDIT. Tabs flip between pages of the report.
     ============================================================ */
  var viewer = document.getElementById("viewer");
  if (viewer) {
    var tabs = $$('[role="tab"]', viewer);
    var sheets = $$(".sheet", viewer);
    var firstSheet = sheets[0];
    if (hasIO && !reduceMotion && firstSheet) {
      firstSheet.classList.remove("is-active");
      once(viewer, 0.2, function () { firstSheet.classList.add("is-active"); });
    }
    var showTab = function (tab, focus) {
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (!panel || tab.getAttribute("aria-selected") === "true") { if (focus) tab.focus(); return; }
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; });
      sheets.forEach(function (s) { if (s === panel) return; s.hidden = true; s.classList.remove("is-active", "is-entering"); });
      panel.hidden = false;
      void panel.offsetWidth;
      panel.classList.add("is-entering");
      requestAnimationFrame(function () { panel.classList.add("is-active"); });
      if (focus) tab.focus();
      var bar = tab.parentNode;
      if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: reduceMotion ? "auto" : "smooth" });
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
    assoc: { who: "sample travel association", measure: "New member signups, event registrations, sponsor visibility and newsletter growth.", stats: [["18", "new member signups", "up 7 on August"], ["214", "summit registrations", "up 31%"], ["4,180", "newsletter subscribers", "up 260"]], drove: ["Member spotlight carousels on LinkedIn, reshared by the members themselves", "The early bird reminder email, opened by 46% of the list"], next: ["Sponsor posts move to Tuesdays, when members are most active", "A registration link goes on every speaker post"], weeks: ["Speaker of the week starts, one Reel from the venue", "Member spotlight, two carousels, the sponsor post", "Early bird closes, the reminder email, the countdown", "Behind the summit, the agenda carousel, the report"], ask: "Which three speakers can I announce first?" },
    dmc: { who: "sample DMC", measure: "Enquiries and bookings, traced through tracked links from every post and email.", stats: [["41", "enquiries from social and email", "up 15 on August"], ["7", "bookings traced to a post or email", "up 4"], ["4.2%", "email click rate", "up 1.1 points"]], drove: ["The packing list Reel that ended on comment BASECAMP", "A spring departures email to past guests"], next: ["A second guide for autumn treks, to grow the list", "Static quote posts are retired, they reached almost no one"], weeks: ["Departure of the month, dates and seats, one Reel", "The guide answers the five altitude questions", "The autumn guide goes out by email, carousel on the feed", "Guest photos from the last trek, credited, the report"], ask: "Can I publish the two spring departure dates this week?" },
    hotel: { who: "sample boutique hotel", measure: "Direct booking clicks against the OTAs, plus bookings from email offers.", stats: [["486", "direct booking clicks", "up 18%"], ["34%", "of bookings made direct", "up 5 points on the OTAs"], ["23", "bookings from the email offer", "new this month"]], drove: ["The monsoon offer email to past guests", "Room tour Reels with a link to book direct"], next: ["A weekday offer for remote workers", "A book direct button on every Instagram highlight"], weeks: ["A day here, hour by hour, carousel and one Reel", "The chef's week, two posts, the weekday offer email", "Guest photos reshared with credit, the local tip post", "The monsoon offer closes, the report"], ask: "Which weekday rate can I offer remote workers?" }
  };
  var page = document.getElementById("reportPage");
  var segs = $$("[data-report]");
  if (page && segs.length) {
    var setList = function (id, items) {
      var ul = document.getElementById(id);
      ul.innerHTML = "";
      items.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    };
    var showReport = function (btn, focus) {
      var r = REPORTS[btn.getAttribute("data-report")];
      if (!r) return;
      segs.forEach(function (s) { var on = s === btn; s.setAttribute("aria-selected", on ? "true" : "false"); s.tabIndex = on ? 0 : -1; });
      if (focus) btn.focus();
      document.getElementById("rpWho").textContent = r.who;
      document.getElementById("reportMeasure").textContent = r.measure;
      r.stats.forEach(function (s, i) {
        document.getElementById("rs" + (i + 1) + "v").textContent = s[0];
        document.getElementById("rs" + (i + 1) + "k").textContent = s[1];
        document.getElementById("rs" + (i + 1) + "d").textContent = s[2];
      });
      setList("rpDrove", r.drove);
      setList("rpNext", r.next);
      var weeks = document.getElementById("rpWeeks");
      if (weeks && r.weeks) {
        weeks.innerHTML = "";
        r.weeks.forEach(function (t, i) { var li = document.createElement("li"); var b = document.createElement("b"); b.textContent = "Week " + (i + 1); li.appendChild(b); li.appendChild(document.createTextNode(t)); weeks.appendChild(li); });
      }
      var ask = document.getElementById("rpAsk");
      if (ask && r.ask) ask.textContent = r.ask;
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
     PLANS. Below 640px the table is three stacked cards, and this
     adds a control to show one tier at a time.
     ============================================================ */
  $$("[data-plans]").forEach(function (plans) {
    var sw = $(".plans__switch", plans);
    var btns = $$("[data-tier-btn]", plans);
    if (!sw || !btns.length) return;
    var mq = window.matchMedia("(max-width: 640px)");
    var apply = function () {
      if (mq.matches) { sw.hidden = false; if (!plans.getAttribute("data-tier")) plans.setAttribute("data-tier", "takeover"); }
      else { sw.hidden = true; plans.removeAttribute("data-tier"); }
    };
    var pick = function (b, focus) {
      btns.forEach(function (x) { var on = x === b; x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1; });
      plans.setAttribute("data-tier", b.getAttribute("data-tier-btn"));
      if (focus) b.focus();
    };
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { pick(b, false); });
      b.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = btns[(i + 1) % btns.length];
        if (e.key === "ArrowLeft") n = btns[(i - 1 + btns.length) % btns.length];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
  });

  /* ============================================================
     SELF CHECK. Seven questions, a score out of 10.
     ============================================================ */
  var checkQs = document.getElementById("checkQs");
  if (checkQs) {
    var qs = $$(".q", checkQs);
    var stepEl = document.getElementById("checkStep");
    var backBtn = document.getElementById("checkBack");
    var qbar = document.getElementById("checkBar");
    var play = document.getElementById("checkPlay");
    var result = document.getElementById("checkResult");
    var current = 0, advancing = null, started = false;
    var CIRC = 2 * Math.PI * 52;
    var answered = function () { return qs.filter(function (q) { return q.querySelector("input:checked"); }).length; };
    var goTo = function (i, back) {
      qs.forEach(function (q, j) { q.classList.toggle("is-active", j === i); q.classList.toggle("is-back", j === i && !!back); });
      current = i;
      stepEl.textContent = "Question " + (i + 1) + " of " + qs.length;
      backBtn.hidden = i === 0;
      qbar.style.setProperty("--q", (answered() / qs.length).toFixed(3));
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
      document.getElementById("dialNum").textContent = score;
      fill.style.strokeDasharray = CIRC.toFixed(2);
      fill.style.strokeDashoffset = CIRC.toFixed(2);
      requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.strokeDashoffset = (CIRC * (1 - score / 10)).toFixed(2); }); });
      try { sessionStorage.setItem("selfcheck_score", score + " out of 10"); } catch (e) {}
      track("selfcheck_complete", { score: score });
    };
    checkQs.addEventListener("change", function (e) {
      if (e.target.type !== "radio") return;
      if (!started) { started = true; track("selfcheck_start"); }
      qbar.style.setProperty("--q", (answered() / qs.length).toFixed(3));
      clearTimeout(advancing);
      advancing = setTimeout(function () { if (current < qs.length - 1) goTo(current + 1); else showResult(); }, reduceMotion ? 80 : 280);
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
     THE SHARED FORM. Posts to Formspree. Inline validation after a
     field loses focus, a clear success state, the email address
     as the fallback when something fails.
     ============================================================ */
  function utm() {
    var out = {};
    try {
      var q = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(function (k) {
        var v = q.get(k);
        if (v) { out[k] = v; sessionStorage.setItem(k, v); }
        else { v = sessionStorage.getItem(k); if (v) out[k] = v; }
      });
    } catch (e) {}
    return out;
  }
  function cleanUrl(v) {
    v = (v || "").trim().replace(/\s+/g, "");
    if (!v) return "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    return /^https?:\/\/[^\/\s]+\.[^\/\s]{2,}/i.test(v) ? v : null;
  }
  function setErr(input, msg) {
    var field = input.closest(".field");
    if (!field) return;
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
  }

  $$("[data-lead]").forEach(function (form) {
    var f = form.elements;
    var status = $(".form__status", form);
    var btn = form.querySelector('button[type="submit"]');
    var wrap = form.closest(".leadbox");
    var done = wrap && $(".leadbox__done", wrap);
    var doneText = done && $(".leadbox__donetext", done);
    var budgetOwn = $("[data-budget-own]", form);
    var u = utm();
    Object.keys(u).forEach(function (k) { if (f[k]) f[k].value = u[k]; });

    var presetKey = function () {
      var v = f.looking.value;
      return v === "Free week of posts" ? "freeweek" : v === "Free audit" ? "audit" : v === "Monthly social media" ? "monthly" : "other";
    };
    var syncPreset = function () {
      var k = presetKey();
      var label = form.getAttribute("data-label-" + k) || btn.getAttribute("data-label-" + k) || btn.getAttribute("data-label-other");
      if (label) { btn.innerHTML = ""; btn.appendChild(document.createTextNode(label)); var arrow = $(".arrow", form); btn.insertAdjacentHTML("beforeend", '<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"/></svg>'); }
      if (doneText) doneText.textContent = form.getAttribute("data-done-" + k) || form.getAttribute("data-done-other");
    };
    if (f.looking) f.looking.addEventListener("change", syncPreset);
    if (f.budget && budgetOwn) {
      f.budget.addEventListener("change", function () {
        var own = f.budget.value === "I have my own number in mind";
        budgetOwn.hidden = !own;
        if (own) f.budget_own.focus();
      });
    }
    try { var sc = sessionStorage.getItem("selfcheck_score"); if (sc) { var h = document.createElement("input"); h.type = "hidden"; h.name = "selfcheck_score"; h.value = sc; form.appendChild(h); } } catch (e) {}

    var validators = {
      name: function (v) { return v.trim() ? "" : "Tell me what to call you."; },
      email: function (v) { return EMAIL_RE.test(v.trim()) ? "" : "That email doesn't look quite right."; },
      website: function (v) { return cleanUrl(v) ? "" : "Add your website, like yourbrand.com"; },
      organisation: function (v) { return v ? "" : "Pick the closest one."; },
      country: function (v) { return v.trim() ? "" : "Which country are you in?"; }
    };
    $$("input, select, textarea", form).forEach(function (el) {
      var check = validators[el.name];
      el.addEventListener("input", function () { setErr(el, ""); });
      el.addEventListener("change", function () { setErr(el, ""); });
      if (!check) return;
      el.addEventListener("blur", function () {
        if (el.name === "website" && el.value.trim() && cleanUrl(el.value)) el.value = cleanUrl(el.value);
        if (el.value.trim() || el.name === "organisation") setErr(el, check(el.value));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      Object.keys(validators).forEach(function (k) {
        var el = f[k];
        if (!el) return;
        var msg = validators[k](el.value);
        setErr(el, msg);
        if (msg && !bad) bad = el;
      });
      if (bad) { bad.focus(); return; }
      if (f.company_website && f.company_website.value) { form.hidden = true; if (done) done.hidden = false; return; }
      var site = cleanUrl(f.website.value);
      f.website.value = site;
      btn.disabled = true;
      status.textContent = "Sending…";
      var fd = new FormData(form);
      fd.set("_subject", f.looking.value + " from " + f.name.value.trim() + ", " + site.replace(/^https?:\/\//i, ""));
      fd.set("_replyto", f.email.value.trim());
      fd.delete("company_website");
      var offer = presetKey();
      fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; })
        .then(function (ok) {
          if (ok) {
            form.hidden = true;
            if (done) { done.hidden = false; done.focus({ preventScroll: true }); done.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); }
            track("form_submit", { offer: offer, page: pageName() });
            track("generate_lead", { lead_type: offer, organisation: f.organisation.value });
          } else {
            btn.disabled = false;
            status.innerHTML = "";
            status.appendChild(document.createTextNode("That didn't go through. Email me at "));
            var link = document.createElement("a");
            link.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(f.looking.value) + "&body=" + encodeURIComponent("Website " + site);
            link.textContent = CONFIG.email;
            status.appendChild(link);
            status.appendChild(document.createTextNode(" and I'll start on it."));
          }
        });
    });
  });

  /* ============================================================
     EMAIL CAPTURE. The checklist, the CV and the What If signup.
     Formspree records every request. The Netlify function emails
     the file for the checklist and the CV.
     ============================================================ */
  var COPY = {
    cv: { sent: "Sent. My CV is on its way to your inbox. If you don't see it in a couple of minutes, check your spam or promotions folder.", manual: "Got it. I'll email you my CV personally within one working day.", file: true },
    guide: { sent: "Sent. The checklist is on its way to your inbox. If you don't see it in a couple of minutes, check your spam or promotions folder.", manual: "Got it. I'll email you the checklist personally within one working day.", file: true },
    whatif: { sent: "You're on the list. One email per new episode, nothing else.", manual: "You're on the list. One email per new episode, nothing else.", file: false }
  };
  var selectedEngagement = "";
  $$("form.capture").forEach(function (form) {
    var kind = form.getAttribute("data-kind");
    var copy = COPY[kind];
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector(".capture__status");
    var btn = form.querySelector('button[type="submit"]');
    var honeypot = form.querySelector(".hp");
    if (!copy || !input) return;
    $$("input, select", form).forEach(function (el) {
      el.addEventListener("input", function () { el.removeAttribute("aria-invalid"); if (status && !form.classList.contains("is-done")) status.textContent = ""; });
      el.addEventListener("change", function () { el.removeAttribute("aria-invalid"); });
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
      var req = $$("[required]", form).filter(function (el) { return !el.value; });
      if (req.length) { req[0].setAttribute("aria-invalid", "true"); status.textContent = "Fill in the " + (req[0].name === "organisation" ? "organisation type" : req[0].name) + " too."; req[0].focus(); return; }
      if (honeypot && honeypot.value) { form.classList.add("is-done"); status.textContent = copy.sent; return; }
      btn.disabled = true;
      status.textContent = "Sending…";
      var fd = new FormData(form);
      fd.delete("company_website");
      if (selectedEngagement) fd.append("engagement", selectedEngagement);
      fd.set("_replyto", email);
      var recorded = fetch(form.action || CONFIG.formspree, { method: "POST", body: fd, headers: { Accept: "application/json" } }).then(function (r) { return r.ok; }).catch(function () { return false; });
      var delivered = copy.file
        ? fetch(CONFIG.sendFileEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: kind, email: email, engagement: selectedEngagement }) }).then(function (r) { return r.ok; }).catch(function () { return false; })
        : Promise.resolve(false);
      Promise.all([recorded, delivered]).then(function (res) {
        if (res[0] || res[1]) {
          form.classList.add("is-done");
          status.textContent = res[1] ? copy.sent : copy.manual;
          track("form_submit", { offer: kind, page: pageName() });
          track("generate_lead", { lead_type: kind, delivered: res[1] });
        } else {
          btn.disabled = false;
          status.innerHTML = "";
          status.appendChild(document.createTextNode("That didn't go through. Email me at "));
          var link = document.createElement("a");
          link.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(kind === "whatif" ? "What If episodes" : kind === "cv" ? "CV request" : "Checklist request");
          link.textContent = CONFIG.email;
          status.appendChild(link);
          status.appendChild(document.createTextNode(" and I'll sort it out."));
        }
      });
    });
  });

  /* ============================================================
     TRACKING. One listener for the buttons that matter.
     ============================================================ */
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    var cta = t.closest("[data-cta]");
    if (cta) track("cta_click", { location: cta.getAttribute("data-cta"), offer: cta.getAttribute("data-offer") || "", page: pageName() });
    var wa = t.closest("[data-whatsapp]");
    if (wa) track("whatsapp_click", { location: wa.getAttribute("data-whatsapp"), page: pageName() });
    var wc = t.closest("[data-whatif-cta]");
    if (wc) track("whatif_cta_click", { offer: wc.getAttribute("data-whatif-cta"), episode: (document.querySelector("[data-episode]") || { getAttribute: function () { return ""; } }).getAttribute("data-episode") });
  });
  var ep = document.querySelector("[data-episode]");
  if (ep) track("whatif_episode_view", { episode: ep.getAttribute("data-episode"), page: pageName() });

  /* the intro film, one event when it starts and one when it ends */
  $$("[data-film] video").forEach(function (v) {
    var where = v.closest("[data-film]").getAttribute("data-film");
    v.addEventListener("play", function () { track("film_play", { location: where, page: pageName() }); }, { once: true });
    v.addEventListener("ended", function () { track("film_complete", { location: where, page: pageName() }); }, { once: true });
  });

  /* ============================================================
     BOOKING. Every "Book a call" link is a plain link to cal.com.
     Once the Cal embed has loaded, clicks open it in a popup.
     ============================================================ */
  var NS = "discovery-call";
  var calReady = false, calRequested = false;
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
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else { p(cal, ar); }
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    window.Cal("init", NS, { origin: CONFIG.calOrigin });
    window.Cal.ns[NS]("ui", { cssVarsPerTheme: { light: { "cal-brand": "#16241C" }, dark: { "cal-brand": "#E8B25C" } }, hideEventTypeDetails: false, layout: "month_view" });
  }
  ["pointerover", "touchstart", "focusin"].forEach(function (type) {
    document.addEventListener(type, function onIntent(e) {
      if (e.target.closest && e.target.closest("[data-book]")) { loadCal(); document.removeEventListener(type, onIntent, true); }
    }, { capture: true, passive: true });
  });
  function bookingNotes() {
    var phrases = { "Full time": "full time work", "Part time": "part time work", "A project": "a project" };
    return selectedEngagement ? "Interested in " + (phrases[selectedEngagement] || selectedEngagement.toLowerCase()) : "";
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-book]");
    if (!a) return;
    var placement = a.getAttribute("data-book");
    track("book_call_click", { placement: placement, engagement: selectedEngagement || "none", page: pageName() });
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
})();
