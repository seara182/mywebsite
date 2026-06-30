// AUTO-GENERATED from sections-a.jsx by build.mjs — do not edit directly.
(function () {
/* ===========================================================
   Mika Jeske — landing page sections (single-scroll narrative)
   ============================================================ */
const {
  Reveal,
  Eyebrow,
  Badge,
  GlowShape,
  WaveBlend,
  TimelineEntry,
  AlignBlock,
  BlobCluster,
  useLang
} = window.MJ;

/* ---------- Hero ---------- */
function Hero() {
  const [, t] = useLang();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);
  const words = ["Mika", "Jeske"];
  return /*#__PURE__*/React.createElement("section", {
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
    drift: true,
    className: "hero-glow-blob",
    style: {
      position: "absolute",
      top: "-8%",
      right: "-6%",
      zIndex: 2,
      opacity: 0.9,
      transition: "opacity 1.2s ease",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "arch",
    glow: "navy",
    size: 240,
    drift: true,
    style: {
      position: "absolute",
      bottom: 0,
      left: "-4%",
      zIndex: 2,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      maxWidth: "var(--content-wide)",
      margin: "0 auto",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
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
      transition: "transform 0.7s var(--ease-glide) 0.5s, opacity 0.7s ease 0.5s"
    }
  }, t("hero.eyebrow"))), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "var(--fs-display)",
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
    style: {
      display: "inline-block",
      transform: mounted ? "none" : "translateY(108%) rotate(4deg)",
      opacity: mounted ? 1 : 0,
      transition: `transform 0.9s var(--ease-glide) ${0.1 + i * 0.12}s, opacity 0.9s ease ${0.1 + i * 0.12}s`
    }
  }, w))))), /*#__PURE__*/React.createElement("div", {
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
      transition: "opacity 1s ease 1.4s"
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

/* ---------- Intro (navy accent band) ---------- */
function Intro() {
  const [, t] = useLang();
  const ip = t("intro.photos") || [];
  return /*#__PURE__*/React.createElement("section", {
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
    shadow: "rgba(15,23,42,0.55)"
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "circle",
    glow: "sienna",
    size: 300,
    ink: "var(--navy-deep)",
    style: {
      position: "absolute",
      top: "6%",
      right: "4%",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "fill-slot fill-slot--right"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(BlobCluster, {
    style: {
      width: 640,
      height: 820
    },
    photos: [{
      src: "ci/assets/Bilder/Weitere/i_e_chem.jpeg",
      caption: ip[0],
      glow: "white",
      w: 300,
      h: 430,
      focus: "50% 38%",
      rot: -4,
      drift: true,
      radius: "62% 38% 46% 54% / 58% 52% 48% 42%",
      pos: {
        top: 0,
        left: 0
      }
    }, {
      src: "ci/assets/Bilder/Weitere/i_zfp.jpeg",
      caption: ip[1],
      glow: "white",
      w: 380,
      h: 248,
      focus: "50% 45%",
      rot: 5,
      drift: true,
      radius: "46% 54% 60% 40% / 52% 44% 56% 48%",
      pos: {
        top: 520,
        left: 252
      }
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "container align-track",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(AlignBlock, {
    align: "left",
    maxWidth: "58ch"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--sienna-glow)"
  }, t("intro.eyebrow"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h2)",
      lineHeight: 1.22,
      letterSpacing: "var(--ls-heading)",
      color: "var(--on-dark-strong)",
      margin: "20px 0 0",
      maxWidth: "20ch"
    }
  }, t("intro.headline"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 160
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--on-dark-body)",
      margin: "24px 0 0",
      maxWidth: "54ch"
    }
  }, t("intro.p1"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 220
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--on-dark-body)",
      margin: "16px 0 0",
      maxWidth: "54ch"
    }
  }, t("intro.p2"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 280
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--on-dark-body)",
      margin: "16px 0 0",
      maxWidth: "54ch"
    }
  }, t("intro.p3"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 340
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--on-dark-strong)",
      margin: "16px 0 0",
      maxWidth: "54ch"
    }
  }, t("intro.p4"))))));
}
window.SECTIONS_A = {
  Hero,
  Intro
};
})();
