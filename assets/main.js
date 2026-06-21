/* =========================================================
   Pratim N. Moitra — site interactions
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---- nav shadow + scroll progress + pill + back to top ---- */
  var nav = document.querySelector(".nav");
  var progress = document.getElementById("progress");
  var pill = document.getElementById("pill");
  var totop = document.getElementById("totop");
  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("scrolled", y > 8);
    if (pill) pill.classList.toggle("show", y > 700);
    if (totop) totop.classList.toggle("show", y > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---- reveal on scroll ---- */
  var revs = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- count up stats ---- */
  var counted = false;
  function countUp() {
    if (counted) return;
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dur = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      if (reduce) { el.textContent = target; } else { requestAnimationFrame(step); }
    });
    counted = true;
  }
  var statsEl = document.querySelector(".stats");
  if (statsEl && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { countUp(); so.disconnect(); }
    }, { threshold: 0.4 });
    so.observe(statsEl);
  } else { countUp(); }

  /* ---- expandable services ---- */
  document.querySelectorAll(".svc").forEach(function (svc) {
    svc.addEventListener("click", function () {
      var open = svc.getAttribute("aria-expanded") === "true";
      svc.setAttribute("aria-expanded", open ? "false" : "true");
    });
    svc.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); svc.click(); }
    });
  });

  /* =========================================================
     THE 60 SECOND AUDIT DIAGNOSTIC
     ========================================================= */
  var QUESTIONS = [
    {
      area: "Website",
      q: "When someone lands on your website, what happens?",
      opts: [
        { t: "It loads fast and looks current", s: 9 },
        { t: "It works but feels a few years old", s: 6 },
        { t: "It is slow or awkward on a phone", s: 3 },
        { t: "We barely have a website", s: 1 }
      ]
    },
    {
      area: "Visibility",
      q: "Search your destination or service on Google. Where do you show up?",
      opts: [
        { t: "Near the top of page one", s: 9 },
        { t: "Somewhere on page two or three", s: 6 },
        { t: "Nowhere I can find", s: 3 },
        { t: "I have never actually checked", s: 2 }
      ]
    },
    {
      area: "Social",
      q: "How often does something new go out on your social channels?",
      opts: [
        { t: "A few times a week, on a plan", s: 9 },
        { t: "Roughly once a week", s: 6 },
        { t: "Only when we remember", s: 3 },
        { t: "Our channels are mostly quiet", s: 1 }
      ]
    },
    {
      area: "Content",
      q: "Do you have a real plan for what you publish?",
      opts: [
        { t: "Yes, a calendar we actually follow", s: 9 },
        { t: "A loose idea in someone's head", s: 5 },
        { t: "We make it up as we go", s: 3 },
        { t: "No plan at all", s: 1 }
      ]
    },
    {
      area: "Email",
      q: "What happens to your past guests, members, or leads?",
      opts: [
        { t: "They get emails worth opening", s: 9 },
        { t: "We email them now and then", s: 6 },
        { t: "We have the list but rarely use it", s: 3 },
        { t: "We do not really email anyone", s: 1 }
      ]
    },
    {
      area: "Brand",
      q: "Put your website, Instagram, and last newsletter side by side. Same brand?",
      opts: [
        { t: "Yes, clearly one brand", s: 9 },
        { t: "Mostly, with a little drift", s: 6 },
        { t: "They feel a bit disconnected", s: 3 },
        { t: "Honestly, all over the place", s: 1 }
      ]
    }
  ];

  var diag = document.getElementById("diag");
  if (diag) {
    var stage = document.getElementById("diagStage");
    var scoreBox = document.getElementById("scoreRows");
    var resultBox = document.getElementById("scoreResult");
    var idx = 0;
    var answers = new Array(QUESTIONS.length).fill(null);

    // build empty scorecard rows
    QUESTIONS.forEach(function (q, i) {
      var row = document.createElement("div");
      row.className = "score__row";
      row.innerHTML =
        '<div class="lbl"><span>' + q.area + '</span><b data-val="' + i + '">--</b></div>' +
        '<div class="score__track"><span class="score__fill" data-fill="' + i + '"></span></div>';
      scoreBox.appendChild(row);
    });

    function fillColour(v) {
      if (v >= 7) return "var(--ok)";
      if (v >= 4) return "var(--warn)";
      return "var(--bad)";
    }

    function paintScores() {
      answers.forEach(function (a, i) {
        var fill = scoreBox.querySelector('[data-fill="' + i + '"]');
        var val = scoreBox.querySelector('[data-val="' + i + '"]');
        if (a == null) { fill.style.width = "0%"; val.textContent = "--"; return; }
        var pct = (a / 9) * 100;
        fill.style.width = pct + "%";
        fill.style.background = fillColour(a);
        val.textContent = a.toFixed(0) + "/9";
      });
    }

    function renderQuestion() {
      var q = QUESTIONS[idx];
      var pct = (idx / QUESTIONS.length) * 100;
      var html =
        '<div class="diag__meta"><span>Area ' + (idx + 1) + " of " + QUESTIONS.length +
        '</span><span>' + q.area + '</span></div>' +
        '<div class="diag__bar"><span style="width:' + pct + '%"></span></div>' +
        '<p class="q__text">' + q.q + '</p>' +
        '<div class="q__opts">';
      q.opts.forEach(function (o, oi) {
        html += '<button class="opt" type="button" data-s="' + o.s + '" data-oi="' + oi + '">' + o.t + "</button>";
      });
      html += "</div>";
      html += '<button class="diag__back" id="diagBack"' + (idx === 0 ? " hidden" : "") + ">back one step</button>";
      stage.innerHTML = html;

      stage.querySelectorAll(".opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          answers[idx] = parseInt(btn.getAttribute("data-s"), 10);
          paintScores();
          if (idx < QUESTIONS.length - 1) { idx++; renderQuestion(); }
          else { showResult(); }
        });
      });
      var back = document.getElementById("diagBack");
      if (back) back.addEventListener("click", function () { if (idx > 0) { idx--; renderQuestion(); } });
    }

    function showResult() {
      var sum = answers.reduce(function (a, b) { return a + b; }, 0);
      var avg10 = (sum / (QUESTIONS.length * 9)) * 10; // out of 10
      var grade, note;
      if (avg10 >= 8) { grade = "Strong"; note = "Most of the basics are in place. The gains now come from sharper content and tighter measurement."; }
      else if (avg10 >= 6) { grade = "Solid, with gaps"; note = "A good base with a few soft spots that are quietly costing you reach and bookings."; }
      else if (avg10 >= 4) { grade = "Real opportunity"; note = "The foundation is uneven. A focused 90 day push would move this fast."; }
      else { grade = "Lots to gain"; note = "There is plenty of low hanging fruit here. Small, consistent fixes would change the picture quickly."; }

      // two weakest areas
      var ranked = answers.map(function (a, i) { return { area: QUESTIONS[i].area, s: a }; })
        .sort(function (x, y) { return x.s - y.s; });
      var weak = ranked.slice(0, 2).map(function (r) { return r.area; });

      // final bar on the diagram
      stage.innerHTML =
        '<div class="diag__meta"><span>Your result</span><span>' + avg10.toFixed(1) + " out of 10</span></div>" +
        '<div class="diag__bar"><span style="width:100%"></span></div>' +
        '<p class="q__text">Your digital presence scores <em>' + avg10.toFixed(1) + "</em> out of 10.</p>" +
        '<p style="color:rgba(250,246,239,.78);margin:0 0 1.2rem">The two areas pulling you down most are <b style="color:var(--terra-soft)">' +
        weak[0] + "</b> and <b style=\"color:var(--terra-soft)\">" + weak[1] + "</b>. " +
        "Your full written audit goes deep on both, with quick wins and a 90 day playbook.</p>" +
        '<button class="opt" type="button" id="diagReset" style="max-width:220px">start over</button>';
      var reset = document.getElementById("diagReset");
      if (reset) reset.addEventListener("click", function () { idx = 0; answers = new Array(QUESTIONS.length).fill(null); paintScores(); renderQuestion(); });

      // result panel
      resultBox.querySelector(".score__placeholder") && (resultBox.querySelector(".score__placeholder").style.display = "none");
      var gradeEl = document.getElementById("scoreGrade");
      var noteEl = document.getElementById("scoreNote");
      gradeEl.innerHTML = "Overall <b>" + grade + "</b>";
      noteEl.textContent = note;
      gradeEl.parentElement.style.display = "block";

      // wire capture form hidden score
      var cap = document.getElementById("capture");
      cap.classList.add("show");
      var hidden = document.getElementById("scoreField");
      if (hidden) hidden.value = avg10.toFixed(1) + "/10 weakest " + weak.join(" and ");
    }

    renderQuestion();
    paintScores();
  }

  /* =========================================================
     NETLIFY FORM AJAX SUBMIT (keeps user on page)
     ========================================================= */
  function encode(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join("&");
  }
  function ajaxForm(form, statusEl, onDone) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (statusEl) { statusEl.textContent = "Sending..."; statusEl.className = "form-status"; }
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("network");
        if (statusEl) { statusEl.textContent = "Got it. I read everything myself and reply within 24 hours."; statusEl.className = "form-status ok"; }
        form.reset();
        if (onDone) onDone();
      }).catch(function () {
        if (statusEl) { statusEl.textContent = "Something went wrong. Email me directly at pratimxnarayan@gmail.com"; statusEl.className = "form-status err"; }
      });
    });
  }

  ajaxForm(document.getElementById("contactForm"), document.getElementById("contactStatus"));

  // scorecard capture
  var capForm = document.getElementById("captureForm");
  ajaxForm(capForm, null, function () {
    var c = document.getElementById("capture");
    if (c) c.innerHTML = '<p class="capture__done">Sent. Your written audit lands in your inbox soon.</p>';
  });

  // popup form
  var popForm = document.getElementById("popupForm");
  ajaxForm(popForm, null, function () {
    var pc = document.querySelector(".popup__card");
    if (pc) pc.innerHTML = '<p class="eyebrow">Thank you</p><h3>Audit request received.</h3><p>I will be in touch within 24 hours. In the meantime, feel free to keep exploring.</p>';
    setTimeout(closePopup, 2600);
  });

  /* ---- delayed popup (once per session) ---- */
  var popup = document.getElementById("popup");
  var popClose = document.getElementById("popupClose");
  function openPopup() {
    if (!popup) return;
    try { if (sessionStorage.getItem("pmAuditPopup") === "1") return; } catch (e) {}
    popup.classList.add("show");
  }
  function closePopup() {
    if (!popup) return;
    popup.classList.remove("show");
    try { sessionStorage.setItem("pmAuditPopup", "1"); } catch (e) {}
  }
  if (popup) {
    setTimeout(openPopup, 18000);
    if (popClose) popClose.addEventListener("click", closePopup);
    popup.addEventListener("click", function (e) { if (e.target === popup) closePopup(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePopup(); });
  }

  /* ---- year ---- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
