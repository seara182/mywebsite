// AUTO-GENERATED from sections-new.jsx by build.mjs — do not edit directly.
(function () {
/* ============================================================
   Mika Jeske — personal narrative, "torn-paper" deep-dives
   (ZMN cleanroom · EKM Konfi work) and the Abi-reunion mention.
   Built on the design-system tokens + window.MJ primitives.
   ============================================================ */
const {
  useState,
  useRef,
  useEffect
} = React;
const {
  asset,
  Reveal,
  Eyebrow,
  GlowShape,
  WaveBlend,
  AlignBlock,
  FigurePlot,
  useLang
} = window.MJ;

/* ---------- Bachelor-thesis measurement data ----------
   From Jeske-Mika_Bachelorarbeit-Messdaten.xlsx. Two figures:
   (1) SEEBECK_T — relative Seebeck coefficient (µV/K) vs temperature for three
       sputtered films; Ni is negative while Ag/Al are positive (opposite
       thermoelectric sign).  ("Seebeck" sheet, V/K → µV/K)
   (2) SIGMA_TIME — electrical conductivity σ (MS/m) over one heat→cool cycle,
       Ni vs Bi on two y-axes (their magnitudes differ ~100×). Nickel's σ falls
       on heating (PTC), Bismuth's rises (NTC) — opposite responses.
       ("Leitfähigkeit" sheet, time in s → min, S/m → MS/m) */
const SEEBECK_T = {
  series: [{
    label: "Ag · 100 nm",
    accent: true,
    x: [51.6, 61.5, 71.4, 81.2, 91.0, 100.8, 110.7, 120.6, 130.3, 140.1, 150.1, 140.0, 130.1, 120.2, 109.9, 100.2, 90.4, 80.4, 70.6],
    y: [6.08, 6.38, 6.51, 6.73, 7.01, 7.03, 7.30, 7.16, 7.41, 7.44, 7.66, 7.46, 7.09, 7.02, 6.70, 6.46, 6.31, 5.93, 5.69]
  }, {
    label: "Al · 100 nm",
    x: [51.1, 60.9, 70.8, 80.6, 90.5, 100.3, 110.2, 120.1, 129.8, 139.7, 149.7, 139.6, 129.6, 119.8, 109.7, 99.9, 90.0, 80.1, 70.3],
    y: [0.69, 0.87, 1.10, 1.22, 1.34, 1.49, 1.96, 1.93, 2.28, 2.15, 2.48, 2.44, 2.28, 2.05, 2.00, 1.68, 1.47, 1.29, 1.06]
  }, {
    label: "Ni · 100 nm",
    x: [51.7, 61.6, 71.5, 81.3, 91.2, 101.0, 110.9, 120.7, 130.5, 140.2, 150.1, 140.0, 130.0, 120.1, 110.2, 100.2, 90.4, 80.4, 70.6],
    y: [-15.34, -15.42, -15.63, -15.75, -15.89, -15.93, -16.12, -16.17, -16.28, -16.13, -16.43, -16.20, -16.22, -15.83, -15.89, -15.78, -15.46, -15.43, -15.03]
  }]
};
const SIGMA_TIME = {
  series: [{
    label: "Ni · 100 nm  (PTC)",
    color: "var(--accent)",
    axis: 1,
    x: [9, 54, 85, 115, 146, 177, 207, 238, 269, 300, 331, 365, 400, 436, 477, 531, 590, 659, 741, 840, 900],
    y: [6.64, 6.45, 6.28, 6.12, 5.99, 5.86, 5.75, 5.66, 5.59, 5.54, 5.51, 5.84, 6.08, 6.30, 6.52, 6.76, 6.99, 7.25, 7.50, 7.78, 8.05]
  }, {
    label: "Bi · 50 nm  (NTC)",
    color: "var(--navy)",
    axis: 2,
    x: [5, 50, 85, 119, 154, 189, 227, 261, 296, 330, 365, 402, 441, 480, 522, 574, 633, 702, 785, 886, 957],
    y: [0.0579, 0.0589, 0.0598, 0.0607, 0.0618, 0.0631, 0.0648, 0.0668, 0.0691, 0.0705, 0.0723, 0.0704, 0.0686, 0.0669, 0.0652, 0.0636, 0.0620, 0.0605, 0.0590, 0.0575, 0.0559]
  }]
};

/* ---------- torn-paper edge generator ----------
   Deterministic jagged path so each tear looks hand-ripped
   but stable between renders. Filled with the PAGE colour so
   it reads as the surface tearing away to reveal what's below. */
function tornPath(seed, side) {
  const W = 1200,
    H = 26,
    teeth = 52;
  let s = (seed * 9301 + 49297) % 233280;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const pts = [];
  for (let i = 0; i <= teeth; i++) {
    const x = W / teeth * i;
    const j = rnd();
    // small chance of a deeper "rip" for organic asymmetry
    const depth = j < 0.12 ? 0.9 : 0.25 + j * 0.55;
    pts.push([x, side === "top" ? H * depth : H * (1 - depth)]);
  }
  let d;
  if (side === "top") {
    d = `M0,0 L${W},0 L${W},${pts[teeth][1].toFixed(1)}`;
    for (let i = teeth - 1; i >= 0; i--) d += ` L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
  } else {
    d = `M0,${H} L${W},${H} L${W},${pts[teeth][1].toFixed(1)}`;
    for (let i = teeth - 1; i >= 0; i--) d += ` L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
  }
  return d + " Z";
}
function TornEdge({
  side,
  seed,
  color = "var(--paper)"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1200 26",
    preserveAspectRatio: "none",
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      width: "100%",
      height: 26,
      display: "block",
      zIndex: 3,
      pointerEvents: "none",
      [side]: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: tornPath(seed, side),
    fill: color
  }));
}

