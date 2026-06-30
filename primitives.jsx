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

function GlowShape({ shape = "blob", glow = "sienna", size = 220, drift = false, ink = "var(--ink)", className = "", style = {} }) {
  const shapes = { blob: "60% 40% 55% 45% / 55% 50% 50% 45%", circle: "50%", squircle: "34%", capsule: "999px", arch: "50% 50% 12% 12% / 70% 70% 12% 12%" };
  const glowBg = { sienna: "var(--glow-sienna)", amber: "var(--glow-amber)", navy: "var(--glow-navy)", duo: "var(--glow-duo)", white: "var(--glow-white)" }[glow];
  return (
    <div className={className} style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center", ...style }}>
      <div aria-hidden style={{ position: "absolute", width: size * 1.5, height: size * 1.5, top: "58%", left: "50%", transform: "translate(-50%,-50%)", background: glowBg, filter: "var(--blur-md)", borderRadius: "50%", pointerEvents: "none" }} />
      <div className={drift ? "drift" : ""} style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", background: ink, borderRadius: shapes[shape] }} />
    </div>
  );
}

/* ---------- BlobPhoto ----------
   A photo clipped into an organic blob (varied border-radius, NOT a rectangle
   or a paper frame) floating over the signature soft COLOURED glow — the brand's
   "shape over glow" motif, here "photo over glow". Slight rotation; optional
   slow drift, gated on prefers-reduced-motion via the shared .drift class. */
function BlobPhoto({ src, caption, glow = "sienna", radius, rot = 0, w = 220, h, focus = "50% 50%", drift = false, glowScale = 1.12, glowOpacity = 0.5 }) {
  const glowBg = { sienna: "var(--glow-sienna)", amber: "var(--glow-amber)", navy: "var(--glow-navy)", duo: "var(--glow-duo)", white: "var(--glow-white)" }[glow] || "var(--glow-sienna)";
  const blob = radius || "60% 40% 55% 45% / 55% 50% 50% 45%";
  const height = h || w;
  const g = Math.max(w, height) * glowScale;
  return (
    <figure className="blob-photo" style={{ margin: 0, position: "relative", width: w }}>
      <div aria-hidden style={{ position: "absolute", left: "50%", top: "46%", width: g, height: g, transform: "translate(-50%,-50%)", background: glowBg, opacity: glowOpacity, filter: "var(--blur-md)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
      <div className={drift ? "drift-soft" : ""} style={{ position: "relative", zIndex: 1, transform: `rotate(${rot}deg)`, transition: "transform .5s var(--ease-out)" }}>
        <img src={src} alt={caption || ""} loading="lazy"
          style={{ display: "block", width: "100%", height, objectFit: "cover", objectPosition: focus, borderRadius: blob, boxShadow: "0 10px 26px -12px rgba(22,20,15,0.42), 0 30px 60px -30px rgba(22,20,15,0.4)" }} />
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
    <figure className="figure-plot" style={{ margin: 0, padding: "clamp(16px,1.8vw,24px)", background: "var(--paper)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", boxShadow: "0 10px 26px -14px rgba(22,20,15,0.3), 0 36px 70px -40px rgba(188,90,55,0.4)", maxWidth: width + 56 }}>
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

window.MJ = { useReveal, useLang, Reveal, Eyebrow, Badge, GlowShape, WaveBlend, TimelineEntry, AlignBlock, BlobPhoto, BlobCluster, FigurePlot, LanguageSwitcherMount, ContactChipMount };
