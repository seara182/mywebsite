// TRANSPILED from primitives.jsx by build.mjs — do not edit directly.
(function () {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef
} = React;

/* __ASSET_BASE__ is "" on / and "../" on /en/ etc; set by the template and by
   build.mjs, so the same markup resolves at any depth */
function asset(p) {
  var base = typeof window !== "undefined" && window.__ASSET_BASE__ || "";
  return base + p;
}
function useLang() {
  const [lang, setLang] = useState(window.I18N.getLang());
  useEffect(() => {
    const onChange = () => setLang(window.I18N.getLang());
    window.addEventListener("langchange", onChange);
    return () => window.removeEventListener("langchange", onChange);
  }, []);
  return [lang, window.I18N.t];
}
function LanguageSwitcherMount() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) window.Widgets.mountLanguageSwitcher(ref.current);
  }, []);
  /* landmark only; the switcher itself is position:fixed */
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Sprache / Language",
    ref: ref
  });
}
function ContactChipMount() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) window.Widgets.mountContactChip(ref.current);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref
  });
}
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }), {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
}

/* one rAF loop for the page. Subscribers cache their document offset (remeasured
   on resize) so the loop never reads layout - it only writes --py, which
   .parallax turns into a transform. Off under prefers-reduced-motion. */
var _pxSubs = [];
var _pxQueued = false;
var _pxDepths = null;
function _depth(name) {
  if (_pxDepths && _pxDepths[name] != null) return _pxDepths[name];
  var v = 0.08;
  try {
    var raw = getComputedStyle(document.documentElement).getPropertyValue(name);
    if (raw) v = parseFloat(raw) || v;
  } catch (e) {/* token unreadable - fall back to the mid plane */}
  _pxDepths = _pxDepths || {};
  _pxDepths[name] = v;
  return v;
}

/* px of travel at depth 1.0 across one viewport pass */
var PX_TRAVEL = 420;
function _pxTick() {
  _pxQueued = false;
  var vh = window.innerHeight || 1;
  var y = window.pageYOffset;
  for (var i = 0; i < _pxSubs.length; i++) {
    var s = _pxSubs[i];
    if (!s.active || !s.el) continue;
    // distance of the element's centre from the viewport centre, in viewports
    var d = (s.top + s.h / 2 - y - vh / 2) / vh;
    if (d > 1.6) d = 1.6;else if (d < -1.6) d = -1.6;
    s.el.style.setProperty("--py", (-d * s.depth * PX_TRAVEL).toFixed(1) + "px");
  }
}
function _pxSchedule() {
  if (_pxQueued) return;
  _pxQueued = true;
  requestAnimationFrame(_pxTick);
}
function _pxMeasureAll() {
  var y = window.pageYOffset;
  for (var i = 0; i < _pxSubs.length; i++) {
    var s = _pxSubs[i];
    if (!s.el) continue;
    var r = s.el.getBoundingClientRect();
    s.top = r.top + y;
    s.h = r.height;
  }
  _pxSchedule();
}
function _pxListen(on) {
  var fn = on ? "addEventListener" : "removeEventListener";
  window[fn]("scroll", _pxSchedule, {
    passive: true
  });
  window[fn]("resize", _pxMeasureAll);
}
function useParallax(depthVar) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const sub = {
      el: el,
      depth: _depth(depthVar || "--depth-2"),
      top: 0,
      h: 0,
      active: false
    };
    _pxSubs.push(sub);
    if (_pxSubs.length === 1) _pxListen(true);
    const r = el.getBoundingClientRect();
    sub.top = r.top + window.pageYOffset;
    sub.h = r.height;

    // only pay for the element while it is anywhere near the viewport
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      sub.active = e.isIntersecting;
      if (e.isIntersecting) {
        sub.top = e.boundingClientRect.top + window.pageYOffset;
        sub.h = e.boundingClientRect.height;
      }
    }), {
      rootMargin: "40% 0px 40% 0px"
    });
    io.observe(el);
    _pxSchedule();
    return () => {
      io.disconnect();
      const k = _pxSubs.indexOf(sub);
      if (k > -1) _pxSubs.splice(k, 1);
      if (_pxSubs.length === 0) _pxListen(false);
    };
  }, [depthVar]);
  return ref;
}
function Parallax({
  depth = "--depth-2",
  as = "div",
  className = "",
  style = {},
  children,
  ...rest
}) {
  const ref = useParallax(depth);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    className: ("parallax " + className).trim(),
    style: style
  }, rest), children);
}
function Reveal({
  children,
  delay = 0,
  as = "div",
  style = {},
  className = ""
}) {
  const [ref, seen] = useReveal();
  const Tag = as;
  const d = "var(--dur-reveal) var(--ease-emphasized) " + delay + "ms";
  /* not branched on prefers-reduced-motion: React keeps the SERVER's inline
     style when the two disagree, so .js-reveal handles reduce in CSS */
  return /*#__PURE__*/React.createElement(Tag, {
    ref: ref,
    className: ("js-reveal " + className).trim(),
    style: {
      opacity: seen ? 1 : 0,
      transform: seen ? "none" : "translateY(28px) scale(0.985)",
      /* blur(0px), not none: none is not an animatable end state */
      filter: seen ? "blur(0px)" : "blur(3px)",
      transition: "opacity " + d + ", transform " + d + ", filter " + d,
      ...style
    }
  }, children);
}
function Pressable({
  children,
  as = "div",
  tilt = 0,
  lift = -4,
  className = "",
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const Tag = as;
  function set(el, rx, ry, ly) {
    el.style.setProperty("--rx", rx.toFixed(2) + "deg");
    el.style.setProperty("--ry", ry.toFixed(2) + "deg");
    el.style.setProperty("--lift", ly.toFixed(1) + "px");
  }
  function onMove(e) {
    const el = ref.current;
    if (!el || prefersReduced() || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    set(el, tilt ? -ny * tilt : 0, tilt ? nx * tilt : 0, lift);
  }
  function onLeave() {
    const el = ref.current;
    if (el) set(el, 0, 0, 0);
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    className: ("pressable " + className).trim(),
    style: style,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onPointerCancel: onLeave
  }, rest), children);
}