/* ---------- the torn-open deep dive ----------
   Closed: a faint perforated seam inviting a pull.
   Open: the page tears edge-to-edge across the viewport and a
   recessed "under-surface" pushes the content below it down
   (inline, not overlay). The seam and the panel's text stay in
   the reading column; only the rip itself runs full-bleed. */
function TornSection({
  label,
  seed = 7,
  children
}) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(0);
  const inner = useRef(null);
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!inner.current) return;
    const measure = () => setH(inner.current ? inner.current.scrollHeight : 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "clamp(24px,4vw,40px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    className: "tear-trigger",
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      padding: "16px 20px",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      fontFamily: "var(--font-text)",
      color: "var(--text-muted)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      flex: 1,
      height: 0,
      borderTop: "2px dashed var(--hairline-strong)",
      opacity: 0.7
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "tear-label",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      flex: "none",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      whiteSpace: "nowrap"
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "var(--paper-2)",
      border: "1px solid var(--hairline-strong)",
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform .4s var(--ease-glide)",
      fontSize: 12,
      lineHeight: 1,
      color: "var(--sienna)"
    }
  }, "\u2193")), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      flex: 1,
      height: 0,
      borderTop: "2px dashed var(--hairline-strong)",
      opacity: 0.7
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: open ? reduce ? "none" : h + 80 : 0,
      overflow: "hidden",
      transition: reduce ? "none" : "max-height .8s var(--ease-glide)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: inner
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(TornEdge, {
    side: "top",
    seed: seed
  }), /*#__PURE__*/React.createElement(TornEdge, {
    side: "bottom",
    seed: seed + 31
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      padding: "clamp(44px,6vw,72px) 0",
      background: "radial-gradient(120% 80% at 50% -10%, rgba(22,20,15,0.10), transparent 60%)," + "linear-gradient(180deg, var(--paper-3), var(--paper-2) 22%, var(--paper-2))",
      boxShadow: "inset 0 14px 30px -16px rgba(22,20,15,0.45), inset 0 -14px 30px -16px rgba(22,20,15,0.30)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity: 0.5,
      backgroundImage: "repeating-linear-gradient(92deg, rgba(22,20,15,0.022) 0 2px, transparent 2px 6px)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      position: "relative"
    }
  }, children))))));
}

/* ---------- ZMN photos: a relaxed, slightly-rotated row ---------- */
function LoosePhoto({
  src,
  caption,
  rot,
  w
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      flex: `0 1 ${w}px`,
      transform: `rotate(${rot}deg)`,
      transition: "transform .4s var(--ease-out)"
    },
    className: "loose-photo"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 6,
      background: "var(--paper)",
      borderRadius: 10,
      boxShadow: "0 2px 10px -2px rgba(22,20,15,0.18), 0 18px 40px -22px rgba(188,90,55,0.45)",
      border: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: caption,
    loading: "lazy",
    style: {
      display: "block",
      width: "100%",
      height: "auto",
      borderRadius: 5
    }
  })), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      color: "var(--text-muted)",
      marginTop: 10,
      paddingLeft: 4
    }
  }, caption));
}

