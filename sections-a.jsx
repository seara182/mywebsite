const { asset, Reveal, Parallax, Pressable, SplitFeature, Eyebrow, Badge, GlowShape, Scribble, WaveBlend, TimelineEntry, AlignBlock, BlobCluster, useLang } = window.MJ;

/* entrance delays, in ms */
const HERO_T = { name: 100, nameStep: 120, eyebrow: 500, portrait: 1000, chrome: 1400 };

function Hero() {
  const [, t] = useLang();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const timer = setTimeout(() => setMounted(true), 80); return () => clearTimeout(timer); }, []);
  const words = ["Mika", "Jeske"];
  /* no overflow here: .hero clips on the x axis only, so the ambient shapes
     bleed past the bottom edge and the plum band covers them */
  return (
    <section id="top" data-section className="hero" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--gutter)" }}>
      <GlowShape shape="blob" glow="duo" size={420} seed={1} parallax="--depth-3" className="hero-glow-blob" style={{ position: "absolute", top: "-8%", right: "-6%", zIndex: 2, opacity: mounted ? 1 : 0, transition: "opacity 1.4s var(--ease-emphasized) 200ms", pointerEvents: "none" }} />
      <GlowShape shape="arch" glow="plum" size={240} seed={2} parallax="--depth-2" className="hero-glow-arch" style={{ position: "absolute", bottom: 0, left: "-4%", zIndex: 2, opacity: mounted ? 1 : 0, transition: "opacity 1.4s var(--ease-emphasized) 340ms", pointerEvents: "none" }} />
      {/* ≥1440px only, see .hero-photo */}
      <div className="hero-photo" aria-hidden="true" style={{ position: "absolute", zIndex: 2, right: "clamp(80px, 15vw, 340px)", bottom: 0, height: "clamp(520px, 66vh, 820px)", pointerEvents: "none", opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(26px) scale(0.965)", filter: mounted ? "blur(0px)" : "blur(10px)", transition: "opacity 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms, transform 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms, filter 1.1s var(--ease-emphasized) " + HERO_T.portrait + "ms" }}>
        <Scribble seed={9} glow="duo" size={340} style={{ top: "42%", left: "50%", width: "84%", height: "84%", zIndex: 0 }} />
        <img src={asset("ci/assets/Bilder/Weitere/site_header.png")} alt="Mika Jeske" className="drift-soft"
          style={{ position: "relative", zIndex: 1, display: "block", height: "100%", width: "auto" }} />
        <span style={{ position: "absolute", zIndex: 2, right: 10, bottom: 10, fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#808080", textShadow: "0 0 8px var(--bg), 0 0 14px var(--bg)" }}>
          {t("hero.aiImageLabel")}
        </span>
      </div>
      <div className="hero-namewrap" style={{ position: "relative", zIndex: 3 }}>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <span className="hero-line" style={{ display: "inline-block", fontFamily: "var(--font-text)", fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--label)", transform: mounted ? "none" : "translateY(120%)", opacity: mounted ? 1 : 0, transition: "transform 0.7s var(--ease-emphasized) " + HERO_T.eyebrow + "ms, opacity 0.7s ease " + HERO_T.eyebrow + "ms" }}>
            {t("hero.eyebrow")}
          </span>
        </div>
        <h1 className="hero-name" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--fs-display-hero)", lineHeight: 0.98, letterSpacing: "var(--ls-display)", color: "var(--ink)", margin: 0 }}>
          {words.map((w, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
              <span className="hero-line" style={{ display: "inline-block", transformOrigin: "0% 100%", transform: mounted ? "none" : "translateY(108%) scale(0.94)", filter: mounted ? "blur(0px)" : "blur(9px)", opacity: mounted ? 1 : 0, transition: "transform 1s var(--ease-emphasized) " + (HERO_T.name + i * HERO_T.nameStep) + "ms, filter 1s var(--ease-emphasized) " + (HERO_T.name + i * HERO_T.nameStep) + "ms, opacity 0.8s ease " + (HERO_T.name + i * HERO_T.nameStep) + "ms" }}>{w}</span>
            </span>
          ))}
        </h1>
      </div>
      <div className="hero-hint" style={{ position: "absolute", zIndex: 4, bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: mounted ? 0.92 : 0, transition: "opacity 1s ease " + HERO_T.chrome + "ms" }}>
        <span style={{ fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink)", textShadow: "0 0 10px var(--bg), 0 0 18px var(--bg)" }}>{t("hero.scrollHint")}</span>
        <span className="scroll-dot" style={{ width: 2, height: 42, borderRadius: 2, background: "var(--hairline-strong)", position: "relative", overflow: "hidden", boxShadow: "0 0 12px 4px var(--bg)" }}>
          <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 16, background: "var(--ink)", animation: "scrollHint 1.8s var(--ease-in-out) infinite" }} />
        </span>
      </div>
    </section>
  );
}

/* px the plum band overhangs the section below, so it draws its own bottom seam */
const LAP = 48;

function Intro() {
  const [, t] = useLang();
  const ip = t("intro.photos") || [];
  return (
    <section id="intro" data-section className="on-plum" style={{ position: "relative", zIndex: 1, overflow: "hidden", padding: `12mm 0 calc(5mm + ${LAP}px)`, marginBottom: -LAP }}>
      <WaveBlend edge="top" color="var(--paper)" seed={5} shadow="rgb(var(--accent-1-deep-rgb) / 0.55)" z={2} />
      <WaveBlend edge="bottom" lap="under" color="var(--paper)" seed={63} shadow="rgb(var(--accent-1-rgb) / 0.45)" z={2} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SplitFeature bleed
          bleedTop="12mm" bleedBottom={`calc(5mm + ${LAP}px)`}
          src={asset("ci/assets/Bilder/Weitere/i_zfp.jpeg")}
          alt={ip[0]} caption={ip[0]} focus="25% 40%">
          <Reveal><Eyebrow color="var(--sage-glow)">{t("intro.eyebrow")}</Eyebrow></Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", lineHeight: 1.22, letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "20px 0 0", maxWidth: "18ch" }}>
              {t("intro.headline")}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "24px 0 0", maxWidth: "46ch" }}>
              {t("intro.p1")}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "16px 0 0", maxWidth: "46ch" }}>
              {t("intro.p2")}
            </p>
          </Reveal>
          <Reveal delay={300}>
            {/* 46ch mirrors the paragraphs, so the signature centres on the text
                measure and not on the wider copy column; invert() paints the
                black source white for the plum band */}
            <div style={{ maxWidth: "46ch", marginTop: "clamp(24px,3vw,40px)" }}>
              <img src={asset("ci/assets/Bilder/Weitere/signatur-mika-jeske.png")}
                alt="Mika Andreas Jeske" loading="lazy"
                style={{ display: "block", marginInline: "auto", width: "min(300px, 66%)", height: "auto", filter: "invert(1)", opacity: 0.9 }} />
            </div>
          </Reveal>
        </SplitFeature>
      </div>
    </section>
  );
}

function Seeking() {
  const [, t] = useLang();
  const s = t("seeking");
  return (
    <section id="werkstudent" data-section style={{ position: "relative", overflow: "hidden", padding: "var(--section-y-sm) 0 var(--section-y)" }}>
      {/* top seam is drawn by Intro, which overhangs this section by LAP px */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="seeking">
          <div>
            <Reveal><Eyebrow>{s.eyebrow}</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", lineHeight: 1.15, letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "14ch" }}>
                {s.heading}
              </h2>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <dl className="seeking__list">
                {s.rows.map((r, i) => (
                  <React.Fragment key={i}>
                    <dt className="seeking__k">{r.k}</dt>
                    <dd className="seeking__v">{r.v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={80}>
              <Pressable as="a" className="cta-ink" href="https://www.linkedin.com/in/mika-jeske-835092313/" target="_blank" rel="noopener" lift={-3}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: "clamp(24px,3vw,36px)", padding: "12px 22px", background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, textDecoration: "none" }}>
                {s.cta} <span aria-hidden className="cta-arrow">&rarr;</span>
              </Pressable>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

window.SECTIONS_A = { Hero, Intro, Seeking };
