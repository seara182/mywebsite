// AUTO-GENERATED from sections-b.jsx by build.mjs — do not edit directly.
(function () {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   Mika Jeske — résumé, engagement, projects, footer + App shell
   ============================================================ */
const {
  asset,
  Reveal,
  Eyebrow,
  Badge,
  GlowShape,
  WaveBlend,
  TimelineEntry,
  AlignBlock,
  BlobCluster,
  useLang,
  LanguageSwitcherMount,
  ContactChipMount
} = window.MJ;
const {
  Hero,
  Intro
} = window.SECTIONS_A;
const {
  Story,
  CleanroomTear,
  ConfiTear,
  Reunion
} = window.SECTIONS_NEW;
const LINKEDIN = "https://www.linkedin.com/in/mika-jeske-835092313/";
const EMAIL = "mailto:mikajeske@gmail.com";
const PHONE = "tel:+491774866584";
function SectionHead({
  kicker,
  title,
  glow = "sienna",
  shape = "blob"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "section-head",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      marginBottom: "clamp(32px,5vw,64px)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, null, kicker)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h1)",
      letterSpacing: "var(--ls-heading)",
      color: "var(--heading)",
      margin: "16px 0 0",
      maxWidth: "16ch"
    }
  }, title))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120,
    className: "section-head__deco",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(GlowShape, {
    shape: shape,
    glow: glow,
    size: 96
  })));
}

/* ---------- Résumé ---------- */
function Resume() {
  const [, t] = useLang();
  const r = t("resume");
  const experience = t("experience");
  const education = t("education");
  const skills = t("skills");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    kicker: r.kicker,
    title: r.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(420px,100%),1fr))",
      gap: "clamp(32px,5vw,72px)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h3", {
    className: "t-h3",
    style: {
      marginBottom: 28
    }
  }, r.experienceHeading)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 60
  }, /*#__PURE__*/React.createElement("div", null, experience.map((e, i) => /*#__PURE__*/React.createElement(TimelineEntry, _extends({
    key: i
  }, e, {
    last: i === experience.length - 1
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h3", {
    className: "t-h3",
    style: {
      marginBottom: 28
    }
  }, r.educationHeading)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 60
  }, /*#__PURE__*/React.createElement("div", null, education.map((e, i) => /*#__PURE__*/React.createElement(TimelineEntry, _extends({
    key: i
  }, e, {
    last: i === education.length - 1
  }))))))), /*#__PURE__*/React.createElement(Reveal, {
    style: {
      marginTop: "clamp(48px,6vw,88px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, r.skillsEyebrow)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%),1fr))",
      gap: "clamp(20px,2.5vw,32px)"
    }
  }, skills.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-small)",
      fontWeight: 600,
      color: "var(--heading)",
      marginBottom: 14
    }
  }, s.group), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, s.items.map((it, j) => /*#__PURE__*/React.createElement(Badge, {
    key: j,
    variant: i === 0 ? "accent" : "neutral"
  }, it))))))), /*#__PURE__*/React.createElement(Reveal, {
    style: {
      marginTop: "clamp(40px,5vw,72px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      padding: "clamp(24px,3vw,36px)",
      background: "var(--surface-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(GlowShape, {
    shape: "squircle",
    glow: "amber",
    size: 64
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-caption)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--label)",
      fontWeight: 600,
      marginBottom: 4
    }
  }, r.awardLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-title)",
      color: "var(--heading)"
    }
  }, r.awardName))), /*#__PURE__*/React.createElement("a", {
    href: LINKEDIN,
    target: "_blank",
    rel: "noopener",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 22px",
      background: "var(--ink)",
      color: "var(--paper)",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-body)",
      fontWeight: 600
    }
  }, r.linkedinLabel, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true
  }, "\u2192"))))));
}

