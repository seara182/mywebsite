// AUTO-GENERATED from sections-a.jsx by build.mjs — do not edit directly.
(function () {
const {
  asset,
  Reveal,
  Parallax,
  Pressable,
  SplitFeature,
  Eyebrow,
  Badge,
  GlowShape,
  Scribble,
  WaveBlend,
  TimelineEntry,
  AlignBlock,
  BlobCluster,
  useLang,
  prefersReduced
} = window.MJ;

/* entrance delays, in ms */
const HERO_T = {
  name: 100,
  nameStep: 120,
  eyebrow: 500,
  portrait: 1000,
  chrome: 1400
};

/* The four ways in. Same destinations + icons as the trailer facade; each label
   is split into per-letter spans so the `lang-wave` runs at any length/language.
   Two flank the film on the left, two on the right; on narrow/portrait they fold
   into a bottom cluster (see .trailer__rail in the template). */
const TRAILER_ICONS = {
  cv: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 3v5h5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 13h6M9 17h4"
  })),
  story: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.2 16.2 20.5 20.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.2",
    y: "9.2",
    width: "3.6",
    height: "3.6",
    rx: "0.6"
  })),
  cheapseats: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "6",
    width: "18",
    height: "12",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 6v12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10.5h3M15 10.5h3"
  })),
  volunteering: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "8",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.2",
    cy: "9.4",
    r: "2.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.6 19a5.4 5.4 0 0 1 10.8 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15.6 14.4a4.6 4.6 0 0 1 4.8 4.6"
  }))
};
function TrailerLink({
  href,
  label,
  icon,
  delay
}) {
  return /*#__PURE__*/React.createElement("a", {
    className: "tl",
    href: href,
    "aria-label": label,
    style: {
      transitionDelay: delay + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl__ico",
    "aria-hidden": "true"
  }, icon), /*#__PURE__*/React.createElement("span", {
    className: "tl__label",
    "aria-hidden": "true"
  }, label.split("").map((ch, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "tl__c",
    style: {
      animationDelay: i * 80 + "ms"
    }
  }, ch === " " ? " " : ch))));
}
function Hero() {
  const [lang, t] = useLang();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);
  const words = ["Mika", "Jeske"];
  const wrapRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const faceRef = React.useRef(null);
  const ambientRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const aiRef = React.useRef(null);
  const replayRef = React.useRef(null);

  /* The scrub. Written entirely via refs + direct .style (like useParallax), so
     the server and client first render match and hydration stays clean. Name and
     portrait travel up into the corners and OUT of frame; the film rises; the
     four ways in appear when it ends. Reversible on scroll-back. */
  React.useEffect(() => {
    const wrap = wrapRef.current,
      stage = stageRef.current,
      video = videoRef.current;
    const name = nameRef.current,
      face = faceRef.current,
      ambient = ambientRef.current;
    const hint = hintRef.current,
      ai = aiRef.current;
    if (!wrap || !stage || !video) return;
    const mm = window.matchMedia;
    const portrait = mm && mm("(max-aspect-ratio: 3/4)").matches;
    const src = portrait ? video.dataset.src9 : video.dataset.src16;
    video.poster = portrait ? video.dataset.poster9 : video.dataset.poster16;
    const replay = replayRef.current;
    let finished = false;
    function onRefused() {
      finished = true;
      if (stage.classList.contains("is-playing")) stage.classList.add("is-revealed");
    }
    function onEnded() {
      finished = true;
      if (stage.classList.contains("is-playing")) stage.classList.add("is-revealed");
    }
    /* replay: hide the ways in, rewind and play the film again; it re-reveals
       them when it ends. */
    function onReplay() {
      stage.classList.remove("is-revealed");
      try {
        video.currentTime = 0;
      } catch (e) {}
      video.playbackRate = 0.8125;
      const pr = video.play();
      if (pr && typeof pr.catch === "function") pr.catch(onRefused);
    }
    video.addEventListener("ended", onEnded);

    /* Reduced motion: no scrub, no autoplay. Show the resolved composition —
       poster + ways in + caption, name/portrait faded out (decided in CSS). */
    if (prefersReduced()) {
      stage.classList.add("is-playing", "is-revealed");
      return () => video.removeEventListener("ended", onEnded);
    }
    if (replay) replay.addEventListener("click", onReplay);
    const DOCK_END = 0.62,
      PLAY_AT = 0.9;
    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    function tryPlay() {
      if (!video.src) video.src = src;
      video.playbackRate = 0.8125;
      const pr = video.play();
      if (pr && typeof pr.catch === "function") pr.catch(onRefused);
    }
    function setDocked(docked) {
      const was = stage.classList.contains("is-playing");
      if (docked === was) {
        if (docked && !finished && video.paused) tryPlay();
        return;
      }
      stage.classList.toggle("is-playing", docked);
      stage.classList.toggle("is-revealed", docked && finished);
      if (docked) {
        if (!finished && video.paused) tryPlay();
      } else if (!video.paused) video.pause();
    }

    /* Cache viewport size so apply() never forces a layout reflow on every
       scroll tick. Refreshed on resize (which already goes through rAF). */
    let cachedVw = window.innerWidth,
      cachedVh = window.innerHeight;
    function apply(p) {
      const vw = cachedVw,
        vh = cachedVh;
      const raw = p < DOCK_END ? p / DOCK_END : 1; // 0 hero → 1 docked
      const u = 1 - raw;
      const k = ease(raw); // 0 hero → 1 exit
      const arc = Math.sin(Math.PI * raw); // 0 at both ends, 1 mid
      const fade = clamp((u - 0.1) / 0.3, 0, 1); // name/portrait opacity

      // name → up and out toward the top-left, with a leftward arc
      name.style.transform = "translate(" + (-0.12 * vw * k - 0.05 * vw * arc) + "px," + -0.98 * vh * k + "px) scale(" + (1 - 0.45 * k) + ")";
      name.style.opacity = String(fade);
      // portrait → up and out toward the top-right
      if (face) {
        face.style.transform = "translate(" + (0.12 * vw * k + 0.05 * vw * arc) + "px," + -1.02 * vh * k + "px) scale(" + (1 - 0.5 * k) + ")";
        face.style.opacity = String(fade);
      }
      if (ambient) ambient.style.opacity = String(clamp((u - 0.1) / 0.6, 0, 1));
      // "AI-edited image" disclaimer fades out early — the fade-to-white refinement
      if (ai) ai.style.opacity = String(clamp((u - 0.85) / 0.15, 0, 1));
      if (hint) hint.style.opacity = u > 0.92 ? String((u - 0.92) / 0.08) : "0";
      setDocked(raw >= PLAY_AT);
    }
    function progress() {
      const range = wrap.offsetHeight - cachedVh;
      return range > 0 ? clamp((window.pageYOffset - wrap.offsetTop) / range, 0, 1) : 0;
    }
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply(progress());
        ticking = false;
      });
    }
    function onResize() {
      cachedVw = window.innerWidth;
      cachedVh = window.innerHeight;
      onScroll();
    }
    apply(progress());
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("ended", onEnded);
      if (replay) replay.removeEventListener("click", onReplay);
    };
  }, []);
  const links = [{
    side: "l",
    key: "cv",
    href: "#lebenslauf",
    delay: 0
  }, {
    side: "l",
    key: "story",
    href: "#story",
    delay: 70
  }, {
    side: "r",
    key: "cheapseats",
    href: asset("projects/cheapseats/"),
    delay: 140
  }, {
    side: "r",
    key: "volunteering",
    href: "#ehrenamt",
    delay: 210
  }];
  const side = s => links.filter(l => l.side === s).map(l => /*#__PURE__*/React.createElement(TrailerLink, {
    key: l.key,
    href: l.href,
    label: t("trailer." + l.key),
    icon: TRAILER_ICONS[l.key],
    delay: l.delay
  }));
  return /*#__PURE__*/React.createElement("section", {
    ref: wrapRef,
    id: "top",
    "data-section": true,
    className: "herostage-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    ref: stageRef,
    className: "hero herostage"
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    className: "herostage__video",
    muted: true,
    playsInline: true,
    preload: "auto",
    disablePictureInPicture: true,
    "aria-hidden": "true",
    "data-src16": asset("ci/assets/video/brag_" + lang + "-16x9.mp4"),
    "data-src9": asset("ci/assets/video/brag_" + lang + "-9x16.mp4"),
    "data-poster16": asset("ci/assets/video/brag_" + lang + "-16x9.jpg"),
    "data-poster9": asset("ci/assets/video/brag_" + lang + "-9x16.jpg")
  }), /*#__PURE__*/React.createElement("div", {
    className: "herostage__scrim",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    ref: ambientRef,
    className: "herostage__ambient",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(GlowShape, {
    shape: "blob",
    glow: "duo",
    size: 420,
    seed: 1,
    parallax: "--depth-3",
    className: "hero-glow-blob",
    style: {
      position: "absolute",
      top: "-8%",
      right: "-6%",
      opacity: mounted ? 1 : 0,
      transition: "opacity 1.4s var(--ease-emphasized) 200ms",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(GlowShape, {
    shape: "arch",
    glow: "plum",
    size: 240,
    seed: 2,
    parallax: "--depth-2",
    className: "hero-glow-arch",
    style: {
      position: "absolute",
      bottom: "8%",
      left: "-4%",
      opacity: mounted ? 1 : 0,
      transition: "opacity 1.4s var(--ease-emphasized) 340ms",
      pointerEvents: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    ref: faceRef,
    className: "hero-photo",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      zIndex: 3,
      right: "clamp(80px, 15vw, 340px)",
      bottom: 0,
      height: "clamp(520px, 66vh, 820px)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-photo__in",
    style: {
      position: "relative",
      height: "100%",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "none" : "translateY(26px) scale(0.965)",
      filter: mounted ? "blur(0px)" : "blur(10px)",
      transition: "opacity 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms, transform 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms, filter 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms"
    }
  }, /*#__PURE__*/React.createElement(Scribble, {
    seed: 9,
    glow: "duo",
    size: 340,
    style: {
      top: "42%",
      left: "50%",
      width: "84%",
      height: "84%",
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
    ref: aiRef,
    className: "hero-ailabel",
    style: {
      position: "absolute",
      zIndex: 2,
      right: 10,
      bottom: 10,
      fontFamily: "var(--font-text)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#808080",
      textShadow: "0 0 8px var(--bg), 0 0 14px var(--bg)"
    }
  }, t("hero.aiImageLabel")))), /*#__PURE__*/React.createElement("div", {
    ref: nameRef,
    className: "hero-namewrap",
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 4,
      paddingInline: "var(--gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-namewrap__col"
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
  }, t("hero.eyebrow"))), /*#__PURE__*/React.createElement("div", {
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
      transition: "transform 0.7s var(--ease-emphasized) " + (HERO_T.eyebrow + 80) + "ms, opacity 0.7s ease " + (HERO_T.eyebrow + 80) + "ms"
    }
  }, t("hero.eyebrow2"))), /*#__PURE__*/React.createElement("h1", {
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
  }, w)))))), /*#__PURE__*/React.createElement("nav", {
    className: "trailer__rail",
    "aria-label": t("trailer.enterLabel")
  }, /*#__PURE__*/React.createElement("div", {
    className: "trailer__side",
    "data-side": "l"
  }, side("l")), /*#__PURE__*/React.createElement("div", {
    className: "trailer__side",
    "data-side": "r"
  }, side("r"))), /*#__PURE__*/React.createElement("button", {
    ref: replayRef,
    type: "button",
    className: "herostage__replay",
    "aria-label": t("trailer.replay")
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-2.64-6.36"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 3v5h-5"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "herostage__caption"
  }, t("trailer.caption")), /*#__PURE__*/React.createElement("div", {
    ref: hintRef,
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
  })))));
}