/* real anchors so it still works without JS; visibility is a CLASS toggle, never
   an inline style, or hydration would keep the server's value */
function SectionSkipper({
  items = [],
  label = "Zum Abschnitt springen"
}) {
  const [past, setPast] = useState(false);
  const [active, setActive] = useState("");

  /* past-the-hero gate */
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), {
      threshold: 0
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  /* published on <html> so the globe in widgets.js can react in CSS */
  useEffect(() => {
    document.documentElement.classList.toggle("has-skipper", past);
  }, [past]);

  /* which section is currently under the reader */
  useEffect(() => {
    const els = items.map(it => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, {
      rootMargin: "-45% 0px -45% 0px"
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);
  function jump(e, id) {
    const el = document.getElementById(id);
    if (!el) return; /* no target: let the anchor do its job */
    e.preventDefault();
    el.scrollIntoView({
      behavior: prefersReduced() ? "auto" : "smooth",
      block: "start"
    });
    if (window.history && window.history.replaceState) window.history.replaceState(null, "", "#" + id);
  }
  return /*#__PURE__*/React.createElement("nav", {
    className: "skipper" + (past ? " is-visible" : ""),
    "aria-label": label
  }, /*#__PURE__*/React.createElement("div", {
    className: "skipper__track"
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.id,
    href: "#" + it.id,
    className: "skipper__link" + (active === it.id ? " is-active" : ""),
    "aria-current": active === it.id ? "true" : "false",
    onClick: e => jump(e, it.id)
  }, it.label))));
}

/* Spans the full width rather than sitting in .container: the copy cell carries
   the padding that lines it up with the content column. `bleed` hands the
   section's block padding back as negative margins. See .split* in the template. */
function SplitFeature({
  src,
  alt,
  caption,
  focus = "50% 50%",
  flip = false,
  bleed = false,
  bleedTop = "0px",
  bleedBottom = "0px",
  children,
  className = "",
  style = {}
}) {
  var cls = "split" + (flip ? " split--flip" : "") + (bleed ? " split--bleed" : "") + (className ? " " + className : "");
  var css = bleed ? Object.assign({
    "--split-bleed-top": bleedTop,
    "--split-bleed-bottom": bleedBottom
  }, style) : style;
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: css
  }, /*#__PURE__*/React.createElement("div", {
    className: "split__copy"
  }, children), /*#__PURE__*/React.createElement("figure", {
    className: "split__media"
  }, /*#__PURE__*/React.createElement("img", {
    className: "split__img",
    src: src,
    alt: alt,
    loading: "lazy",
    style: {
      objectPosition: focus
    }
  }), caption ? /*#__PURE__*/React.createElement("figcaption", {
    className: "split__cap"
  }, caption) : null));
}

