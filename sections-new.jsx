/* ============================================================
   Mika Jeske — personal narrative, "torn-paper" deep-dives
   (ZMN cleanroom · EKM Konfi work) and the Abi-reunion mention.
   Built on the design-system tokens + window.MJ primitives.
   ============================================================ */
const { useState, useRef, useEffect } = React;
const { Reveal, Eyebrow, GlowShape, WaveBlend, useLang } = window.MJ;

/* ---------- torn-paper edge generator ----------
   Deterministic jagged path so each tear looks hand-ripped
   but stable between renders. Filled with the PAGE colour so
   it reads as the surface tearing away to reveal what's below. */
function tornPath(seed, side) {
  const W = 1200, H = 26, teeth = 52;
  let s = (seed * 9301 + 49297) % 233280;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pts = [];
  for (let i = 0; i <= teeth; i++) {
    const x = (W / teeth) * i;
    const j = rnd();
    // small chance of a deeper "rip" for organic asymmetry
    const depth = (j < 0.12 ? 0.9 : 0.25 + j * 0.55);
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

function TornEdge({ side, seed, color = "var(--paper)" }) {
  return (
    <svg viewBox="0 0 1200 26" preserveAspectRatio="none" aria-hidden
      style={{ position: "absolute", left: 0, right: 0, width: "100%", height: 26, display: "block", zIndex: 3, pointerEvents: "none", [side]: -1 }}>
      <path d={tornPath(seed, side)} fill={color} />
    </svg>
  );
}

/* ---------- the torn-open deep dive ----------
   Closed: a faint perforated seam inviting a pull.
   Open: the page tears edge-to-edge across the viewport and a
   recessed "under-surface" pushes the content below it down
   (inline, not overlay). The seam and the panel's text stay in
   the reading column; only the rip itself runs full-bleed. */
function TornSection({ label, seed = 7, children }) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(0);
  const inner = useRef(null);
  const reduce = typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!inner.current) return;
    const measure = () => setH(inner.current ? inner.current.scrollHeight : 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [open]);

  return (
    <div style={{ margin: "clamp(24px,4vw,40px) 0" }}>
      {/* trigger — the seam, kept in the reading column */}
      <div className="container">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="tear-trigger"
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            padding: "16px 20px", cursor: "pointer", background: "transparent", border: "none",
            fontFamily: "var(--font-text)", color: "var(--text-muted)", position: "relative",
          }}>
          <span aria-hidden style={{ flex: 1, height: 0, borderTop: "2px dashed var(--hairline-strong)", opacity: 0.7 }} />
          <span className="tear-label" style={{
            display: "inline-flex", alignItems: "center", gap: 10, flex: "none",
            fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)",
            textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap",
          }}>
            {label}
            <span aria-hidden style={{
              display: "inline-grid", placeItems: "center", width: 22, height: 22, borderRadius: "50%",
              background: "var(--paper-2)", border: "1px solid var(--hairline-strong)",
              transform: open ? "rotate(180deg)" : "none", transition: "transform .4s var(--ease-glide)",
              fontSize: 12, lineHeight: 1, color: "var(--sienna)",
            }}>↓</span>
          </span>
          <span aria-hidden style={{ flex: 1, height: 0, borderTop: "2px dashed var(--hairline-strong)", opacity: 0.7 }} />
        </button>
      </div>

      {/* the hole that tears open — full-bleed to the page edges */}
      <div style={{
        maxHeight: open ? (reduce ? "none" : h + 80) : 0,
        overflow: "hidden",
        transition: reduce ? "none" : "max-height .8s var(--ease-glide)",
      }}>
        <div ref={inner}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            <TornEdge side="top" seed={seed} />
            <TornEdge side="bottom" seed={seed + 31} />
            {/* recessed under-surface, spanning the full viewport width */}
            <div style={{
              position: "relative", zIndex: 1,
              padding: "clamp(44px,6vw,72px) 0",
              background:
                "radial-gradient(120% 80% at 50% -10%, rgba(22,20,15,0.10), transparent 60%)," +
                "linear-gradient(180deg, var(--paper-3), var(--paper-2) 22%, var(--paper-2))",
              boxShadow: "inset 0 14px 30px -16px rgba(22,20,15,0.45), inset 0 -14px 30px -16px rgba(22,20,15,0.30)",
            }}>
              {/* faint paper-fibre texture */}
              <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
                backgroundImage: "repeating-linear-gradient(92deg, rgba(22,20,15,0.022) 0 2px, transparent 2px 6px)",
              }} />
              <div className="container" style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ZMN photos: a relaxed, slightly-rotated row ---------- */
