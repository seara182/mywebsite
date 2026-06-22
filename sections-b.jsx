/* ============================================================
   Mika Jeske — résumé, engagement, projects, footer + App shell
   ============================================================ */
const { Reveal, Eyebrow, Badge, GlowShape, WaveBlend, TimelineEntry, useLang, LanguageSwitcherMount, ContactChipMount } = window.MJ;
const { Hero, Intro } = window.SECTIONS_A;
const { Story, CleanroomTear, ConfiTear, Reunion } = window.SECTIONS_NEW;

const LINKEDIN = "https://www.linkedin.com/in/mika-jeske-835092313/";
const EMAIL = "mailto:mikajeske@gmail.com";
const PHONE = "tel:+491774866584";

function SectionHead({ kicker, title, glow = "sienna", shape = "blob" }) {
  return (
    <div className="section-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: "clamp(32px,5vw,64px)" }}>
      <div>
        <Reveal><Eyebrow>{kicker}</Eyebrow></Reveal>
        <Reveal delay={80}><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "16ch" }}>{title}</h2></Reveal>
      </div>
      <Reveal delay={120} className="section-head__deco" style={{ flex: "none" }}><GlowShape shape={shape} glow={glow} size={96} /></Reveal>
    </div>
  );
}

/* ---------- Résumé ---------- */
function Resume() {
  const [, t] = useLang();
  const r = t("resume");
  const experience = t("experience");
  const education = t("education");
  const skills = t("skills");
  return (
    <section style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <SectionHead kicker={r.kicker} title={r.title} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px,100%),1fr))", gap: "clamp(32px,5vw,72px)" }}>
          <div>
            <Reveal><h3 className="t-h3" style={{ marginBottom: 28 }}>{r.experienceHeading}</h3></Reveal>
            <Reveal delay={60}><div>{experience.map((e, i) => <TimelineEntry key={i} {...e} last={i === experience.length - 1} />)}</div></Reveal>
          </div>
          <div>
            <Reveal><h3 className="t-h3" style={{ marginBottom: 28 }}>{r.educationHeading}</h3></Reveal>
            <Reveal delay={60}><div>{education.map((e, i) => <TimelineEntry key={i} {...e} last={i === education.length - 1} />)}</div></Reveal>
          </div>
        </div>

        {/* skills */}
        <Reveal style={{ marginTop: "clamp(48px,6vw,88px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <Eyebrow>{r.skillsEyebrow}</Eyebrow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%),1fr))", gap: "clamp(20px,2.5vw,32px)" }}>
            {skills.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--font-text)", fontSize: "var(--fs-small)", fontWeight: 600, color: "var(--heading)", marginBottom: 14 }}>{s.group}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.items.map((it, j) => <Badge key={j} variant={i === 0 ? "accent" : "neutral"}>{it}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* award + linkedin */}
        <Reveal style={{ marginTop: "clamp(40px,5vw,72px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "clamp(24px,3vw,36px)", background: "var(--surface-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <GlowShape shape="squircle" glow="amber" size={64} />
              <div>
                <div style={{ fontSize: "var(--fs-caption)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--label)", fontWeight: 600, marginBottom: 4 }}>{r.awardLabel}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)" }}>{r.awardName}</div>
              </div>
            </div>
            <a href={LINKEDIN} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600 }}>
              {r.linkedinLabel} <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Engagement (sienna accent band) ---------- */