/* desktop only; .align-block re-centres it below 768px */
function AlignBlock({
  align = "center",
  maxWidth = "var(--content-narrow)",
  style = {},
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "align-block",
    style: {
      maxWidth,
      marginLeft: align === "right" ? "auto" : 0,
      marginRight: align === "left" ? "auto" : 0,
      marginInline: align === "center" ? "auto" : undefined,
      ...style
    }
  }, children);
}

/* `as` exists for the handful of eyebrows that are the only thing introducing
   a block of content. Most eyebrows sit directly above a real <h2>/<h3> as a
   kicker, and those must stay spans — promoting them all would double every
   entry in a screen reader's heading list, which is worse than the gap it
   would be fixing. Opt in per call site, not by default. */
function Eyebrow({
  children,
  color,
  as: Tag = "span"
}) {
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      margin: 0,
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: color || "var(--label)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 22,
      height: 2,
      borderRadius: 2,
      background: "var(--accent)"
    }
  }), children);
}
function Badge({
  children,
  variant = "neutral"
}) {
  const v = {
    neutral: {
      background: "var(--paper-2)",
      color: "var(--text-body)",
      border: "1px solid var(--border)"
    },
    accent: {
      background: "var(--badge-accent-bg)",
      color: "var(--badge-accent-fg)",
      border: "1px solid var(--badge-accent-border)"
    },
    plum: {
      background: "var(--badge-accent-bg)",
      color: "var(--badge-plum-fg)",
      border: "1px solid var(--badge-accent-border)"
    },
    onDark: {
      background: "rgba(255,255,255,0.10)",
      color: "var(--on-dark-body)",
      border: "1px solid var(--on-dark-hairline)"
    }
  }[variant];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 12px",
      fontFamily: "var(--font-text)",
      fontSize: "var(--fs-caption)",
      fontWeight: 600,
      borderRadius: "var(--radius-xs)",
      whiteSpace: "nowrap",
      ...v
    }
  }, children);
}

