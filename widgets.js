/* ============================================================
   widgets.js — vanilla DOM widgets shared by the React page and
   the static cheapseats page: language switcher, contact chip,
   and the data-i18n static-text binder.
   ============================================================ */
(function () {
  "use strict";
  var I18N = window.I18N;

  /* ---------- the globe/sun glyph ----------
     One disc, split on the diagonal: globe on the upper-left, sun on the
     lower-right. Mika drew this, and it is the version that actually says
     what the button does — the earlier attempts morphed the whole mark
     between globe / sun / moon, which meant that at any given moment it
     only advertised ONE of the two things the button opens, and in the
     default state it advertised appearance not at all.

     The split is the line x + y = 24. The globe grid is clipped to the
     x + y < 24 side; the rays all sit on the far side of it, outside the
     rim. Deliberately STATIC — this is a signifier for "language and
     appearance", not a state readout. Which mode is active is shown by the
     segmented control inside the menu, where there is room to say it
     properly. */
  var GLOBE_SVG = [
    '<svg class="globe-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    ' stroke-width="1.6" stroke-linecap="round" aria-hidden="true">',
      '<defs><clipPath id="mjGlobeHalf">',
        /* everything above-left of the diagonal */
        '<polygon points="0,0 24,0 0,24"/>',
      '</clipPath></defs>',
      '<circle cx="12" cy="12" r="7.5"/>',
      /* NO drawn terminator. A diagonal stroke across a circle is the
         universal "prohibited / disabled" mark — with the line in, the
         button read as a crossed-out globe. The split is carried by the
         content instead: grid lines only on the upper-left, rays only off
         the lower-right, which is the same division without the negation. */
      '<g clip-path="url(#mjGlobeHalf)">',
        '<path d="M4.5 12H19.5"/>',                      /* equator */
        '<path d="M5.22 8.8H18.78"/>',                   /* upper parallel */
        '<path d="M12 4.5A3.6 7.5 0 0 0 12 19.5"/>',     /* meridian */
      '</g>',
      '<g class="gs-rays">',
        '<line x1="19.62" y1="7.6" x2="21.44" y2="6.55"/>',
        '<line x1="20.8" y1="12" x2="22.9" y2="12"/>',
        '<line x1="19.62" y1="16.4" x2="21.44" y2="17.45"/>',
        '<line x1="16.4" y1="19.62" x2="17.45" y2="21.44"/>',
        '<line x1="12" y1="20.8" x2="12" y2="22.9"/>',
      '</g>',
    '</svg>'
  ].join("");

  /* Small standalone marks for the three appearance options. */
  var SUN_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.6"/><path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/></svg>';
  var MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"/></svg>';

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

    /* ---------- appearance ----------
       Deliberately inside the existing popover rather than as a second
       floating button. The corners are already carrying the globe and the
       contact chip, and a portfolio does not need a third permanent control
       hovering over the reader; the cost of hiding it one tap deep is
       smaller than the cost of the clutter.

       role="group" + menuitemradio, NOT role="radiogroup": the parent is a
       role="menu", and a menu may only contain menuitem, menuitemradio,
       menuitemcheckbox or group. A radiogroup in here would be invalid ARIA
       and screen readers would report the containment badly. */
    var sep = document.createElement("div");
    sep.className = "lang-sep";
    sep.setAttribute("aria-hidden", "true");
    menu.appendChild(sep);

    var themeRow = document.createElement("div");
    themeRow.className = "theme-row";
    themeRow.setAttribute("role", "group");
    themeRow.style.transitionDelay = (I18N.LANGUAGES.length * 60) + "ms";

    var themeLabel = document.createElement("span");
    themeLabel.className = "theme-row__label";
    themeLabel.setAttribute("aria-hidden", "true");
    themeRow.appendChild(themeLabel);

    var seg = document.createElement("div");
    seg.className = "theme-seg";
    themeRow.appendChild(seg);

    var THEME_MARK = { auto: "", light: SUN_SVG, dark: MOON_SVG };
    var themeEls = I18N.THEMES.map(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "theme-opt theme-opt--" + code;
      b.setAttribute("role", "menuitemradio");
      b.dataset.theme = code;
      b.addEventListener("click", function () { I18N.setTheme(code); });
      seg.appendChild(b);
      return b;
    });

    /* Left/Right within the segment, which is what the segmented shape
       promises; Tab still steps through them as it does the language pills
       above, matching how the rest of this menu already behaves. */
    seg.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var i = themeEls.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var next = (i + (e.key === "ArrowRight" ? 1 : themeEls.length - 1)) % themeEls.length;
      themeEls[next].focus();
      I18N.setTheme(I18N.THEMES[next]);
    });

    function renderTheme() {
      var active = I18N.getTheme();
      themeLabel.textContent = I18N.t("theme.label");
      themeRow.setAttribute("aria-label", I18N.t("theme.groupAria"));
      themeEls.forEach(function (b, i) {
        var code = I18N.THEMES[i];
        var on = code === active;
        b.setAttribute("aria-checked", on ? "true" : "false");
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-label", I18N.t("theme." + code + "Aria"));
        /* Auto reads as a word; light and dark read as their marks, with the
           accessible name carrying the meaning either way. */
        b.innerHTML = code === "auto"
          ? '<span class="theme-opt__txt"></span>'
          : THEME_MARK[code];
        if (code === "auto") b.firstChild.textContent = I18N.t("theme.auto");
      });
    }
    window.addEventListener("themechange", renderTheme);

    function renderLabels() {
      globe.setAttribute("aria-label", I18N.t("langSwitcher.globeAria"));
      optionEls.forEach(function (btn, i) {
        var lang = I18N.LANGUAGES[i];
        var active = lang.code === I18N.getLang();
        btn.setAttribute("aria-current", active ? "true" : "false");
        btn.setAttribute("aria-label", I18N.t("langSwitcher.optionAria").replace("{lang}", lang.name));
      });
      renderHint();
      renderTheme();
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

    menu.appendChild(themeRow);

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