/* ---------- Engagement (sienna accent band) ---------- */
function Engagement() {
  const [, t] = useLang();
  const s = t("engagementSection");
  const engagement = t("engagement");
  const ep = s.photos || [];
  return /*#__PURE__*/React.createElement("section", {
    className: "on-sienna",
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "top",
    color: "var(--paper)",
    seed: 31,
    shadow: "rgba(120,52,28,0.5)"
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "blob",
    glow: "amber",
    size: 340,
    ink: "var(--sienna-deep)",
    style: {
      position: "absolute",
      bottom: "6%",
      right: "-4%",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "fill-slot fill-slot--left"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(BlobCluster, {
    style: {
      width: 560,
      height: 860
    },
    photos: [{
      src: asset("ci/assets/Bilder/Weitere/e_kids.jpeg"),
      caption: ep[0],
      glow: "white",
      w: 430,
      h: 282,
      focus: "50% 45%",
      rot: 4,
      drift: true,
      radius: "58% 42% 52% 48% / 46% 56% 44% 54%",
      pos: {
        top: 0,
        left: 130
      }
    }, {
      src: asset("ci/assets/Bilder/Weitere/e_hfc.jpeg"),
      caption: ep[1],
      glow: "white",
      w: 288,
      h: 408,
      focus: "50% 32%",
      rot: -5,
      drift: true,
      radius: "52% 48% 40% 60% / 56% 46% 54% 44%",
      pos: {
        top: 410,
        left: 0
      }
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "container align-track",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(AlignBlock, {
    align: "right",
    maxWidth: "var(--content-narrow)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "clamp(32px,5vw,56px)"
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--on-dark-strong)"
  }, s.eyebrow)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h1)",
      letterSpacing: "var(--ls-heading)",
      color: "var(--on-dark-strong)",
      margin: "16px 0 0",
      maxWidth: "18ch"
    }
  }, s.heading))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 60
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      "--ink": "var(--on-dark-strong)",
      "--accent": "var(--on-dark-strong)",
      "--heading": "var(--on-dark-strong)",
      "--text": "var(--on-dark-body)",
      "--text-body": "var(--on-dark-body)",
      "--label": "var(--on-dark-muted)",
      "--border": "var(--on-dark-hairline)",
      "--paper-2": "rgba(0,0,0,0.12)"
    }
  }, engagement.map((e, i) => /*#__PURE__*/React.createElement(TimelineEntry, _extends({
    key: i
  }, e, {
    last: i === engagement.length - 1
  }))))))));
}

/* ---------- Projects (Sports Window showcase) ---------- */
function Projects() {
  const [, t] = useLang();
  const p = t("projects");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container align-track"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    kicker: p.kicker,
    title: p.title,
    glow: "navy",
    shape: "arch"
  }), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%),1fr))",
      gap: "clamp(28px,4vw,56px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: 0,
      maxWidth: "46ch"
    }
  }, p.description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 28
    }
  }, p.stack.map((s, i) => /*#__PURE__*/React.createElement(Badge, {
    key: i,
    variant: "navy"
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px 24px",
      marginTop: 28
    }
  }, p.features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--fs-small)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "var(--accent)"
    }
  }), f))), /*#__PURE__*/React.createElement("a", {
    href: asset("projects/sports-window/"),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginTop: 32,
      padding: "13px 24px",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-body)",
      fontWeight: 600,
      color: "var(--heading)"
    }
  }, p.cta, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "bay-preview",
    style: {
      position: "relative",
      minWidth: 0,
      aspectRatio: "16/10",
      minHeight: 300,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 16,
      padding: 26,
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      background: "#14151D",
      boxShadow: "var(--shadow-lg)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(120% 120% at 80% 0%, rgba(232,154,92,0.5), transparent 55%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "20px 22px",
      borderRadius: "var(--radius-lg)",
      background: "linear-gradient(110deg, var(--sienna-deep), var(--amber))",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      opacity: 0.85,
      fontWeight: 600
    }
  }, "Next Game \xB7 Week 25"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "clamp(20px,3vw,34px)",
      marginTop: 6
    }
  }, "@ Miami Marlins"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.9,
      marginTop: 8
    }
  }, "Sat, Jun 20 \xB7 1:10 AM \xB7 loanDepot park")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
      gap: 12
    }
  }, [["ERA", "5.73"], ["K", "48"], ["WHIP", "1.58"], ["W-L", "2-6"]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minWidth: 0,
      padding: "12px 10px",
      borderRadius: "var(--radius-sm)",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: "0.1em",
      color: "rgba(255,255,255,0.55)",
      fontWeight: 600
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "clamp(18px, 5vw, 22px)",
      color: "#fff",
      marginTop: 4
    }
  }, v)))))))));
}

