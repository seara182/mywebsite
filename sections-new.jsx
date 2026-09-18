const { useState, useRef, useEffect } = React;
const { asset, Reveal, Pressable, SplitFeature, Eyebrow, GlowShape, WaveBlend, AlignBlock, FigurePlot, useLang } = window.MJ;

/* bachelor-thesis data: µV/K vs °C */
const SEEBECK_T = {
  series: [
    { label: "Ag · 100 nm", accent: true,
      x: [51.6, 61.5, 71.4, 81.2, 91.0, 100.8, 110.7, 120.6, 130.3, 140.1, 150.1, 140.0, 130.1, 120.2, 109.9, 100.2, 90.4, 80.4, 70.6],
      y: [6.08, 6.38, 6.51, 6.73, 7.01, 7.03, 7.30, 7.16, 7.41, 7.44, 7.66, 7.46, 7.09, 7.02, 6.70, 6.46, 6.31, 5.93, 5.69] },
    { label: "Al · 100 nm",
      x: [51.1, 60.9, 70.8, 80.6, 90.5, 100.3, 110.2, 120.1, 129.8, 139.7, 149.7, 139.6, 129.6, 119.8, 109.7, 99.9, 90.0, 80.1, 70.3],
      y: [0.69, 0.87, 1.10, 1.22, 1.34, 1.49, 1.96, 1.93, 2.28, 2.15, 2.48, 2.44, 2.28, 2.05, 2.00, 1.68, 1.47, 1.29, 1.06] },
    { label: "Ni · 100 nm",
      x: [51.7, 61.6, 71.5, 81.3, 91.2, 101.0, 110.9, 120.7, 130.5, 140.2, 150.1, 140.0, 130.0, 120.1, 110.2, 100.2, 90.4, 80.4, 70.6],
      y: [-15.34, -15.42, -15.63, -15.75, -15.89, -15.93, -16.12, -16.17, -16.28, -16.13, -16.43, -16.20, -16.22, -15.83, -15.89, -15.78, -15.46, -15.43, -15.03] },
  ],
};
/* MS/m vs min, two y-axes (Ni and Bi differ ~100x) */
const SIGMA_TIME = {
  series: [
    { label: "Ni · 100 nm  (PTC)", color: "var(--accent)", axis: 1,
      x: [9, 54, 85, 115, 146, 177, 207, 238, 269, 300, 331, 365, 400, 436, 477, 531, 590, 659, 741, 840, 900],
      y: [6.64, 6.45, 6.28, 6.12, 5.99, 5.86, 5.75, 5.66, 5.59, 5.54, 5.51, 5.84, 6.08, 6.30, 6.52, 6.76, 6.99, 7.25, 7.50, 7.78, 8.05] },
    { label: "Bi · 50 nm  (NTC)", color: "var(--plum)", axis: 2,
      x: [5, 50, 85, 119, 154, 189, 227, 261, 296, 330, 365, 402, 441, 480, 522, 574, 633, 702, 785, 886, 957],
      y: [0.0579, 0.0589, 0.0598, 0.0607, 0.0618, 0.0631, 0.0648, 0.0668, 0.0691, 0.0705, 0.0723, 0.0704, 0.0686, 0.0669, 0.0652, 0.0636, 0.0620, 0.0605, 0.0590, 0.0575, 0.0559] },
  ],
};