function LoosePhoto({ src, caption, rot, w }) {
  return (
    <figure style={{ margin: 0, flex: `0 1 ${w}px`, transform: `rotate(${rot}deg)`, transition: "transform .4s var(--ease-out)" }}
      className="loose-photo">
      <div style={{
        padding: 6, background: "var(--paper)", borderRadius: 10,
        boxShadow: "0 2px 10px -2px rgba(22,20,15,0.18), 0 18px 40px -22px rgba(188,90,55,0.45)",
        border: "1px solid var(--hairline)",
      }}>
        <img src={src} alt={caption} loading="lazy" style={{ display: "block", width: "100%", height: "auto", borderRadius: 5 }} />
      </div>
      <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 10, paddingLeft: 4 }}>
        {caption}
      </figcaption>
    </figure>
  );
}

/* ---------- Konfi photos: hand-glued polaroids ---------- */
function Polaroid({ src, caption, rot, tape }) {
  return (
    <figure style={{ margin: 0, transform: `rotate(${rot}deg)`, transition: "transform .4s var(--ease-out)", position: "relative" }}
      className="polaroid">
      {tape && <span aria-hidden style={{
        position: "absolute", top: -12, left: "50%", width: 78, height: 26,
        transform: "translateX(-50%) rotate(-3deg)", background: "rgba(226,161,76,0.28)",
        border: "1px solid rgba(226,161,76,0.18)", borderRadius: 2,
        boxShadow: "0 1px 3px rgba(22,20,15,0.10)",
      }} />}
      <div style={{
        background: "#FCFAF5", padding: "12px 12px 0", borderRadius: 3,
        boxShadow: "0 6px 22px -10px rgba(22,20,15,0.40), 0 30px 50px -30px rgba(188,90,55,0.40)",
      }}>
        <img src={src} alt={caption} loading="lazy" style={{ display: "block", width: "100%", height: "auto", filter: "saturate(1.02) contrast(1.02)" }} />
        <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5a5346", textAlign: "center", padding: "14px 6px 16px", lineHeight: 1.4 }}>
          {caption}
        </figcaption>
      </div>
    </figure>
  );
}

/* ============================================================
   STORY — how Mika ended up in the small scale
   ============================================================ */
