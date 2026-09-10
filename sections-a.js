// AUTO-GENERATED from sections-a.jsx by build.mjs — do not edit directly.
(function () {
/* ===========================================================
   Mika Jeske — landing page sections (single-scroll narrative)
   ============================================================ */
const {
  asset,
  Reveal,
  Parallax,
  Pressable,
  SplitFeature,
  Eyebrow,
  Badge,
  GlowShape,
  WaveBlend,
  TimelineEntry,
  AlignBlock,
  BlobCluster,
  useLang
} = window.MJ;

/* ---------- Hero ----------
   The brief asks that on load you see the NAME and nothing else, and
   that it should arrive with movement and depth rather than a plain
   fade. So the hero is choreographed as one sequence instead of five
   independent fades: the two name lines rise out of focus and settle
   (0.10s / 0.22s), the eyebrow follows (0.5s), the portrait comes
   forward out of depth (1.0s), and only then do the scroll hint and the
   floating chrome arrive (1.4s). For the first second the screen really
   is just "Mika Jeske". */
const HERO_T = {
  name: 100,
  nameStep: 120,
  eyebrow: 500,
  portrait: 1000,
  chrome: 1400
};
function Hero() {
  const [, t] = useLang();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);
  const words = ["Mika", "Jeske"];
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    "data-section": true,
    className: "hero",
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      padding: "0 var(--gutter)"
    }
  }, /*#__PURE__*/React.createElement(GlowShape, {
    shape: "blob",
    glow: "duo",
    size: 420,
    parallax: "--depth-3",
    className: "hero-glow-blob",
    style: {
      position: "absolute",
      top: "-8%",
      right: "-6%",
      zIndex: 2,
      opacity: mounted ? 1 : 0,
      transition: "opacity 1.4s var(--ease-emphasized) 200ms",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "arch",
    glow: "navy",
    size: 240,
    parallax: "--depth-2",
    className: "hero-glow-arch",
    style: {
      position: "absolute",
      bottom: 0,
      left: "-4%",
      zIndex: 2,
      opacity: mounted ? 1 : 0,
      transition: "opacity 1.4s var(--ease-emphasized) 340ms",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-photo",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      zIndex: 2,
      right: "clamp(80px, 15vw, 340px)",
      bottom: 0,
      height: "clamp(520px, 66vh, 820px)",
      pointerEvents: "none",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "none" : "translateY(26px) scale(0.965)",
      filter: mounted ? "blur(0px)" : "blur(10px)",
      transition: "opacity 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms, transform 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms, filter 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: "50%",
      top: "42%",
      width: "82%",
      height: "82%",
      transform: "translate(-50%,-50%)",
      background: "var(--glow-duo)",
      opacity: 0.55,
      filter: "var(--blur-md)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: asset("ci/assets/Bilder/Weitere/site_header.png"),
    alt: "Mika Jeske",
    className: "drift-soft",
    style: {
      position: "relative",
      zIndex: 1,
      display: "block",
      height: "100%",
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      zIndex: 2,
      left: 10,
      bottom: 10,
      fontFamily: "var(--font-text)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--ink)",
      textShadow: "0 0 8px var(--bg), 0 0 14px var(--bg)"
    }
  }, t("hero.aiImageLabel"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-namewrap",
    style: {
      position: "relative",
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-line",
    style: {
      display: "inline-block",
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--label)",
      transform: mounted ? "none" : "translateY(120%)",
      opacity: mounted ? 1 : 0,
      transition: "transform 0.7s var(--ease-emphasized) " + HERO_T.eyebrow + "ms, opacity 0.7s ease " + HERO_T.eyebrow + "ms"
    }
  }, t("hero.eyebrow"))), /*#__PURE__*/React.createElement("h1", {
    className: "hero-name",
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "var(--fs-display-hero)",
      lineHeight: 0.98,
      letterSpacing: "var(--ls-display)",
      color: "var(--ink)",
      margin: 0
    }
  }, words.map((w, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "block",
      overflow: "hidden",
      paddingBottom: "0.14em",
      marginBottom: "-0.14em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-line",
    style: {
      display: "inline-block",
      transformOrigin: "0% 100%",
      transform: mounted ? "none" : "translateY(108%) scale(0.94)",
      filter: mounted ? "blur(0px)" : "blur(9px)",
      opacity: mounted ? 1 : 0,
      transition: "transform 1s var(--ease-emphasized) " + (HERO_T.name + i * HERO_T.nameStep) + "ms, filter 1s var(--ease-emphasized) " + (HERO_T.name + i * HERO_T.nameStep) + "ms, opacity 0.8s ease " + (HERO_T.name + i * HERO_T.nameStep) + "ms"
    }
  }, w))))), /*#__PURE__*/React.createElement("div", {
    className: "hero-hint",
    style: {
      position: "absolute",
      zIndex: 4,
      bottom: 30,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      opacity: mounted ? 0.92 : 0,
      transition: "opacity 1s ease " + HERO_T.chrome + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-text)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "var(--ink)",
      textShadow: "0 0 10px var(--bg), 0 0 18px var(--bg)"
    }
  }, t("hero.scrollHint")), /*#__PURE__*/React.createElement("span", {
    className: "scroll-dot",
    style: {
      width: 2,
      height: 42,
      borderRadius: 2,
      background: "var(--hairline-strong)",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 0 12px 4px var(--bg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 16,
      background: "var(--ink)",
      animation: "scrollHint 1.8s var(--ease-in-out) infinite"
    }
  }))));
}