/* ---------- Konfi photos: hand-glued polaroids ---------- */
function Polaroid({
  src,
  caption,
  rot,
  tape
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      transform: `rotate(${rot}deg)`,
      transition: "transform .4s var(--ease-out)",
      position: "relative"
    },
    className: "polaroid"
  }, tape && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      top: -12,
      left: "50%",
      width: 78,
      height: 26,
      transform: "translateX(-50%) rotate(-3deg)",
      background: "rgba(226,161,76,0.28)",
      border: "1px solid rgba(226,161,76,0.18)",
      borderRadius: 2,
      boxShadow: "0 1px 3px rgba(22,20,15,0.10)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FCFAF5",
      padding: "12px 12px 0",
      borderRadius: 3,
      boxShadow: "0 6px 22px -10px rgba(22,20,15,0.40), 0 30px 50px -30px rgba(188,90,55,0.40)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: caption,
    loading: "lazy",
    style: {
      display: "block",
      width: "100%",
      height: "auto",
      filter: "saturate(1.02) contrast(1.02)"
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: "#5a5346",
      textAlign: "center",
      padding: "14px 6px 16px",
      lineHeight: 1.4
    }
  }, caption)));
}

/* ============================================================
   STORY — how Mika ended up in the small scale
   ============================================================ */
function Story() {
  const [, t] = useLang();
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "top",
    color: "var(--navy)",
    seed: 63,
    shadow: "rgba(28,44,76,0.45)"
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "squircle",
    glow: "amber",
    size: 200,
    drift: true,
    style: {
      position: "absolute",
      top: "8%",
      left: "-5%",
      opacity: 0.35,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "container align-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "story-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "story-figs"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(FigurePlot, {
    series: SEEBECK_T.series,
    xDomain: [45, 155],
    yDomain: [-18, 9],
    xTicks: [50, 75, 100, 125, 150],
    yTicks: [5, 0, -5, -10, -15],
    zeroLine: true,
    xLabel: t("story.figure.x"),
    yLabel: t("story.figure.y"),
    caption: t("story.figure.caption")
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement(FigurePlot, {
    series: SIGMA_TIME.series,
    xDomain: [0, 960],
    yDomain: [5, 8.5],
    y2Domain: [0.05, 0.075],
    xTicks: [0, 240, 480, 720, 960],
    yTicks: [5, 6, 7, 8],
    y2Ticks: [0.05, 0.06, 0.07],
    xLabel: t("story.figure2.x"),
    yLabel: t("story.figure2.y"),
    y2Label: t("story.figure2.y2"),
    caption: t("story.figure2.caption")
  }))), /*#__PURE__*/React.createElement(AlignBlock, {
    align: "right",
    maxWidth: "66ch"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "clamp(28px,4vw,48px)"
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, null, t("story.eyebrow"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h1)",
      letterSpacing: "var(--ls-heading)",
      color: "var(--heading)",
      margin: "16px 0 0",
      maxWidth: "18ch"
    }
  }, t("story.heading")))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--content-narrow, 64ch)"
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    delay: 40
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: "0 0 22px",
      maxWidth: "62ch"
    }
  }, t("story.p1"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 80
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: 0,
      maxWidth: "62ch"
    }
  }, t("story.p2"))))))));
}

/* ============================================================
   CLEANROOM TEAR — sits directly under the CV; the dry line
   in the résumé torn open to show what the work was really like
   ============================================================ */
function CleanroomTear() {
  const [, t] = useLang();
  const c = t("cleanroomTear");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      paddingBottom: "clamp(40px,6vw,80px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container align-track"
  }, /*#__PURE__*/React.createElement(AlignBlock, {
    align: "left",
    maxWidth: "54ch"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-small)",
      color: "var(--text-muted)",
      margin: 0,
      maxWidth: "54ch"
    }
  }, c.intro)))), /*#__PURE__*/React.createElement(TornSection, {
    label: c.label,
    seed: 11
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--sienna)"
  }, c.eyebrow), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-title)",
      color: "var(--heading)",
      margin: "14px 0 18px",
      maxWidth: "22ch"
    }
  }, c.heading), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "62ch"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: "0 0 16px"
    }
  }, c.p1), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: "0 0 16px"
    }
  }, c.p2), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: 0
    }
  }, c.p3)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "clamp(16px,2.4vw,30px)",
      alignItems: "flex-start",
      marginTop: "clamp(28px,4vw,44px)"
    }
  }, /*#__PURE__*/React.createElement(LoosePhoto, {
    src: asset("ci/assets/Bilder/ZMN/ZMN_Sputter.jpeg"),
    caption: c.photos[0],
    rot: -2.5,
    w: 340
  }), /*#__PURE__*/React.createElement(LoosePhoto, {
    src: asset("ci/assets/Bilder/ZMN/ZMN_Me.jpeg"),
    caption: c.photos[1],
    rot: 2.5,
    w: 210
  }), /*#__PURE__*/React.createElement(LoosePhoto, {
    src: asset("ci/assets/Bilder/ZMN/ZMN_Profilo.jpeg"),
    caption: c.photos[2],
    rot: 1.5,
    w: 330
  }), /*#__PURE__*/React.createElement(LoosePhoto, {
    src: asset("ci/assets/Bilder/ZMN/ZMN_Proben.jpeg"),
    caption: c.photos[3],
    rot: -1.5,
    w: 205
  }))));
}

