/* pratimnarayan.com, interactions. No dependencies.
   Every page is complete before this runs. This file adds the menu,
   the bar on a phone, the red pen's three moments of motion, the
   forms' inline states, the P shortcut, the live clocks and tracking. */
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

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ============================================================
     THE MENU. Under 760 pixels the header shows a menu button that
     opens a full screen sheet. Focus stays inside it until it closes.
     ============================================================ */
  var menuBtn = document.getElementById("menuBtn");
  var sheet = document.getElementById("sheet");
  var menuClose = document.getElementById("menuClose");
  var inertable = [document.getElementById("top"), document.getElementById("main"), $(".foot"), document.getElementById("stickybar")].filter(Boolean);
  function openMenu() {
    if (!sheet || !sheet.hidden) return;
    sheet.hidden = false;
    root.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    inertable.forEach(function (el) { el.inert = true; });
    (menuClose || sheet).focus();
  }
  function closeMenu(returnFocus) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
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
    window.addEventListener("resize", function () { if (window.innerWidth > 760) closeMenu(false); });
  }

  /* ============================================================
     THE BAR ON A PHONE. Under 760 pixels a bar with the offer and
     the button pins to the bottom once the hero form has left the
     screen, and hides while the form in the close is on screen.
     Pages without a hero form show it after the first screen and
     hide it over any form. Once a form is sent it stays away.
     ============================================================ */
  var bar = document.getElementById("stickybar");
  var barMq = window.matchMedia ? window.matchMedia("(max-width: 760px)") : null;
  var heroForm = $("#hero [data-quick-wrap]");
  var requestForm = $("#request [data-quick-wrap]") || $("#request form");
  var heroGone = false, requestOn = false, formsOn = 0, barOn = false, leadSent = false;
  function updateBar() {
    if (!bar || !barMq) return;
    var past = heroForm ? heroGone : (window.scrollY || window.pageYOffset || 0) > 280;
    var show = barMq.matches && past && !requestOn && formsOn === 0 && !leadSent;
    if (show === barOn) return;
    barOn = show;
    bar.classList.toggle("is-on", show);
  }
  if (bar && barMq && hasIO) {
    if (heroForm) {
      new IntersectionObserver(function (entries) {
        var en = entries[entries.length - 1];
        heroGone = !en.isIntersecting && en.boundingClientRect.bottom <= 0;
        updateBar();
      }, { threshold: 0 }).observe(heroForm);
    }
    if (requestForm) {
      new IntersectionObserver(function (entries) {
        requestOn = entries[entries.length - 1].isIntersecting;
        if (requestOn) hideNudge();
        updateBar();
      }, { threshold: 0.05 }).observe(requestForm);
    }
    if (!heroForm) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { formsOn += en.isIntersecting ? 1 : -1; });
        formsOn = Math.max(0, formsOn);
        updateBar();
      }, { threshold: 0.05 });
      $$("form:not(.capture--inline)").forEach(function (f) { if (!requestForm || !requestForm.contains(f)) fio.observe(f); });
      var barTicking = false;
      window.addEventListener("scroll", function () {
        if (!barTicking) { barTicking = true; requestAnimationFrame(function () { barTicking = false; updateBar(); }); }
      }, { passive: true });
    }
    if (barMq.addEventListener) barMq.addEventListener("change", updateBar);
    updateBar();
  }

  /* ============================================================
     THE RED PEN. Three small moments of motion, once each, on first
     view. The hero posts settle into the fan, the underline under
     the headline draws itself and the hero arrow draws itself. The
     stylesheet holds the start states, this adds is-in when the
     part is on screen. With reduced motion nothing is armed.
     ============================================================ */
  $$("[data-pen]").forEach(function (el) {
    if (!hasIO || reduceMotion) { el.classList.add("is-in"); return; }
    once(el, 0.3, function () { el.classList.add("is-in"); });
  });

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

  /* the campaign tags on the address, remembered for the session and sent with every form */
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
     THE TWO FIELD FORM. A website or Instagram handle and a work
     email, with the offer in a hidden field. It posts to Formspree.
     Once it is sent, one line replaces it and three optional
     questions are offered as a second submission. The quiet link
     under the button, and the address /#audit, switch every copy
     of the form on the page to the other offer.
     ============================================================ */
  function fldErr(input, msg) {
    var fld = input.closest(".fld");
    if (!fld) return;
    var err = fld.querySelector(".fld__err");
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      if (!err) {
        err = document.createElement("span");
        err.className = "fld__err";
        err.id = input.id + "-err";
        fld.appendChild(err);
        input.setAttribute("aria-describedby", err.id);
      }
      err.textContent = msg;
    } else {
      input.removeAttribute("aria-invalid");
      if (err) err.textContent = "";
    }
  }
  var quickWraps = $$("[data-quick-wrap]");
  var currentOffer = "freeweek";
  function setOffer(key) {
    quickWraps.forEach(function (wrap) {
      var offers;
      try { offers = JSON.parse(wrap.getAttribute("data-offers")); } catch (e) { return; }
      var o = offers[key];
      if (!o) return;
      currentOffer = key;
      wrap.setAttribute("data-offer", key);
      var form = $("[data-quick]", wrap);
      var btn = form.querySelector('button[type="submit"]');
      form.elements.offer.value = o.value;
      form.elements._subject.value = o.value + ", from pratimnarayan.com";
      btn.textContent = o.button;
      btn.setAttribute("data-offer", key);
      var text = $("[data-quick-finetext]", wrap);
      var swap = $("[data-quick-swap]", wrap);
      if (text) text.textContent = o.fine;
      if (swap) { swap.textContent = o.swap; swap.setAttribute("data-quick-swap", o.swapTo); swap.setAttribute("href", swap.getAttribute("href").replace(/[^\/]+\/(index\.html)?$/, o.swapTo + "/$1")); }
      var ok = $("[data-quick-ok]", wrap);
      if (ok) ok.textContent = o.done;
      var more = $("[data-quick-more]", wrap);
      if (more) more.elements.offer.value = o.value;
    });
  }
  quickWraps.forEach(function (wrap) {
    var form = $("[data-quick]", wrap);
    var f = form.elements;
    var btn = form.querySelector('button[type="submit"]');
    var status = $(".form__status", form);
    var fine = $("[data-quick-fine]", wrap);
    var done = $(".quick__done", wrap);
    var more = $("[data-quick-more]", wrap);
    var thanks = $("[data-quick-thanks]", wrap);
    var where = form.getAttribute("data-where") || "";
    var u = utm();
    Object.keys(u).forEach(function (k) { if (f[k]) f[k].value = u[k]; });

    var swap = $("[data-quick-swap]", wrap);
    if (swap) {
      swap.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        var to = swap.getAttribute("data-quick-swap");
        setOffer(to);
        track("cta_click", { location: where + "_swap", offer: to, page: pageName() });
        f.handle.focus();
      });
    }

    var checks = {
      handle: function (v) { return v.trim().length > 1 ? "" : "Add your website or Instagram handle."; },
      email: function (v) { return EMAIL_RE.test(v.trim()) ? "" : "That email doesn't look quite right."; }
    };
    ["handle", "email"].forEach(function (k) {
      f[k].addEventListener("input", function () { fldErr(f[k], ""); });
      f[k].addEventListener("blur", function () { if (f[k].value.trim()) fldErr(f[k], checks[k](f[k].value)); });
    });

    function showDone() {
      form.hidden = true;
      if (fine) fine.hidden = true;
      var privacyLine = $("[data-quick-privacy]", wrap);
      if (privacyLine) privacyLine.hidden = true;
      if (more) { more.elements.handle.value = f.handle.value.trim(); more.elements.email.value = f.email.value.trim(); }
      done.hidden = false;
      done.focus({ preventScroll: true });
      leadSent = true;
      updateBar();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      ["handle", "email"].forEach(function (k) {
        var msg = checks[k](f[k].value);
        fldErr(f[k], msg);
        if (msg && !bad) bad = f[k];
      });
      if (bad) { bad.focus(); return; }
      if (f.company_website && f.company_website.value) { showDone(); return; }
      var offer = wrap.getAttribute("data-offer") || "freeweek";
      var handle = f.handle.value.trim();
      btn.disabled = true;
      status.textContent = "Sending…";
      var fd = new FormData(form);
      fd.set("handle", handle);
      fd.set("_subject", f.offer.value + ", from " + handle.replace(/^https?:\/\//i, ""));
      fd.set("_replyto", f.email.value.trim());
      fd.delete("company_website");
      fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; })
        .then(function (ok) {
          btn.disabled = false;
          if (ok) {
            status.textContent = "";
            showDone();
            track("form_submit", { offer: offer, page: pageName(), location: where });
            track("generate_lead", { lead_type: offer });
          } else {
            status.innerHTML = "";
            status.appendChild(document.createTextNode("That didn't go through. Email me at "));
            var link = document.createElement("a");
            link.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(f.offer.value) + "&body=" + encodeURIComponent(handle);
            link.textContent = CONFIG.email;
            status.appendChild(link);
            status.appendChild(document.createTextNode(" and I'll start on it."));
          }
        });
    });

    if (more) {
      more.addEventListener("submit", function (e) {
        e.preventDefault();
        var m = more.elements;
        var mbtn = more.querySelector('button[type="submit"]');
        var mstatus = $(".form__status", more);
        var finish = function () { more.hidden = true; if (thanks) { thanks.hidden = false; } done.focus({ preventScroll: true }); };
        if (!m.organisation.value && !m.country.value.trim() && !m.budget.value.trim()) { finish(); return; }
        mbtn.disabled = true;
        mstatus.textContent = "Sending…";
        var fd = new FormData(more);
        fd.set("_subject", "More detail, from " + m.handle.value.replace(/^https?:\/\//i, ""));
        fd.set("_replyto", m.email.value);
        fetch(more.action, { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { return r.ok; })
          .catch(function () { return false; })
          .then(function (ok) {
            mbtn.disabled = false;
            if (ok) {
              mstatus.textContent = "";
              finish();
              track("form_submit", { offer: wrap.getAttribute("data-offer") || "freeweek", page: pageName(), location: where, step: "details" });
            } else {
              mstatus.textContent = "That didn't go through. Your request itself is with me, so there is nothing more you need to do.";
            }
          });
      });
    }
  });
  /* /#audit lands on the form with the audit offer chosen */
  function auditFromHash() {
    if (location.hash !== "#audit" || !quickWraps.length) return;
    setOffer("audit");
    var target = $("#request [data-quick-wrap]") || quickWraps[0];
    if (!document.getElementById("audit")) target.scrollIntoView({ behavior: "auto", block: "center" });
  }
  window.addEventListener("hashchange", auditFromHash);
  auditFromHash();

  /* ============================================================
     QUESTIONS. On the page they are plain headings with every
     answer open. Under 760 pixels each heading becomes a button
     with aria-expanded and all but the first fold away. Above 760
     they go back to plain headings.
     ============================================================ */
  var qaMq = window.matchMedia ? window.matchMedia("(max-width: 760px)") : null;
  var ICON_QA = '<svg class="qa__icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 9h12"></path><path d="M9 3v12"></path></svg>';
  function foldQuestions(on) {
    $$("[data-qas]").forEach(function (group) {
      group.classList.toggle("is-acc", on);
      $$(".qa", group).forEach(function (qa, i) {
        var h = $(".qa__q", qa), a = $(".qa__a", qa), btn = $(".qa__btn", qa);
        if (on && !btn) {
          btn = document.createElement("button");
          btn.type = "button";
          btn.className = "qa__btn";
          btn.setAttribute("aria-controls", a.id);
          while (h.firstChild) btn.appendChild(h.firstChild);
          btn.insertAdjacentHTML("beforeend", ICON_QA);
          h.appendChild(btn);
          var open = i === 0;
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          qa.classList.toggle("is-folded", !open);
          btn.addEventListener("click", function () {
            var now = btn.getAttribute("aria-expanded") !== "true";
            btn.setAttribute("aria-expanded", now ? "true" : "false");
            qa.classList.toggle("is-folded", !now);
          });
        } else if (!on && btn) {
          var icon = $(".qa__icon", btn);
          if (icon) icon.remove();
          while (btn.firstChild) h.appendChild(btn.firstChild);
          btn.remove();
          qa.classList.remove("is-folded");
        }
      });
    });
  }
  if (qaMq) {
    foldQuestions(qaMq.matches);
    if (qaMq.addEventListener) qaMq.addEventListener("change", function () { foldQuestions(qaMq.matches); });
  }

  /* the row of posts scrolls sideways on a phone. When it does, the keyboard can reach it. */
  function postsRow() {
    $$(".posts").forEach(function (row) {
      if (row.scrollWidth > row.clientWidth + 2) row.tabIndex = 0; else row.removeAttribute("tabindex");
    });
  }
  postsRow();
  window.addEventListener("resize", postsRow);

  /* form_start, once for each form, on the first focus of a field */
  $$("form").forEach(function (form) {
    var name = form.getAttribute("data-where") || form.getAttribute("data-kind") || form.getAttribute("data-preset") || (form.hasAttribute("data-quick-more") ? "details" : form.id || "form");
    form.addEventListener("focusin", function onStart(e) {
      if (!e.target.matches || !e.target.matches("input:not([type=hidden]), select, textarea")) return;
      form.removeEventListener("focusin", onStart);
      track("form_start", { form: name, page: pageName() });
    });
  });

  /* ============================================================
     PRESS P. On a screen wider than 760 pixels with a mouse or
     trackpad, P goes to the form in the close and puts the cursor
     in its first field. Ignored while typing in a field and when a
     modifier key is held. The hint in the header shows under the
     same conditions.
     ============================================================ */
  var keyMq = window.matchMedia ? window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)") : null;
  document.addEventListener("keydown", function (e) {
    if (!keyMq || !keyMq.matches || e.repeat) return;
    if (e.key !== "p" && e.key !== "P") return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if ((sheet && !sheet.hidden) || document.querySelector("dialog[open]")) return;
    track("cta_click", { location: "key_p", offer: currentOffer, page: pageName() });
    var request = document.getElementById("request");
    if (!request) {
      var cta = $(".site__cta .btn");
      if (cta) location.href = cta.href;
      return;
    }
    e.preventDefault();
    var field = $$("input, select, textarea", request).filter(function (el) { return el.type !== "hidden" && !el.classList.contains("hp") && el.offsetParent !== null; })[0];
    (field || request).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (field) field.focus({ preventScroll: true });
    callForm();
  });

  /* ============================================================
     THE CALL TO THE FORM. Whenever something sends the visitor to
     the form (the P key, the header button, the bar on a phone, the
     pop up or an address that ends in #request), the white box
     lifts a little and shows a ring, so it is clear this is the
     place. With reduced motion only the ring shows.
     ============================================================ */
  var callTimer = null;
  function callForm(delay) {
    var box = $("#request .reqbox");
    if (!box) return;
    clearTimeout(callTimer);
    callTimer = setTimeout(function () {
      box.classList.remove("is-called");
      void box.offsetWidth;
      box.classList.add("is-called");
      /* on a phone the box sits under the steps, so bring it into view */
      var r = box.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: r.height > window.innerHeight * 0.9 ? "start" : "center" });
      callTimer = setTimeout(function () { box.classList.remove("is-called"); }, 1800);
    }, delay == null ? 450 : delay);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (a && /^#(request|audit|lead)$/.test(a.getAttribute("href"))) callForm();
  });
  if (/^#(request|audit|lead)$/.test(location.hash)) callForm(700);

  /* ============================================================
     THE COOKIE NOTICE. Google Analytics may not use cookies for a
     visitor in Europe until they allow it. The page sets that
     before Analytics starts. This shows the notice to visitors in
     Europe who have not chosen, and to anyone who presses Cookies
     in the footer. The choice is kept in the browser.
     ============================================================ */
  var consentBox = document.getElementById("consent");
  var cookieBtn = document.getElementById("cookieBtn");
  function inEurope() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      return /^Europe\//.test(tz) || /^(Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)|Arctic\/Longyearbyen)$/.test(tz);
    } catch (e) { return false; }
  }
  function showConsent(focus) {
    consentBox.hidden = false;
    document.body.classList.add("has-consent");
    hideNudge();
    if (focus) document.getElementById("consentYes").focus();
  }
  function setConsent(value) {
    try { localStorage.setItem("pn_consent", value); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: value }); } catch (e) {}
    consentBox.hidden = true;
    document.body.classList.remove("has-consent");
    if (cookieBtn && document.activeElement === document.body) cookieBtn.focus();
  }
  if (consentBox) {
    var storedConsent = null;
    try { storedConsent = localStorage.getItem("pn_consent"); } catch (e) {}
    if (!storedConsent && inEurope()) showConsent(false);
    document.getElementById("consentYes").addEventListener("click", function () { setConsent("granted"); });
    document.getElementById("consentNo").addEventListener("click", function () { setConsent("denied"); });
    if (cookieBtn) {
      cookieBtn.hidden = false;
      cookieBtn.addEventListener("click", function () { showConsent(true); });
    }
  }

  /* ============================================================
     THE POP UP. A dialog in the middle of the screen over a blurred
     page, with the offer and the two field form. It opens once a
     visit, after half the page or 40 seconds, or when the pointer
     leaves for the tab bar on a computer. It stays away while the
     form is on screen, while someone is typing or watching the film,
     while the menu or the cookie notice is open, once a form is sent,
     and for the set number of days after it is closed. Escape, the
     close button and a tap outside it all close it, and focus goes
     back where it was.
     ============================================================ */
  var pop = document.getElementById("pop");
  var popDone = false, popFrom = null;
  function popAllowed() {
    if (!pop || popDone || leadSent || requestOn || typeof pop.showModal !== "function") return false;
    if (sheet && !sheet.hidden) return false;
    if (consentBox && !consentBox.hidden) return false;
    if (document.querySelector("dialog[open]")) return false;
    var el = document.activeElement;
    if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return false;
    if ($$("video").some(function (v) { return !v.paused && !v.ended; })) return false;
    return true;
  }
  function showNudge(why) {
    if (!popAllowed()) return;
    popDone = true;
    popFrom = document.activeElement;
    pop.showModal();
    root.classList.add("pop-open");
    try { sessionStorage.setItem("pn_nudge", "1"); } catch (e) {}
    track("popup_view", { trigger: why, page: pageName() });
  }
  function hideNudge() { if (pop && pop.open) pop.close(); }
  if (pop) {
    var nudgeDays = +pop.getAttribute("data-days") || 14;
    try {
      var closedAt = +localStorage.getItem("pn_nudge_closed") || 0;
      if (sessionStorage.getItem("pn_nudge") === "1" || (closedAt && Date.now() - closedAt < nudgeDays * 864e5)) popDone = true;
    } catch (e) {}
    if (!popDone) {
      setTimeout(function () { showNudge("time"); }, 40000);
      var nudgeScroll = function () {
        if (popDone) { window.removeEventListener("scroll", nudgeScroll); return; }
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 0 && (window.scrollY || 0) / h > 0.5) showNudge("scroll");
      };
      window.addEventListener("scroll", nudgeScroll, { passive: true });
      if (keyMq && keyMq.matches) {
        document.addEventListener("mouseout", function (e) {
          if (!e.relatedTarget && e.clientY <= 0 && performance.now() > 8000) showNudge("leave");
        });
      }
    }
    document.getElementById("popClose").addEventListener("click", function () { pop.close(); });
    /* a tap on the blurred page around the dialog closes it */
    pop.addEventListener("click", function (e) { if (e.target === pop) pop.close(); });
    pop.addEventListener("close", function () {
      root.classList.remove("pop-open");
      try { localStorage.setItem("pn_nudge_closed", String(Date.now())); } catch (e) {}
      track("popup_close", { page: pageName(), sent: leadSent });
      if (popFrom && popFrom.focus && document.contains(popFrom)) popFrom.focus({ preventScroll: true });
    });
  }

  /* ============================================================
     COPY THE LINK. Copies the full address of the film page, so it
     can go into an email signature or a message.
     ============================================================ */
  $$("[data-copy]").forEach(function (b) {
    if (!(navigator.clipboard && navigator.clipboard.writeText)) return;
    b.hidden = false;
    var label = b.textContent;
    b.addEventListener("click", function () {
      navigator.clipboard.writeText(b.getAttribute("data-copy")).then(function () {
        b.textContent = "Link copied";
        track("copy_link", { url: b.getAttribute("data-copy"), page: pageName() });
        setTimeout(function () { b.textContent = label; }, 2200);
      }, function () { b.textContent = b.getAttribute("data-copy"); });
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
    window.Cal.ns[NS]("ui", { cssVarsPerTheme: { light: { "cal-brand": "#CC0000" }, dark: { "cal-brand": "#EA9999" } }, hideEventTypeDetails: false, layout: "month_view" });
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