/* seeded, so the path is identical on server and client */
function tornPath(seed, side) {
  const W = 1200, H = 26, teeth = 52;
  let s = (seed * 9301 + 49297) % 233280;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pts = [];
  for (let i = 0; i <= teeth; i++) {
    const x = (W / teeth) * i;
    const j = rnd();
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

function TornSection({ label, seed = 7, teaser, children }) {
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(0);
  const inner = useRef(null);

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
      <div className="container">
        {teaser ? (
          <button
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="tear-trigger tear-trigger--teaser"
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 16, textAlign: "left",
              padding: "14px 18px", cursor: "pointer", background: "var(--paper-2)",
              border: "1px solid var(--hairline-strong)", borderRadius: 14,
              fontFamily: "var(--font-text)", color: "var(--text)",
            }}>
            <img src={teaser.photo} alt="" aria-hidden
              style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flex: "none" }} />
            <span style={{ flex: 1, fontSize: "var(--fs-small)", lineHeight: "var(--lh-relaxed)", color: "var(--text)" }}>
              {teaser.text}
            </span>
            <span aria-hidden style={{
              display: "inline-grid", placeItems: "center", width: 28, height: 28, borderRadius: "50%",
              background: "var(--paper)", border: "1px solid var(--hairline-strong)", flex: "none",
              transform: open ? "rotate(180deg)" : "none", transition: "transform .4s var(--ease-glide)",
              fontSize: 13, lineHeight: 1, color: "var(--sage)",
            }}>↓</span>
          </button>
        ) : (
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
                fontSize: 12, lineHeight: 1, color: "var(--sage)",
              }}>↓</span>
            </span>
            <span aria-hidden style={{ flex: 1, height: 0, borderTop: "2px dashed var(--hairline-strong)", opacity: 0.7 }} />
          </button>
        )}
      </div>

      {/* transition is unconditional and disabled in CSS: branching on a media
          query here would desync the prerender from the browser */}
      <div className="tear-panel" style={{
        maxHeight: open ? h + 80 : 0,
        overflow: "hidden",
        transition: "max-height .8s var(--ease-glide)",
      }}>
        <div ref={inner}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            <TornEdge side="top" seed={seed} />
            <TornEdge side="bottom" seed={seed + 31} />
            <div style={{
              position: "relative", zIndex: 1,
              padding: "clamp(44px,6vw,72px) 0",
              background:
                "radial-gradient(120% 80% at 50% -10%, rgba(20,20,26,0.10), transparent 60%)," +
                "linear-gradient(180deg, var(--paper-3), var(--paper-2) 22%, var(--paper-2))",
              boxShadow: "inset 0 14px 30px -16px rgba(20,20,26,0.45), inset 0 -14px 30px -16px rgba(20,20,26,0.30)",
            }}>
              <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
                backgroundImage: "repeating-linear-gradient(92deg, rgba(20,20,26,0.022) 0 2px, transparent 2px 6px)",
              }} />
              <div className="container" style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoosePhoto({ src, caption, rot, w }) {
  return (
    <figure style={{ margin: 0, flex: `0 1 ${w}px`, transform: `rotate(${rot}deg)`, transition: "transform .4s var(--ease-out)" }}
      className="loose-photo">
      <div style={{
        padding: 6, background: "var(--paper)", borderRadius: 10,
        boxShadow: "0 2px 10px -2px rgba(20,20,26,0.18), 0 18px 40px -22px rgb(var(--accent-2-rgb) / 0.45)",
        border: "1px solid var(--hairline)",
      }}>
        <img src={src} alt={caption} loading="lazy" style={{ display: "block", width: "100%", height: "auto", borderRadius: 5 }} />
      </div>
      <figcaption className="photo-cap" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 10, paddingLeft: 4 }}>
        {caption}
      </figcaption>
    </figure>
  );
}

function Polaroid({ src, caption, rot, tape }) {
  return (
    <figure style={{ margin: 0, transform: `rotate(${rot}deg)`, transition: "transform .4s var(--ease-out)", position: "relative" }}
      className="polaroid">
      {tape && <span aria-hidden style={{
        position: "absolute", top: -12, left: "50%", width: 78, height: 26,
        transform: "translateX(-50%) rotate(-3deg)", background: "rgb(var(--honey-rgb) / 0.28)",
        border: "1px solid rgb(var(--honey-rgb) / 0.18)", borderRadius: 2,
        boxShadow: "0 1px 3px rgba(20,20,26,0.10)",
      }} />}
      <div style={{
        background: "#FBFBFC", padding: "12px 12px 0", borderRadius: 3,
        boxShadow: "0 6px 22px -10px rgba(20,20,26,0.40), 0 30px 50px -30px rgb(var(--accent-2-rgb) / 0.40)",
      }}>
        <img src={src} alt={caption} loading="lazy" style={{ display: "block", width: "100%", height: "auto", filter: "saturate(1.02) contrast(1.02)" }} />
        <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#55555E", textAlign: "center", padding: "14px 6px 16px", lineHeight: 1.4 }}>
          {caption}
        </figcaption>
      </div>
    </figure>
  );
}

function Story() {
  const [, t] = useLang();
  return (
    <section id="story" data-section style={{ padding: "var(--section-y) 0", position: "relative", overflow: "hidden" }}>
      <div className="container align-track">
        {/* figures show at ≥1440px only, see .story-grid */}
        <div className="story-grid">
          <div className="story-figs">
            <Reveal>
              <FigurePlot series={SEEBECK_T.series}
                xDomain={[45, 155]} yDomain={[-18, 9]}
                xTicks={[50, 75, 100, 125, 150]} yTicks={[5, 0, -5, -10, -15]} zeroLine
                xLabel={t("story.figure.x")} yLabel={t("story.figure.y")} caption={t("story.figure.caption")} />
            </Reveal>
            <Reveal delay={80}>
              <FigurePlot series={SIGMA_TIME.series}
                xDomain={[0, 960]} yDomain={[5, 8.5]} y2Domain={[0.05, 0.075]}
                xTicks={[0, 240, 480, 720, 960]} yTicks={[5, 6, 7, 8]} y2Ticks={[0.05, 0.06, 0.07]}
                xLabel={t("story.figure2.x")} yLabel={t("story.figure2.y")} y2Label={t("story.figure2.y2")} caption={t("story.figure2.caption")} />
            </Reveal>
          </div>
          <AlignBlock align="right" maxWidth="66ch">
          <div style={{ marginBottom: "clamp(28px,4vw,48px)" }}>
            <Reveal><Eyebrow>{t("story.eyebrow")}</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "18ch" }}>
                {t("story.heading")}
              </h2>
            </Reveal>
          </div>

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
          </AlignBlock>
        </div>
      </div>
    </section>
  );
}

