/* ============================================================
   Mika Jeske — personal site UI kit
   Self-contained brand primitives + section screens.
   Built on the design-system tokens (styles.css).
   ============================================================ */

const { useState, useEffect, useRef } = React;

/* ---------- asset base ----------
   The same compiled JS runs on the root page (/) and on the per-language
   prerendered pages (/en/, /fr/, /es/, /it/), which sit one directory deeper.
   window.__ASSET_BASE__ is set per page by an inline <script> in the template
   ("" for /, "../" for sub-dirs) and by build.mjs during prerender, so relative
   asset URLs resolve correctly at any depth — on GitHub Pages and on file://
   alike — with identical markup on server and client (no hydration mismatch). */
function asset(p) {
  var base = (typeof window !== "undefined" && window.__ASSET_BASE__) || "";
  return base + p;
}

/* ---------- i18n hook ---------- */
function useLang() {
  const [lang, setLang] = useState(window.I18N.getLang());
  useEffect(() => {
    const onChange = () => setLang(window.I18N.getLang());
    window.addEventListener("langchange", onChange);
    return () => window.removeEventListener("langchange", onChange);
  }, []);
  return [lang, window.I18N.t];
}

/* ---------- language switcher / contact chip mounts (delegate to widgets.js) ---------- */
function LanguageSwitcherMount() {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) window.Widgets.mountLanguageSwitcher(ref.current); }, []);
  // <nav> landmark for assistive tech / crawlers; the switcher itself is
  // position:fixed, so the wrapper is visually inert (no layout change).
  return <nav aria-label="Sprache / Language" ref={ref} />;
}

function ContactChipMount() {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) window.Widgets.mountContactChip(ref.current); }, []);
  return <div ref={ref} />;
}

/* ---------- scroll reveal hook ---------- */
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }),
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

/* ---------- reduced-motion ---------- */
function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

/* ---------- scroll-linked parallax ----------
   ONE rAF loop for the whole page, not one per element. Each subscriber
   caches its document offset (re-measured only on resize) so the loop
   never reads layout - it only writes a --py custom property that
   `.parallax` turns into a transform. Subscribers pause while off-screen.

   This is what makes the page feel continuous rather than "animated":
   the offset is a pure function of scroll position, so it tracks the
   user's finger, reverses instantly, and can be interrupted at any
   moment. Fully disabled under prefers-reduced-motion. */
var _pxSubs = [];
var _pxQueued = false;
var _pxDepths = null;

function _depth(name) {
  if (_pxDepths && _pxDepths[name] != null) return _pxDepths[name];
  var v = 0.08;
  try {
    var raw = getComputedStyle(document.documentElement).getPropertyValue(name);
    if (raw) v = parseFloat(raw) || v;
  } catch (e) { /* token unreadable - fall back to the mid plane */ }
  _pxDepths = _pxDepths || {};
  _pxDepths[name] = v;
  return v;
}

/* Travel budget in px for a depth of 1.0 across one full viewport pass.
   The depth tokens (0.04 / 0.08 / 0.14) scale against this, so the far
   plane moves ~59px and the foreground ~17px - felt, never hectic. */
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
    if (d > 1.6) d = 1.6; else if (d < -1.6) d = -1.6;
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
  window[fn]("scroll", _pxSchedule, { passive: true });
  window[fn]("resize", _pxMeasureAll);
}

function useParallax(depthVar) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const sub = { el: el, depth: _depth(depthVar || "--depth-2"), top: 0, h: 0, active: false };
    _pxSubs.push(sub);
    if (_pxSubs.length === 1) _pxListen(true);

    const r = el.getBoundingClientRect();
    sub.top = r.top + window.pageYOffset;
    sub.h = r.height;

    // only pay for the element while it is anywhere near the viewport
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        sub.active = e.isIntersecting;
        if (e.isIntersecting) {
          sub.top = e.boundingClientRect.top + window.pageYOffset;
          sub.h = e.boundingClientRect.height;
        }
      }),
      { rootMargin: "40% 0px 40% 0px" }
    );
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