/* ---------- Footer ---------- */
function Footer() {
  const [, t] = useLang();
  const f = t("footer");
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: "clamp(48px,6vw,88px) 0 40px",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h3)",
      color: "var(--heading)",
      letterSpacing: "var(--ls-heading)"
    }
  }, "Mika Jeske"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: LINKEDIN,
    target: "_blank",
    rel: "noopener",
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      fontWeight: 500
    }
  }, f.linkedinLabel), /*#__PURE__*/React.createElement("a", {
    href: EMAIL,
    "aria-label": f.emailAria,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m4 7 8 6 8-6"
  })), f.email), /*#__PURE__*/React.createElement("a", {
    href: PHONE,
    "aria-label": f.phoneAria,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
  })), f.phone), /*#__PURE__*/React.createElement("a", {
    href: asset("impressum/"),
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      fontWeight: 500
    }
  }, f.legal), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      color: "var(--text-faint)"
    }
  }, f.madeBy))), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "i18n-disclaimer"
  }, f.disclaimer), f.privacyNote && /*#__PURE__*/React.createElement("p", {
    className: "i18n-disclaimer"
  }, f.privacyNote)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: asset("private/"),
    style: {
      display: "inline-flex",
      padding: 8,
      color: "var(--text-faint)",
      opacity: 0.35
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "11",
    width: "16",
    height: "10",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V7a4 4 0 0 1 8 0v4"
  })))));
}

/* ---------- ambient side orbs ----------
   A few drifting, colour-glowing shapes pinned in the side gutters.
   Only shown on 16:9-and-wider displays (see .side-orbs in index.html),
   where the centred content column leaves the margins feeling empty.
   Fixed layer sits behind the content; the navy/sienna bands cover it,
   so the orbs only read over the paper sections. */
function SideOrbs() {
  return /*#__PURE__*/React.createElement("div", {
    className: "side-orbs",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(GlowShape, {
    shape: "circle",
    glow: "duo",
    size: 150,
    drift: true,
    style: {
      position: "absolute",
      right: "1vw",
      top: "22%"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "blob",
    glow: "sienna",
    size: 180,
    drift: true,
    style: {
      position: "absolute",
      left: "1.5vw",
      top: "40%"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "squircle",
    glow: "amber",
    size: 140,
    drift: true,
    style: {
      position: "absolute",
      right: "2vw",
      top: "58%"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "blob",
    glow: "navy",
    size: 170,
    drift: true,
    style: {
      position: "absolute",
      left: "1vw",
      top: "76%"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "circle",
    glow: "duo",
    size: 150,
    drift: true,
    style: {
      position: "absolute",
      right: "1.5vw",
      top: "90%"
    }
  }));
}
function App() {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(SideOrbs, null), /*#__PURE__*/React.createElement(LanguageSwitcherMount, null), /*#__PURE__*/React.createElement(ContactChipMount, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Intro, null), /*#__PURE__*/React.createElement(Story, null), /*#__PURE__*/React.createElement(Resume, null), /*#__PURE__*/React.createElement(CleanroomTear, null), /*#__PURE__*/React.createElement(Engagement, null), /*#__PURE__*/React.createElement(ConfiTear, null), /*#__PURE__*/React.createElement(Reunion, null), /*#__PURE__*/React.createElement(Projects, null), /*#__PURE__*/React.createElement(Footer, null));
}

/* Expose the root component so the build-time prerender (build.mjs) can render it
   to static HTML in Node. */
window.SECTIONS_B = {
  App
};

/* Mount only in the browser. The #root is pre-filled with prerendered markup at
   build time, so hydrate it (preserving the server DOM); fall back to a fresh
   render if the page was served without prerender (e.g. raw file:// of a source
   checkout before `npm run build`). */
if (typeof document !== "undefined") {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    if (rootEl.firstElementChild) {
      ReactDOM.hydrateRoot(rootEl, /*#__PURE__*/React.createElement(App, null));
    } else {
      ReactDOM.createRoot(rootEl).render(/*#__PURE__*/React.createElement(App, null));
    }
  }
}
})();