function CleanroomTear() {
  const [, t] = useLang();
  const c = t("cleanroomTear");
  return (
    <section style={{ position: "relative", paddingBottom: "clamp(40px,6vw,80px)" }}>
      <div className="container align-track">
        <AlignBlock align="left" maxWidth="54ch">
        <Reveal>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-muted)", margin: 0, maxWidth: "54ch" }}>
            {c.intro}
          </p>
        </Reveal>
        </AlignBlock>
      </div>

      <TornSection label={c.label} seed={11}>
        <Eyebrow color="var(--sage)">{c.eyebrow}</Eyebrow>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)", margin: "14px 0 18px", maxWidth: "22ch" }}>
          {c.heading}
        </h3>
        <div style={{ maxWidth: "62ch" }}>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px" }}>{c.p1}</p>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px" }}>{c.p2}</p>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0 }}>{c.p3}</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2.4vw,30px)", alignItems: "flex-start", marginTop: "clamp(28px,4vw,44px)" }}>
          <LoosePhoto src={asset("ci/assets/Bilder/ZMN/ZMN_Sputter.jpeg")} caption={c.photos[0]} rot={-2.5} w={340} />
          <LoosePhoto src={asset("ci/assets/Bilder/ZMN/ZMN_Me.jpeg")} caption={c.photos[1]} rot={2.5} w={210} />
          <LoosePhoto src={asset("ci/assets/Bilder/ZMN/ZMN_Profilo.jpeg")} caption={c.photos[2]} rot={1.5} w={330} />
          <LoosePhoto src={asset("ci/assets/Bilder/ZMN/ZMN_Proben.jpeg")} caption={c.photos[3]} rot={-1.5} w={205} />
        </div>
      </TornSection>
    </section>
  );
}

function ConfiTear() {
  const [, t] = useLang();
  const c = t("confiTear");
  return (
    <section style={{ position: "relative", padding: "clamp(40px,6vw,80px) 0 clamp(40px,6vw,80px)" }}>
      {/* the sage band above laps down over this paper section */}
      <WaveBlend edge="top" color="var(--sage)" seed={71} shadow="rgb(var(--accent-2-rgb) / 0.45)" />
      <div className="container align-track" style={{ position: "relative", zIndex: 1 }}>
        <AlignBlock align="left" maxWidth="54ch">
        <Reveal>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-muted)", margin: 0, maxWidth: "54ch" }}>
            {c.intro}
          </p>
        </Reveal>
        </AlignBlock>
      </div>

      <TornSection label={c.label} seed={23} teaser={{ photo: asset("ci/assets/Bilder/Konfi/Konfi_Phe.jpeg"), text: c.teaser }}>
        {/* eyebrow + heading go INSIDE the copy column; above the split they
            would span the whole panel and read as a caption band */}
        <SplitFeature flip
          src={asset("ci/assets/Bilder/Konfi/Konfi_speach.jpeg")}
          alt={c.photos[0]} caption={c.photos[0]} focus="50% 38%">
          <Eyebrow color="var(--sage)">{c.eyebrow}</Eyebrow>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)", margin: "14px 0 18px", maxWidth: "24ch" }}>
            {c.heading}
          </h3>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 16px", maxWidth: "48ch" }}>{c.p1}</p>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0, maxWidth: "48ch" }}>{c.p2}</p>
        </SplitFeature>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(18px,2.4vw,34px)", alignItems: "flex-start", marginTop: "clamp(28px,4vw,48px)" }}>
          <div style={{ flex: "1 1 260px", maxWidth: 340 }}>
            <Polaroid src={asset("ci/assets/Bilder/Konfi/Konfi_Phe.jpeg")} caption={c.photos[1]} rot={3} tape />
          </div>
          <div style={{ flex: "1 1 260px", maxWidth: 340 }}>
            <Polaroid src={asset("ci/assets/Bilder/Konfi/Konfi_Party.jpeg")} caption={c.photos[2]} rot={-3.5} />
          </div>
        </div>
      </TornSection>
    </section>
  );
}