/* px the plum band overhangs the section below, so it draws its own bottom seam */
const LAP = 48;
function Intro() {
  const [, t] = useLang();
  const ip = t("intro.photos") || [];
  return /*#__PURE__*/React.createElement("section", {
    id: "intro",
    "data-section": true,
    className: "on-plum",
    style: {
      position: "relative",
      zIndex: 1,
      overflow: "hidden",
      padding: `12mm 0 calc(5mm + ${LAP}px)`,
      marginBottom: -LAP
    }
  }, /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "top",
    color: "var(--plum)",
    seed: 5,
    shadow: "rgb(var(--accent-1-deep-rgb) / 0.55)",
    z: 2
  }), /*#__PURE__*/React.createElement(WaveBlend, {
    edge: "bottom",
    lap: "under",
    color: "var(--paper)",
    seed: 63,
    shadow: "rgb(var(--accent-1-rgb) / 0.45)",
    z: 2
  }), /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(SplitFeature, {
    bleed: true,
    bleedTop: "12mm",
    bleedBottom: `calc(5mm + ${LAP}px)`,
    src: asset("ci/assets/Bilder/Weitere/i_zfp.jpeg"),
    alt: ip[0],
    caption: ip[0],
    focus: "25% 40%"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--sage-glow)"
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
  }, t("intro.p2"))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 300
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "46ch",
      marginTop: "clamp(24px,3vw,40px)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: asset("ci/assets/Bilder/Weitere/signatur-mika-jeske.png"),
    alt: "Mika Andreas Jeske",
    loading: "lazy",
    style: {
      display: "block",
      marginInline: "auto",
      width: "min(300px, 66%)",
      height: "auto",
      filter: "invert(1)",
      opacity: 0.9
    }
  }))))));
}
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
  }, /*#__PURE__*/React.createElement("div", {
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