/* seeded, so a given shape's loop is stable across renders */
function scribbleLoop(seed, opts) {
  var cx = opts.cx,
    cy = opts.cy,
    r = opts.r,
    wobble = opts.wobble != null ? opts.wobble : 0.16,
    n = opts.n || 10;
  var s = (seed * 9301 + 49297) % 233280;
  var rnd = function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  var f1 = 2 + rnd() * 1.4,
    f2 = 5 + rnd() * 2.5;
  var p1 = rnd() * Math.PI * 2,
    p2 = rnd() * Math.PI * 2;
  var rot = rnd() * Math.PI * 2;
  var pts = [];
  for (var i = 0; i < n; i++) {
    var a = rot + Math.PI * 2 / n * i;
    var rr = r * (1 + wobble * Math.sin(a * f1 + p1) + wobble * 0.5 * Math.sin(a * f2 + p2));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  var mid0 = [(pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2];
  var d = "M" + mid0[0].toFixed(1) + "," + mid0[1].toFixed(1);
  for (var k = 0; k < n; k++) {
    var next = pts[(k + 1) % n];
    var mid = [(pts[k][0] + next[0]) / 2, (pts[k][1] + next[1]) / 2];
    d += " Q" + pts[k][0].toFixed(1) + "," + pts[k][1].toFixed(1) + " " + mid[0].toFixed(1) + "," + mid[1].toFixed(1);
  }
  return d + " Z";
}

/* [inner pass, outer pass] */
const SCRIBBLE_COLORS = {
  sage: ["var(--sage-glow)", "var(--sage-deep)"],
  plum: ["var(--plum-glow)", "var(--plum-deep)"],
  honey: ["var(--honey)", "var(--sage-deep)"],
  duo: ["var(--plum-glow)", "var(--sage-glow)"],
  white: ["var(--on-dark-strong)", "var(--on-dark-muted)"]
};
function Scribble({
  seed = 1,
  glow = "sage",
  size = 320,
  className = "",
  style = {}
}) {
  const colors = SCRIBBLE_COLORS[glow] || SCRIBBLE_COLORS.sage;
  const cx = size / 2,
    cy = size / 2;
  const baseR = size * 0.34;
  const strokeWidth = Math.max(1.8, size / 120);
  /* centre jitter, so the two passes are not concentric */
  const j = size * 0.045;
  const loops = [{
    seed: seed,
    cx: cx - j * 0.4,
    cy: cy + j * 0.3,
    r: baseR,
    wobble: 0.22,
    n: 14,
    color: colors[0],
    opacity: 0.88,
    w: strokeWidth
  }, {
    seed: seed + 31,
    cx: cx + j * 0.5,
    cy: cy - j * 0.25,
    r: baseR * 1.18,
    wobble: 0.26,
    n: 12,
    color: colors[1],
    opacity: 0.55,
    w: strokeWidth * 0.78
  }];
  return /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    className: ("scribble " + className).trim(),
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      overflow: "visible",
      pointerEvents: "none",
      ...style
    }
  }, loops.map((l, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: scribbleLoop(l.seed, {
      cx: l.cx,
      cy: l.cy,
      r: l.r,
      wobble: l.wobble,
      n: l.n
    }),
    fill: "none",
    stroke: l.color,
    strokeWidth: l.w,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    opacity: l.opacity
  })));
}
function GlowShape({
  shape = "blob",
  glow = "sage",
  size = 220,
  seed = 1,
  drift = false,
  parallax = null,
  ink = "var(--ink)",
  className = "",
  style = {}
}) {
  const shapes = {
    blob: "60% 40% 55% 45% / 55% 50% 50% 45%",
    circle: "50%",
    squircle: "34%",
    capsule: "999px",
    arch: "50% 50% 12% 12% / 70% 70% 12% 12%"
  };
  const dense = size < 150;
  /* smaller shapes need a proportionally wider ring to clear the silhouette */
  const ratio = dense ? 1.6 : size < 280 ? 1.42 : 1.28;
  const g = size * ratio;
  const pxRef = useParallax(parallax || "--depth-3");
  const inner = /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Scribble, {
    seed: seed,
    glow: glow,
    size: g
  }), /*#__PURE__*/React.createElement("div", {
    className: drift ? "drift" : "",
    style: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      height: "100%",
      background: ink,
      borderRadius: shapes[shape],
      boxShadow: dense ? "var(--shadow-shape-sm)" : "var(--shadow-shape)"
    }
  }));
  if (!parallax) {
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: {
        position: "relative",
        width: size,
        height: size,
        ...style
      }
    }, inner);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      position: "relative",
      width: size,
      height: size,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: pxRef,
    className: "parallax"
  }, inner));
}
function BlobPhoto({
  src,
  caption,
  glow = "sage",
  seed = 1,
  radius,
  rot = 0,
  w = 220,
  h,
  focus = "50% 50%",
  drift = false,
  parallax = null,
  glowScale = 1.32
}) {
  const blob = radius || "60% 40% 55% 45% / 55% 50% 50% 45%";
  const height = h || w;
  const g = Math.max(w, height) * glowScale;
  const pxRef = useParallax(parallax || "--depth-2");
  return /*#__PURE__*/React.createElement("figure", {
    ref: parallax ? pxRef : null,
    className: "blob-photo" + (parallax ? " parallax" : ""),
    style: {
      margin: 0,
      position: "relative",
      width: w
    }
  }, /*#__PURE__*/React.createElement(Scribble, {
    seed: seed,
    glow: glow,
    size: g,
    style: {
      top: "46%",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: drift ? "drift-soft" : "",
    style: {
      position: "relative",
      zIndex: 1,
      transform: `rotate(${rot}deg)`,
      transition: "transform .5s var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: caption || "",
    loading: "lazy",
    style: {
      display: "block",
      width: "100%",
      height,
      objectFit: "cover",
      objectPosition: focus,
      borderRadius: blob,
      boxShadow: "0 10px 26px -12px rgba(20,20,26,0.42), 0 30px 60px -30px rgba(20,20,26,0.4)"
    }
  })), caption && /*#__PURE__*/React.createElement("figcaption", {
    className: "photo-cap",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      color: "var(--on-dark-muted)",
      marginTop: 12,
      maxWidth: w + 40,
      lineHeight: 1.4
    }
  }, caption));
}

/* each photo positions itself via `pos`; this is just the relative stage */
function BlobCluster({
  photos = [],
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blob-cluster",
    style: {
      position: "relative",
      ...style
    }
  }, photos.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      ...(p.pos || {})
    }
  }, /*#__PURE__*/React.createElement(BlobPhoto, p))));
}