const HENDRIK_SITE = "https://www.hendrik-e-peters.com/";
const PHP_INSTAGRAM = "https://www.instagram.com/php_films/";

function Collaborations() {
  const [, t] = useLang();
  const c = t("collaborations");
  return (
    <section id="mitwirkung" data-section style={{ padding: "var(--section-y) 0" }}>
      <div className="container align-track">
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px,100%),1fr))",
          gap: "clamp(32px,5vw,56px)", alignItems: "start",
        }}>
          <div>
            <div style={{ marginBottom: "clamp(28px,4vw,48px)" }}>
              <Reveal><Eyebrow>{c.eyebrow}</Eyebrow></Reveal>
              <Reveal delay={80}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "16ch" }}>
                  {c.heading}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={40}>
              <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "0 0 18px", maxWidth: "62ch" }}>{c.p1}</p>
            </Reveal>
            <Reveal delay={80}>
              <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0, maxWidth: "62ch" }}>{c.p2}</p>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <figure style={{ margin: "0 auto", maxWidth: 380, transform: "rotate(-2deg)" }}>
              <div style={{
                padding: 8, background: "var(--paper)", borderRadius: "var(--radius-lg)",
                boxShadow: "0 10px 30px -12px rgba(20,20,26,0.28), 0 44px 76px -38px rgb(var(--accent-2-rgb) / 0.35)",
                border: "1px solid var(--hairline)",
              }}>
                <img src={asset("ci/assets/Bilder/DerHochsitz/DerHochsitz_Poster.jpeg")} alt={c.posterCaption} loading="lazy"
                  style={{ display: "block", width: "100%", height: "auto", borderRadius: 8 }} />
              </div>
              <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-muted)", marginTop: 12, textAlign: "center" }}>
                {c.posterCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%),1fr))",
            gap: "clamp(20px,3vw,32px)", marginTop: "clamp(36px,5vw,56px)",
          }}>
            {c.entries.map((e, i) => (
              <div key={i} style={{
                padding: "clamp(22px,3vw,30px)", borderRadius: "var(--radius-xl)",
                background: "var(--paper-2)", border: "1px dashed var(--hairline-strong)",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {e.kicker}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)", margin: "10px 0 12px" }}>
                  {e.label}
                  {e.genre && <span style={{ fontWeight: 400, color: "var(--text-muted)" }}> · {e.genre}</span>}
                </h3>
                <p style={{ fontSize: "var(--fs-small)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0 }}>{e.note}</p>
                {e.href && (
                  <a href={e.href} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontFamily: "var(--font-text)", fontSize: "var(--fs-small)", fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
                    {e.linkLabel} <span aria-hidden>↗</span>
                  </a>
                )}
                {e.pins && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {e.pins.map((pin, j) => (
                      <span key={j} style={{
                        fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", fontWeight: 600,
                        padding: "8px 12px", borderRadius: "var(--radius-sm)",
                        background: "var(--paper)", border: "1px solid var(--hairline)", color: "var(--text-muted)",
                      }}>{pin}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--text-muted)", margin: "clamp(28px,4vw,40px) 0 0", maxWidth: "62ch" }}>
            {c.creditsBefore}
            <a href={HENDRIK_SITE} target="_blank" rel="noopener" style={{ color: "var(--text-body)", fontWeight: 600 }}>{c.creditsPortfolioLabel}</a>
            {c.creditsMiddle}
            <a href={PHP_INSTAGRAM} target="_blank" rel="noopener" style={{ color: "var(--text-body)", fontWeight: 600 }}>{c.creditsInstagramLabel}</a>
            {c.creditsAfter}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Reunion() {
  const GGI = "https://ggi-abitur2022.de/";
  const [, t] = useLang();
  const r = t("reunion");
  const [p1Before, p1After] = r.p1.split("{{site}}");
  return (
    <section id="nebenbei" data-section style={{ padding: "clamp(48px,6vw,96px) 0", position: "relative" }}>
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
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 120% at 110% -10%, rgb(var(--accent-1-glow-rgb) / 0.16), transparent 60%)", pointerEvents: "none" }} />
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
              <Pressable as="a" href={GGI} target="_blank" rel="noopener" className="ggi-link cta-ink" lift={-3} style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px",
                background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, textDecoration: "none",
              }}>
                {r.linkLabel} <span aria-hidden className="cta-arrow">→</span>
              </Pressable>
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, justifySelf: "center" }}>
              <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
                <GlowShape shape="circle" glow="plum" size={120} seed={64} />
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

window.SECTIONS_NEW = { Story, CleanroomTear, ConfiTear, Reunion, Collaborations };