function Engagement() {
  const [, t] = useLang();
  const s = t("engagementSection");
  const engagement = t("engagement");
  return (
    <section className="on-sienna" style={{ position: "relative", overflow: "hidden", padding: "var(--section-y) 0" }}>
      {/* paper (Cleanroom) above laps DOWN over this sienna band; bottom seam is handled by ConfiTear's top wave (sienna laps over paper) */}
      <WaveBlend edge="top" color="var(--paper)" seed={31} shadow="rgba(120,52,28,0.5)" />
      <GlowShape shape="blob" glow="amber" size={340} ink="var(--sienna-deep)" style={{ position: "absolute", bottom: "6%", right: "-4%", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          <Reveal><Eyebrow color="var(--on-dark-strong)">{s.eyebrow}</Eyebrow></Reveal>
          <Reveal delay={80}><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "16px 0 0", maxWidth: "18ch" }}>{s.heading}</h2></Reveal>
        </div>
        <Reveal delay={60}>
          <div style={{ "--ink": "var(--on-dark-strong)", "--accent": "var(--on-dark-strong)", "--heading": "var(--on-dark-strong)", "--text": "var(--on-dark-body)", "--text-body": "var(--on-dark-body)", "--label": "var(--on-dark-muted)", "--border": "var(--on-dark-hairline)", "--paper-2": "rgba(0,0,0,0.12)", maxWidth: "var(--content-narrow)" }}>
            {engagement.map((e, i) => <TimelineEntry key={i} {...e} last={i === engagement.length - 1} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Projects (Bay Window showcase) ---------- */
function Projects() {
  const [, t] = useLang();
  const p = t("projects");
  return (
    <section style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <SectionHead kicker={p.kicker} title={p.title} glow="navy" shape="arch" />
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%),1fr))", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0, maxWidth: "46ch" }}>
                {p.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
                {p.stack.map((s, i) => <Badge key={i} variant="navy">{s}</Badge>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", marginTop: 28 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-small)", color: "var(--text-body)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />{f}
                  </div>
                ))}
              </div>
              <a href="projects/bay-window/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, padding: "13px 24px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, color: "var(--heading)" }}>
                {p.cta} <span aria-hidden>→</span>
              </a>
            </div>
            {/* preview tile */}
            <div className="bay-preview" style={{ position: "relative", minWidth: 0, aspectRatio: "16/10", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, padding: 26, borderRadius: "var(--radius-xl)", overflow: "hidden", background: "#14151D", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 80% 0%, rgba(232,154,92,0.5), transparent 55%)" }} />
              <div style={{ position: "relative", padding: "20px 22px", borderRadius: "var(--radius-lg)", background: "linear-gradient(110deg, var(--sienna-deep), var(--amber))", color: "#fff" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85, fontWeight: 600 }}>Next Game · Week 25</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px,3vw,34px)", marginTop: 6 }}>@ Miami Marlins</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>Sat, Jun 20 · 1:10 AM · loanDepot park</div>
              </div>
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 12 }}>
                {[["ERA","5.73"],["K","48"],["WHIP","1.58"],["W-L","2-6"]].map(([k,v],i)=>(
                  <div key={i} style={{ minWidth: 0, padding: "12px 10px", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{k}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px, 5vw, 22px)", color: "#fff", marginTop: 4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const [, t] = useLang();
  const f = t("footer");
  return (
    <footer style={{ padding: "clamp(48px,6vw,88px) 0 40px", borderTop: "1px solid var(--border)" }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h3)", color: "var(--heading)", letterSpacing: "var(--ls-heading)" }}>Mika Jeske</div>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <a href={LINKEDIN} target="_blank" rel="noopener" style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>{f.linkedinLabel}</a>
          <a href={EMAIL} aria-label={f.emailAria} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
            {f.email}
          </a>
          <a href={PHONE} aria-label={f.phoneAria} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            {f.phone}
          </a>
          <a href="impressum/" style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>{f.legal}</a>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-faint)" }}>{f.madeBy}</span>
        </div>
      </div>
      <div className="container">
        <p className="i18n-disclaimer">{f.disclaimer}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <a href="private/" style={{ display: "inline-flex", padding: 8, color: "var(--text-faint)", opacity: 0.35 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        </a>
      </div>
    </footer>
  );
}

/* ---------- ambient side orbs ----------
   A few drifting, colour-glowing shapes pinned in the side gutters.
   Only shown on 16:9-and-wider displays (see .side-orbs in index.html),
   where the centred content column leaves the margins feeling empty.
   Fixed layer sits behind the content; the navy/sienna bands cover it,
   so the orbs only read over the paper sections. */
function SideOrbs() {
  return (
    <div className="side-orbs" aria-hidden="true">
      <GlowShape shape="circle"   glow="duo"    size={150} drift style={{ position: "absolute", right: "1vw",   top: "22%" }} />
      <GlowShape shape="blob"     glow="sienna" size={180} drift style={{ position: "absolute", left: "1.5vw",  top: "40%" }} />
      <GlowShape shape="squircle" glow="amber"  size={140} drift style={{ position: "absolute", right: "2vw",   top: "58%" }} />
      <GlowShape shape="blob"     glow="navy"   size={170} drift style={{ position: "absolute", left: "1vw",    top: "76%" }} />
      <GlowShape shape="circle"   glow="duo"    size={150} drift style={{ position: "absolute", right: "1.5vw", top: "90%" }} />
    </div>
  );
}

function App() {
  return (
    <main>
      <SideOrbs />
      <LanguageSwitcherMount />
      <ContactChipMount />
      <Hero />
      <Intro />
      <Story />
      <Resume />
      <CleanroomTear />
      <Engagement />
      <ConfiTear />
      <Reunion />
      <Projects />
      <Footer />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
