/* ============================================================
   Mika Jeske — personal site UI kit
   Self-contained brand primitives + section screens.
   Built on the design-system tokens (styles.css).
   ============================================================ */

const { useState, useEffect, useRef } = React;

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
  return <div ref={ref} />;
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

function Reveal({ children, delay = 0, as = "div", style = {}, className = "" }) {
  const [ref, seen] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(28px)",
        transition: `opacity var(--dur-reveal) var(--ease-glide) ${delay}ms, transform var(--dur-reveal) var(--ease-glide) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
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

function GlowShape({ shape = "blob", glow = "sienna", size = 220, drift = false, className = "", style = {} }) {
  const shapes = { blob: "60% 40% 55% 45% / 55% 50% 50% 45%", circle: "50%", squircle: "34%", capsule: "999px", arch: "50% 50% 12% 12% / 70% 70% 12% 12%" };
  const glowBg = { sienna: "var(--glow-sienna)", amber: "var(--glow-amber)", navy: "var(--glow-navy)", duo: "var(--glow-duo)", white: "var(--glow-white)" }[glow];
  return (
    <div className={className} style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center", ...style }}>
      <div aria-hidden style={{ position: "absolute", width: size * 1.5, height: size * 1.5, top: "58%", left: "50%", transform: "translate(-50%,-50%)", background: glowBg, filter: "var(--blur-md)", borderRadius: "50%", pointerEvents: "none" }} />
      <div className={drift ? "drift" : ""} style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", background: "var(--ink)", borderRadius: shapes[shape] }} />
    </div>
  );
}

/* ---------- WaveBlend ----------
   A full-bleed SVG that blends a colour band into its paper neighbour
   at one edge: the neighbour colour fills the band edge along a long,
   gently irregular wave (2-3 stretched crests from two overlapped
   frequencies), and the whole shape gets a small CSS blur so the single
   wavy edge reads ever-so-slightly soft instead of a hard cut. Lives
   INSIDE the band section (which clips it), over its solid background. */
function wavePath(seed, edge, opts) {
  var W = 1200, H = opts.height, amp = opts.amp;
  var s = (seed * 9301 + 49297) % 233280;
  var rnd = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  var peaks = 2 + Math.floor(rnd() * 2); // 2-3 long, stretched crests
  // one dominant low-frequency wave + a single gentle overlap → softly
  // irregular but never noisy (no high-frequency chatter on thin screens)
  var comps = [
    [peaks,     rnd() * Math.PI * 2, 1],
    [peaks + 1, rnd() * Math.PI * 2, 0.22],
  ];
  var totalW = comps[0][2] + comps[1][2];
  var baseline = H * 0.5, N = 48, pts = [];
  for (var i = 0; i <= N; i++) {
    var x = (W / N) * i, u = i / N, y = 0;
    for (var c = 0; c < comps.length; c++) y += comps[c][2] * Math.sin(u * Math.PI * 2 * comps[c][0] + comps[c][1]);
    var cy = baseline + (y / totalW) * amp;
    if (edge === "bottom") cy = H - cy;
    pts.push([x, cy]);
  }
  var edgeY = edge === "top" ? 0 : H;
  var d = "M0," + edgeY + " L" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
  for (var k = 1; k <= N; k++) {
    var mx = (pts[k - 1][0] + pts[k][0]) / 2, my = (pts[k - 1][1] + pts[k][1]) / 2;
    d += " Q" + pts[k - 1][0].toFixed(1) + "," + pts[k - 1][1].toFixed(1) + " " + mx.toFixed(1) + "," + my.toFixed(1);
  }
  d += " L" + pts[N][0].toFixed(1) + "," + pts[N][1].toFixed(1) + " L" + W + "," + edgeY + " Z";
  return d;
}

function WaveBlend({ edge = "top", color = "var(--paper)", seed = 1, height = 72, amp = 18, blur = 2.5 }) {
  var d = wavePath(seed, edge, { height: height, amp: amp });
  return (
    <svg viewBox={`0 0 1200 ${height}`} preserveAspectRatio="none" aria-hidden="true"
      style={{ position: "absolute", left: 0, right: 0, width: "100%", height: height, [edge]: 0, zIndex: 0, display: "block", pointerEvents: "none", filter: `blur(${blur}px)` }}>
      <path d={d} fill={color} />
    </svg>
  );
}

function TimelineEntry({ role, org, period, location, points = [], last, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "clamp(16px,2.4vw,28px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: accent ? "var(--accent)" : "var(--ink)", boxShadow: accent ? "0 0 0 5px rgba(188,90,55,0.14)" : "0 0 0 5px var(--paper-2)", marginTop: 5, flex: "none" }} />
        {!last && <span style={{ width: 2, flex: 1, background: "var(--border)", marginTop: 6 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : "clamp(28px,4vw,48px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 14px", marginBottom: 4 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-title)", fontWeight: 600, color: "var(--heading)", letterSpacing: "var(--ls-heading)", margin: 0 }}>{role}</h3>
          {period && <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--label)" }}>{period}</span>}
        </div>
        <div style={{ fontSize: "var(--fs-small)", color: "var(--text-body)", fontWeight: 500, marginBottom: points.length ? 12 : 0 }}>{org}{location ? ` · ${location}` : ""}</div>
        {points.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7 }}>
            {points.map((p, i) => <li key={i} style={{ fontSize: "var(--fs-body)", color: "var(--text)", lineHeight: "var(--lh-normal)" }}>{p}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

window.MJ = { useReveal, useLang, Reveal, Eyebrow, Badge, GlowShape, WaveBlend, TimelineEntry, LanguageSwitcherMount, ContactChipMount };
