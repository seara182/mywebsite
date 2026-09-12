/* ============================================================
   widgets.js — vanilla DOM widgets shared by the React page and
   the static cheapseats page: language switcher, contact chip,
   and the data-i18n static-text binder.
   ============================================================ */
(function () {
  "use strict";
  var I18N = window.I18N;

  var GLOBE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z"/></svg>';

  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* The hero is choreographed so that for the first second the page shows
     the name and nothing else. The fixed chrome (language globe, contact
     chip) is part of that sequence rather than being present from frame
     one, so it arrives last. Reduced motion skips the wait. */
  var CHROME_DELAY = 1400;
  /* The hint is decoration. It used to linger for 15s, which meant it was
     still on screen - and unreadable - once the reader reached the navy
     band. 7s is long enough to notice the globe and short enough that it is
     always gone before the first colour band. */
  var HINT_LIFE = 7000;
  function arm(el) {
    if (reduceMotion()) { el.classList.add("is-ready"); return; }
    setTimeout(function () { el.classList.add("is-ready"); }, CHROME_DELAY);
  }

  /* ---------- scrollbar width ----------
     The full-bleed split sections are sized in vw, and vw counts the
     scrollbar. Publishing the real difference lets the CSS subtract it
     instead of overshooting by ~15px on Windows. */
  function measureScrollbar() {
    var w = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--sbw", (w > 0 ? w : 0) + "px");
  }
  /* This file is also loaded into the Node prerender sandbox (build.mjs), where
     there is no document - so nothing may touch the DOM at module scope. */
  if (typeof document !== "undefined") {
    measureScrollbar();
    window.addEventListener("resize", measureScrollbar, { passive: true });
  }

  /* ---------- language switcher ---------- */
  function mountLanguageSwitcher(root) {
    var wrap = document.createElement("div");
    wrap.className = "lang-switcher";

    var globe = document.createElement("button");
    globe.type = "button";
    globe.className = "lang-globe";
    globe.innerHTML = GLOBE_SVG;
    globe.setAttribute("aria-expanded", "false");

    var hint = document.createElement("span");
    hint.className = "lang-hint";

    var menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.setAttribute("role", "menu");

    var optionEls = I18N.LANGUAGES.map(function (lang, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-option";
      btn.setAttribute("role", "menuitem");
      btn.style.transitionDelay = (i * 60) + "ms";
      btn.innerHTML = '<span aria-hidden="true">' + lang.flag + "</span><span>" + lang.name + "</span>";
      btn.addEventListener("click", function () {
        fadeSwitch(function () { I18N.setLang(lang.code); });
        closeMenu();
      });
      menu.appendChild(btn);
      return btn;
    });

    function renderLabels() {
      globe.setAttribute("aria-label", I18N.t("langSwitcher.globeAria"));
      optionEls.forEach(function (btn, i) {
        var lang = I18N.LANGUAGES[i];
        var active = lang.code === I18N.getLang();
        btn.setAttribute("aria-current", active ? "true" : "false");
        btn.setAttribute("aria-label", I18N.t("langSwitcher.optionAria").replace("{lang}", lang.name));
      });
      renderHint();
    }

    function renderHint() {
      if (hint.dataset.dismissed === "1") return;
      var text = I18N.t("langSwitcher.selectLabel");
      hint.innerHTML = "";
      if (reduceMotion()) {
        hint.textContent = text;
        return;
      }
      text.split("").forEach(function (ch, i) {
        var span = document.createElement("span");
        span.className = "lang-hint-char";
        span.style.animationDelay = (i * 80) + "ms";
        span.textContent = ch === " " ? " " : ch;
        hint.appendChild(span);
      });
    }

    function dismissHint() {
      hint.dataset.dismissed = "1";
      hint.classList.add("is-hidden");
      setTimeout(function () { hint.style.display = "none"; }, 400);
    }
    setTimeout(dismissHint, CHROME_DELAY + HINT_LIFE);
    /* ...and immediately once the reader starts moving. The hint has served
       its purpose by then, and this guarantees it is never on screen over the
       navy or sienna band, where plain muted text would be unreadable. */
    window.addEventListener("scroll", function onFirstScroll() {
      if (window.pageYOffset < 120) return;
      window.removeEventListener("scroll", onFirstScroll);
      dismissHint();
    }, { passive: true });

    function fadeSwitch(applyFn) {
      var app = document.getElementById("root") || document.body;
      app.style.transition = "opacity .16s ease";
      app.style.opacity = "0";
      setTimeout(function () {
        applyFn();
        requestAnimationFrame(function () { app.style.opacity = "1"; });
      }, 160);
    }

    var open = false;
    function openMenu() { open = true; menu.classList.add("is-open"); globe.setAttribute("aria-expanded", "true"); }
    function closeMenu() { open = false; menu.classList.remove("is-open"); globe.setAttribute("aria-expanded", "false"); }
    function toggleMenu() { open ? closeMenu() : openMenu(); }

    globe.addEventListener("click", toggleMenu);
    document.addEventListener("click", function (e) {
      if (open && !wrap.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) closeMenu();
    });

    window.addEventListener("langchange", renderLabels);
    renderLabels();

    wrap.appendChild(globe);
    wrap.appendChild(hint);
    wrap.appendChild(menu);
    root.appendChild(wrap);
    arm(wrap);
  }

  /* ---------- contact chip ---------- */
  function mountContactChip(root) {
    var wrap = document.createElement("div");
    wrap.className = "contact-chip-wrap";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "contact-chip";

    var label = document.createElement("span");

    btn.appendChild(label);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });

    function renderLabel() {
      var text = I18N.t("contact.chip");
      label.textContent = text;
      btn.setAttribute("aria-label", text);
    }
    window.addEventListener("langchange", renderLabel);
    renderLabel();

    wrap.appendChild(btn);
    root.appendChild(wrap);
    arm(wrap);

    /* The chip hides over the footer (its target is already on screen) and
       over the hero. On a 390px viewport the hero's scroll hint and the chip
       otherwise land on the same line and collide; hiding it here also keeps
       the promised "name only" first frame clean. */
    if ("IntersectionObserver" in window) {
      var zones = [document.querySelector("footer"), document.querySelector(".hero")].filter(Boolean);
      var over = new Set();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) over.add(entry.target); else over.delete(entry.target);
        });
        wrap.classList.toggle("is-faded", over.size > 0);
      }, { threshold: 0.05 });
      zones.forEach(function (z) { io.observe(z); });
    }
  }

  /* ---------- static-page text binder (used by the vanilla cheapseats page) ---------- */
  function applyStaticTranslations(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = I18N.t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = I18N.t(el.getAttribute("data-i18n-html"));
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) el.setAttribute(parts[0].trim(), I18N.t(parts[1].trim()));
      });
    });
  }

  window.Widgets = { mountLanguageSwitcher: mountLanguageSwitcher, mountContactChip: mountContactChip, applyStaticTranslations: applyStaticTranslations };
})();
