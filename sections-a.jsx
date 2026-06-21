/* ===========================================================
   Mika Jeske — landing page sections (single-scroll narrative)
   ============================================================ */
const { Reveal, Eyebrow, Badge, GlowShape, TimelineEntry } = window.MJ;

/* ---------- content ---------- */
const EXPERIENCE = [
  { role: "Praktikant Industrial Engineering", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
    points: ["Qualifizierung eines Betriebsmittels für den Serieneinsatz — Versuchsplanung, Prozesskontrolle und Prozessautomatisierung", "Evaluation und Beschaffung von Viskosimeter-Systemen mit eigenständigen Messreihen und Beschaffungsempfehlung", "Charakterisierung bleifreier Pastenalternativen mittels optischer Mikroskopie und Röntgenografie"] },
  { role: "Wissenschaftlicher Assistent", org: "Zentrum für Mikro- und Nanotechnik · TU Ilmenau", period: "04.2025 – 10.2025",
    points: ["Sputter-Abscheidung metallischer Dünnschichten (Al, Ag, Ti, Si) und Strukturierung per Lift-off im Reinraum", "Profilometrie, REM-Topografieanalyse und elektrische Charakterisierung (Van-der-Pauw)"] },
];
const EDUCATION = [
  { role: "B.Sc. Werkstoffwissenschaft", org: "Technische Universität Ilmenau", period: "10.2022 – 06.2026",
    points: ["Schwerpunkt metallische Werkstoffe, Dünnschichttechnik und Fertigungsverfahren", "Bachelorarbeit: Temperaturabhängige elektrische Eigenschaften gesputterter Dünnschichten", "Nominierung für die Studienstiftung des deutschen Volkes"] },
  { role: "Allgemeine Hochschulreife · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
];
const ENGAGEMENT = [
  { role: "Helfer in Grundausbildung", org: "Technisches Hilfswerk · OV Friedrichshafen", period: "seit 10.2025", accent: true,
    points: ["Grundausbildung im Zivil- und Katastrophenschutz, Ausrichtung auf Fachberatung CBRN-Abwehr"] },
  { role: "Telefonberater · Nummer gegen Kummer", org: "Kinderschutzbund · Friedrichshafen", period: "seit 02.2026",
    points: ["Ausbildung zur telefonischen Beratung für Kinder und Jugendliche in Krisensituationen", "Aktive Beratung auf systemisch-psychologischer Grundlage"] },
  { role: "Ehrenamtliche Gruppenleitung", org: "Evangelische Kirche Mitteldeutschland · Ilmenau", period: "2022 – 2025",
    points: ["Dreijährige Gruppenleitung in Konfirmations- und offener Jugendarbeit", "Leitung auf Freizeiten und Events mit bis zu 120 Teilnehmenden"] },
  { role: "Gewähltes Mitglied der Studierendenvertretung", org: "TU Ilmenau", period: "2024 – 2026", last: true,
    points: ["Studienausschuss im Universitätssenat — Mitgestaltung von Hochschulpolitik und Studienordnungen", "Mitgestalter Wahl-O-Mat zur Thüringer Landtagswahl 2024 (bpb · MDR)"] },
];
const SKILLS = [
  { group: "Materialanalyse", items: ["REM / SEM", "Röntgenografie", "Profilometrie", "Gefügeanalyse", "Dünnschichttechnik", "Viskosimetrie"] },
  { group: "Methoden", items: ["Werkstoffcharakterisierung", "Reinraumarbeit", "Versuchsplanung", "Qualitätsprüfung", "Prozessautomatisierung"] },
  { group: "Software", items: ["LaTeX", "KI-Tools", "MS Office", "SAP", "FreeCAD"] },
  { group: "Sprachen", items: ["Deutsch (Muttersprache)", "Englisch (verhandlungssicher)"] },
];

/* ---------- Hero ---------- */
function Hero() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);
  const words = ["Mika", "Jeske"];
  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", padding: "0 var(--gutter)" }}>
      {/* ambient drifting shapes */}
      <GlowShape shape="blob" glow="duo" size={420} drift style={{ position: "absolute", top: "-8%", right: "-6%", opacity: 0.9, transition: "opacity 1.2s ease", pointerEvents: "none" }} />
      <GlowShape shape="arch" glow="navy" size={240} drift style={{ position: "absolute", bottom: "6%", left: "-4%", opacity: 0.75, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: "var(--content-wide)", margin: "0 auto", width: "100%" }}>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <span style={{ display: "inline-block", fontFamily: "var(--font-text)", fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--label)", transform: mounted ? "none" : "translateY(120%)", opacity: mounted ? 1 : 0, transition: "transform 0.7s var(--ease-glide) 0.5s, opacity 0.7s ease 0.5s" }}>
            Werkstoffwissenschaft · B.Sc.
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--fs-display)", lineHeight: 0.98, letterSpacing: "var(--ls-display)", color: "var(--ink)", margin: 0 }}>
          {words.map((w, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden" }}>
              <span style={{ display: "inline-block", transform: mounted ? "none" : "translateY(108%) rotate(4deg)", opacity: mounted ? 1 : 0, transition: `transform 0.9s var(--ease-glide) ${0.1 + i * 0.12}s, opacity 0.9s ease ${0.1 + i * 0.12}s` }}>{w}</span>
            </span>
          ))}
        </h1>
      </div>
      {/* scroll hint */}
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: mounted ? 0.6 : 0, transition: "opacity 1s ease 1.4s" }}>
        <span style={{ fontFamily: "var(--font-text)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--label)" }}>Scroll</span>
        <span className="scroll-dot" style={{ width: 1, height: 34, background: "var(--hairline-strong)", position: "relative", overflow: "hidden" }}>
          <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 14, background: "var(--ink)", animation: "scrollHint 1.8s var(--ease-in-out) infinite" }} />
        </span>
      </div>
    </section>
  );
}

/* ---------- Intro (navy accent band) ---------- */
function Intro() {
  return (
    <section className="on-navy" style={{ position: "relative", overflow: "hidden", padding: "var(--section-y) 0" }}>
      <GlowShape shape="circle" glow="white" size={300} style={{ position: "absolute", top: "-10%", right: "4%", opacity: 0.5, pointerEvents: "none" }} />
      <div className="container">
        <Reveal><Eyebrow color="var(--sienna-glow)">Hallo</Eyebrow></Reveal>
        <Reveal delay={80}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", lineHeight: 1.22, letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "20px 0 0", maxWidth: "20ch" }}>
            Ich bin Mika. Ich mache Werkstoffe messbar — und erklärbar.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "24px 0 0", maxWidth: "54ch" }}>
            Werkstoffwissenschaft, Mess- und Sensortechnik, zerstörungsfreie Prüfung: Mich fasziniert, was im Mikrometerbereich passiert, lange bevor ein Bauteil in Serie geht. Ich messe genau, halte Prozesse sauber und sage, was die Daten wirklich hergeben.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "16px 0 0", maxWidth: "54ch" }}>
            Diese Seite ist kein Lebenslauf zum Überfliegen — sie ist eine kurze Erzählung. Bleiben Sie einen Moment, es lohnt sich.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

window.SECTIONS_A = { Hero, Intro, EXPERIENCE, EDUCATION, ENGAGEMENT, SKILLS };