/* ============================================================
   CONFI TEAR — sits directly under the Ehrenamt band; the
   youth-work line opened up into the human side of it
   ============================================================ */
function ConfiTear() {
  const [, t] = useLang();
  const c = t("confiTear");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      padding: "clamp(40px,6vw,80px) 0 clamp(40px,6vw,80px)"
    }
  }, /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "top",
    color: "var(--sienna)",
    seed: 71,
    shadow: "rgba(188,90,55,0.45)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container align-track",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(AlignBlock, {
    align: "left",
    maxWidth: "54ch"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-small)",
      color: "var(--text-muted)",
      margin: 0,
      maxWidth: "54ch"
    }
  }, c.intro)))), /*#__PURE__*/React.createElement(TornSection, {
    label: c.label,
    seed: 23
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--sienna)"
  }, c.eyebrow), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-title)",
      color: "var(--heading)",
      margin: "14px 0 18px",
      maxWidth: "24ch"
    }
  }, c.heading), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))",
      gap: "clamp(28px,4vw,56px)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "58ch"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: "0 0 16px"
    }
  }, c.p1), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: "0 0 16px"
    }
  }, c.p2), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: 0
    }
  }, c.p3)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "clamp(18px,2.4vw,30px)",
      padding: "8px 0 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      maxWidth: 460,
      justifySelf: "center"
    }
  }, /*#__PURE__*/React.createElement(Polaroid, {
    src: asset("ci/assets/Bilder/Konfi/Konfi_speach.jpeg"),
    caption: c.photos[0],
    rot: -2.5,
    tape: true
  })), /*#__PURE__*/React.createElement(Polaroid, {
    src: asset("ci/assets/Bilder/Konfi/Konfi_Phe.jpeg"),
    caption: c.photos[1],
    rot: 3
  }), /*#__PURE__*/React.createElement(Polaroid, {
    src: asset("ci/assets/Bilder/Konfi/Konfi_Party.jpeg"),
    caption: c.photos[2],
    rot: -3.5
  })))));
}

/* ============================================================
   REUNION — ggi-abitur2022.de (lighter, "student" register)
   ============================================================ */
function Reunion() {
  const GGI = "https://ggi-abitur2022.de/";
  const [, t] = useLang();
  const r = t("reunion");
  const [p1Before, p1After] = r.p1.split("{{site}}");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "clamp(48px,6vw,96px) 0",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%),1fr))",
      gap: "clamp(24px,3.5vw,48px)",
      alignItems: "center",
      padding: "clamp(28px,4vw,52px)",
      borderRadius: "var(--radius-xl)",
      background: "linear-gradient(135deg, var(--paper-2), var(--paper))",
      border: "1px dashed var(--hairline-strong)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(80% 120% at 110% -10%, rgba(91,124,192,0.16), transparent 60%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, r.eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "var(--fs-h2)",
      letterSpacing: "var(--ls-heading)",
      color: "var(--heading)",
      margin: "14px 0 18px",
      maxWidth: "16ch"
    }
  }, r.heading), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text)",
      margin: "0 0 16px",
      maxWidth: "54ch"
    }
  }, p1Before, /*#__PURE__*/React.createElement("strong", null, "ggi-abitur2022.de"), p1After), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text-body)",
      margin: "0 0 26px",
      maxWidth: "54ch"
    }
  }, r.p2), /*#__PURE__*/React.createElement("a", {
    href: GGI,
    target: "_blank",
    rel: "noopener",
    className: "ggi-link",
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
      fontWeight: 600,
      textDecoration: "none"
    }
  }, r.linkLabel, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      justifySelf: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(GlowShape, {
    shape: "circle",
    glow: "navy",
    size: 120
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      fontSize: 40,
      lineHeight: 1,
      color: "var(--paper)",
      transform: "translateY(-2px)"
    }
  }, "\u25CE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, r.pins.map((pin, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      fontWeight: 600,
      padding: "8px 12px",
      borderRadius: "var(--radius-sm)",
      background: "var(--paper)",
      border: "1px solid var(--hairline)",
      color: "var(--text-muted)"
    }
  }, pin))))))));
}
window.SECTIONS_NEW = {
  Story,
  CleanroomTear,
  ConfiTear,
  Reunion
};
})();