/* series: { label, x:[], y:[], accent?, color?, axis? (1|2) } */
function FigurePlot({
  series = [],
  xDomain,
  yDomain,
  y2Domain,
  xTicks = [],
  yTicks = [],
  y2Ticks = [],
  xLabel,
  yLabel,
  y2Label,
  caption,
  zeroLine = false,
  width = 460,
  height = 300
}) {
  const dual = !!y2Domain;
  const padL = 54,
    padR = dual ? 54 : 18,
    padT = 16,
    padB = 46;
  const iw = width - padL - padR,
    ih = height - padT - padB;
  const [x0, x1] = xDomain,
    [y0, y1] = yDomain;
  const [z0, z1] = y2Domain || [0, 1];
  const X = t => padL + (t - x0) / (x1 - x0) * iw;
  const Y = s => padT + ih - (s - y0) / (y1 - y0) * ih;
  const Y2 = s => padT + ih - (s - z0) / (z1 - z0) * ih;
  const muted = ["var(--text-faint)", "var(--text-muted)", "var(--label)"];
  let mi = 0;
  const colors = series.map(s => s.color || (s.accent ? "var(--accent)" : muted[mi++ % muted.length]));
  const leftCol = colors[series.findIndex(s => s.axis !== 2)] || "var(--text)";
  const rightCol = colors[series.findIndex(s => s.axis === 2)] || "var(--text)";
  return /*#__PURE__*/React.createElement("figure", {
    className: "figure-plot",
    style: {
      margin: 0,
      padding: "clamp(16px,1.8vw,24px)",
      background: "var(--paper)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "0 10px 26px -14px rgba(20,20,26,0.3), 0 36px 70px -40px rgb(var(--accent-2-rgb) / 0.4)",
      maxWidth: width + 56
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    role: "img",
    "aria-label": caption,
    style: {
      display: "block",
      overflow: "visible"
    }
  }, yTicks.map((v, i) => /*#__PURE__*/React.createElement("g", {
    key: `y${i}`
  }, /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: Y(v),
    x2: width - padR,
    y2: Y(v),
    stroke: "var(--hairline)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: Y(v) + 4,
    textAnchor: "end",
    fontFamily: "var(--font-mono)",
    fontSize: "10.5",
    fill: "var(--text-muted)"
  }, v))), dual && y2Ticks.map((v, i) => /*#__PURE__*/React.createElement("text", {
    key: `y2${i}`,
    x: width - padR + 8,
    y: Y2(v) + 4,
    textAnchor: "start",
    fontFamily: "var(--font-mono)",
    fontSize: "10.5",
    fill: "var(--text-muted)"
  }, v)), xTicks.map((v, i) => /*#__PURE__*/React.createElement("g", {
    key: `x${i}`
  }, /*#__PURE__*/React.createElement("line", {
    x1: X(v),
    y1: padT,
    x2: X(v),
    y2: padT + ih,
    stroke: "var(--hairline)",
    strokeWidth: "1",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: X(v),
    y: padT + ih + 18,
    textAnchor: "middle",
    fontFamily: "var(--font-mono)",
    fontSize: "10.5",
    fill: "var(--text-muted)"
  }, v))), zeroLine && y0 < 0 && y1 > 0 && /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: Y(0),
    x2: width - padR,
    y2: Y(0),
    stroke: "var(--hairline-strong)",
    strokeWidth: "1.25",
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: padT,
    x2: padL,
    y2: padT + ih,
    stroke: "var(--hairline-strong)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: padL,
    y1: padT + ih,
    x2: width - padR,
    y2: padT + ih,
    stroke: "var(--hairline-strong)",
    strokeWidth: "1.5"
  }), dual && /*#__PURE__*/React.createElement("line", {
    x1: width - padR,
    y1: padT,
    x2: width - padR,
    y2: padT + ih,
    stroke: "var(--hairline-strong)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: padL + iw / 2,
    y: height - 4,
    textAnchor: "middle",
    fontFamily: "var(--font-mono)",
    fontSize: "11",
    fill: "var(--text)"
  }, xLabel), /*#__PURE__*/React.createElement("text", {
    transform: `translate(13 ${padT + ih / 2}) rotate(-90)`,
    textAnchor: "middle",
    fontFamily: "var(--font-mono)",
    fontSize: "11",
    fill: dual ? leftCol : "var(--text)"
  }, yLabel), dual && /*#__PURE__*/React.createElement("text", {
    transform: `translate(${width - 3} ${padT + ih / 2}) rotate(90)`,
    textAnchor: "middle",
    fontFamily: "var(--font-mono)",
    fontSize: "11",
    fill: rightCol
  }, y2Label), series.map((s, i) => {
    const map = s.axis === 2 ? Y2 : Y;
    const pts = s.x.map((t, j) => `${X(t).toFixed(1)},${map(s.y[j]).toFixed(1)}`).join(" ");
    const strong = s.accent || s.color;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("polyline", {
      points: pts,
      fill: "none",
      stroke: colors[i],
      strokeWidth: strong ? 2.3 : 1.8,
      strokeLinejoin: "round",
      strokeLinecap: "round",
      opacity: strong ? 1 : 0.85
    }), /*#__PURE__*/React.createElement("circle", {
      cx: X(s.x[0]),
      cy: map(s.y[0]),
      r: "3",
      fill: colors[i]
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px 16px",
      margin: "12px 0 0"
    }
  }, series.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 3,
      borderRadius: 2,
      background: colors[i]
    }
  }), s.label))), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      color: "var(--text-muted)",
      marginTop: 10,
      lineHeight: 1.5
    }
  }, caption));
}