/* ---------- Intro (navy accent band) ----------
   The DGZfP photograph used to be one of two small blobs floating in the
   right half, visible only above 1440px. It is the strongest image on the
   page - him at the award, in the field he is applying into - so it now
   fills half the band edge to edge and is visible at every width.

   The ambient glow circle that used to sit top-right went with it: that
   corner is the photograph now, and a near-black disc floating over a
   photograph is furniture, not motif. */
function Intro() {
  const [, t] = useLang();
  const ip = t("intro.photos") || [];
  return /*#__PURE__*/React.createElement("section", {
    id: "intro",
    "data-section": true,
    className: "on-navy",
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "top",
    color: "var(--paper)",
    seed: 5,
    shadow: "rgb(var(--accent-1-deep-rgb) / 0.55)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(SplitFeature, {
    src: asset("ci/assets/Bilder/Weitere/i_zfp.jpeg"),
    alt: ip[0],
    caption: ip[0],
    focus: "50% 42%"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--sienna-glow)"
  }, t("intro.eyebrow"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h2)",
      lineHeight: 1.22,
      letterSpacing: "var(--ls-heading)",
      color: "var(--on-dark-strong)",
      margin: "20px 0 0",
      maxWidth: "18ch"
    }
  }, t("intro.headline"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 160
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--on-dark-body)",
      margin: "24px 0 0",
      maxWidth: "46ch"
    }
  }, t("intro.p1"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 220
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--on-dark-body)",
      margin: "16px 0 0",
      maxWidth: "46ch"
    }
  }, t("intro.p2"))))));
}

/* ---------- Seeking ("Was ich suche") ----------
   The pitch used to end on "available immediately, I can start Monday",
   written for a full-time search that no longer exists. This replaces it
   with the handful of facts a recruiter actually needs, set as a spec list
   rather than a paragraph so it survives a five-second skim. It is also
   the target the skipper's first link points at. */
function Seeking() {
  const [, t] = useLang();
  const s = t("seeking");
  return /*#__PURE__*/React.createElement("section", {
    id: "werkstudent",
    "data-section": true,
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "var(--section-y-sm) 0 var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "top",
    color: "var(--navy)",
    seed: 63,
    shadow: "rgb(var(--accent-1-rgb) / 0.45)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "seeking"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, null, s.eyebrow)), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h2)",
      lineHeight: 1.15,
      letterSpacing: "var(--ls-heading)",
      color: "var(--heading)",
      margin: "16px 0 0",
      maxWidth: "14ch"
    }
  }, s.heading))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("dl", {
    className: "seeking__list"
  }, s.rows.map((r, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("dt", {
    className: "seeking__k"
  }, r.k), /*#__PURE__*/React.createElement("dd", {
    className: "seeking__v"
  }, r.v))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(Pressable, {
    as: "a",
    className: "cta-ink",
    href: "https://www.linkedin.com/in/mika-jeske-835092313/",
    target: "_blank",
    rel: "noopener",
    lift: -3,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginTop: "clamp(24px,3vw,36px)",
      padding: "12px 22px",
      background: "var(--ink)",
      color: "var(--paper)",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-body)",
      fontWeight: 600,
      textDecoration: "none"
    }
  }, s.cta, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    className: "cta-arrow"
  }, "\u2192")))))));
}
window.SECTIONS_A = {
  Hero,
  Intro,
  Seeking
};
})();