/* A drop-in wrapper for anything that should ride a depth plane. */
function Parallax({ depth = "--depth-2", as = "div", className = "", style = {}, children, ...rest }) {
  const ref = useParallax(depth);
  const Tag = as;
  return <Tag ref={ref} className={("parallax " + className).trim()} style={style} {...rest}>{children}</Tag>;
}

/* ---------- Reveal ----------
   Sections don't just fade up any more: they resolve OUT OF DEPTH -
   opacity + rise + a 5px defocus + a hair of scale, on the emphasized
   curve. It stays a CSS transition (not an animation) so a fast scroll
   interrupts it mid-flight instead of queueing, and input is never
   blocked. Reduced motion collapses it to a plain fade. */
function Reveal({ children, delay = 0, as = "div", style = {}, className = "" }) {
  const [ref, seen] = useReveal();
  const Tag = as;
  const d = "var(--dur-reveal) var(--ease-emphasized) " + delay + "ms";
  // Deliberately NOT branched on prefers-reduced-motion: this markup is
  // prerendered in Node and hydrated in the browser, and React keeps the
  // server's inline style when the two disagree - a reduced-motion visitor
  // would have been left with a permanent blur. The `.js-reveal` rule in
  // index.template.html strips the blur and the travel under `reduce`.
  return (
    <Tag
      ref={ref}
      className={("js-reveal " + className).trim()}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(28px) scale(0.985)",
        // blur(0px), never `none` - `none` is not an animatable end state
        filter: seen ? "blur(0px)" : "blur(3px)",
        transition: "opacity " + d + ", transform " + d + ", filter " + d,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Pressable ----------
   Pointer-tracked lift. While the cursor is over the surface the tilt
   follows it continuously (motion tracks input); on leave it springs
   back; on press it scales to 0.97 per the design system. Touch pointers
   get the press state only - no hover tilt to strand. */
function Pressable({ children, as = "div", tilt = 0, lift = -4, className = "", style = {}, ...rest }) {
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

  return (
    <Tag ref={ref} className={("pressable " + className).trim()} style={style}
      onPointerMove={onMove} onPointerLeave={onLeave} onPointerCancel={onLeave} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------- SectionRail ----------
   The brief allows a discreet scroll indicator but no classic menu, so
   this is a hairline track of dots on the right edge: it reports where
   you are and lets you jump, and nothing else. Desktop-only (hidden
   below 1024px in index.template.html) and frosted, so it reads as
   chrome rather than content. */
function SectionRail({ items = [] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const k = els.indexOf(e.target);
        if (k > -1) setActive(k);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  function jump(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav className="section-rail" aria-label="Abschnitte">
      <span className="section-rail__track" aria-hidden="true" />
      {items.map((it, i) => (
        <button key={it.id} type="button"
          className={"section-rail__dot" + (i === active ? " is-active" : "")}
          aria-label={it.label} aria-current={i === active ? "true" : "false"}
          onClick={() => jump(it.id)}>
          <span className="section-rail__label" aria-hidden="true">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ---------- AlignBlock ----------
   Wraps a section's heading/lead-paragraph block to give it a left / center /
   right resting position on desktop, breaking up the uniform centred rhythm.
   On mobile (≤768px) the .align-block rule in index.html neutralises this back
   to centred, full-width — so the phone layout stays exactly as it was. */
function AlignBlock({ align = "center", maxWidth = "var(--content-narrow)", style = {}, children }) {
  return (
    <div className="align-block" style={{
      maxWidth,
      marginLeft: align === "right" ? "auto" : 0,
      marginRight: align === "left" ? "auto" : 0,
      marginInline: align === "center" ? "auto" : undefined,
      ...style,
    }}>{children}</div>
  );
}

/* ---------- brand primitives (mirror the DS components) ---------- */
function Eyebrow({ children, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-text)", fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: color || "var(--label)" }}>
      <span style={{ width: 22, height: 2, borderRadius: 2, background: "var(--accent)" }} />
      {children}
    </span>
  );
}

function Badge({ children, variant = "neutral" }) {
  const v = {
    neutral: { background: "var(--paper-2)", color: "var(--text-body)", border: "1px solid var(--border)" },
    accent: { background: "rgba(188,90,55,0.12)", color: "var(--sienna-deep)", border: "1px solid rgba(188,90,55,0.22)" },
    navy: { background: "rgba(28,44,76,0.10)", color: "var(--navy)", border: "1px solid rgba(28,44,76,0.20)" },
    onDark: { background: "rgba(255,255,255,0.10)", color: "var(--on-dark-body)", border: "1px solid var(--on-dark-hairline)" },
  }[variant];
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", fontFamily: "var(--font-text)", fontSize: "var(--fs-caption)", fontWeight: 600, borderRadius: 999, whiteSpace: "nowrap", ...v }}>{children}</span>;
}

/* ---------- GlowShape ----------
   The brand's defining motif: a near-black abstract shape floating over
   a soft COLOURED gradient glow - never a hard drop shadow.

   The halo has to grow FASTER than the shape. At a fixed 1.5x ratio a
   96px section deco hides its own glow behind itself and the only thing
   left visible is the grey tail of the gradient, which reads as exactly
   the drop shadow the brand forbids. Small shapes therefore get a much
   wider halo and the denser gradient stops, plus a second warm core
   offset below the shape so a rim of colour is always visible. */
function GlowShape({ shape = "blob", glow = "sienna", size = 220, drift = false, parallax = null, ink = "var(--ink)", className = "", style = {} }) {
  const shapes = { blob: "60% 40% 55% 45% / 55% 50% 50% 45%", circle: "50%", squircle: "34%", capsule: "999px", arch: "50% 50% 12% 12% / 70% 70% 12% 12%" };
  const dense = size < 150;
  const glowBg = (dense
    ? { sienna: "var(--glow-sienna-dense)", amber: "var(--glow-amber-dense)", navy: "var(--glow-navy-dense)", duo: "var(--glow-duo-dense)", white: "var(--glow-white-strong)" }
    : { sienna: "var(--glow-sienna)", amber: "var(--glow-amber)", navy: "var(--glow-navy)", duo: "var(--glow-duo)", white: "var(--glow-white)" }
  )[glow];
  // halo/shape ratio: the smaller the shape, the wider the halo has to be
  const ratio = size < 150 ? 2.6 : size < 280 ? 1.9 : 1.6;
  const g = size * ratio;
  const pxRef = useParallax(parallax || "--depth-3");
  const inner = (
    <div style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center" }}>
      <div aria-hidden style={{ position: "absolute", width: g, height: g, top: "62%", left: "50%", transform: "translate(-50%,-50%)", background: glowBg, opacity: dense ? 0.62 : 1, filter: "var(--blur-md)", borderRadius: "50%", pointerEvents: "none" }} />
      <div className={drift ? "drift" : ""} style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", background: ink, borderRadius: shapes[shape] }} />
    </div>
  );
  if (!parallax) {
    return <div className={className} style={{ position: "relative", width: size, height: size, ...style }}>{inner}</div>;
  }
  return (
    <div className={className} style={{ position: "relative", width: size, height: size, ...style }}>
      <div ref={pxRef} className="parallax">{inner}</div>
    </div>
  );
}

/* ---------- BlobPhoto ----------
   A photo clipped into an organic blob (varied border-radius, NOT a rectangle
   or a paper frame) floating over the signature soft COLOURED glow — the brand's
   "shape over glow" motif, here "photo over glow". Slight rotation; optional
   slow drift, gated on prefers-reduced-motion via the shared .drift class. */
function BlobPhoto({ src, caption, glow = "sienna", radius, rot = 0, w = 220, h, focus = "50% 50%", drift = false, parallax = null, glowScale = 1.12, glowOpacity = 0.5 }) {
  const glowBg = { sienna: "var(--glow-sienna)", amber: "var(--glow-amber)", navy: "var(--glow-navy)", duo: "var(--glow-duo)", white: "var(--glow-white)" }[glow] || "var(--glow-sienna)";
  const blob = radius || "60% 40% 55% 45% / 55% 50% 50% 45%";
  const height = h || w;
  const g = Math.max(w, height) * glowScale;
  const pxRef = useParallax(parallax || "--depth-2");
  return (
    <figure ref={parallax ? pxRef : null} className={"blob-photo" + (parallax ? " parallax" : "")} style={{ margin: 0, position: "relative", width: w }}>
      <div aria-hidden style={{ position: "absolute", left: "50%", top: "46%", width: g, height: g, transform: "translate(-50%,-50%)", background: glowBg, opacity: glowOpacity, filter: "var(--blur-md)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
      <div className={drift ? "drift-soft" : ""} style={{ position: "relative", zIndex: 1, transform: `rotate(${rot}deg)`, transition: "transform .5s var(--ease-out)" }}>
        <img src={src} alt={caption || ""} loading="lazy"
          style={{ display: "block", width: "100%", height, objectFit: "cover", objectPosition: focus, borderRadius: blob, boxShadow: "0 10px 26px -12px rgba(20,20,26,0.42), 0 30px 60px -30px rgba(20,20,26,0.4)" }} />
      </div>
      {caption && (
        <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--on-dark-muted)", marginTop: 12, maxWidth: w + 40, lineHeight: 1.4 }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------- BlobCluster ----------
   A few BlobPhotos staggered/overlapping organically inside a section's empty
   half. Each photo carries its own absolute `pos` so the section composes the
   arrangement; the cluster just provides the relative stage. */
function BlobCluster({ photos = [], style = {} }) {
  return (
    <div className="blob-cluster" style={{ position: "relative", ...style }}>
      {photos.map((p, i) => (
        <div key={i} style={{ position: "absolute", ...(p.pos || {}) }}>
          <BlobPhoto {...p} />
        </div>
      ))}
    </div>
  );
}

/* ---------- FigurePlot ----------
   A clean inline-SVG line chart for the Bachelor-thesis data. Warm-ink
   axes/gridlines, accent series in sienna, others muted — obeys the
   no-pure-black/white brand rule a raster export couldn't. Data-driven, with
   optional second (right) y-axis for comparing series of different magnitude,
   and an optional dashed zero line. Each series: { label, x:[], y:[], accent?,
   color?, axis? (1|2) }. */
function FigurePlot({ series = [], xDomain, yDomain, y2Domain, xTicks = [], yTicks = [], y2Ticks = [], xLabel, yLabel, y2Label, caption, zeroLine = false, width = 460, height = 300 }) {
  const dual = !!y2Domain;
  const padL = 54, padR = dual ? 54 : 18, padT = 16, padB = 46;
  const iw = width - padL - padR, ih = height - padT - padB;
  const [x0, x1] = xDomain, [y0, y1] = yDomain;
  const [z0, z1] = y2Domain || [0, 1];
  const X = (t) => padL + ((t - x0) / (x1 - x0)) * iw;
  const Y = (s) => padT + ih - ((s - y0) / (y1 - y0)) * ih;
  const Y2 = (s) => padT + ih - ((s - z0) / (z1 - z0)) * ih;
  const muted = ["var(--text-faint)", "var(--text-muted)", "var(--label)"];
  let mi = 0;
  const colors = series.map((s) => s.color || (s.accent ? "var(--accent)" : muted[mi++ % muted.length]));
  const leftCol = colors[series.findIndex((s) => s.axis !== 2)] || "var(--text)";
  const rightCol = colors[series.findIndex((s) => s.axis === 2)] || "var(--text)";
  return (
    <figure className="figure-plot" style={{ margin: 0, padding: "clamp(16px,1.8vw,24px)", background: "var(--paper)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", boxShadow: "0 10px 26px -14px rgba(20,20,26,0.3), 0 36px 70px -40px rgba(188,90,55,0.4)", maxWidth: width + 56 }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={caption} style={{ display: "block", overflow: "visible" }}>
        {yTicks.map((v, i) => (
          <g key={`y${i}`}>
            <line x1={padL} y1={Y(v)} x2={width - padR} y2={Y(v)} stroke="var(--hairline)" strokeWidth="1" />
            <text x={padL - 8} y={Y(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--text-muted)">{v}</text>
          </g>
        ))}
        {dual && y2Ticks.map((v, i) => (
          <text key={`y2${i}`} x={width - padR + 8} y={Y2(v) + 4} textAnchor="start" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--text-muted)">{v}</text>
        ))}
        {xTicks.map((v, i) => (
          <g key={`x${i}`}>
            <line x1={X(v)} y1={padT} x2={X(v)} y2={padT + ih} stroke="var(--hairline)" strokeWidth="1" opacity="0.5" />
            <text x={X(v)} y={padT + ih + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--text-muted)">{v}</text>
          </g>
        ))}
        {zeroLine && y0 < 0 && y1 > 0 && <line x1={padL} y1={Y(0)} x2={width - padR} y2={Y(0)} stroke="var(--hairline-strong)" strokeWidth="1.25" strokeDasharray="3 3" />}
        <line x1={padL} y1={padT} x2={padL} y2={padT + ih} stroke="var(--hairline-strong)" strokeWidth="1.5" />
        <line x1={padL} y1={padT + ih} x2={width - padR} y2={padT + ih} stroke="var(--hairline-strong)" strokeWidth="1.5" />
        {dual && <line x1={width - padR} y1={padT} x2={width - padR} y2={padT + ih} stroke="var(--hairline-strong)" strokeWidth="1.5" />}
        <text x={padL + iw / 2} y={height - 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text)">{xLabel}</text>
        <text transform={`translate(13 ${padT + ih / 2}) rotate(-90)`} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill={dual ? leftCol : "var(--text)"}>{yLabel}</text>
        {dual && <text transform={`translate(${width - 3} ${padT + ih / 2}) rotate(90)`} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill={rightCol}>{y2Label}</text>}
        {series.map((s, i) => {
          const map = s.axis === 2 ? Y2 : Y;
          const pts = s.x.map((t, j) => `${X(t).toFixed(1)},${map(s.y[j]).toFixed(1)}`).join(" ");
          const strong = s.accent || s.color;
          return (
            <g key={i}>
              <polyline points={pts} fill="none" stroke={colors[i]} strokeWidth={strong ? 2.3 : 1.8} strokeLinejoin="round" strokeLinecap="round" opacity={strong ? 1 : 0.85} />
              <circle cx={X(s.x[0])} cy={map(s.y[0])} r="3" fill={colors[i]} />
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", margin: "12px 0 0" }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-body)" }}>
            <span style={{ width: 14, height: 3, borderRadius: 2, background: colors[i] }} />{s.label}
          </span>
        ))}
      </div>
      {caption && (
        <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>{caption}</figcaption>
      )}
    </figure>
  );
}

/* ---------- WaveBlend ----------
   A full-bleed SVG that overlaps a colour band's paper neighbour onto
   the band edge as an "overlapping scale/tile": the paper fills the edge
   along a shallow, crisp wave and casts a drop shadow in the band's own
   colour (a bit darker) so the band reads as tucked underneath the paper.
   The wave is drawn ONCE on a fixed wide virtual canvas and shown via
   `preserveAspectRatio="slice"`, so it renders at a constant pixel scale
   on every screen (wide screens show more crests, phones show a gentle
   slice) — it never squishes into steep spikes. Lives INSIDE the band
   section, which clips it. */
function wavePath(seed, edge, opts) {
  var VBW = opts.width, H = opts.height, amp = opts.amp;
  var s = (seed * 9301 + 49297) % 233280;
  var rnd = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  // constant pixel wavelength (seed-varied a touch) → identical crest shape
  // at any viewport width; one dominant wave + a gentle higher overlap.
  var wl = 760 + rnd() * 220;
  var k1 = (Math.PI * 2) / wl, k2 = k1 * (1.7 + rnd() * 0.4);
  var p1 = rnd() * Math.PI * 2, p2 = rnd() * Math.PI * 2;
  var a1 = 1, a2 = 0.22, totalW = a1 + a2;
  var baseline = H * 0.5, N = Math.round(VBW / 40), pts = [];
  for (var i = 0; i <= N; i++) {
    var x = (VBW / N) * i;
    var y = a1 * Math.sin(x * k1 + p1) + a2 * Math.sin(x * k2 + p2);
    var cy = baseline + (y / totalW) * amp;
    if (edge === "bottom") cy = H - cy;
    pts.push([x, cy]);
  }
  var edgeY = edge === "top" ? 0 : H; // outer (paper-side) edge of the fill
  var d = "M0," + edgeY + " L" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
  for (var k = 1; k <= N; k++) {
    var mx = (pts[k - 1][0] + pts[k][0]) / 2, my = (pts[k - 1][1] + pts[k][1]) / 2;
    d += " Q" + pts[k - 1][0].toFixed(1) + "," + pts[k - 1][1].toFixed(1) + " " + mx.toFixed(1) + "," + my.toFixed(1);
  }
  d += " L" + pts[N][0].toFixed(1) + "," + pts[N][1].toFixed(1) + " L" + VBW + "," + edgeY + " Z";
  return d;
}

function WaveBlend({ edge = "top", color = "var(--paper)", seed = 1, height = 52, amp = 11, over = 4, shadow, shadowOffset = 5, shadowBlur = 8 }) {
  var VBW = 5600; // fixed virtual width (~35:9); shown as a centred px-scale slice
  var d = wavePath(seed, edge, { width: VBW, height: height, amp: amp });
  var sy = edge === "top" ? shadowOffset : -shadowOffset; // cast into the band
  var filter = shadow ? `drop-shadow(0 ${sy}px ${shadowBlur}px ${shadow})` : "none";
  return (
    <svg viewBox={`0 0 ${VBW} ${height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: "absolute", left: 0, right: 0, width: "100%", height: height, [edge]: -over, zIndex: 0, display: "block", pointerEvents: "none", filter: filter }}>
      <path d={d} fill={color} />
    </svg>
  );
}

/* ---------- TimelineEntry ----------
   The period used to sit inline with the role and only wrapped onto its
   own line when the role was long, so two entries in the same column
   could align differently. It now always occupies its own mono meta
   line: one rule, one rhythm, whatever the role is called. */
function TimelineEntry({ role, org, period, location, points = [], last, accent }) {
  return (
    <div className="timeline-entry" style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "clamp(16px,2.4vw,28px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span className="timeline-dot" aria-hidden style={{ position: "relative", width: 13, height: 13, borderRadius: "50%", background: accent ? "var(--accent)" : "var(--ink)", marginTop: 5, flex: "none" }}>
          {/* soft halo instead of a flat ring - the glow logic, at dot scale */}
          <span style={{ position: "absolute", inset: -7, borderRadius: "50%", background: accent ? "var(--glow-sienna-dense)" : "transparent", opacity: accent ? 0.55 : 0, filter: "var(--blur-sm)", pointerEvents: "none" }} />
          <span style={{ position: "absolute", inset: -5, borderRadius: "50%", boxShadow: accent ? "none" : "0 0 0 5px var(--paper-2)", pointerEvents: "none" }} />
        </span>
        {!last && <span style={{ width: 2, flex: 1, background: "var(--border)", marginTop: 8 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : "clamp(28px,4vw,48px)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-title)", fontWeight: 600, color: "var(--heading)", letterSpacing: "var(--ls-heading)", margin: 0 }}>{role}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 12px", margin: "6px 0 0" }}>
          {period && <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--label)", letterSpacing: "0.02em" }}>{period}</span>}
          <span style={{ fontSize: "var(--fs-small)", color: "var(--text-body)", fontWeight: 500 }}>{org}{location ? " \u00b7 " + location : ""}</span>
        </div>
        {points.length > 0 && (
          <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7 }}>
            {points.map((p, i) => (
              p && p.html
                ? <li key={i} style={{ fontSize: "var(--fs-body)", color: "var(--text)", lineHeight: "var(--lh-normal)" }} dangerouslySetInnerHTML={{ __html: p.html }} />
                : <li key={i} style={{ fontSize: "var(--fs-body)", color: "var(--text)", lineHeight: "var(--lh-normal)" }}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

window.MJ = { asset, useReveal, useLang, useParallax, prefersReduced, Reveal, Parallax, Pressable, SectionRail, Eyebrow, Badge, GlowShape, WaveBlend, TimelineEntry, AlignBlock, BlobPhoto, BlobCluster, FigurePlot, LanguageSwitcherMount, ContactChipMount };