/* Drawn once on a fixed wide canvas and shown with preserveAspectRatio="slice",
   so crests keep a constant pixel scale at any viewport width. */
function wavePath(seed, edge, opts) {
  var VBW = opts.width,
    H = opts.height,
    amp = opts.amp;
  var s = (seed * 9301 + 49297) % 233280;
  var rnd = function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  var wl = 760 + rnd() * 220;
  var k1 = Math.PI * 2 / wl,
    k2 = k1 * (1.7 + rnd() * 0.4);
  var p1 = rnd() * Math.PI * 2,
    p2 = rnd() * Math.PI * 2;
  var a1 = 1,
    a2 = 0.22,
    totalW = a1 + a2;
  /* overridable: the inner shadow needs the same curve filled the other way */
  var anchor = opts.anchor || edge;
  var baseline = H * 0.5,
    N = Math.round(VBW / 40),
    pts = [];
  for (var i = 0; i <= N; i++) {
    var x = VBW / N * i;
    var y = a1 * Math.sin(x * k1 + p1) + a2 * Math.sin(x * k2 + p2);
    var cy = baseline + y / totalW * amp;
    if (edge === "bottom") cy = H - cy;
    pts.push([x, cy]);
  }
  var edgeY = anchor === "top" ? 0 : H; // outer edge of the fill
  var d = "M0," + edgeY + " L" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
  for (var k = 1; k <= N; k++) {
    var mx = (pts[k - 1][0] + pts[k][0]) / 2,
      my = (pts[k - 1][1] + pts[k][1]) / 2;
    d += " Q" + pts[k - 1][0].toFixed(1) + "," + pts[k - 1][1].toFixed(1) + " " + mx.toFixed(1) + "," + my.toFixed(1);
  }
  d += " L" + pts[N][0].toFixed(1) + "," + pts[N][1].toFixed(1) + " L" + VBW + "," + edgeY + " Z";
  return d;
}
function WaveBlend({
  edge = "top",
  color = "var(--paper)",
  seed = 1,
  height = 52,
  amp = 11,
  over = 4,
  shadow,
  shadowOffset = 5,
  shadowBlur = 8,
  lap = "over",
  z = 0
}) {
  var VBW = 5600; // fixed virtual width (~35:9); shown as a centred px-scale slice
  var geom = {
    width: VBW,
    height: height,
    amp: amp
  };
  var d = wavePath(seed, edge, geom);
  var sy = edge === "top" ? shadowOffset : -shadowOffset; // cast into the band
  /* lap="under" inverts which side is filled, so the seam can be painted OVER a
     bleeding photograph. drop-shadow only casts outwards, so the edge shadow is
     drawn as the complementary half, clipped to the fill. */
  var under = lap === "under";
  var uid = "wb" + edge + seed + lap;
  var filter = shadow && !under ? `drop-shadow(0 ${sy}px ${shadowBlur}px ${shadow})` : "none";
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${VBW} ${height}`,
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": "true",
    className: "waveblend",
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      width: "100%",
      height: height,
      [edge]: -over,
      zIndex: z,
      display: "block",
      pointerEvents: "none",
      filter: filter
    }
  }, under && shadow ? /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: uid + "c"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  })), /*#__PURE__*/React.createElement("filter", {
    id: uid + "f",
    x: "-5%",
    y: "-100%",
    width: "110%",
    height: "300%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: shadowBlur / 2
  }))) : null, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: color
  }), under && shadow ? /*#__PURE__*/React.createElement("g", {
    clipPath: `url(#${uid}c)`
  }, /*#__PURE__*/React.createElement("path", {
    d: wavePath(seed, edge, Object.assign({
      anchor: edge === "top" ? "bottom" : "top"
    }, geom)),
    fill: shadow,
    filter: `url(#${uid}f)`,
    transform: `translate(0,${-sy})`
  })) : null);
}