function Story() {
  const [, t] = useLang();
  return (
    <section style={{ padding: "var(--section-y) 0", position: "relative", overflow: "hidden" }}>
      {/* navy band above laps DOWN over this paper section, casting a navy shadow on the white */}
      <WaveBlend edge="top" color="var(--navy)" seed={63} shadow="rgba(28,44,76,0.45)" />
      <GlowShape shape="squircle" glow="amber" size={200} drift style={{ position: "absolute", top: "8%", left: "-5%", opacity: 0.35, pointerEvents: "none" }} />
      <div className="container">
        {/* header */}
        <div style={{ marginBottom: "clamp(28px,4vw,48px)" }}>
          <Reveal><Eyebrow>{t("story.eyebrow")}</Eyebrow></Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "18ch" }}>
              {t("story.heading")}
            </h2>
          </Reveal>
        </div>

        {/* narrative */}
        <div style={{ maxWidth: "var(--content-narrow, 64ch)" }}>
          <Reveal delay={40}>
            <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 22px", maxWidth: "62ch" }}>
              {t("story.p1")}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0, maxWidth: "62ch" }}>
              {t("story.p2")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CLEANROOM TEAR — sits directly under the CV; the dry line
   in the résumé torn open to show what the work was really like
   ============================================================ */
function CleanroomTear() {
  const [, t] = useLang();
  const c = t("cleanroomTear");
  return (
    <section style={{ position: "relative", paddingBottom: "clamp(40px,6vw,80px)" }}>
      <div className="container">
        <Reveal>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-muted)", margin: 0, maxWidth: "54ch" }}>
            {c.intro}
          </p>
        </Reveal>
      </div>

      <TornSection label={c.label} seed={11}>
        <Eyebrow color="var(--sienna)">{c.eyebrow}</Eyebrow>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)", margin: "14px 0 18px", maxWidth: "22ch" }}>
          {c.heading}
        </h3>
        <div style={{ maxWidth: "62ch" }}>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px" }}>{c.p1}</p>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px" }}>{c.p2}</p>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0 }}>{c.p3}</p>
        </div>
        {/* relaxed photo row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2.4vw,30px)", alignItems: "flex-start", marginTop: "clamp(28px,4vw,44px)" }}>
          <LoosePhoto src="ci/assets/Bilder/ZMN/ZMN_Sputter.jpeg" caption={c.photos[0]} rot={-2.5} w={340} />
          <LoosePhoto src="ci/assets/Bilder/ZMN/ZMN_Me.jpeg" caption={c.photos[1]} rot={2.5} w={210} />
          <LoosePhoto src="ci/assets/Bilder/ZMN/ZMN_Profilo.jpeg" caption={c.photos[2]} rot={1.5} w={330} />
          <LoosePhoto src="ci/assets/Bilder/ZMN/ZMN_Proben.jpeg" caption={c.photos[3]} rot={-1.5} w={205} />
        </div>
      </TornSection>
    </section>
  );
}

/* ============================================================
   CONFI TEAR — sits directly under the Ehrenamt band; the
   youth-work line opened up into the human side of it
   ============================================================ */
function ConfiTear() {
  const [, t] = useLang();
  const c = t("confiTear");
  return (
    <section style={{ position: "relative", padding: "clamp(40px,6vw,80px) 0 clamp(40px,6vw,80px)" }}>
      {/* sienna band above laps DOWN over this paper section, casting a sienna shadow on the white */}
      <WaveBlend edge="top" color="var(--sienna)" seed={71} shadow="rgba(188,90,55,0.45)" />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-muted)", margin: 0, maxWidth: "54ch" }}>
            {c.intro}
          </p>
        </Reveal>
      </div>

      <TornSection label={c.label} seed={23}>
        <Eyebrow color="var(--sienna)">{c.eyebrow}</Eyebrow>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)", margin: "14px 0 18px", maxWidth: "24ch" }}>
          {c.heading}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))", gap: "clamp(28px,4vw,56px)", alignItems: "start" }}>
          <div style={{ maxWidth: "58ch" }}>
            <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px" }}>{c.p1}</p>
            <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px" }}>{c.p2}</p>
            <p style={{ fontSize: "var(--fs-small)", lineHeight: "var(--lh-relaxed)", color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>{c.note}</p>
          </div>
          {/* hand-glued polaroids */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(18px,2.4vw,30px)", padding: "8px clamp(4px,2vw,20px) 18px" }}>
            <div style={{ gridColumn: "1 / -1", maxWidth: 360, justifySelf: "center" }}>
              <Polaroid src="ci/assets/Bilder/Konfi/Konfi_speach.jpeg" caption={c.photos[0]} rot={-2.5} tape />
            </div>
            <Polaroid src="ci/assets/Bilder/Konfi/Konfi_Phe.jpeg" caption={c.photos[1]} rot={3} />
            <Polaroid src="ci/assets/Bilder/Konfi/Konfi_Party.jpeg" caption={c.photos[2]} rot={-3.5} />
          </div>
        </div>
      </TornSection>
    </section>
  );
}

/* ============================================================
   REUNION — ggi-abitur2022.de (lighter, "student" register)
   ============================================================ */
function Reunion() {
  const GGI = "https://ggi-abitur2022.de/";
  const [, t] = useLang();
  const r = t("reunion");
  const [p1Before, p1After] = r.p1.split("{{site}}");
  return (
    <section style={{ padding: "clamp(48px,6vw,96px) 0", position: "relative" }}>
      <div className="container">
        <Reveal>
          <div style={{
            position: "relative", overflow: "hidden",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%),1fr))",
            gap: "clamp(24px,3.5vw,48px)", alignItems: "center",
            padding: "clamp(28px,4vw,52px)", borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, var(--paper-2), var(--paper))",
            border: "1px dashed var(--hairline-strong)",
          }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 120% at 110% -10%, rgba(91,124,192,0.16), transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <Eyebrow>{r.eyebrow}</Eyebrow>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "14px 0 18px", maxWidth: "16ch" }}>
                {r.heading}
              </h2>
              <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px", maxWidth: "54ch" }}>
                {p1Before}<strong>ggi-abitur2022.de</strong>{p1After}
              </p>
              <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text-body)", margin: "0 0 26px", maxWidth: "54ch" }}>
                {r.p2}
              </p>
              <a href={GGI} target="_blank" rel="noopener" className="ggi-link" style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px",
                background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, textDecoration: "none",
              }}>
                {r.linkLabel} <span aria-hidden>→</span>
              </a>
            </div>
            {/* playful "map pin + countdown" ornament */}
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, justifySelf: "center" }}>
              <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
                <GlowShape shape="circle" glow="navy" size={120} />
                <span aria-hidden style={{ position: "absolute", fontSize: 40, lineHeight: 1, color: "var(--paper)", transform: "translateY(-2px)" }}>◎</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {r.pins.map((pin, i) => (
                  <span key={i} style={{
                    fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", fontWeight: 600,
                    padding: "8px 12px", borderRadius: "var(--radius-sm)",
                    background: "var(--paper)", border: "1px solid var(--hairline)", color: "var(--text-muted)",
                  }}>{pin}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

window.SECTIONS_NEW = { Story, CleanroomTear, ConfiTear, Reunion };
