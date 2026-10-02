const { asset, Reveal, Pressable, SectionSkipper, WaveBlend, TimelineEntry, AlignBlock, BlobCluster, useLang, LanguageSwitcherMount, ContactChipMount } = window.MJ;
const { Hero, Intro, Seeking } = window.SECTIONS_A;
const { Story, CleanroomTear, ConfiTear, Reunion, Collaborations } = window.SECTIONS_NEW;

const LINKEDIN = "https://www.linkedin.com/in/mika-jeske-835092313/";
const EMAIL = "mailto:mikajeske@gmail.com";
const PHONE = "tel:+491774866584";

function SectionHead({ title }) {
  return (
    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "0 0 clamp(32px,5vw,64px)", maxWidth: "16ch" }}>{title}</h2>
  );
}

function Resume() {
  const [, t] = useLang();
  const r = t("resume");
  const experience = t("experience");
  const education = t("education");
  const skills = t("skills");
  return (
    <section id="lebenslauf" data-section style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <SectionHead title={r.title} />
        <div className="resume-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px,100%),1fr))", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
          <div>
            <h3 className="t-h3" style={{ marginBottom: 28 }}>{r.experienceHeading}</h3>
            <div>{experience.map((e, i) => <TimelineEntry key={i} {...e} last={i === experience.length - 1} />)}</div>
          </div>
          <div>
            <h3 className="t-h3" style={{ marginBottom: 28 }}>{r.educationHeading}</h3>
            <div>{education.map((e, i) => <TimelineEntry key={i} {...e} last={i === education.length - 1} />)}</div>
          </div>
        </div>

        <div style={{ marginTop: "clamp(48px,6vw,88px)" }}>
          <h3 className="t-h3" style={{ marginBottom: 28 }}>{r.skillsHeading}</h3>
          <dl className="kv">
            {skills.map((s, i) => (
              <React.Fragment key={i}>
                <dt className="kv__k">{s.group}</dt>
                <dd className="kv__v">{s.items.join(", ")}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>

        <div style={{ marginTop: "clamp(40px,5vw,72px)" }}>
          <h3 className="t-h3" style={{ marginBottom: 12 }}>{r.awardLabel}</h3>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-normal)", color: "var(--text)", margin: 0 }}>
            {r.awardName}{" · "}
            <a href={LINKEDIN} target="_blank" rel="noopener" style={{ color: "var(--accent)", fontWeight: 600 }}>{r.linkedinLabel}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Engagement() {
  const [, t] = useLang();
  const s = t("engagementSection");
  const engagement = t("engagement");
  const ep = s.photos || [];
  return (
    <section id="ehrenamt" data-section className="on-sage" style={{ position: "relative", overflow: "hidden", padding: "var(--section-y) 0" }}>
      {/* top seam only; the bottom one is drawn by ConfiTear's top wave */}
      <WaveBlend edge="top" color="var(--paper)" seed={31} shadow="rgb(var(--accent-2-deep-rgb) / 0.5)" />
      <div className="fill-slot fill-slot--left">
        <Reveal>
          <BlobCluster style={{ width: 560, height: 860 }} photos={[
            { src: asset("ci/assets/Bilder/Weitere/e_kids.jpeg"), caption: ep[0], glow: "white", seed: 22, w: 430, h: 282, focus: "50% 45%", rot: 4, parallax: "--depth-1", radius: "58% 42% 52% 48% / 46% 56% 44% 54%", pos: { top: 0, left: 130 } },
            { src: asset("ci/assets/Bilder/Weitere/e_hfc.jpeg"), caption: ep[1], glow: "white", seed: 53, w: 288, h: 408, focus: "50% 32%", rot: -5, parallax: "--depth-2", radius: "52% 48% 40% 60% / 56% 46% 54% 44%", pos: { top: 410, left: 0 } },
          ]} />
        </Reveal>
      </div>
      <div className="container align-track" style={{ position: "relative", zIndex: 1 }}>
        <AlignBlock align="right" maxWidth="var(--content-narrow)">
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "0 0 clamp(32px,5vw,56px)", maxWidth: "18ch" }}>{s.heading}</h2>
          <div style={{ "--ink": "var(--on-dark-strong)", "--accent": "var(--on-dark-strong)", "--heading": "var(--on-dark-strong)", "--text": "var(--on-dark-body)", "--text-body": "var(--on-dark-body)", "--label": "var(--on-dark-muted)", "--border": "var(--on-dark-hairline)", "--paper-2": "rgba(0,0,0,0.12)" }}>
            {engagement.map((e, i) => <TimelineEntry key={i} {...e} last={i === engagement.length - 1} />)}
          </div>
        </AlignBlock>
      </div>
    </section>
  );
}

function Projects() {
  const [, t] = useLang();
  const p = t("projects");
  return (
    <section id="projekt" data-section style={{ padding: "var(--section-y) 0" }}>
      <div className="container align-track">
        <SectionHead title={p.title} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%),1fr))", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0, maxWidth: "46ch" }}>
                {p.p1}
              </p>
              <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: "16px 0 0", maxWidth: "46ch" }}>
                {p.p2}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", marginTop: 28 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-small)", color: "var(--text-body)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />{f}
                  </div>
                ))}
              </div>
              <Pressable as="a" className="cta-outline" href={asset("projects/cheapseats/")} lift={-3} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, padding: "13px 24px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, color: "var(--heading)" }}>
                {p.cta} <span aria-hidden className="cta-arrow">→</span>
              </Pressable>
            </div>
            {/* translateZ on the children needs the perspective on this wrapper */}
            <Reveal className="bay-stage" style={{ perspective: 1200, minWidth: 0 }}>
            <Pressable className="bay-preview" tilt={7} lift={-6} style={{ position: "relative", minWidth: 0, aspectRatio: "16/10", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, padding: 26, borderRadius: "var(--radius-xl)", overflow: "hidden",
              /* Theme-fixed on purpose. This is a mock of the CheapSeats app's
                 own dark interface — product imagery, like a screenshot, not
                 site chrome. Re-theming it to light would misrepresent the
                 app, so it keeps literal values in both schemes. */
              background: "#14151D", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 80% 0%, rgb(var(--accent-2-glow-rgb) / 0.5), transparent 55%)" }} />
              <div style={{ position: "relative", transform: "translateZ(34px)", padding: "20px 22px", borderRadius: "var(--radius-lg)", /* The warm end was --honey, which put white text at 1.61:1 over the
                 right-hand half of this card — comfortably the worst contrast
                 on the site, and one the audit never found because it only
                 looked at text tokens, never at what text was sitting on.
                 --honey-deep is the same hue dropped to where white clears AA
                 across the entire ramp (worst point 4.72:1). */
              background: "linear-gradient(110deg, var(--sage-deep), var(--honey-deep))", color: "#fff", boxShadow: "0 18px 40px -22px rgba(0,0,0,0.8)" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85, fontWeight: 600 }}>Next Game · Week 25</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px,3vw,34px)", marginTop: 6 }}>@ Miami Marlins</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>Sat, Jun 20 · 1:10 AM · loanDepot park</div>
              </div>
              <div style={{ position: "relative", transform: "translateZ(18px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 12 }}>
                {[["ERA","5.73"],["K","48"],["WHIP","1.58"],["W-L","2-6"]].map(([k,v],i)=>(
                  <div key={i} style={{ minWidth: 0, padding: "12px 10px", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{k}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px, 5vw, 22px)", color: "#fff", marginTop: 4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Pressable>
            </Reveal>
          </div>
      </div>
    </section>
  );
}

function Footer() {
  const [, t] = useLang();
  const f = t("footer");
  return (
    <footer style={{ padding: "clamp(48px,6vw,88px) 0 40px", borderTop: "1px solid var(--border)" }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h3)", color: "var(--heading)", letterSpacing: "var(--ls-heading)" }}>Mika Jeske</div>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <a href={LINKEDIN} target="_blank" rel="noopener" style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>{f.linkedinLabel}</a>
          <a href={EMAIL} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
            {f.email}
          </a>
          <a href={PHONE} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            {f.phone}
          </a>
          <a href={asset("impressum/")} style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>{f.legal}</a>
        </div>
      </div>
      <div className="container">
        <p className="i18n-disclaimer">{f.disclaimer}</p>
        {f.privacyNote && <p className="i18n-disclaimer">{f.privacyNote}</p>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <a href={asset("private/")} aria-label="Private Hub (Not needed for public site navigation)" style={{ display: "inline-flex", padding: 8, color: "var(--text-faint)", opacity: 0.35 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        </a>
      </div>
    </footer>
  );
}

/* keep in page order: the rail highlights by index */
function useSkipperItems() {
  const [, t] = useLang();
  const nav = t("nav");
  return [
    { id: "werkstudent", label: nav.werkstudent },
    { id: "lebenslauf", label: nav.lebenslauf },
    { id: "ehrenamt", label: nav.ehrenamt },
    { id: "projekt", label: nav.projekt },
  ];
}

function App() {
  const [, t] = useLang();
  const skipItems = useSkipperItems();
  return (
    <main>
      <LanguageSwitcherMount />
      <ContactChipMount />
      <SectionSkipper items={skipItems} label={t("nav").skipLabel} />
      <Hero />
      <Intro />
      <Seeking />
      <Resume />
      <Engagement />
      <ConfiTear />
      <Story />
      <CleanroomTear />
      <Reunion />
      <Collaborations />
      <Projects />
      <Footer />
    </main>
  );
}

/* build.mjs renders this in Node to prerender each language */
window.SECTIONS_B = { App };

/* hydrate the prerendered markup; plain render if it is missing */
if (typeof document !== "undefined") {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    if (rootEl.firstElementChild) {
      ReactDOM.hydrateRoot(rootEl, <App />);
    } else {
      ReactDOM.createRoot(rootEl).render(<App />);
    }
  }
}