/* One bullet. A point is either a plain string, or a link-bearing object
   { before, link: { href, text }, after }.

   That object used to be { html: "<a …>" } fed straight into
   dangerouslySetInnerHTML. The injection risk was theoretical — the strings
   are authored in i18n.js, not user input — but the concrete problem was
   that the markup carried its own inline style="color:inherit;…", which no
   stylesheet and no prefers-contrast rule could ever override. Structured
   data puts the styling back under CSS's control. */
function TimelinePoint({
  point
}) {
  const [, t] = useLang();
  /* typeof check first, and it is load-bearing: String.prototype.link is a
     legacy Annex B method, so "any string".link is a FUNCTION and therefore
     truthy. A plain `!point.link` guard sends every plain-string bullet down
     the link branch, where before/after/link.href/link.text are all
     undefined and the bullet renders as an empty <a>. That silently emptied
     every timeline bullet on the site. */
  if (!point || typeof point !== "object" || !point.link) return /*#__PURE__*/React.createElement(React.Fragment, null, point);
  const {
    before,
    link,
    after
  } = point;
  return /*#__PURE__*/React.createElement(React.Fragment, null, before, /*#__PURE__*/React.createElement("a", {
    className: "tl-point-link",
    href: link.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, link.text, /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " (", t("nav.newTab"), ")")), after);
}
function TimelineEntry({
  role,
  org,
  period,
  location,
  points = [],
  last,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "timeline-entry",
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      columnGap: "clamp(16px,2.4vw,28px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "timeline-dot",
    "aria-hidden": true,
    style: {
      position: "relative",
      width: 13,
      height: 13,
      borderRadius: "50%",
      background: accent ? "var(--accent)" : "var(--ink)",
      marginTop: 5,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -7,
      borderRadius: "50%",
      background: accent ? "var(--glow-sage-dense)" : "transparent",
      opacity: accent ? 0.55 : 0,
      filter: "var(--blur-sm)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -5,
      borderRadius: "50%",
      boxShadow: accent ? "none" : "0 0 0 5px var(--paper-2)",
      pointerEvents: "none"
    }
  })), !last && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      flex: 1,
      background: "var(--border)",
      marginTop: 8
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: last ? 0 : "clamp(28px,4vw,48px)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--fs-title)",
      fontWeight: 600,
      color: "var(--heading)",
      letterSpacing: "var(--ls-heading)",
      margin: 0
    }
  }, role), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "baseline",
      gap: "2px 12px",
      margin: "6px 0 0"
    }
  }, period && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-caption)",
      color: "var(--label)",
      letterSpacing: "0.02em"
    }
  }, period), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-small)",
      color: "var(--text-body)",
      fontWeight: 500
    }
  }, org, location ? " \u00b7 " + location : "")), points.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "12px 0 0",
      paddingLeft: 18,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, points.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--text)",
      lineHeight: "var(--lh-normal)"
    }
  }, /*#__PURE__*/React.createElement(TimelinePoint, {
    point: p
  }))))));
}
window.MJ = {
  asset,
  useReveal,
  useLang,
  useParallax,
  prefersReduced,
  Reveal,
  Parallax,
  Pressable,
  SectionSkipper,
  SplitFeature,
  Eyebrow,
  Badge,
  GlowShape,
  Scribble,
  WaveBlend,
  TimelineEntry,
  AlignBlock,
  BlobPhoto,
  BlobCluster,
  FigurePlot,
  LanguageSwitcherMount,
  ContactChipMount
};
})();
