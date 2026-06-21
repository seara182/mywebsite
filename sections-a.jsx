/* ===========================================================
   Mika Jeske — landing page sections (single-scroll narrative)
   ============================================================ */
const { Reveal, Eyebrow, Badge, GlowShape, WaveBlend, TimelineEntry, useLang } = window.MJ;

/* ---------- Hero ---------- */
function Hero() {
  const [, t] = useLang();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const timer = setTimeout(() => setMounted(true), 80); return () => clearTimeout(timer); }, []);
  const words = ["Mika", "Jeske"];
  return (
    <section className="hero" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", padding: "0 var(--gutter)" }}>
      {/* ambient drifting shapes */}
      <GlowShape shape="blob" glow="duo" size={420} drift style={{ position: "absolute", top: "-8%", right: "-6%", opacity: 0.9, transition: "opacity 1.2s ease", pointerEvents: "none" }} />
      <GlowShape shape="arch" glow="navy" size={240} drift style={{ position: "absolute", bottom: 0, left: "-4%", opacity: 0.75, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: "var(--content-wide)", margin: "0 auto", width: "100%" }}>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <span style={{ display: "inline-block", fontFamily: "var(--font-text)", fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--label)", transform: mounted ? "none" : "translateY(120%)", opacity: mounted ? 1 : 0, transition: "transform 0.7s var(--ease-glide) 0.5s, opacity 0.7s ease 0.5s" }}>
            {t("hero.eyebrow")}
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--fs-display)", lineHeight: 0.98, letterSpacing: "var(--ls-display)", color: "var(--ink)", margin: 0 }}>
          {words.map((w, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
              <span style={{ display: "inline-block", transform: mounted ? "none" : "translateY(108%) rotate(4deg)", opacity: mounted ? 1 : 0, transition: `transform 0.9s var(--ease-glide) ${0.1 + i * 0.12}s, opacity 0.9s ease ${0.1 + i * 0.12}s` }}>{w}</span>
            </span>
          ))}
        </h1>
      </div>
      {/* scroll hint */}
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: mounted ? 0.6 : 0, transition: "opacity 1s ease 1.4s" }}>
        <span style={{ fontFamily: "var(--font-text)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--label)" }}>{t("hero.scrollHint")}</span>
        <span className="scroll-dot" style={{ width: 1, height: 34, background: "var(--hairline-strong)", position: "relative", overflow: "hidden" }}>
          <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 14, background: "var(--ink)", animation: "scrollHint 1.8s var(--ease-in-out) infinite" }} />
        </span>
      </div>
    </section>
  );
}

/* ---------- Intro (navy accent band) ---------- */
function Intro() {
  const [, t] = useLang();
  return (
    <section className="on-navy" style={{ position: "relative", overflow: "hidden", padding: "var(--section-y) 0" }}>
      <WaveBlend edge="top" color="var(--paper)" seed={5} />
      <WaveBlend edge="bottom" color="var(--paper)" seed={17} />
      <GlowShape shape="circle" glow="white" size={300} style={{ position: "absolute", top: "-10%", right: "4%", opacity: 0.5, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal><Eyebrow color="var(--sienna-glow)">{t("intro.eyebrow")}</Eyebrow></Reveal>
        <Reveal delay={80}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", lineHeight: 1.22, letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "20px 0 0", maxWidth: "20ch" }}>
            {t("intro.headline")}
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "24px 0 0", maxWidth: "54ch" }}>
            {t("intro.p1")}
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "16px 0 0", maxWidth: "54ch" }}>
            {t("intro.p2")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

window.SECTIONS_A = { Hero, Intro };
