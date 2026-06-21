/* ============================================================
   Mika Jeske — résumé, engagement, projects, footer + App shell
   ============================================================ */
const { Reveal, Eyebrow, Badge, GlowShape, TimelineEntry } = window.MJ;
const { Hero, Intro, EXPERIENCE, EDUCATION, ENGAGEMENT, SKILLS } = window.SECTIONS_A;
const { Story, Reunion } = window.SECTIONS_NEW;

const LINKEDIN = "https://www.linkedin.com/in/mika-jeske-835092313/";

function SectionHead({ kicker, title, glow = "sienna", shape = "blob" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: "clamp(32px,5vw,64px)" }}>
      <div>
        <Reveal><Eyebrow>{kicker}</Eyebrow></Reveal>
        <Reveal delay={80}><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "16ch" }}>{title}</h2></Reveal>
      </div>
      <Reveal delay={120} style={{ flex: "none" }}><GlowShape shape={shape} glow={glow} size={96} /></Reveal>
    </div>
  );
}

/* ---------- Résumé ---------- */
function Resume() {
  return (
    <section style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <SectionHead kicker="Lebenslauf" title="Beruflicher Werdegang" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px,100%),1fr))", gap: "clamp(32px,5vw,72px)" }}>
          <div>
            <Reveal><h3 className="t-h3" style={{ marginBottom: 28 }}>Berufserfahrung</h3></Reveal>
            <Reveal delay={60}><div>{EXPERIENCE.map((e, i) => <TimelineEntry key={i} {...e} last={i === EXPERIENCE.length - 1} />)}</div></Reveal>
          </div>
          <div>
            <Reveal><h3 className="t-h3" style={{ marginBottom: 28 }}>Bildungsweg</h3></Reveal>
            <Reveal delay={60}><div>{EDUCATION.map((e, i) => <TimelineEntry key={i} {...e} last={i === EDUCATION.length - 1} />)}</div></Reveal>
          </div>
        </div>

        {/* skills */}
        <Reveal style={{ marginTop: "clamp(48px,6vw,88px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <Eyebrow>Kompetenzen</Eyebrow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%),1fr))", gap: "clamp(20px,2.5vw,32px)" }}>
            {SKILLS.map((s, i) => (
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
                <div style={{ fontSize: "var(--fs-caption)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--label)", fontWeight: 600, marginBottom: 4 }}>Auszeichnung</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-title)", color: "var(--heading)" }}>DGZfP Science Student Award 2025</div>
              </div>
            </div>
            <a href={LINKEDIN} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600 }}>
              LinkedIn <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Engagement (sienna accent band) ---------- */
function Engagement() {
  return (
    <section className="on-sienna" style={{ position: "relative", overflow: "hidden", padding: "var(--section-y) 0" }}>
      <GlowShape shape="blob" glow="white" size={340} style={{ position: "absolute", bottom: "-12%", right: "-4%", opacity: 0.4, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          <Reveal><Eyebrow color="var(--on-dark-strong)">Ehrenamt</Eyebrow></Reveal>
          <Reveal delay={80}><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h1)", letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "16px 0 0", maxWidth: "18ch" }}>Engagement, das mir wichtig ist</h2></Reveal>
        </div>
        <Reveal delay={60}>
          <div style={{ "--ink": "var(--on-dark-strong)", "--accent": "var(--on-dark-strong)", "--heading": "var(--on-dark-strong)", "--text": "var(--on-dark-body)", "--text-body": "var(--on-dark-body)", "--label": "var(--on-dark-muted)", "--border": "var(--on-dark-hairline)", "--paper-2": "rgba(0,0,0,0.12)", maxWidth: "var(--content-narrow)" }}>
            {ENGAGEMENT.map((e, i) => <TimelineEntry key={i} {...e} last={i === ENGAGEMENT.length - 1} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Projects (Bay Window showcase) ---------- */
function Projects() {
  const features = ["Dashboard mit Countdown", "Player-Spotlight", "Lineup-Diagramm", "Standings & Venue", "History & Playoffs", "Roster mit Filter"];
  const stack = ["Tauri 2 · Rust", "React 19 · TS", "Vite 7", "ESPN JSON-API", "i18next EN/DE"];
  return (
    <section style={{ padding: "var(--section-y) 0" }}>
      <div className="container">
        <SectionHead kicker="Projekt" title="Bay Window" glow="navy" shape="arch" />
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px,100%),1fr))", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--text)", margin: 0, maxWidth: "46ch" }}>
                Eine Desktop-App, die auf einen Blick den Stand zweier Lieblings-Sportteams zeigt — Spiele, Tabelle, Kader und Geschichte. Gebaut für den kurzen Blick beim Hochfahren: der Cache zeigt sofort Daten, während im Hintergrund aktualisiert wird.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
                {stack.map((s, i) => <Badge key={i} variant="navy">{s}</Badge>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", marginTop: 28 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-small)", color: "var(--text-body)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />{f}
                  </div>
                ))}
              </div>
              <a href="projects/bay-window/index.html" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, padding: "13px 24px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, color: "var(--heading)" }}>
                Bay Window ansehen <span aria-hidden>→</span>
              </a>
            </div>
            {/* preview tile */}
            <div style={{ position: "relative", minWidth: 0, aspectRatio: "16/10", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, padding: 26, borderRadius: "var(--radius-xl)", overflow: "hidden", background: "#14151D", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 80% 0%, rgba(232,154,92,0.5), transparent 55%)" }} />
              <div style={{ position: "relative", padding: "20px 22px", borderRadius: "var(--radius-lg)", background: "linear-gradient(110deg, var(--sienna-deep), var(--amber))", color: "#fff" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85, fontWeight: 600 }}>Next Game · Week 25</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px,3vw,34px)", marginTop: 6 }}>@ Miami Marlins</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>Sat, Jun 20 · 1:10 AM · loanDepot park</div>
              </div>
              <div style={{ position: "relative", display: "flex", gap: 12 }}>
                {[["ERA","5.73"],["K","48"],["WHIP","1.58"],["W-L","2-6"]].map(([k,v],i)=>(
                  <div key={i} style={{ flex: 1, minWidth: 0, padding: "12px 10px", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{k}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "#fff", marginTop: 4 }}>{v}</div>
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
  return (
    <footer style={{ padding: "clamp(48px,6vw,88px) 0 40px", borderTop: "1px solid var(--border)" }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h3)", color: "var(--heading)", letterSpacing: "var(--ls-heading)" }}>Mika Jeske</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href={LINKEDIN} target="_blank" rel="noopener" style={{ fontSize: "var(--fs-body)", color: "var(--text-body)", fontWeight: 500 }}>LinkedIn</a>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-caption)", color: "var(--text-faint)" }}>Made by Mika</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <a href="private/index.html" style={{ display: "inline-flex", padding: 8, color: "var(--text-faint)", opacity: 0.35 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        </a>
      </div>
    </footer>
  );
}

function App() {
  return (
    <main>
      <Hero />
      <Intro />
      <Story />
      <Resume />
      <Engagement />
      <Reunion />
      <Projects />
      <Footer />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
