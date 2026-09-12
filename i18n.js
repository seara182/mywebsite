/* ============================================================
   i18n.js — translation data + language resolution
   Loaded first, before React/Babel, on every PUBLIC page.
   Never include this script on /private/* pages.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- environment guards ----------
     This file is loaded both in the browser AND in Node during the build-time
     prerender (build.mjs). Browser-only globals must be probed before use. */
  var HAS_WINDOW = typeof window !== "undefined";
  var HAS_DOCUMENT = typeof document !== "undefined";
  function safeStorage() { try { return HAS_WINDOW && window.localStorage; } catch (e) { return null; } }

  /* ---------- Google Translate / React reconciliation guard ----------
     Google Translate rewrites live text nodes by wrapping them in extra
     <font>/<span> tags. Any later React re-render that touches those nodes
     (ResizeObserver-driven layout, scroll reveals, the lang-switcher fade,
     etc.) makes the reconciler try to remove/reorder nodes Translate has
     already replaced, throwing NotFoundError and wiping the translation.
     Swallowing just that mismatch keeps hydration/updates working normally
     for everyone else. */
  if (HAS_DOCUMENT && typeof Node === "function" && Node.prototype) {
    var origRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child.parentNode !== this) {
        if (typeof console !== "undefined") console.warn("removeChild mismatch ignored (likely Google Translate)", child);
        return child;
      }
      return origRemoveChild.apply(this, arguments);
    };
    var origInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, refNode) {
      if (refNode && refNode.parentNode !== this) {
        if (typeof console !== "undefined") console.warn("insertBefore mismatch ignored (likely Google Translate)", refNode);
        return newNode;
      }
      return origInsertBefore.apply(this, arguments);
    };
  }

  /* ---------- Step 3b: first-visit auto-redirect (runs immediately) ----------
     Records the navigator language preference on first visit. Real per-language
     routing is now URL-based (see getLang); this only seeds a remembered choice. */
  var _ls = safeStorage();
  if (_ls && !_ls.getItem("lang")) {
    var userLang = ((HAS_WINDOW && (navigator.language || navigator.userLanguage)) || "").toLowerCase();
    if (userLang.indexOf("fr") === 0) _ls.setItem("lang", "fr");
    else if (userLang.indexOf("en") === 0) _ls.setItem("lang", "en");
    else if (userLang.indexOf("es") === 0) _ls.setItem("lang", "es");
    else if (userLang.indexOf("it") === 0) _ls.setItem("lang", "it");
    // de or anything else: no-op, German is the natural fallback
  }

  var LANGUAGES = [
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
  ];

  var TRANSLATIONS = {
    de: {
      meta: {
        title: "Mika Jeske — Werkstoffwissenschaft & Messtechnik",
        description: "Mika Jeske, Werkstoffwissenschaftler (B.Sc.) mit Fokus auf Messtechnik, Sensorik und zerstörungsfreie Prüfung. Ab Oktober 2026 Master in Metrologie und Messtechnik in Braunschweig; auf der Suche nach einer Werkstudentenstelle und nach Ehrenämtern.",
      },
      hero: { eyebrow: "Werkstoffwissenschaft · B.Sc.", scrollHint: "Scroll", aiImageLabel: "KI-bearbeitetes Bild" },
      intro: {
        eyebrow: "Moin.",
        headline: "Mein Name ist Mika: Werkstoffwissenschaftler mit Fokus auf Messtechnik.",
        p1: "Beim PC-Bau mit meinem Cousin Jack ging es irgendwann um Kupferkühlkörper und Diamant-Wärmeleitpaste. Er hat nicht gemerkt, dass er damit mitten in meinem Fach gelandet war. Genau das mag ich daran: Werkstoffwissenschaft steckt in Dingen, die man ohnehin in der Hand hält. Altglas, das wieder zur Flasche wird, gehört genauso dazu.",
        p2: "Präzise wird es für mich in der Messtechnik. Eine Zahl abzulesen ist einfach; zu beurteilen, ob sie stimmt, ist Handwerk. Im Oktober fange ich deshalb den Master in Metrologie und Messtechnik in Braunschweig an. Ein Rasterelektronenmikroskop habe ich zu Hause nicht; also baue ich nebenher diese Website und eigene Projekte, um beim Programmieren und beim Darstellen von Daten weiterzukommen.",
        photos: [
          "Eingeladen zur DGZfP in Magdeburg; als Teil des Awards",
        ],
      },
      nav: { werkstudent: "Werkstudent", ehrenamt: "Ehrenamt", lebenslauf: "Lebenslauf", projekt: "Projekt", skipLabel: "Zum Abschnitt springen" },
      seeking: {
        eyebrow: "Was ich suche",
        heading: "Werkstudent neben dem Master",
        rows: [
          { k: "Stelle", v: "Werkstudent, ab Oktober 2026" },
          { k: "Ort", v: "Braunschweig und Umgebung" },
          { k: "Umfang", v: "Bis 20 Stunden pro Woche neben dem Studium" },
          { k: "Themen", v: "Messtechnik, Sensorik, Dünnschichttechnik, ZfP" },
          { k: "Ehrenamt", v: "THW, Beratung, Jugendarbeit; auch am neuen Ort" },
        ],
        cta: "Mein LinkedIn",
      },
      story: {
        eyebrow: "Mein Weg",
        heading: "Wie ich im Kleinen gelandet bin",
        p1: "Physik und Chemie haben mich schon in der Schule gepackt, reine Theorie aber nie gereizt. Eine Weile stand Pharmazie im Raum; bei uns Familiensache. Dann kam die Werkstoffwissenschaft dazwischen, genau der praktische Brückenschlag, den ich gesucht hatte.",
        p2: "Gefangen hat mich der Mikro- und Nanobereich: filigran, hochpräzise, fast schon ästhetisch. Ich habe lange auf Turnierniveau getanzt, und die Parallele meine ich ernst; aufgefallen ist sie übrigens einem Professor. Beides verlangt Kontrolle und Eleganz im Detail. Vom Parkett über Dünnschichten bis in die Messtechnik zieht sich das durch.",
        figure: {
          x: "Temperatur (°C)",
          y: "Seebeck-Koeffizient (µV/K)",
          caption: "Relativer Seebeck-Koeffizient gesputterter Dünnschichten über die Temperatur; Nickel ist negativ, Silber und Aluminium positiv. Aus meiner Bachelorarbeit.",
        },
        figure2: {
          x: "Zeit (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Bismut ist normalerweise ein PTC-Leiter; als gesputterte polykristalline Dünnschicht kehrt sich das um. Ein Korngrenzeneffekt, den meine Bachelorarbeit berührt hat.",
        },
      },
      cleanroomTear: {
        intro: "Die nüchternste Zeile in diesem Lebenslauf war für mich die spannendste Zeit. Ein Blick unter die Oberfläche:",
        label: "Reinraum aufreißen",
        eyebrow: "ZMN · Zentrum für Mikro- und Nanotechnik",
        heading: "Unter der Oberfläche, im ISO-2-Reinraum",
        p1: "Ein halbes Jahr im ISO-2-Reinraum der TU Ilmenau: Magnetron-Sputtern, Profilometrie, REM/EDX, TiOₓ-Dünnschichten. Der Kontrast ist fast absurd; eine bis ins Letzte kontrollierte Umgebung, und mittendrin Proben unter einem Quadratmillimeter, die sich partout nicht so verhalten wollen, wie sie sollen.",
        p2: "Ehrlich gesagt war es großartig dort. Endlich das tun, dessen Theorie ich gelernt hatte, mit diesem Gefühl von echter Wissenschaft, wie man sich als Kind „Forschung“ vorstellt.",
        p3: "Konkret: Ag-, Al-, Ni- und Bi-Schichten, der TFA-Aufbau, temperaturabhängige Transportmessungen. Sie bilden die Grundlage meiner Bachelorarbeit.",
        photos: ["Sputterkammer; Schichtwachstum im Vakuum", "ISO-2-Reinraum, voll vermummt", "Profilometrie; Schichtdicke nachmessen", "Proben, kleiner als ein Fingernagel"],
      },
      confiTear: {
        intro: "Die offene Jugendarbeit hat mich mehr geprägt als so manche Vorlesung. Was wirklich dahintersteckt:",
        label: "Mehr über meine Jugendarbeit erfahren:",
        teaser: "Ich habe mehrere Jahre lang Jugendliche durch Konfirmation und Freizeiten begleitet, und diese Erfahrungen prägen mich bis heute.",
        eyebrow: "EKM Ilmenau · Konfi- & Jugendarbeit",
        heading: "Sehen und gesehen werden",
        p1: "Über mehrere Jahre habe ich Gruppen in der Konfi- und offenen Jugendarbeit der Evangelischen Kirche in Ilmenau geleitet. Die eigentliche Aufgabe verrät einem vorher keiner: ansprechbar bleiben, während Jugendliche Glauben, Zweifel und das ganz normale Erwachsenwerden für sich sortieren. An Tagen, die bei mir selbst viel Luft nach oben hatten, kam oft jemand mit eigenen Themen. Mich dann komplett zurückzunehmen hat am Ende des Tages öfter mich sortiert als den anderen.",
        p2: "Für meine eigene Haltung war die Arbeit mit Kindern prägend. Wer erwartet, dass Jugendliche aus sich herausgehen, muss im Lager als Erster im schrägen Kostüm dastehen. Wer dafür zu befangen ist, bekommt es von niemandem zurück. Angstfrei vorangehen und das Verhalten vorleben, das man von anderen erwartet; das prägt mein Verständnis von Zusammenarbeit bis heute, weit über die Jugendarbeit hinaus.",
        photos: ["Ausnahmsweise mal vor der Kamera", "Mittendrin", "Abendprogramm auf Freizeit"],
      },
      reunion: {
        eyebrow: "Nebenbei",
        heading: "Ein Wiedersehen planen",
        p1: "Nebenbei betreue ich {{site}}, die Seite zum Abitreffen meines Jahrgangs. Es gibt eine Karte, die zeigt, wie weit wir uns inzwischen verteilt haben und wie sehr die Wurzeln trotzdem bleiben, dazu einen Countdown aus reiner Vorfreude und ein Kontaktformular, über das man sich meldet.",
        p2: "Die alten Schulfarben habe ich bewusst genommen, das fühlte sich einfach richtig an. Am liebsten schreibe ich den Jahrgangs-Newsletter; die Antworten, die zurückkommen, sind immer wieder wundervolle Einblicke.",
        linkLabel: "ggi-abitur2022.de",
        pins: ["Planung", "Connection", "GGI"],
      },
      resume: {
        kicker: "Lebenslauf", title: "Beruflicher Werdegang",
        experienceHeading: "Berufserfahrung", educationHeading: "Bildungsweg",
        skillsEyebrow: "Kompetenzen", awardLabel: "Auszeichnung",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Praktikant Industrial Engineering", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualifizierung eines Betriebsmittels für den Serieneinsatz; Versuchsplanung, Prozesskontrolle und Prozessautomatisierung", "Evaluation und Beschaffung von Viskosimeter-Systemen mit eigenständigen Messreihen und Beschaffungsempfehlung", "Charakterisierung bleifreier Pastenalternativen mittels optischer Mikroskopie und Röntgenografie", "Neu entwickeltes Pastenmischer-Gerät gemeinsam mit der Fertigung eingeführt; inzwischen im Einsatz auf 100 % der relevanten Produktionsschritte"] },
        { role: "Wissenschaftlicher Assistent", org: "Zentrum für Mikro- und Nanotechnik · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Sputter-Abscheidung metallischer Dünnschichten (Al, Ag, Ti, Si) und Strukturierung per Lift-off im Reinraum", "Profilometrie, REM-Topografieanalyse und elektrische Charakterisierung (Van-der-Pauw)"] },
      ],
      education: [
        { role: "M.Sc. Metrologie und Messtechnik", org: "Technische Universität Braunschweig", period: "ab 10.2026", accent: true,
          points: ["Vertiefungsrichtung Sensorik und Messprinzipien; knüpft direkt an die Bachelorarbeit zu gesputterten Dünnschichten an", "Basisteil Metrologie: Messdatenauswertung und messtechnische Statistik", "Enge Anbindung an die Physikalisch-Technische Bundesanstalt als nationales Metrologieinstitut"] },
        { role: "B.Sc. Werkstoffwissenschaft · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Schwerpunkt metallische Werkstoffe, Dünnschichttechnik und Fertigungsverfahren", "Bachelorarbeit: Temperaturabhängige elektrische Eigenschaften gesputterter Dünnschichten (Note 1,0)", "Nominierung für die Studienstiftung des deutschen Volkes"] },
        { role: "Allgemeine Hochschulreife · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        eyebrow: "Ehrenamt", heading: "Engagement, das mir wichtig ist",
        photos: [
          "Anti-Rassismus-Workshop an einer Grundschule",
          "Vorbesprechung unseres Podcasts zum Studentenkino-Programm",
        ],
      },
      engagement: [
        { role: "Helfer in Grundausbildung", org: "Technisches Hilfswerk · OV Friedrichshafen", period: "seit 10.2025", accent: true,
          points: ["Grundausbildung im Zivil- und Katastrophenschutz im Team, mit Ausrichtung auf Fachberatung CBRN-Abwehr"] },
        { role: "Telefonberater · Nummer gegen Kummer", org: "Kinderschutzbund · Friedrichshafen", period: "seit 02.2026",
          points: ["Ausbildung zur telefonischen Beratung für Kinder und Jugendliche in Krisensituationen", "Aktive Beratung auf systemisch-psychologischer Grundlage"] },
        { role: "Ehrenamtliche Gruppenleitung", org: "Evangelische Kirche Mitteldeutschland · Ilmenau", period: "seit 2022",
          points: ["Mehrjährige Gruppenleitung im mehrköpfigen Leitungsteam für Konfirmations- und offene Jugendarbeit", "Nach dem Umzug: Ansprechpartner, Eventplanung und Koordination im Team der Ehrenamtlichen", "Gemeinsam mit dem Leitungsteam Freizeiten und Events mit über 150 Teilnehmenden geleitet"] },
        { role: "Gewähltes Mitglied der Studierendenvertretung", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Studienausschuss im Universitätssenat; gemeinsam mit dem Gremium Hochschulpolitik und Studienordnungen mitgestaltet", { html: 'Mitgestalter <a href="https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Wahl-O-Mat zur Thüringer Landtagswahl 2024</a> (bpb · MDR)' }] },
      ],
      skills: [
        { group: "Materialanalyse", items: ["REM / SEM", "Röntgenografie", "Profilometrie", "Gefügeanalyse", "Dünnschichttechnik", "Viskosimetrie"] },
        { group: "Methoden", items: ["Werkstoffcharakterisierung", "Reinraumarbeit", "Versuchsplanung", "Qualitätsprüfung", "Prozessautomatisierung"] },
        { group: "Software", items: ["LaTeX", "KI-Tools", "MS Office", "SAP", "FreeCAD"] },
        { group: "Sprachen", items: ["Deutsch (Muttersprache)", "Englisch (verhandlungssicher)"] },
      ],
      projects: {
        kicker: "Projekt", title: "CheapSeats",
        description: "CheapSeats ist ein Desktop-Scoreboard für Windows, das beliebige der 32 NFL- und 30 MLB-Teams verfolgt. Es zeigt Live-Play-by-Play eines laufenden Spiels und den Anstoß des nächsten, mit Benachrichtigungen bei Kickoff und Spielstand-Änderungen sowie Links zu Highlight-Clips der offiziellen Liga-YouTube-Kanäle. Die Daten stammen aus der öffentlichen JSON-API von ESPN; Teamauswahl und ein Spielstand-Cache werden lokal gespeichert, sodass beim Start der letzte bekannte Stand erscheint. Vertrieb und Auto-Updates laufen über den Microsoft Store. Die Oberfläche ist auf Englisch und Deutsch, ohne Konto und ohne Telemetrie.",
        features: ["Live-Tracking", "Benachrichtigungen", "Player-Spotlight", "Lineup-Diagramm", "Standings & Venue", "History & Playoffs", "Roster mit Filter"],
        stack: ["Tauri 2 · Rust", "React 19 · TS", "Vite 7", "ESPN JSON-API", "i18next EN/DE"],
        cta: "CheapSeats ansehen",
      },
      footer: {
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email: "E-Mail schreiben", phone: "Anrufen",
        emailAria: "E-Mail an Mika Jeske schreiben", phoneAria: "Mika Jeske anrufen",
        legal: "Impressum & Datenschutz",
        disclaimer: "Das Porträtbild sowie einzelne Textpassagen und die Übersetzungen dieser Seite wurden mit KI-Unterstützung erstellt bzw. überarbeitet und von mir inhaltlich geprüft. Maßgeblich ist die deutsche Fassung.",
        privacyNote: "Einzelne Personen wurden aus Datenschutz- oder rechtlichen Gründen unkenntlich gemacht.",
      },
      contact: { chip: "Kontakt aufnehmen" },
      langSwitcher: { selectLabel: "Sprache wählen", globeAria: "Sprache auswählen", optionAria: "{lang} auswählen" },
      sports: {
        nav: { features: "Funktionen", deepDive: "Einblicke", mobile: "Mobil", tech: "Technik", updates: "Updates", download: "Jetzt herunterladen" },
        backLink: "Startseite", madeBy: "Made by Mika", eyebrow: "Projekt", title: "CheapSeats",
        heroSub: "Ein persönliches Sport-Dashboard als native Desktop-App für Windows; gebaut für den kurzen Blick beim Hochfahren. Der Cache zeigt sofort relevante Daten, während im Hintergrund frische Stände nachgeladen werden. Jedes der 32 NFL- bzw. 30 MLB-Teams lässt sich frei wählen; einen festen Standard gibt es nicht.",
        dashboardK: "Dashboard", dashboardV: "Nächstes Spiel, Player-Spotlight und Aufstellung; alles auf einen Blick, sobald die App startet.",
        featuresLabel: "Funktionen", featuresHeading: "Was die App kann",
        featuresLede: "Jeder Endpunkt wird unabhängig abgerufen; fällt einer aus, bleiben die übrigen Bereiche funktionsfähig. Fehlende oder fehlerhafte Daten werden zu „—“ statt zu einem Absturz.",
        features: [
          { title: "Live-Dashboard", desc: "Hero-Karte zum nächsten Spiel mit Gegner, Anstoßzeit, Spielort und TV-Sender; inklusive Countdown bis zum Kickoff." },
          { title: "Live-Tracking", desc: "Echtzeit-Play-by-Play bei laufenden Spielen: aktuelles Inning bzw. Viertel, Spielstand, Down-Distance bzw. Ball-Strike-Zähler und eine Timeline der Scoring-Plays." },
          { title: "Benachrichtigungen", desc: "Taskleisten-Blinken im Fokus, Toast beim Minimieren; einmalige Erinnerung zu Anstoß oder erstem Wurf, optionale Spielstand-Alerts, gedrosselt auf ein Update alle 5 Sekunden." },
          { title: "Player-Spotlight", desc: "Automatisch gewählte Schlüsselspieler-Karte (QB bzw. Starting Pitcher) mit Saisonwerten und Trend gegenüber dem Karrieremittel." },
          { title: "Formations-Diagramm", desc: "Visuelle Aufstellung auf Feld oder Diamond, angepasst an die Sportart; Offense-Gruppen im Football, Feldpositionen im Baseball." },
          { title: "Division-Tabelle", desc: "Vollständige Standings mit W/L, Heim/Auswärts, Run-Differential und Streak; plus Glossar-Tooltips für jede Abkürzung." },
          { title: "Venue & History", desc: "Stadiondaten (Baujahr, Kapazität, Maße, Belag) neben kuratierter Saisonhistorie: Trendkurven, Meistertitel, All-Time-Rekorde." },
          { title: "Roster & Playoffs", desc: "Filterbare Kaderliste nach Positionsgruppe, suchbar nach Name und Nummer; plus automatische Playoff-Brackets in der Postseason." },
        ],
        historyLabel: "Tiefe statt Oberfläche", historyHeading: "History, die Geschichten erzählt",
        historyDesc: "Die History-Ansicht verdichtet Jahrzehnte in wenige Blicke: eine Win/Loss-Trendkurve über die letzten Saisons, die Meistertitel als Banner-Reihe und die Team-ERA der jüngsten Jahre als Balken.",
        historyTicks: ["Trendkurve mit markierten Playoff- und Championship-Saisons", "All-Time-Wins, beste Modern-Season, längste Siegesserie", "Dunkles, team-gefärbtes Thema; bewusst abgesetzt vom hellen Dashboard"],
        teamLabel: "Dein Team, deine Sprache", teamHeading: "Für beide Ligen gebaut",
        teamDesc: "NFL und MLB teilen sich dieselbe Oberfläche; der Team-Selektor wechselt zwischen allen 62 Teams, die Glossare und Diagramme passen sich der Sportart an. Einstellungen für Sprache (DE/EN), Theme und Standardteam sind ein Klick entfernt.",
        teamTicks: ["Zweisprachig über i18next, mit sportartspezifischen Glossaren", "Light- und Dark-Theme, team-gefärbte Akzente", "Demo-Modus zum Testen ohne Netzwerk"],
        everywhereLabel: "Überall zu Hause", everywhereHeading: "Läuft auf Handy, Mac und Windows",
        everywhereLede: "Dieselbe defensive Architektur, dieselben Daten; responsiv vom Desktop bis aufs Telefon. Die Seitennavigation merkt sich die Scroll-Position, sodass sich Bereiche sofort anspringen lassen.",
        techLabel: "Unter der Haube", techHeading: "Technisches Fundament",
        techLede: "Cache-first und ausfallsicher: Daten sind beim ersten Start sichtbar, jeder API-Aufruf läuft isoliert, und Updates kommen über den Microsoft Store.",
        spec: [
          { dt: "Plattform", dd: "<strong>Tauri 2</strong> auf Rust-Basis für native, plattformübergreifende Performance; ein Binary für Windows, macOS und mobile Layouts." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, kompiliert mit <strong>Vite 7</strong>. Komponentenbasiert, typsicher, schnell im Build." },
          { dt: "Architektur", dd: "Defensiv gedacht: jeder Endpunkt wird unabhängig gefetcht, ein Ausfall kaskadiert nicht. Fehlende Daten werden zu <strong>„—“</strong> statt zum Crash." },
          { dt: "Daten & Offline", dd: "Live-Daten aus der öffentlichen <strong>ESPN-JSON-API</strong>, persistent gecacht. Offline nutzbar, mit Demo-Modus für Tests ohne Netz." },
          { dt: "Sprache", dd: "<strong>i18next</strong> mit Deutsch/Englisch und sportartspezifischen Glossaren; Tooltips erklären jede Abkürzung." },
          { dt: "Updates", dd: "Automatische Auslieferung über den <strong>Microsoft Store</strong>; kein separater Installer, keine manuellen Updates." },
        ],
        designLabel: "Designphilosophie",
        designText: "Die App ist auf <strong style=\"color:var(--heading);font-weight:600\">geringe kognitive Last</strong> und schnelles Scannen ausgelegt. Der Cache-first-Ansatz macht Daten beim Start sofort sichtbar; die Seitennavigation mit Scroll-Tracking lässt zwischen Bereichen springen. Tooltips erklären durchgehend die Fachbegriffe; auch für alle, die mit US-Sport (noch) nicht vertraut sind.",
        comingBadge: "Microsoft Store", comingText: "CheapSeats wird ausschließlich über den Microsoft Store vertrieben.",
        comingSoon: "Bald verfügbar",
        githubBtn: "Jetzt im Microsoft Store", backFooter: "Zurück zur Startseite", madeByFooter: "CheapSeats · Made by Mika",
        screenshotNote: "Die Screenshots auf dieser Seite stammen aus der Entwicklung und können vom aktuellen Stand der App abweichen.",
        updateBanner: {
          pill: "Neu",
          ticker: "CheapSeats v1.1 ist da: Live-Tracking, Benachrichtigungen und der offizielle Microsoft-Store-Release +++ App Store und Play Store folgen in Kürze +++ Versprochen: CheapSeats bleibt zu 100 % kostenlos +++",
          cta: "Was ist neu →",
        },
        changelogLabel: "Versionsverlauf", changelogHeading: "Was sich getan hat",
        changelogLede: "Ein kurzer Rückblick auf die bisherigen Releases - ohne Datumsangabe, damit er nicht veraltet wirkt.",
        changelog: {
          v11: {
            tag: "v1.1 · Aktuell", title: "Live-Tracking, Benachrichtigungen & Microsoft Store",
            items: [
              "Live-Tracking: Echtzeit-Play-by-Play, aktuelles Inning/Viertel, Down-Distance bzw. Ball-Strike-Zähler und eine Scoring-Play-Timeline",
              "Benachrichtigungen: Taskleisten-Blinken, Toast beim Minimieren, Kickoff-Erinnerung und optionale Spielstand-Alerts",
              "Offizieller Release im Microsoft Store: signierte Auto-Updates, kein Installer, kein UAC-Prompt",
              "Team-Auswahl bleibt über Neustarts hinweg erhalten, Autostart mit Windows",
              "Rund 40 % schnellerer Start bei kaltem Cache",
            ],
          },
          v10: {
            tag: "v1.0 · Erstveröffentlichung", title: "Der Grundstein",
            items: [
              "Dashboard mit nächstem/letztem Spiel, Countdown und Head-to-Head-Vorschau",
              "Player-Spotlight mit Saisonwerten und Trend gegenüber der Karrierebilanz",
              "Formations-Diagramm für NFL und MLB",
              "Vollständige Standings mit Glossar-Tooltips für jede Abkürzung",
              "Venue- und History-Ansicht mit Meistertiteln und All-Time-Rekorden",
              "Durchsuchbares Roster und automatische Playoff-Brackets",
              "Zweisprachig EN/DE, Light-/Dark-Theme, Demo-Modus",
            ],
          },
        },
      },
    },

    en: {
      meta: {
        title: "Mika Jeske — Materials Science & Measurement",
        description: "Mika Jeske, materials scientist (B.Sc.) focused on measurement technology, sensor technology and non-destructive testing. Starting the Master in Metrology and Measurement Technology in Braunschweig in October 2026; looking for a working-student role and for volunteer work.",
      },
      hero: { eyebrow: "Materials Science · B.Sc.", scrollHint: "Scroll", aiImageLabel: "AI-edited image" },
      intro: {
        eyebrow: "Hey.",
        headline: "My name is Mika: a materials scientist focused on measurement.",
        p1: "Building a PC with my cousin Jack, we ended up on copper heatsinks and diamond thermal paste. He had no idea he had landed in the middle of my field. That is what I like about it: materials science sits inside things you are already holding. Waste glass melted back into bottles counts too.",
        p2: "Measurement is where it gets precise for me. Reading a number is easy; judging whether it is right is a craft. So in October I start the Master in Metrology and Measurement Technology in Braunschweig. I do not have a scanning electron microscope at home; so alongside it I build this site and my own projects, to get further with programming and with presenting data.",
        photos: [
          "Invited to the DGZfP in Magdeburg; part of the award",
        ],
      },
      nav: { werkstudent: "Working student", ehrenamt: "Volunteering", lebenslauf: "CV", projekt: "Project", skipLabel: "Skip to section" },
      seeking: {
        eyebrow: "What I am looking for",
        heading: "A working-student role alongside the Master",
        rows: [
          { k: "Role", v: "Working student, from October 2026" },
          { k: "Where", v: "Braunschweig and the surrounding area" },
          { k: "Hours", v: "Up to 20 hours a week alongside the degree" },
          { k: "Fields", v: "Measurement, sensors, thin films, NDT" },
          { k: "Volunteering", v: "THW, helpline work, youth work; in the new city too" },
        ],
        cta: "My LinkedIn",
      },
      story: {
        eyebrow: "My Path",
        heading: "How I ended up in the small scale",
        p1: "Physics and chemistry gripped me back in school, but pure theory never tempted me. For a while pharmacy was on the table; a family tradition of ours. Then materials science came along, exactly the practical bridge I had been looking for.",
        p2: "What captured me was the micro- and nano-scale world: fine, highly precise, almost aesthetic. I danced at competition level for a long time, and I mean the parallel seriously; a professor spotted it before I did. Both demand control and elegance in the detail. From the dance floor through thin films and into measurement, that runs all the way through.",
        figure: {
          x: "Temperature (°C)",
          y: "Seebeck coefficient (µV/K)",
          caption: "Relative Seebeck coefficient of sputtered thin films vs. temperature; nickel is negative, silver and aluminium positive. From my Bachelor's thesis.",
        },
        figure2: {
          x: "Time (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Bismuth is normally a PTC conductor; but sputtered as a polycrystalline thin film, it inverts to NTC. A grain-boundary effect that my Bachelor's thesis touched upon.",
        },
      },
      cleanroomTear: {
        intro: "The driest line in this résumé was, for me, the most exciting stretch of time. A look beneath the surface:",
        label: "Tear open the cleanroom",
        eyebrow: "ZMN · Center for Micro- and Nanotechnology",
        heading: "Beneath the surface, in the ISO‑2 cleanroom",
        p1: "Half a year in the ISO 2 cleanroom at TU Ilmenau: magnetron sputtering, profilometry, SEM/EDX, TiOₓ thin films. The contrast is almost absurd; an environment controlled down to the last detail, and in the middle of it samples smaller than a square millimetre that flatly refuse to behave the way they should.",
        p2: "Honestly, it was great in there. Finally doing the thing whose theory I had learned, with that feeling of real science, the way you imagine research as a child.",
        p3: "Concretely: Ag, Al, Ni and Bi films, the TFA setup, temperature-dependent transport measurements. They are the basis of my bachelor’s thesis.",
        photos: ["Sputtering chamber; film growth under vacuum", "ISO‑2 cleanroom, fully suited up", "Profilometry; measuring film thickness", "Samples smaller than a fingernail"],
      },
      confiTear: {
        intro: "A volunteer role shrinks fast to two lines on a résumé. There's a lot more behind this one:",
        label: "Learn more about my youth work:",
        teaser: "For several years I guided teenagers through confirmation and camps, and those years still shape how I lead today.",
        eyebrow: "EKM Ilmenau · Confirmation & Youth Work",
        heading: "Seeing and being seen",
        p1: "For several years I led groups in the confirmation and open youth work of the Protestant Church in Ilmenau. Nobody tells you the actual job in advance: staying approachable while young people sort out faith, doubt and the ordinary business of growing up. On days when I had plenty of room for improvement myself, someone would often come to me with something of their own. Stepping back completely in those moments sorted me out more often than it sorted them.",
        p2: "Working with children shaped my own attitude too. Anyone who expects young people to come out of their shell has to be the first at camp in the ridiculous costume. Anyone too self-conscious for that gets nothing back. Going first without fear, and living out the behaviour you expect from others; that shapes how I think about working together, far beyond youth work.",
        photos: ["For once, in front of the camera", "Right in the middle of it", "Evening programme on a youth camp"],
      },
      reunion: {
        eyebrow: "On the Side",
        heading: "Planning a reunion",
        p1: "On the side, I run {{site}}, the site for my graduating class's reunion. There's a map showing how far we've all scattered since; and how much the roots still hold; plus a countdown built from pure anticipation, and a contact form for getting in touch.",
        p2: "I deliberately kept the old school colours; it just felt right. My favourite part is writing the year-group newsletter; the replies that come back are, time and again, wonderful glimpses.",
        linkLabel: "ggi-abitur2022.de",
        pins: ["Planning", "Connection", "GGI"],
      },
      resume: {
        kicker: "Résumé", title: "Professional Background",
        experienceHeading: "Work Experience", educationHeading: "Education",
        skillsEyebrow: "Skills", awardLabel: "Award",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Industrial Engineering Intern", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualifying production equipment for series deployment; test planning, process control and process automation", "Evaluating and sourcing viscometer systems through independent test series and a procurement recommendation", "Characterising lead-free paste alternatives using optical microscopy and X-ray imaging", "Introduced a newly developed paste-mixer device together with production; now deployed across 100% of the relevant production steps"] },
        { role: "Research Assistant", org: "Center for Micro- and Nanotechnology · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Sputter deposition of metallic thin films (Al, Ag, Ti, Si) and lift-off patterning in the cleanroom", "Profilometry, SEM topography analysis and electrical characterisation (van der Pauw)"] },
      ],
      education: [
        { role: "M.Sc. Metrology and Measurement Technology", org: "Technische Universität Braunschweig", period: "from 10.2026", accent: true,
          points: ["Specialisation in sensor technology and measurement principles; a direct continuation of the bachelor's thesis on sputtered thin films", "Metrology core: measurement data evaluation and metrological statistics", "Closely tied to the Physikalisch-Technische Bundesanstalt, Germany's national metrology institute"] },
        { role: "B.Sc. Materials Science · 2.0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Focus on metallic materials, thin-film technology and manufacturing processes", "Bachelor's thesis: Temperature-dependent electrical properties of sputtered thin films (grade 1.0)", "Nominated for the German National Academic Foundation (Studienstiftung)"] },
        { role: "German university entrance qualification (Abitur) · 1.8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        eyebrow: "Volunteering", heading: "Engagement that matters to me",
        photos: [
          "Anti-racism workshop at a primary school",
          "Planning our podcast on the student-cinema programme",
        ],
      },
      engagement: [
        { role: "Volunteer, Basic Training", org: "Technisches Hilfswerk · OV Friedrichshafen", period: "since 10.2025", accent: true,
          points: ["Basic training in civil and disaster protection as part of a team, with a focus on CBRN defence advisory work"] },
        { role: "Telephone Counsellor · Kids' Helpline", org: "Kinderschutzbund · Friedrichshafen", period: "since 02.2026",
          points: ["Trained in telephone counselling for children and young people in crisis situations", "Active counselling grounded in systemic psychology"] },
        { role: "Volunteer Group Leader", org: "Protestant Church in Central Germany · Ilmenau", period: "since 2022",
          points: ["Several years leading groups as part of a multi-person leadership team, in confirmation classes and open youth work", "After relocating: contact person, event planning and coordination within the volunteer team", "Led camps and events together with the leadership team, with over 150 participants"] },
        { role: "Elected Student Representative", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Academic affairs committee in the university senate; helped shape higher-education policy and study regulations together with the committee", { html: 'Co-developed the <a href="https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Wahl-O-Mat voting-aid tool for the 2024 Thuringia state election</a> (bpb · MDR)' }] },
      ],
      skills: [
        { group: "Material Analysis", items: ["SEM", "X-ray imaging", "Profilometry", "Microstructure analysis", "Thin-film technology", "Viscometry"] },
        { group: "Methods", items: ["Materials characterisation", "Cleanroom work", "Experimental design", "Quality testing", "Process automation"] },
        { group: "Software", items: ["LaTeX", "AI tools", "MS Office", "SAP", "FreeCAD"] },
        { group: "Languages", items: ["German (native)", "English (business fluent)"] },
      ],
      projects: {
        kicker: "Project", title: "CheapSeats",
        description: "CheapSeats is a desktop scoreboard for Windows that follows any of the 32 NFL and 30 MLB clubs you select. It shows live play-by-play for a running game and the start time of the next one, with notifications at kickoff and on score changes, plus links to highlight clips from the official league YouTube channels. Data comes from ESPN's public JSON API; team selection and a score cache are stored locally, so the last known state appears at launch. Distributed and auto-updated through the Microsoft Store. The interface is in English and German, and there is no account and no telemetry.",
        features: ["Live tracking", "Notifications", "Player spotlight", "Lineup diagram", "Standings & venue", "History & playoffs", "Filterable roster"],
        stack: ["Tauri 2 · Rust", "React 19 · TS", "Vite 7", "ESPN JSON API", "i18next EN/DE"],
        cta: "View CheapSeats",
      },
      footer: {
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email: "Send an email", phone: "Call me",
        emailAria: "Send an email to Mika Jeske", phoneAria: "Call Mika Jeske",
        legal: "Legal notice & Privacy",
        disclaimer: "The portrait photo, some text passages, and the translations on this site were created or edited with AI assistance and reviewed by the author. The German version is authoritative.",
        privacyNote: "Some individuals have been blurred for privacy or legal reasons.",
      },
      contact: { chip: "Contact me now" },
      langSwitcher: { selectLabel: "Select Language", globeAria: "Select language", optionAria: "Select {lang}" },
      sports: {
        nav: { features: "Features", deepDive: "Close-ups", mobile: "Mobile", tech: "Tech", updates: "Updates", download: "Download now" },
        backLink: "Home", madeBy: "Made by Mika", eyebrow: "Project", title: "CheapSeats",
        heroSub: "A personal sports dashboard as a native desktop app for Windows; built for the quick glance at startup. The cache shows relevant data instantly while fresh scores load in the background. Any of the 32 NFL or 30 MLB teams can be chosen freely; there is no fixed default.",
        dashboardK: "Dashboard", dashboardV: "Next game, player spotlight and lineup; all at a glance the moment the app starts.",
        featuresLabel: "Features", featuresHeading: "What the app can do",
        featuresLede: "Every endpoint is fetched independently; if one fails, the rest of the app keeps working. Missing or malformed data becomes a “—” instead of a crash.",
        features: [
          { title: "Live Dashboard", desc: "A hero card for the next game with opponent, kickoff time, venue and broadcaster; including a countdown to kickoff." },
          { title: "Live Tracking", desc: "Real-time play-by-play while a game is in progress: current inning or quarter, score, down-distance or balls-strikes, and a timeline of scoring plays." },
          { title: "Notifications", desc: "Taskbar blink in focus, toast when minimized; a one-time reminder at kickoff or first pitch, opt-in score-change alerts, throttled to one update every 5 seconds." },
          { title: "Player Spotlight", desc: "An automatically selected key-player card (QB or starting pitcher) with season stats and a trend against career averages." },
          { title: "Formation Diagram", desc: "A visual lineup on field or diamond, adapted to the sport; offensive groupings in football, field positions in baseball." },
          { title: "Division Standings", desc: "Full standings with W/L, home/away, run differential and streak; plus glossary tooltips for every abbreviation." },
          { title: "Venue & History", desc: "Stadium data (year built, capacity, dimensions, surface) alongside a curated season history: trend charts, championships, all-time records." },
          { title: "Roster & Playoffs", desc: "A filterable roster by position group, searchable by name and number; plus automatic playoff brackets during the postseason." },
        ],
        historyLabel: "Depth Over Surface", historyHeading: "History that tells stories",
        historyDesc: "The history view condenses decades into a few glances: a win/loss trend line across recent seasons, championships as a row of banners, and recent team ERA as bars.",
        historyTicks: ["Trend line with playoff and championship seasons marked", "All-time wins, best modern-era season, longest win streak", "A dark, team-coloured theme; deliberately set apart from the light dashboard"],
        teamLabel: "Your Team, Your Language", teamHeading: "Built for both leagues",
        teamDesc: "NFL and MLB share the same interface; the team selector switches between all 62 teams, with glossaries and diagrams adapting to the sport. Language (DE/EN), theme and default-team settings are one click away.",
        teamTicks: ["Bilingual via i18next, with sport-specific glossaries", "Light and dark theme, with team-coloured accents", "A demo mode for testing without a network connection"],
        everywhereLabel: "At Home Everywhere", everywhereHeading: "Runs on phone, Mac and Windows",
        everywhereLede: "The same defensive architecture, the same data; responsive from desktop down to phone. The side navigation remembers scroll position, so sections can be jumped to instantly.",
        techLabel: "Under the Hood", techHeading: "Technical foundation",
        techLede: "Cache-first and fail-safe: data is visible from the very first launch, every API call runs in isolation, and updates arrive through the Microsoft Store.",
        spec: [
          { dt: "Platform", dd: "<strong>Tauri 2</strong> on a Rust foundation for native, cross-platform performance; a single binary for Windows, macOS and mobile layouts." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, built with <strong>Vite 7</strong>. Component-based, type-safe, fast to build." },
          { dt: "Architecture", dd: "Designed defensively: every endpoint is fetched independently, so a failure doesn't cascade. Missing data becomes <strong>“—”</strong> instead of a crash." },
          { dt: "Data & Offline", dd: "Live data from the public <strong>ESPN JSON API</strong>, persistently cached. Usable offline, with a demo mode for testing without a network." },
          { dt: "Language", dd: "<strong>i18next</strong> with German/English and sport-specific glossaries; tooltips explain every abbreviation." },
          { dt: "Updates", dd: "Automatic delivery through the <strong>Microsoft Store</strong>; no separate installer, no manual updates." },
        ],
        designLabel: "Design Philosophy",
        designText: "The app is designed for <strong style=\"color:var(--heading);font-weight:600\">low cognitive load</strong> and fast scanning. The cache-first approach makes data visible instantly on launch; side navigation with scroll-tracking lets you jump between sections. Tooltips consistently explain the terminology; including for anyone not (yet) familiar with US sports.",
        comingBadge: "Microsoft Store", comingText: "CheapSeats is distributed exclusively through the Microsoft Store.",
        comingSoon: "Coming soon",
        githubBtn: "Now on Microsoft Store", backFooter: "Back to home", madeByFooter: "CheapSeats · Made by Mika",
        screenshotNote: "Screenshots on this page are from development builds and may differ from the current version of the app.",
        updateBanner: {
          pill: "New",
          ticker: "CheapSeats v1.1 is here: live tracking, notifications and the official Microsoft Store release +++ App Store and Play Store releases in the works +++ Promise made: CheapSeats will stay 100% free +++",
          cta: "See what's new →",
        },
        changelogLabel: "Version History", changelogHeading: "What's changed",
        changelogLede: "A quick look back at past releases - no dates, so it never reads as stale.",
        changelog: {
          v11: {
            tag: "v1.1 · Current", title: "Live tracking, notifications & the Microsoft Store",
            items: [
              "Live tracking: real-time play-by-play, current inning/quarter, down-distance or balls-strikes, and a scoring-play timeline",
              "Notifications: taskbar blink, toast when minimized, a kickoff reminder and optional score-change alerts",
              "Official Microsoft Store release: signed auto-updates, no installer, no UAC prompt",
              "Team selection now persists across restarts, plus auto-start with Windows",
              "About 40% faster startup on a cold cache",
            ],
          },
          v10: {
            tag: "v1.0 · Initial release", title: "The foundation",
            items: [
              "Dashboard with the next/last game, a countdown, and a head-to-head preview",
              "Player spotlight with season stats and a trend against career averages",
              "Formation diagram for NFL and MLB",
              "Full standings with glossary tooltips for every abbreviation",
              "Venue and history view with championships and all-time records",
              "Searchable roster and automatic playoff brackets",
              "Bilingual EN/DE, light/dark theme, demo mode",
            ],
          },
        },
      },
    },

    fr: {
      meta: {
        title: "Mika Jeske — Science des matériaux & métrologie",
        description: "Mika Jeske, scientifique des matériaux (B.Sc.) spécialisé en métrologie, capteurs et contrôle non destructif. Master en métrologie et techniques de mesure à Brunswick à partir d’octobre 2026 ; à la recherche d’un poste d’étudiant salarié et de missions bénévoles.",
      },
      hero: { eyebrow: "Science des matériaux · B.Sc.", scrollHint: "Scroll", aiImageLabel: "Image retouchée par IA" },
      intro: {
        eyebrow: "Salut.",
        headline: "Je m’appelle Mika : scientifique des matériaux, spécialisé en métrologie.",
        p1: "En montant un PC avec mon cousin Jack, on a fini sur les dissipateurs en cuivre et la pâte thermique au diamant. Il ne savait pas qu’il venait d’atterrir en plein dans mon domaine. C’est ce qui me plaît : la science des matériaux se cache dans des objets qu’on a déjà en main. Le verre usagé refondu en bouteilles en fait partie.",
        p2: "C’est en métrologie que ça devient précis. Relever un chiffre est simple ; juger s’il est juste est un métier. En octobre je commence donc le master en métrologie et techniques de mesure à Brunswick. Je n’ai pas de microscope électronique à balayage chez moi ; alors je construis en parallèle ce site et mes propres projets, pour progresser en programmation et en présentation de données.",
        photos: [
          "Invité à la DGZfP à Magdebourg ; dans le cadre du prix",
        ],
      },
      nav: { werkstudent: "Étudiant salarié", ehrenamt: "Bénévolat", lebenslauf: "Parcours", projekt: "Projet", skipLabel: "Aller à la section" },
      seeking: {
        eyebrow: "Ce que je cherche",
        heading: "Un poste d’étudiant salarié en parallèle du master",
        rows: [
          { k: "Poste", v: "Étudiant salarié, à partir d’octobre 2026" },
          { k: "Lieu", v: "Brunswick et ses environs" },
          { k: "Volume", v: "Jusqu’à 20 heures par semaine en parallèle des études" },
          { k: "Domaines", v: "Métrologie, capteurs, couches minces, CND" },
          { k: "Bénévolat", v: "THW, écoute téléphonique, animation jeunesse ; sur place aussi" },
        ],
        cta: "Mon LinkedIn",
      },
      story: {
        eyebrow: "Mon parcours",
        heading: "Comment j'en suis venu à l'échelle microscopique",
        p1: "La physique et la chimie m’ont passionné dès le lycée, mais la théorie pure ne m’a jamais tenté. Un temps, la pharmacie a été envisagée ; une affaire de famille chez nous. Puis la science des matériaux est arrivée, exactement le pont pratique que je cherchais.",
        p2: "Ce qui m’a captivé, c’est le domaine micro- et nanométrique : fin, d’une grande précision, presque esthétique. J’ai longtemps dansé en compétition, et je prends ce parallèle au sérieux ; c’est un professeur qui l’a remarqué avant moi. Les deux exigent du contrôle et de l’élégance dans le détail. Du parquet aux couches minces jusqu’à la métrologie, cela traverse tout.",
        figure: {
          x: "Température (°C)",
          y: "Coefficient Seebeck (µV/K)",
          caption: "Coefficient Seebeck relatif de couches minces pulvérisées en fonction de la température ; le nickel est négatif, l'argent et l'aluminium positifs. Extrait de mon mémoire de licence.",
        },
        figure2: {
          x: "Temps (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Le bismuth est normalement un conducteur PTC ; mais pulvérisé en couche mince polycristalline, il s'inverse en NTC. Un effet de joints de grains que mon mémoire de licence a abordé.",
        },
      },
      cleanroomTear: {
        intro: "La ligne la plus sobre de ce CV a été, pour moi, la période la plus passionnante. Un regard sous la surface :",
        label: "Ouvrir la salle blanche",
        eyebrow: "ZMN · Centre de micro- et nanotechnologies",
        heading: "Sous la surface, dans la salle blanche ISO‑2",
        p1: "Six mois dans la salle blanche ISO‑2 de la TU Ilmenau : pulvérisation magnétron, profilométrie, MEB/EDX, couches minces de TiOₓ. Le contraste est presque absurde ; un environnement contrôlé jusqu’au moindre détail, et au milieu des échantillons de moins d’un millimètre carré qui refusent obstinément de se comporter comme ils le devraient.",
        p2: "Honnêtement, c’était formidable d’y travailler. Enfin faire ce dont j’avais appris la théorie, avec ce sentiment de science véritable, telle qu’on l’imagine enfant.",
        p3: "Concrètement : des couches d’Ag, d’Al, de Ni et de Bi, le dispositif TFA, des mesures de transport en fonction de la température. Elles constituent la base de mon mémoire de licence.",
        photos: ["Chambre de pulvérisation ; croissance de couches sous vide", "Salle blanche ISO‑2, intégralement équipé", "Profilométrie ; mesure de l'épaisseur des couches", "Échantillons plus petits qu'un ongle"],
      },
      confiTear: {
        intro: "Un engagement bénévole se réduit vite à deux lignes sur un CV. Il y a bien plus derrière celui-ci :",
        label: "En savoir plus sur mon animation jeunesse :",
        teaser: "Pendant plusieurs années, j'ai accompagné des jeunes en catéchèse et en camps, et ces années me marquent encore aujourd'hui.",
        eyebrow: "EKM Ilmenau · Catéchèse et animation jeunesse",
        heading: "Voir et être vu",
        p1: "Pendant plusieurs années, j’ai animé des groupes de catéchèse et d’animation jeunesse ouverte à l’Église protestante d’Ilmenau. Personne ne vous prévient de la véritable mission : rester accessible pendant que des jeunes démêlent foi, doutes et le simple fait de grandir. Les jours où mon propre moral laissait à désirer, quelqu’un venait souvent me voir avec ses propres sujets. Me mettre complètement de côté dans ces moments-là m’a recentré plus souvent que lui.",
        p2: "Le travail avec les enfants a façonné ma propre attitude. Celui qui attend des jeunes qu’ils sortent de leur coquille doit être le premier en costume ridicule au camp. Celui qui est trop gêné pour cela n’obtient rien en retour. Avancer sans crainte et incarner le comportement que l’on attend des autres ; cela façonne ma conception de la collaboration, bien au-delà de l’animation jeunesse.",
        photos: ["Exceptionnellement devant l'objectif", "En plein cœur de l'action", "Soirée animée pendant un camp"],
      },
      reunion: {
        eyebrow: "À côté",
        heading: "Organiser des retrouvailles",
        p1: "À côté, je m'occupe de {{site}}, le site des retrouvailles de ma promotion du baccalauréat. On y trouve une carte montrant à quel point nous nous sommes dispersés depuis, et combien les racines demeurent malgré tout, ainsi qu'un compte à rebours né d'une pure impatience et un formulaire de contact pour reprendre contact.",
        p2: "J'ai délibérément repris les anciennes couleurs de l'école ; cela me semblait tout simplement juste. Ce que je préfère, c'est rédiger la newsletter de la promotion ; les réponses qui reviennent sont, encore et encore, de merveilleux aperçus.",
        linkLabel: "ggi-abitur2022.de",
        pins: ["Organisation", "Connexion", "GGI"],
      },
      resume: {
        kicker: "Parcours", title: "Parcours professionnel",
        experienceHeading: "Expérience professionnelle", educationHeading: "Formation",
        skillsEyebrow: "Compétences", awardLabel: "Distinction",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Stagiaire en ingénierie industrielle", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualification d'un équipement de production pour un déploiement en série ; planification des essais, contrôle et automatisation des processus", "Évaluation et acquisition de systèmes viscosimétriques, avec séries de mesures menées de façon autonome et recommandation d'achat", "Caractérisation d'alternatives de pâtes sans plomb par microscopie optique et radiographie", "Introduction, avec la production, d'un nouveau dispositif mélangeur de pâte ; désormais déployé sur 100 % des étapes de production concernées"] },
        { role: "Assistant de recherche", org: "Centre de micro- et nanotechnologies · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Dépôt par pulvérisation cathodique de couches minces métalliques (Al, Ag, Ti, Si) et structuration par lift-off en salle blanche", "Profilométrie, analyse topographique par MEB et caractérisation électrique (méthode de van der Pauw)"] },
      ],
      education: [
        { role: "Master (M.Sc.) en métrologie et techniques de mesure", org: "Technische Universität Braunschweig", period: "à partir de 10.2026", accent: true,
          points: ["Spécialisation en capteurs et principes de mesure ; dans le prolongement direct du mémoire de licence sur les couches minces pulvérisées", "Tronc commun de métrologie : exploitation des données de mesure et statistiques métrologiques", "Lien étroit avec la Physikalisch-Technische Bundesanstalt, institut national allemand de métrologie"] },
        { role: "Licence (B.Sc.) en science des matériaux · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Spécialisation en matériaux métalliques, technologie des couches minces et procédés de fabrication", "Mémoire de licence : propriétés électriques en fonction de la température de couches minces pulvérisées (note 1,0)", "Nommé pour la Fondation nationale allemande pour les études (Studienstiftung)"] },
        { role: "Baccalauréat allemand (Abitur) · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        eyebrow: "Engagement bénévole", heading: "Un engagement qui me tient à cœur",
        photos: [
          "Atelier antiraciste dans une école primaire",
          "Préparation de notre podcast sur le programme du cinéma étudiant",
        ],
      },
      engagement: [
        { role: "Bénévole, formation de base", org: "Technisches Hilfswerk · OV Friedrichshafen", period: "depuis 10.2025", accent: true,
          points: ["Formation de base en protection civile et gestion des catastrophes en équipe, orientée vers le conseil spécialisé en défense NRBC"] },
        { role: "Conseiller téléphonique · Ligne d'écoute pour enfants", org: "Kinderschutzbund · Friedrichshafen", period: "depuis 02.2026",
          points: ["Formation au conseil téléphonique pour enfants et adolescents en situation de crise", "Conseil actif fondé sur une approche psychologique systémique"] },
        { role: "Responsable de groupe bénévole", org: "Église protestante d'Allemagne centrale · Ilmenau", period: "depuis 2022",
          points: ["Plusieurs années à la tête de groupes en équipe d'encadrement, dans la catéchèse et l'animation jeunesse ouverte", "Après le déménagement : interlocuteur, organisation d'événements et coordination au sein de l'équipe de bénévoles", "Direction, avec l'équipe d'encadrement, de camps et d'événements réunissant plus de 150 participants"] },
        { role: "Membre élu de la représentation étudiante", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Commission des affaires académiques au sénat universitaire ; contribution, avec la commission, à la politique de l'enseignement supérieur et aux règlements d'études", { html: 'Co-concepteur du <a href="https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Wahl-O-Mat, outil d\'aide au vote pour les élections régionales de Thuringe 2024</a> (bpb · MDR)' }] },
      ],
      skills: [
        { group: "Analyse des matériaux", items: ["MEB", "Radiographie", "Profilométrie", "Analyse microstructurale", "Technologie des couches minces", "Viscosimétrie"] },
        { group: "Méthodes", items: ["Caractérisation des matériaux", "Travail en salle blanche", "Planification d'essais", "Contrôle qualité", "Automatisation des processus"] },
        { group: "Logiciels", items: ["LaTeX", "Outils IA", "MS Office", "SAP", "FreeCAD"] },
        { group: "Langues", items: ["Allemand (langue maternelle)", "Anglais (courant professionnel)"] },
      ],
      projects: {
        kicker: "Projet", title: "CheapSeats",
        description: "CheapSeats est un tableau de bord de bureau pour Windows qui suit n'importe laquelle des 32 équipes NFL et 30 équipes MLB de votre choix. Il affiche le play-by-play en direct d'un match en cours et l'heure du prochain, avec des notifications au coup d'envoi et lors des changements de score, ainsi que des liens vers des extraits vidéo des chaînes YouTube officielles des ligues. Les données proviennent de l'API JSON publique d'ESPN ; la sélection d'équipe et un cache des scores sont stockés localement, si bien que le dernier état connu apparaît au lancement. Distribution et mises à jour automatiques via le Microsoft Store. L'interface est en anglais et en allemand, sans compte ni télémétrie.",
        features: ["Suivi en direct", "Notifications", "Joueur à l'honneur", "Diagramme de composition", "Classement et stade", "Historique et playoffs", "Effectif filtrable"],
        stack: ["Tauri 2 · Rust", "React 19 · TS", "Vite 7", "API JSON ESPN", "i18next EN/DE"],
        cta: "Découvrir CheapSeats",
      },
      footer: {
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email: "Envoyer un e-mail", phone: "M'appeler",
        emailAria: "Envoyer un e-mail à Mika Jeske", phoneAria: "Appeler Mika Jeske",
        legal: "Mentions légales & confidentialité",
        disclaimer: "Le portrait, certains passages de texte et les traductions de ce site ont été créés ou retravaillés avec l'aide de l'IA et relus par l'auteur. La version allemande fait foi.",
        privacyNote: "Certaines personnes ont été floutées pour des raisons de confidentialité ou juridiques.",
      },
      contact: { chip: "Me contacter" },
      langSwitcher: { selectLabel: "Choisir la langue", globeAria: "Sélectionner la langue", optionAria: "Sélectionner le {lang}" },
      sports: {
        nav: { features: "Fonctions", deepDive: "Aperçus", mobile: "Mobile", tech: "Technique", updates: "Mises à jour", download: "Télécharger" },
        backLink: "Accueil", madeBy: "Made by Mika", eyebrow: "Projet", title: "CheapSeats",
        heroSub: "Un tableau de bord sportif personnel sous forme d'application de bureau native pour Windows ; conçu pour le coup d'œil rapide au démarrage. Le cache affiche instantanément les données pertinentes pendant que les scores les plus récents se chargent en arrière-plan. Chacune des 32 équipes NFL ou 30 équipes MLB peut être choisie librement ; il n'y a pas d'équipe par défaut fixe.",
        dashboardK: "Dashboard", dashboardV: "Prochain match, joueur à l'honneur et composition ; tout en un coup d'œil dès le lancement de l'application.",
        featuresLabel: "Fonctionnalités", featuresHeading: "Ce que l'application permet de faire",
        featuresLede: "Chaque point d'accès est interrogé indépendamment ; si l'un échoue, le reste de l'application continue de fonctionner. Les données manquantes ou erronées deviennent un « — » plutôt qu'un plantage.",
        features: [
          { title: "Tableau de bord en direct", desc: "Une carte principale pour le prochain match avec adversaire, heure du coup d'envoi, lieu et diffuseur ; avec un compte à rebours jusqu'au coup d'envoi." },
          { title: "Suivi en direct", desc: "Play-by-play en temps réel pendant un match : quart-temps ou manche en cours, score, down-distance ou balles-strikes, et une chronologie des actions marquantes." },
          { title: "Notifications", desc: "Icône clignotante dans la barre des tâches si l'app est au premier plan, notification si elle est réduite ; rappel unique au coup d'envoi ou au premier lancer, alertes de score en option, limitées à une mise à jour toutes les 5 secondes." },
          { title: "Joueur à l'honneur", desc: "Une carte de joueur clé sélectionnée automatiquement (quarterback ou lanceur partant) avec ses statistiques de la saison et une tendance par rapport à sa moyenne de carrière." },
          { title: "Diagramme de formation", desc: "Une composition visuelle sur le terrain ou le diamant, adaptée au sport ; groupes offensifs au football américain, positions sur le terrain au baseball." },
          { title: "Classement de division", desc: "Classement complet avec victoires/défaites, domicile/extérieur, différentiel de points et série en cours ; avec des info-bulles glossaire pour chaque abréviation." },
          { title: "Stade et historique", desc: "Données du stade (année de construction, capacité, dimensions, surface) accompagnées d'un historique de saisons sélectionné : courbes de tendance, titres remportés, records historiques." },
          { title: "Effectif et playoffs", desc: "Un effectif filtrable par groupe de poste, consultable par nom et numéro ; avec des tableaux de playoffs automatiques en phase finale." },
        ],
        historyLabel: "La profondeur plutôt que la surface", historyHeading: "Un historique qui raconte des histoires",
        historyDesc: "La vue historique condense des décennies en quelques coups d'œil : une courbe de tendance victoires/défaites sur les dernières saisons, les titres remportés sous forme de bannières, et la moyenne de points encaissés (ERA) récente de l'équipe sous forme de barres.",
        historyTicks: ["Courbe de tendance avec les saisons de playoffs et de titre mises en évidence", "Victoires historiques, meilleure saison de l'ère moderne, plus longue série de victoires", "Un thème sombre aux couleurs de l'équipe ; volontairement distinct du tableau de bord clair"],
        teamLabel: "Votre équipe, votre langue", teamHeading: "Conçue pour les deux ligues",
        teamDesc: "La NFL et la MLB partagent la même interface ; le sélecteur d'équipe permet de basculer entre les 62 équipes, les glossaires et les diagrammes s'adaptant au sport. Les réglages de langue (DE/EN), de thème et d'équipe par défaut sont à portée de clic.",
        teamTicks: ["Bilingue grâce à i18next, avec des glossaires spécifiques à chaque sport", "Thème clair et sombre, avec des accents aux couleurs de l'équipe", "Un mode démo pour tester sans connexion réseau"],
        everywhereLabel: "Chez soi partout", everywhereHeading: "Fonctionne sur téléphone, Mac et Windows",
        everywhereLede: "La même architecture défensive, les mêmes données ; responsive du bureau jusqu'au téléphone. La navigation latérale mémorise la position de défilement, ce qui permet de sauter instantanément entre les sections.",
        techLabel: "Sous le capot", techHeading: "Fondations techniques",
        techLede: "Cache-first et tolérante aux pannes : les données sont visibles dès le premier lancement, chaque appel d'API s'exécute de façon isolée, et les mises à jour arrivent via le Microsoft Store.",
        spec: [
          { dt: "Plateforme", dd: "<strong>Tauri 2</strong> sur une base Rust pour des performances natives et multiplateformes ; un seul binaire pour Windows, macOS et les mises en page mobiles." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, compilé avec <strong>Vite 7</strong>. Basé sur des composants, typé, rapide à construire." },
          { dt: "Architecture", dd: "Pensée de façon défensive : chaque point d'accès est interrogé indépendamment, une panne ne se propage donc pas. Les données manquantes deviennent un <strong>« — »</strong> plutôt qu'un plantage." },
          { dt: "Données et hors ligne", dd: "Données en direct issues de l'<strong>API JSON publique d'ESPN</strong>, mises en cache de façon persistante. Utilisable hors ligne, avec un mode démo pour tester sans réseau." },
          { dt: "Langue", dd: "<strong>i18next</strong> en allemand/anglais avec des glossaires spécifiques à chaque sport ; des info-bulles expliquent chaque abréviation." },
          { dt: "Mises à jour", dd: "Livraison automatique via le <strong>Microsoft Store</strong> ; pas d'installeur séparé, pas de mise à jour manuelle." },
        ],
        designLabel: "Philosophie de conception",
        designText: "L'application est conçue pour une <strong style=\"color:var(--heading);font-weight:600\">faible charge cognitive</strong> et une lecture rapide. L'approche cache-first rend les données visibles instantanément au lancement ; la navigation latérale avec suivi du défilement permet de passer d'une section à l'autre. Des info-bulles expliquent systématiquement les termes techniques ; y compris pour celles et ceux qui ne connaissent pas (encore) le sport américain.",
        comingBadge: "Microsoft Store", comingText: "CheapSeats est distribué exclusivement via le Microsoft Store.",
        comingSoon: "Bientôt disponible",
        githubBtn: "Désormais sur le Microsoft Store", backFooter: "Retour à l'accueil", madeByFooter: "CheapSeats · Made by Mika",
        screenshotNote: "Les captures d'écran de cette page proviennent de versions de développement et peuvent différer de la version actuelle de l'application.",
        updateBanner: {
          pill: "Nouveau",
          ticker: "CheapSeats v1.1 est arrivé : suivi en direct, notifications et la sortie officielle sur le Microsoft Store +++ Les versions App Store et Play Store arrivent bientôt +++ Promis : CheapSeats restera gratuite à 100 % +++",
          cta: "Voir les nouveautés →",
        },
        changelogLabel: "Historique des versions", changelogHeading: "Ce qui a changé",
        changelogLede: "Un rapide coup d'œil sur les versions précédentes - sans date, pour que ça ne paraisse jamais dépassé.",
        changelog: {
          v11: {
            tag: "v1.1 · Actuelle", title: "Suivi en direct, notifications et Microsoft Store",
            items: [
              "Suivi en direct : play-by-play en temps réel, quart-temps ou manche en cours, down-distance ou balles-strikes, et une chronologie des actions marquantes",
              "Notifications : icône clignotante dans la barre des tâches, notification à la réduction, rappel au coup d'envoi et alertes de score optionnelles",
              "Sortie officielle sur le Microsoft Store : mises à jour automatiques signées, sans installeur, sans invite UAC",
              "La sélection d'équipe est désormais conservée entre les redémarrages, plus le démarrage automatique avec Windows",
              "Environ 40 % plus rapide au démarrage avec un cache froid",
            ],
          },
          v10: {
            tag: "v1.0 · Première version", title: "Les fondations",
            items: [
              "Tableau de bord avec le prochain/dernier match, un compte à rebours et un aperçu face-à-face",
              "Joueur à l'honneur avec les statistiques de la saison et une tendance par rapport à la moyenne de carrière",
              "Diagramme de formation pour la NFL et la MLB",
              "Classement complet avec des info-bulles glossaire pour chaque abréviation",
              "Vue stade et historique avec les titres remportés et les records historiques",
              "Effectif consultable et tableaux de playoffs automatiques",
              "Bilingue EN/DE, thème clair/sombre, mode démo",
            ],
          },
        },
      },
    },

    es: {
      meta: {
        title: "Mika Jeske — Ciencia de materiales y metrología",
        description: "Mika Jeske, científico de materiales (B.Sc.) centrado en metrología, sensórica y ensayos no destructivos. Máster en Metrología y Técnicas de Medición en Brunswick desde octubre de 2026; en busca de un puesto de estudiante en prácticas y de voluntariado.",
      },
      hero: { eyebrow: "Ciencia de materiales · B.Sc.", scrollHint: "Scroll", aiImageLabel: "Imagen editada con IA" },
      intro: {
        eyebrow: "Hola.",
        headline: "Me llamo Mika: científico de materiales centrado en la metrología.",
        p1: "Montando un PC con mi primo Jack acabamos hablando de disipadores de cobre y pasta térmica con diamante. No sabía que había aterrizado justo en mi campo. Eso es lo que me gusta: la ciencia de materiales está dentro de cosas que ya tienes en la mano. El vidrio usado fundido de nuevo en botellas también cuenta.",
        p2: "Donde se vuelve preciso para mí es en la metrología. Leer un número es fácil; juzgar si es correcto es un oficio. Por eso en octubre empiezo el máster en Metrología y Técnicas de Medición en Brunswick. En casa no tengo un microscopio electrónico de barrido; así que en paralelo construyo esta web y mis propios proyectos, para avanzar programando y presentando datos.",
        photos: [
          "Invitado a la DGZfP en Magdeburgo; como parte del premio",
        ],
      },
      nav: { werkstudent: "Estudiante en prácticas", ehrenamt: "Voluntariado", lebenslauf: "Trayectoria", projekt: "Proyecto", skipLabel: "Ir a la sección" },
      seeking: {
        eyebrow: "Lo que busco",
        heading: "Un puesto de estudiante en prácticas junto al máster",
        rows: [
          { k: "Puesto", v: "Estudiante en prácticas, desde octubre de 2026" },
          { k: "Lugar", v: "Brunswick y alrededores" },
          { k: "Jornada", v: "Hasta 20 horas por semana junto a los estudios" },
          { k: "Áreas", v: "Metrología, sensores, capas finas, END" },
          { k: "Voluntariado", v: "THW, asesoramiento telefónico, trabajo juvenil; también allí" },
        ],
        cta: "Mi LinkedIn",
      },
      story: {
        eyebrow: "Mi camino",
        heading: "Cómo llegué a la pequeña escala",
        p1: "La física y la química me atraparon ya en el instituto, pero la teoría pura nunca me tentó. Durante un tiempo se barajó la farmacia; en mi familia es tradición. Después se cruzó la ciencia de materiales, justo el puente práctico que buscaba.",
        p2: "Lo que me atrapó fue el ámbito micro y nanométrico: fino, de gran precisión, casi estético. Bailé mucho tiempo a nivel de competición, y el paralelismo lo digo en serio; lo notó un profesor antes que yo. Ambos exigen control y elegancia en el detalle. De la pista de baile a las capas finas y hasta la metrología, eso lo atraviesa todo.",
        figure: {
          x: "Temperatura (°C)",
          y: "Coeficiente Seebeck (µV/K)",
          caption: "Coeficiente Seebeck relativo de capas finas pulverizadas frente a la temperatura; el níquel es negativo, la plata y el aluminio positivos. De mi trabajo de fin de grado.",
        },
        figure2: {
          x: "Tiempo (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "El bismuto es normalmente un conductor PTC; pero pulverizado como capa fina policristalina, invierte a NTC. Un efecto de bordes de grano que mi trabajo de fin de grado abordó.",
        },
      },
      cleanroomTear: {
        intro: "La línea más escueta de este currículum fue, para mí, la época más apasionante. Una mirada bajo la superficie:",
        label: "Abrir la sala blanca",
        eyebrow: "ZMN · Centro de Micro- y Nanotecnología",
        heading: "Bajo la superficie, en la sala blanca ISO‑2",
        p1: "Medio año en la sala blanca ISO‑2 de la TU Ilmenau: pulverización catódica por magnetrón, perfilometría, SEM/EDX, capas finas de TiOₓ. El contraste es casi absurdo; un entorno controlado hasta el último detalle, y en medio muestras de menos de un milímetro cuadrado que se niegan rotundamente a comportarse como deberían.",
        p2: "Sinceramente, allí se estaba genial. Por fin hacer aquello cuya teoría había aprendido, con esa sensación de ciencia auténtica, tal como uno se imagina la investigación de niño.",
        p3: "En concreto: capas de Ag, Al, Ni y Bi, el montaje TFA, mediciones de transporte en función de la temperatura. Son la base de mi trabajo de fin de grado.",
        photos: ["Cámara de pulverización; crecimiento de capas en vacío", "Sala blanca ISO‑2, completamente equipado", "Perfilometría; midiendo el grosor de la capa", "Muestras más pequeñas que una uña"],
      },
      confiTear: {
        intro: "Un voluntariado se reduce rápidamente a dos líneas en un currículum. Detrás de este hay mucho más:",
        label: "Saber más sobre mi trabajo juvenil:",
        teaser: "Durante varios años acompañé a jóvenes en la catequesis y en campamentos, y esos años todavía me marcan hoy.",
        eyebrow: "EKM Ilmenau · Catequesis y trabajo juvenil",
        heading: "Ver y ser visto",
        p1: "Durante varios años dirigí grupos de catequesis confirmatoria y trabajo juvenil abierto en la Iglesia Evangélica de Ilmenau. Nadie te avisa de la verdadera tarea: seguir siendo accesible mientras los jóvenes ordenan su fe, sus dudas y el simple hecho de crecer. En los días en que mi propio ánimo dejaba que desear, a menudo alguien se acercaba con sus propios asuntos. Hacerme a un lado en esos momentos me recompuso a mí más veces que a ellos.",
        p2: "El trabajo con niños moldeó también mi propia actitud. Quien espera que los jóvenes se abran tiene que ser el primero en ponerse el disfraz ridículo en el campamento. Quien es demasiado tímido para eso no recibe nada a cambio. Ir por delante sin miedo y encarnar el comportamiento que se espera de los demás; eso moldea mi forma de entender la colaboración, mucho más allá del trabajo juvenil.",
        photos: ["Excepcionalmente, delante de la cámara", "En pleno ajetreo", "Programa de noche en un campamento"],
      },
      reunion: {
        eyebrow: "Aparte",
        heading: "Organizando un reencuentro",
        p1: "Aparte, gestiono {{site}}, la web del reencuentro de mi promoción de bachillerato. Hay un mapa que muestra lo dispersos que estamos ya, y cuánto siguen pesando las raíces a pesar de ello, además de una cuenta atrás nacida de pura ilusión y un formulario de contacto para escribir.",
        p2: "Mantuve a propósito los antiguos colores del instituto; sencillamente se sentía bien. Lo que más me gusta es redactar el boletín de la promoción; las respuestas que llegan son, una y otra vez, maravillosas miradas.",
        linkLabel: "ggi-abitur2022.de",
        pins: ["Organización", "Conexión", "GGI"],
      },
      resume: {
        kicker: "Currículum", title: "Trayectoria profesional",
        experienceHeading: "Experiencia profesional", educationHeading: "Formación académica",
        skillsEyebrow: "Competencias", awardLabel: "Distinción",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Becario en ingeniería industrial", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Cualificación de un equipo de producción para su despliegue en serie; planificación de ensayos, control y automatización de procesos", "Evaluación y adquisición de sistemas viscosimétricos mediante series de medición independientes y recomendación de compra", "Caracterización de alternativas de pasta sin plomo mediante microscopía óptica y radiografía", "Introducción, junto con producción, de un nuevo dispositivo mezclador de pasta; ahora implementado en el 100 % de los pasos de producción relevantes"] },
        { role: "Asistente de investigación", org: "Centro de Micro- y Nanotecnología · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Deposición por pulverización catódica de capas finas metálicas (Al, Ag, Ti, Si) y estructuración por lift-off en sala blanca", "Perfilometría, análisis topográfico por SEM y caracterización eléctrica (método de van der Pauw)"] },
      ],
      education: [
        { role: "Máster (M.Sc.) en Metrología y Técnicas de Medición", org: "Technische Universität Braunschweig", period: "a partir de 10.2026", accent: true,
          points: ["Especialización en sensores y principios de medición: continuación directa del trabajo de fin de grado sobre capas finas pulverizadas", "Módulo base de metrología: evaluación de datos de medición y estadística metrológica", "Estrecha vinculación con la Physikalisch-Technische Bundesanstalt, el instituto metrológico nacional alemán"] },
        { role: "Grado (B.Sc.) en Ciencia de Materiales · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Especialización en materiales metálicos, tecnología de capas finas y procesos de fabricación", "Trabajo de fin de grado: propiedades eléctricas en función de la temperatura de capas finas pulverizadas (nota 1,0)", "Nominado para la Fundación Nacional Académica Alemana (Studienstiftung)"] },
        { role: "Bachillerato alemán (Abitur) · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        eyebrow: "Voluntariado", heading: "Un compromiso que me importa",
        photos: [
          "Taller antirracista en una escuela primaria",
          "Preparando nuestro pódcast sobre el programa del cine estudiantil",
        ],
      },
      engagement: [
        { role: "Voluntario, formación básica", org: "Technisches Hilfswerk · OV Friedrichshafen", period: "desde 10.2025", accent: true,
          points: ["Formación básica en protección civil y gestión de catástrofes en equipo, orientada al asesoramiento especializado en defensa NRBQ"] },
        { role: "Consejero telefónico · Línea de ayuda infantil", org: "Kinderschutzbund · Friedrichshafen", period: "desde 02.2026",
          points: ["Formación en asesoramiento telefónico para niños y adolescentes en situaciones de crisis", "Asesoramiento activo basado en un enfoque psicológico sistémico"] },
        { role: "Líder de grupo voluntario", org: "Iglesia Evangélica de Alemania Central · Ilmenau", period: "desde 2022",
          points: ["Varios años liderando grupos como parte de un equipo de coordinación, en catequesis confirmatoria y trabajo juvenil abierto", "Tras la mudanza: persona de contacto, organización de eventos y coordinación dentro del equipo de voluntariado", "Dirección, junto con el equipo de coordinación, de campamentos y eventos con más de 150 participantes"] },
        { role: "Representante estudiantil electo", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Comisión de asuntos académicos en el senado universitario; contribución, junto con la comisión, a la política de educación superior y a los reglamentos de estudio", { html: 'Co-creador del <a href="https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Wahl-O-Mat, herramienta de ayuda al voto para las elecciones regionales de Turingia de 2024</a> (bpb · MDR)' }] },
      ],
      skills: [
        { group: "Análisis de materiales", items: ["SEM", "Radiografía", "Perfilometría", "Análisis microestructural", "Tecnología de capas finas", "Viscosimetría"] },
        { group: "Métodos", items: ["Caracterización de materiales", "Trabajo en sala blanca", "Diseño de experimentos", "Control de calidad", "Automatización de procesos"] },
        { group: "Software", items: ["LaTeX", "Herramientas de IA", "MS Office", "SAP", "FreeCAD"] },
        { group: "Idiomas", items: ["Alemán (lengua materna)", "Inglés (nivel profesional avanzado)"] },
      ],
      projects: {
        kicker: "Proyecto", title: "CheapSeats",
        description: "CheapSeats es un panel de marcador de escritorio para Windows que sigue cualquiera de los 32 equipos de la NFL y 30 de la MLB que elijas. Muestra el play-by-play en directo de un partido en curso y la hora de inicio del siguiente, con notificaciones al inicio y ante cambios de marcador, además de enlaces a vídeos destacados de los canales oficiales de YouTube de las ligas. Los datos provienen de la API JSON pública de ESPN; la selección de equipo y una caché de resultados se guardan localmente, de modo que al abrir la app aparece el último estado conocido. Distribución y actualizaciones automáticas a través de la Microsoft Store. La interfaz está en inglés y alemán, sin cuenta y sin telemetría.",
        features: ["Seguimiento en vivo", "Notificaciones", "Jugador destacado", "Diagrama de alineación", "Clasificación y estadio", "Historial y playoffs", "Plantilla filtrable"],
        stack: ["Tauri 2 · Rust", "React 19 · TS", "Vite 7", "API JSON de ESPN", "i18next EN/DE"],
        cta: "Ver CheapSeats",
      },
      footer: {
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email: "Enviar un correo", phone: "Llamarme",
        emailAria: "Enviar un correo a Mika Jeske", phoneAria: "Llamar a Mika Jeske",
        legal: "Aviso legal y privacidad",
        disclaimer: "El retrato, algunos pasajes de texto y las traducciones de este sitio se crearon o revisaron con ayuda de IA y fueron revisados por el autor. La versión alemana es la vinculante.",
        privacyNote: "Algunas personas han sido difuminadas por motivos de privacidad o legales.",
      },
      contact: { chip: "Contáctame" },
      langSwitcher: { selectLabel: "Elegir idioma", globeAria: "Seleccionar idioma", optionAria: "Seleccionar {lang}" },
      sports: {
        nav: { features: "Funciones", deepDive: "Detalles", mobile: "Móvil", tech: "Técnica", updates: "Actualizaciones", download: "Descargar ahora" },
        backLink: "Inicio", madeBy: "Made by Mika", eyebrow: "Proyecto", title: "CheapSeats",
        heroSub: "Un panel deportivo personal en forma de aplicación de escritorio nativa para Windows; diseñado para una consulta rápida al arrancar. La caché muestra los datos relevantes al instante mientras los resultados más recientes se cargan en segundo plano. Cualquiera de los 32 equipos de la NFL o los 30 de la MLB puede elegirse libremente; no hay un equipo predeterminado fijo.",
        dashboardK: "Dashboard", dashboardV: "Próximo partido, jugador destacado y alineación; todo de un vistazo en cuanto se abre la aplicación.",
        featuresLabel: "Funciones", featuresHeading: "Lo que la aplicación puede hacer",
        featuresLede: "Cada endpoint se consulta de forma independiente; si uno falla, el resto de la aplicación sigue funcionando. Los datos ausentes o incorrectos se convierten en un «—» en lugar de un fallo.",
        features: [
          { title: "Panel en vivo", desc: "Una tarjeta principal del próximo partido con rival, hora de inicio, sede y cadena televisiva; incluyendo una cuenta atrás hasta el inicio." },
          { title: "Seguimiento en vivo", desc: "Jugada a jugada en tiempo real durante un partido en curso: inning o cuarto actual, marcador, down-distancia o cuenta de bolas-strikes, y una línea de tiempo de las jugadas de anotación." },
          { title: "Notificaciones", desc: "Parpadeo en la barra de tareas con la app en primer plano, aviso emergente al minimizarla; un recordatorio único al inicio o al primer lanzamiento, alertas de cambio de marcador opcionales, limitadas a una actualización cada 5 segundos." },
          { title: "Jugador destacado", desc: "Una tarjeta de jugador clave seleccionada automáticamente (quarterback o lanzador abridor) con sus estadísticas de la temporada y una tendencia respecto a su media de carrera." },
          { title: "Diagrama de formación", desc: "Una alineación visual en el campo o el diamante, adaptada al deporte; agrupaciones ofensivas en fútbol americano, posiciones de campo en béisbol." },
          { title: "Clasificación de división", desc: "Clasificación completa con victorias/derrotas, local/visitante, diferencial de carreras y racha; con tooltips de glosario para cada abreviatura." },
          { title: "Estadio e historial", desc: "Datos del estadio (año de construcción, capacidad, dimensiones, superficie) junto a un historial de temporadas seleccionado: gráficos de tendencia, títulos ganados, récords históricos." },
          { title: "Plantilla y playoffs", desc: "Una plantilla filtrable por grupo de posición, buscable por nombre y número; además de cuadros de playoffs automáticos en la postemporada." },
        ],
        historyLabel: "Profundidad, no superficialidad", historyHeading: "Un historial que cuenta historias",
        historyDesc: "La vista de historial condensa décadas en unas pocas miradas: una curva de tendencia de victorias/derrotas en las últimas temporadas, los títulos ganados como una fila de banderines y la ERA reciente del equipo en forma de barras.",
        historyTicks: ["Curva de tendencia con las temporadas de playoffs y de título destacadas", "Victorias históricas, mejor temporada de la era moderna, racha de victorias más larga", "Un tema oscuro con los colores del equipo; deliberadamente diferenciado del panel claro"],
        teamLabel: "Tu equipo, tu idioma", teamHeading: "Diseñada para ambas ligas",
        teamDesc: "La NFL y la MLB comparten la misma interfaz; el selector de equipo permite cambiar entre los 62 equipos, con glosarios y diagramas que se adaptan al deporte. Los ajustes de idioma (DE/EN), tema y equipo predeterminado están a un clic de distancia.",
        teamTicks: ["Bilingüe mediante i18next, con glosarios específicos por deporte", "Tema claro y oscuro, con acentos en los colores del equipo", "Un modo demo para probar sin conexión de red"],
        everywhereLabel: "Como en casa, en todas partes", everywhereHeading: "Funciona en móvil, Mac y Windows",
        everywhereLede: "La misma arquitectura defensiva, los mismos datos; responsive desde el escritorio hasta el teléfono. La navegación lateral recuerda la posición de desplazamiento, lo que permite saltar a cualquier sección al instante.",
        techLabel: "Bajo el capó", techHeading: "Fundamento técnico",
        techLede: "Cache-first y a prueba de fallos: los datos son visibles desde el primer arranque, cada llamada a la API se ejecuta de forma aislada, y las actualizaciones llegan a través de la Microsoft Store.",
        spec: [
          { dt: "Plataforma", dd: "<strong>Tauri 2</strong> sobre una base de Rust para un rendimiento nativo y multiplataforma; un único binario para Windows, macOS y diseños móviles." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, compilado con <strong>Vite 7</strong>. Basado en componentes, con tipado seguro y compilación rápida." },
          { dt: "Arquitectura", dd: "Pensada de forma defensiva: cada endpoint se consulta de forma independiente, por lo que un fallo no se propaga. Los datos ausentes se convierten en un <strong>«—»</strong> en lugar de un fallo." },
          { dt: "Datos y sin conexión", dd: "Datos en vivo de la <strong>API JSON pública de ESPN</strong>, almacenados en caché de forma persistente. Utilizable sin conexión, con un modo demo para probar sin red." },
          { dt: "Idioma", dd: "<strong>i18next</strong> en alemán/inglés con glosarios específicos por deporte; los tooltips explican cada abreviatura." },
          { dt: "Actualizaciones", dd: "Entrega automática a través de la <strong>Microsoft Store</strong>; sin instalador independiente, sin actualizaciones manuales." },
        ],
        designLabel: "Filosofía de diseño",
        designText: "La aplicación está diseñada para una <strong style=\"color:var(--heading);font-weight:600\">baja carga cognitiva</strong> y una lectura rápida. El enfoque cache-first hace que los datos sean visibles al instante al iniciar; la navegación lateral con seguimiento de desplazamiento permite saltar entre secciones. Los tooltips explican sistemáticamente la terminología; incluso para quienes (todavía) no están familiarizados con el deporte estadounidense.",
        comingBadge: "Microsoft Store", comingText: "CheapSeats se distribuye exclusivamente a través de la Microsoft Store.",
        comingSoon: "Próximamente",
        githubBtn: "Ya en Microsoft Store", backFooter: "Volver al inicio", madeByFooter: "CheapSeats · Made by Mika",
        screenshotNote: "Las capturas de pantalla de esta página son de versiones en desarrollo y pueden diferir de la versión actual de la aplicación.",
        updateBanner: {
          pill: "Nuevo",
          ticker: "Ya está aquí CheapSeats v1.1: seguimiento en vivo, notificaciones y el lanzamiento oficial en la Microsoft Store +++ Las versiones para App Store y Play Store están en camino +++ Promesa hecha: CheapSeats será 100 % gratis +++",
          cta: "Ver novedades →",
        },
        changelogLabel: "Historial de versiones", changelogHeading: "Qué ha cambiado",
        changelogLede: "Un vistazo rápido a las versiones anteriores - sin fechas, para que nunca se vea desactualizado.",
        changelog: {
          v11: {
            tag: "v1.1 · Actual", title: "Seguimiento en vivo, notificaciones y Microsoft Store",
            items: [
              "Seguimiento en vivo: jugada a jugada en tiempo real, inning o cuarto actual, down-distancia o cuenta de bolas-strikes, y una línea de tiempo de las jugadas de anotación",
              "Notificaciones: parpadeo en la barra de tareas, aviso emergente al minimizar, recordatorio de inicio y alertas de cambio de marcador opcionales",
              "Lanzamiento oficial en la Microsoft Store: actualizaciones automáticas firmadas, sin instalador, sin aviso de UAC",
              "La selección de equipo ahora se conserva entre reinicios, además de inicio automático con Windows",
              "Arranque alrededor de un 40 % más rápido con caché frío",
            ],
          },
          v10: {
            tag: "v1.0 · Lanzamiento inicial", title: "Los cimientos",
            items: [
              "Panel con el próximo/último partido, cuenta atrás y un adelanto cara a cara",
              "Jugador destacado con estadísticas de la temporada y tendencia respecto a la media de carrera",
              "Diagrama de formación para la NFL y la MLB",
              "Clasificación completa con tooltips de glosario para cada abreviatura",
              "Vista de estadio e historial con títulos ganados y récords históricos",
              "Plantilla con búsqueda y cuadros de playoffs automáticos",
              "Bilingüe EN/DE, tema claro/oscuro, modo demo",
            ],
          },
        },
      },
    },

    /* ---------- Italian (it) ----------
       Professional register conventions (keep consistent in future edits):
       • Tone: formal yet warm, first person for Mika's own voice; impersonal /
         "si" constructions for product descriptions (mirrors fr/es).
       • Address the reader with courtesy, never the over-familiar "tu" in prose.
       • Domain glossary (fixed): Werkstoffwissenschaft → "scienza dei materiali";
         Messtechnik → "metrologia"; thin films → "film sottili"; sputtering →
         "(deposizione per) sputtering"; Reinraum → "camera bianca"; Seebeck →
         "coefficiente di Seebeck"; Profilometrie → "profilometria"; van der Pauw,
         SEM, EDX, TFA, ERA, PTC/NTC kept as-is; proper nouns & award names verbatim.
       • Typography: Italian accents (à è é ì ò ù) and elision apostrophes
         ("un'app", "po'"); guillemets «…» as used in fr/es, not German „…“.
       Only the German version is authoritative (see footer disclaimer). */
    it: {
      meta: {
        title: "Mika Jeske — Scienza dei materiali e metrologia",
        description: "Mika Jeske, scienziato dei materiali (B.Sc.) specializzato in metrologia, sensoristica e controlli non distruttivi. Master in Metrologia e tecniche di misura a Braunschweig da ottobre 2026; in cerca di un impiego da studente lavoratore e di attività di volontariato.",
      },
      hero: { eyebrow: "Scienza dei materiali · B.Sc.", scrollHint: "Scroll", aiImageLabel: "Immagine modificata con IA" },
      intro: {
        eyebrow: "Ciao.",
        headline: "Mi chiamo Mika: scienziato dei materiali, specializzato in metrologia.",
        p1: "Montando un PC con mio cugino Jack siamo finiti sui dissipatori in rame e sulla pasta termica al diamante. Non sapeva di essere atterrato in pieno nel mio campo. È questo che mi piace: la scienza dei materiali sta dentro cose che hai già in mano. Anche il vetro usato rifuso in bottiglie nuove.",
        p2: "In metrologia diventa preciso. Leggere un numero è semplice; giudicare se sia giusto è un mestiere. Per questo a ottobre inizio il master in Metrologia e tecniche di misura a Braunschweig. A casa non ho un microscopio elettronico a scansione; così in parallelo costruisco questo sito e i miei progetti, per crescere nella programmazione e nella presentazione dei dati.",
        photos: [
          "Invitato alla DGZfP a Magdeburgo; nell'ambito del premio",
        ],
      },
      nav: { werkstudent: "Studente lavoratore", ehrenamt: "Volontariato", lebenslauf: "Percorso", projekt: "Progetto", skipLabel: "Vai alla sezione" },
      seeking: {
        eyebrow: "Che cosa cerco",
        heading: "Un impiego da studente lavoratore accanto al master",
        rows: [
          { k: "Posizione", v: "Studente lavoratore, da ottobre 2026" },
          { k: "Luogo", v: "Braunschweig e dintorni" },
          { k: "Impegno", v: "Fino a 20 ore a settimana accanto agli studi" },
          { k: "Ambiti", v: "Metrologia, sensoristica, film sottili, CND" },
          { k: "Volontariato", v: "THW, ascolto telefonico, lavoro giovanile; anche nella nuova città" },
        ],
        cta: "Il mio LinkedIn",
      },
      story: {
        eyebrow: "Il mio percorso",
        heading: "Come sono approdato alla piccola scala",
        p1: "La fisica e la chimica mi hanno conquistato già a scuola, ma la teoria pura non mi ha mai attirato. Per un periodo si è valutata la farmacia; da noi è tradizione di famiglia. Poi è arrivata la scienza dei materiali, esattamente il ponte pratico che cercavo.",
        p2: "Ciò che mi ha catturato è stato il mondo micro e nanometrico: fine, di altissima precisione, quasi estetico. Ho ballato a lungo a livello agonistico, e il parallelo lo dico sul serio; se n’è accorto un professore prima di me. Entrambi richiedono controllo ed eleganza nel dettaglio. Dalla pista da ballo ai film sottili fino alla metrologia, questo attraversa tutto.",
        figure: {
          x: "Temperatura (°C)",
          y: "Coefficiente di Seebeck (µV/K)",
          caption: "Coefficiente di Seebeck relativo di film sottili depositati per sputtering in funzione della temperatura; il nichel è negativo, l'argento e l'alluminio positivi. Dalla mia tesi di laurea.",
        },
        figure2: {
          x: "Tempo (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Il bismuto è normalmente un conduttore PTC; ma depositato come film sottile policristallino per sputtering, si inverte in NTC. Un effetto di bordo grano che la mia tesi di laurea ha toccato.",
        },
      },
      cleanroomTear: {
        intro: "La riga più sobria di questo curriculum è stata, per me, il periodo più appassionante. Uno sguardo sotto la superficie:",
        label: "Aprire la camera bianca",
        eyebrow: "ZMN · Centro per la micro- e nanotecnologia",
        heading: "Sotto la superficie, nella camera bianca ISO‑2",
        p1: "Sei mesi nella camera bianca ISO‑2 della TU Ilmenau: sputtering magnetronico, profilometria, SEM/EDX, film sottili di TiOₓ. Il contrasto è quasi assurdo; un ambiente controllato fin nei minimi dettagli e, nel mezzo, campioni di meno di un millimetro quadrato che si rifiutano ostinatamente di comportarsi come dovrebbero.",
        p2: "Sinceramente, lì si stava benissimo. Finalmente fare ciò di cui avevo studiato la teoria, con quella sensazione di scienza autentica che da bambini si immagina.",
        p3: "In concreto: strati di Ag, Al, Ni e Bi, il setup TFA, misure di trasporto in funzione della temperatura. Sono la base della mia tesi di laurea.",
        photos: ["Camera di sputtering; crescita degli strati sotto vuoto", "Camera bianca ISO‑2, completamente bardato", "Profilometria; misura dello spessore degli strati", "Campioni più piccoli di un'unghia"],
      },
      confiTear: {
        intro: "Un'attività di volontariato si riduce in fretta a due righe su un curriculum. Dietro questa c'è molto di più:",
        label: "Scopri di più sul mio lavoro con i giovani:",
        teaser: "Per diversi anni ho accompagnato ragazzi nel catechismo e nei campi, e quegli anni mi segnano ancora oggi.",
        eyebrow: "EKM Ilmenau · Catechismo e lavoro giovanile",
        heading: "Vedere ed essere visti",
        p1: "Per diversi anni ho guidato gruppi di catechismo e di lavoro giovanile aperto presso la Chiesa evangelica di Ilmenau. Nessuno ti avverte del vero compito: restare accessibile mentre i ragazzi fanno i conti con fede, dubbi e il semplice fatto di crescere. Nei giorni in cui il mio stesso umore lasciava a desiderare, capitava spesso che qualcuno venisse da me con le proprie questioni. Mettermi da parte in quei momenti ha rimesso in ordine me più spesso di loro.",
        p2: "Il lavoro con i bambini ha plasmato anche il mio atteggiamento. Chi si aspetta che i ragazzi escano dal proprio guscio deve essere il primo, al campo, a indossare il costume buffo. Chi è troppo impacciato per farlo non riceve nulla in cambio. Andare avanti senza paura e incarnare il comportamento che ci si aspetta dagli altri; questo plasma la mia idea di collaborazione, ben oltre il lavoro giovanile.",
        photos: ["Per una volta, davanti all'obiettivo", "Nel pieno dell'azione", "Programma serale durante un campo"],
      },
      reunion: {
        eyebrow: "A margine",
        heading: "Organizzare una rimpatriata",
        p1: "A margine, mi occupo di {{site}}, il sito della rimpatriata della mia classe di maturità. C'è una mappa che mostra quanto ci siamo ormai dispersi e quanto, nonostante tutto, restino salde le radici, oltre a un conto alla rovescia nato da pura attesa e un modulo di contatto per farsi vivi.",
        p2: "Ho ripreso di proposito i vecchi colori della scuola; mi sembrava semplicemente giusto. Ciò che preferisco è scrivere la newsletter della classe; le risposte che arrivano sono, ogni volta, meravigliosi spaccati.",
        linkLabel: "ggi-abitur2022.de",
        pins: ["Organizzazione", "Connessione", "GGI"],
      },
      resume: {
        kicker: "Curriculum", title: "Percorso professionale",
        experienceHeading: "Esperienza professionale", educationHeading: "Formazione",
        skillsEyebrow: "Competenze", awardLabel: "Riconoscimento",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Tirocinante in Industrial Engineering", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualifica di un'attrezzatura di produzione per l'impiego in serie; pianificazione delle prove, controllo e automazione di processo", "Valutazione e approvvigionamento di sistemi viscosimetrici con serie di misure autonome e raccomandazione d'acquisto", "Caratterizzazione di paste alternative senza piombo mediante microscopia ottica e radiografia", "Introduzione, insieme alla produzione, di un nuovo dispositivo mescolatore di pasta; ora impiegato nel 100% delle fasi di produzione rilevanti"] },
        { role: "Assistente di ricerca", org: "Centro per la micro- e nanotecnologia · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Deposizione per sputtering di film sottili metallici (Al, Ag, Ti, Si) e strutturazione mediante lift-off in camera bianca", "Profilometria, analisi topografica al SEM e caratterizzazione elettrica (metodo di van der Pauw)"] },
      ],
      education: [
        { role: "M.Sc. in Metrologia e tecniche di misura", org: "Technische Universität Braunschweig", period: "da 10.2026", accent: true,
          points: ["Indirizzo in sensoristica e principi di misura: prosecuzione diretta della tesi di laurea sui film sottili depositati per sputtering", "Modulo base di metrologia: analisi dei dati di misura e statistica metrologica", "Stretto legame con la Physikalisch-Technische Bundesanstalt, l'istituto metrologico nazionale tedesco"] },
        { role: "B.Sc. in Scienza dei materiali · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Indirizzo in materiali metallici, tecnologia dei film sottili e processi di fabbricazione", "Tesi di laurea: proprietà elettriche in funzione della temperatura di film sottili depositati per sputtering (voto 1,0)", "Candidatura alla Studienstiftung des deutschen Volkes (fondazione nazionale per il merito accademico)"] },
        { role: "Maturità tedesca (Abitur) · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        eyebrow: "Volontariato", heading: "Un impegno a cui tengo",
        photos: [
          "Laboratorio antirazzismo in una scuola primaria",
          "Riunione preparatoria del nostro podcast sul programma del cinema studentesco",
        ],
      },
      engagement: [
        { role: "Volontario in formazione di base", org: "Technisches Hilfswerk · OV Friedrichshafen", period: "da 10.2025", accent: true,
          points: ["Formazione di base nella protezione civile e nella gestione delle catastrofi in team, con orientamento alla consulenza specialistica in difesa CBRN"] },
        { role: "Consulente telefonico · Numero per l'infanzia", org: "Kinderschutzbund · Friedrichshafen", period: "da 02.2026",
          points: ["Formazione alla consulenza telefonica per bambini e adolescenti in situazioni di crisi", "Consulenza attiva su base sistemico-psicologica"] },
        { role: "Guida di gruppo volontaria", org: "Chiesa evangelica della Germania centrale · Ilmenau", period: "dal 2022",
          points: ["Pluriennale guida di gruppi come parte di un team di coordinamento, nel catechismo e nel lavoro giovanile aperto", "Dopo il trasferimento: referente, organizzazione di eventi e coordinamento all'interno del team di volontari", "Direzione, insieme al team di coordinamento, di campi ed eventi con oltre 150 partecipanti"] },
        { role: "Membro eletto della rappresentanza studentesca", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Commissione per gli affari accademici nel senato universitario; contributo, insieme alla commissione, alla politica universitaria e ai regolamenti didattici", { html: 'Co-realizzatore del <a href="https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:2px">Wahl-O-Mat per le elezioni regionali della Turingia 2024</a> (bpb · MDR)' }] },
      ],
      skills: [
        { group: "Analisi dei materiali", items: ["SEM", "Radiografia", "Profilometria", "Analisi microstrutturale", "Tecnologia dei film sottili", "Viscosimetria"] },
        { group: "Metodi", items: ["Caratterizzazione dei materiali", "Lavoro in camera bianca", "Pianificazione delle prove", "Controllo qualità", "Automazione di processo"] },
        { group: "Software", items: ["LaTeX", "Strumenti IA", "MS Office", "SAP", "FreeCAD"] },
        { group: "Lingue", items: ["Tedesco (madrelingua)", "Inglese (fluente in ambito professionale)"] },
      ],
      projects: {
        kicker: "Progetto", title: "CheapSeats",
        description: "CheapSeats è un tabellone da scrivania per Windows che segue una qualsiasi delle 32 squadre NFL e 30 MLB che scegli. Mostra il play-by-play in diretta di una partita in corso e l'orario di inizio della prossima, con notifiche al fischio d'inizio e sui cambi di punteggio, oltre a link ai video degli highlight dei canali YouTube ufficiali delle leghe. I dati provengono dall'API JSON pubblica di ESPN; la selezione delle squadre e una cache dei punteggi sono salvate localmente, così all'avvio compare l'ultimo stato noto. Distribuzione e aggiornamenti automatici tramite il Microsoft Store. L'interfaccia è in inglese e tedesco, senza account e senza telemetria.",
        features: ["Tracking live", "Notifiche", "Giocatore in evidenza", "Diagramma della formazione", "Classifica e stadio", "Storia e playoff", "Rosa filtrabile"],
        stack: ["Tauri 2 · Rust", "React 19 · TS", "Vite 7", "API JSON ESPN", "i18next EN/DE"],
        cta: "Scopri CheapSeats",
      },
      footer: {
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email: "Scrivi un'e-mail", phone: "Chiama",
        emailAria: "Scrivi un'e-mail a Mika Jeske", phoneAria: "Chiama Mika Jeske",
        legal: "Note legali & privacy",
        disclaimer: "Il ritratto, alcuni passaggi di testo e le traduzioni di questo sito sono stati creati o rielaborati con l'ausilio dell'IA e rivisti dall'autore. Fa fede la versione tedesca.",
        privacyNote: "Alcune persone sono state rese irriconoscibili per motivi di privacy o legali.",
      },
      contact: { chip: "Contattami" },
      langSwitcher: { selectLabel: "Scegli la lingua", globeAria: "Seleziona la lingua", optionAria: "Seleziona {lang}" },
      sports: {
        nav: { features: "Funzioni", deepDive: "Dettagli", mobile: "Mobile", tech: "Tecnica", updates: "Aggiornamenti", download: "Scarica ora" },
        backLink: "Home", madeBy: "Made by Mika", eyebrow: "Progetto", title: "CheapSeats",
        heroSub: "Una dashboard sportiva personale come app desktop nativa per Windows; pensata per il rapido sguardo all'avvio. La cache mostra subito i dati rilevanti mentre i punteggi più recenti vengono caricati in background. Ciascuna delle 32 squadre NFL o delle 30 squadre MLB può essere scelta liberamente; non esiste una squadra predefinita fissa.",
        dashboardK: "Dashboard", dashboardV: "Prossima partita, giocatore in evidenza e formazione; tutto a colpo d'occhio non appena l'app si avvia.",
        featuresLabel: "Funzioni", featuresHeading: "Cosa sa fare l'app",
        featuresLede: "Ogni endpoint viene interrogato in modo indipendente; se uno si guasta, il resto dell'app continua a funzionare. I dati mancanti o errati diventano un «—» invece di un crash.",
        features: [
          { title: "Dashboard live", desc: "Una scheda principale per la prossima partita con avversario, orario d'inizio, sede ed emittente; incluso un conto alla rovescia fino al fischio d'inizio." },
          { title: "Tracking live", desc: "Play-by-play in tempo reale durante una partita in corso: inning o quarto attuale, punteggio, down-distance o conteggio ball-strike, e una timeline delle azioni realizzative." },
          { title: "Notifiche", desc: "Icona lampeggiante nella barra delle applicazioni se in primo piano, notifica toast se ridotta a icona; un promemoria una tantum al fischio d'inizio o al primo lancio, avvisi opzionali sui cambi di punteggio, limitati a un aggiornamento ogni 5 secondi." },
          { title: "Giocatore in evidenza", desc: "Una scheda del giocatore chiave selezionata automaticamente (quarterback o lanciatore partente) con le statistiche di stagione e l'andamento rispetto alla media di carriera." },
          { title: "Diagramma della formazione", desc: "Una formazione visiva sul campo o sul diamante, adattata allo sport; reparti offensivi nel football, posizioni in campo nel baseball." },
          { title: "Classifica di division", desc: "Classifica completa con vittorie/sconfitte, casa/trasferta, differenziale punti e serie in corso; con tooltip-glossario per ogni abbreviazione." },
          { title: "Stadio e storia", desc: "Dati dello stadio (anno di costruzione, capienza, dimensioni, superficie) accanto a una storia delle stagioni curata: curve di tendenza, titoli vinti, record di sempre." },
          { title: "Rosa e playoff", desc: "Una rosa filtrabile per reparto, consultabile per nome e numero; oltre ai tabelloni dei playoff automatici nella postseason." },
        ],
        historyLabel: "Profondità, non superficie", historyHeading: "Una storia che racconta storie",
        historyDesc: "La vista storica condensa decenni in pochi sguardi: una curva di tendenza vittorie/sconfitte sulle ultime stagioni, i titoli vinti come fila di stendardi e l'ERA recente della squadra in forma di barre.",
        historyTicks: ["Curva di tendenza con le stagioni di playoff e di titolo evidenziate", "Vittorie di sempre, migliore stagione dell'era moderna, serie di vittorie più lunga", "Un tema scuro nei colori della squadra; deliberatamente distinto dalla dashboard chiara"],
        teamLabel: "La tua squadra, la tua lingua", teamHeading: "Costruita per entrambe le leghe",
        teamDesc: "NFL e MLB condividono la stessa interfaccia; il selettore di squadra permette di passare tra tutte le 62 squadre, mentre glossari e diagrammi si adattano allo sport. Le impostazioni di lingua (DE/EN), tema e squadra predefinita sono a portata di clic.",
        teamTicks: ["Bilingue tramite i18next, con glossari specifici per sport", "Tema chiaro e scuro, con accenti nei colori della squadra", "Una modalità demo per provare senza connessione di rete"],
        everywhereLabel: "A casa ovunque", everywhereHeading: "Funziona su telefono, Mac e Windows",
        everywhereLede: "La stessa architettura difensiva, gli stessi dati; responsive dal desktop fino al telefono. La navigazione laterale ricorda la posizione di scorrimento, così è possibile saltare tra le sezioni all'istante.",
        techLabel: "Sotto il cofano", techHeading: "Fondamenta tecniche",
        techLede: "Cache-first e a prova di guasto: i dati sono visibili fin dal primo avvio, ogni chiamata API viene eseguita in isolamento e gli aggiornamenti arrivano tramite il Microsoft Store.",
        spec: [
          { dt: "Piattaforma", dd: "<strong>Tauri 2</strong> su base Rust per prestazioni native e multipiattaforma; un unico binario per Windows, macOS e layout mobili." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, compilato con <strong>Vite 7</strong>. Basato su componenti, tipizzato, veloce in build." },
          { dt: "Architettura", dd: "Pensata in modo difensivo: ogni endpoint viene interrogato in modo indipendente, così un guasto non si propaga. I dati mancanti diventano un <strong>«—»</strong> invece di un crash." },
          { dt: "Dati e offline", dd: "Dati in tempo reale dall'<strong>API JSON pubblica di ESPN</strong>, memorizzati in cache in modo persistente. Utilizzabile offline, con una modalità demo per provare senza rete." },
          { dt: "Lingua", dd: "<strong>i18next</strong> in tedesco/inglese con glossari specifici per sport; i tooltip spiegano ogni abbreviazione." },
          { dt: "Aggiornamenti", dd: "Distribuzione automatica tramite il <strong>Microsoft Store</strong>; nessun installer separato, nessun aggiornamento manuale." },
        ],
        designLabel: "Filosofia di design",
        designText: "L'app è progettata per un <strong style=\"color:var(--heading);font-weight:600\">basso carico cognitivo</strong> e una lettura rapida. L'approccio cache-first rende i dati visibili all'istante all'avvio; la navigazione laterale con tracciamento dello scorrimento permette di saltare tra le sezioni. I tooltip spiegano sistematicamente la terminologia; anche per chi (ancora) non conosce lo sport statunitense.",
        comingBadge: "Microsoft Store", comingText: "CheapSeats è distribuita esclusivamente tramite il Microsoft Store.",
        comingSoon: "In arrivo",
        githubBtn: "Ora su Microsoft Store", backFooter: "Torna alla home", madeByFooter: "CheapSeats · Made by Mika",
        screenshotNote: "Gli screenshot in questa pagina provengono da versioni di sviluppo e potrebbero differire dalla versione attuale dell'app.",
        updateBanner: {
          pill: "Novità",
          ticker: "CheapSeats v1.1 è arrivata: tracking live, notifiche e il rilascio ufficiale sul Microsoft Store +++ Le versioni per App Store e Play Store sono in arrivo +++ Promesso: CheapSeats resterà gratuita al 100% +++",
          cta: "Scopri le novità →",
        },
        changelogLabel: "Cronologia versioni", changelogHeading: "Cosa è cambiato",
        changelogLede: "Uno sguardo rapido alle versioni precedenti - senza date, così non sembra mai superato.",
        changelog: {
          v11: {
            tag: "v1.1 · Attuale", title: "Tracking live, notifiche e Microsoft Store",
            items: [
              "Tracking live: play-by-play in tempo reale, inning o quarto attuale, down-distance o conteggio ball-strike, e una timeline delle azioni realizzative",
              "Notifiche: icona lampeggiante nella barra delle applicazioni, notifica toast alla riduzione a icona, promemoria al fischio d'inizio e avvisi opzionali sui cambi di punteggio",
              "Rilascio ufficiale sul Microsoft Store: aggiornamenti automatici firmati, nessun installer, nessun prompt UAC",
              "La selezione della squadra ora viene mantenuta tra i riavvii, oltre all'avvio automatico con Windows",
              "Avvio circa il 40% più veloce con cache fredda",
            ],
          },
          v10: {
            tag: "v1.0 · Prima versione", title: "Le fondamenta",
            items: [
              "Dashboard con la prossima/ultima partita, conto alla rovescia e un'anteprima testa a testa",
              "Giocatore in evidenza con statistiche di stagione e andamento rispetto alla media di carriera",
              "Diagramma della formazione per NFL e MLB",
              "Classifica completa con tooltip-glossario per ogni abbreviazione",
              "Vista stadio e storia con titoli vinti e record di sempre",
              "Rosa ricercabile e tabelloni playoff automatici",
              "Bilingue EN/DE, tema chiaro/scuro, modalità demo",
            ],
          },
        },
      },
    },
  };

  /* ---------- core lang resolution ---------- */
  var SUPPORTED = ["de", "en", "fr", "es", "it"];
  var DEFAULT_LANG = "de";

  /* The URL is the source of truth for the active language: each language has
     its own prerendered page (/ = de, /en/, /fr/, /es/, /it/). Reading the path
     first guarantees the hydrated client matches the prerendered markup with no
     flash or hydration mismatch. localStorage / navigator only seed a *choice*
     for the root page and the very first visit. */
  function langFromPath() {
    if (!HAS_WINDOW || !window.location) return null;
    var seg = (window.location.pathname || "/").split("/")[1];
    return SUPPORTED.indexOf(seg) !== -1 ? seg : null;
  }

  function getLang() {
    // build-time prerender forces the language per page
    if (typeof globalThis !== "undefined" && globalThis.__PRERENDER_LANG__) {
      return globalThis.__PRERENDER_LANG__;
    }
    var fromPath = langFromPath();
    if (fromPath) return fromPath;
    var ls = safeStorage();
    var saved = ls && ls.getItem("lang");
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = ((HAS_WINDOW && navigator.language) || "").toLowerCase();
    for (var i = 0; i < SUPPORTED.length; i++) {
      if (nav.indexOf(SUPPORTED[i]) === 0) return SUPPORTED[i];
    }
    return DEFAULT_LANG;
  }

  /* The directory a language lives in. de stays at the site root so existing
     inbound links and the canonical home URL never change. */
  function pathForLang(code) {
    return code === DEFAULT_LANG ? "/" : "/" + code + "/";
  }

  /* Is the current document one of the prerendered homepage variants
     (/ or /<lang>/)? Only those have per-language URLs to navigate between.
     Sub-pages (e.g. /projects/cheapseats/, /impressum/) are single-URL and
     swap their text in place via the data-i18n binder. */
  function onPrerenderedHome() {
    if (!HAS_WINDOW || !window.location) return false;
    var path = window.location.pathname || "/";
    var stripped = path.replace(/^\/(de|en|fr|es|it)(?=\/|$)/, "");
    return stripped === "" || stripped === "/" || stripped === "/index.html";
  }

  /* Root-only locale redirect for humans: at the site root ("/") with no
     language in the path, send a returning or locale-matched visitor to their
     language directory. Crawlers (no JS) stay on "/" = the canonical German
     page; file:// (path contains a drive/filename) is left untouched. */
  if (HAS_WINDOW && window.location) {
    var _p = window.location.pathname || "/";
    if (_p === "/" || _p === "/index.html") {
      var _ls2 = safeStorage();
      var pref = (_ls2 && _ls2.getItem("lang")) || "";
      if (!pref) {
        var _nav = (navigator.language || "").toLowerCase();
        for (var _i = 0; _i < SUPPORTED.length; _i++) {
          if (_nav.indexOf(SUPPORTED[_i]) === 0) { pref = SUPPORTED[_i]; break; }
        }
      }
      if (pref && pref !== DEFAULT_LANG && SUPPORTED.indexOf(pref) !== -1) {
        window.location.replace(pathForLang(pref) + (window.location.search || "") + (window.location.hash || ""));
      }
    }
  }

  var activeLang = getLang();
  if (HAS_DOCUMENT) document.documentElement.lang = activeLang;

  function setLang(code) {
    if (SUPPORTED.indexOf(code) === -1) return;
    var ls = safeStorage();
    if (ls) ls.setItem("lang", code);
    if (code === activeLang) return;
    // On the homepage, navigate to the language's own prerendered URL so crawlers
    // and humans land on a real per-language page.
    if (HAS_WINDOW && window.location && onPrerenderedHome()) {
      window.location.assign(pathForLang(code) + (window.location.search || "") + (window.location.hash || ""));
      return;
    }
    // On single-URL sub-pages (and headless), swap the active language in place;
    // the data-i18n binder re-renders the text on the langchange event.
    activeLang = code;
    if (HAS_DOCUMENT) document.documentElement.lang = code;
    if (HAS_WINDOW) window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: code } }));
  }

  function resolvePath(obj, path) {
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  function t(key) {
    var value = resolvePath(TRANSLATIONS[activeLang], key);
    if (value === undefined) value = resolvePath(TRANSLATIONS.de, key);
    return value;
  }

  var I18N = {
    LANGUAGES: LANGUAGES,
    SUPPORTED: SUPPORTED,
    DEFAULT_LANG: DEFAULT_LANG,
    getLang: function () { return activeLang; },
    setLang: setLang,
    pathForLang: pathForLang,
    /* Build-time only: force the active language for the next render pass
       (no storage, no navigation). Used by build.mjs's prerender loop. */
    setActiveLang: function (code) {
      if (SUPPORTED.indexOf(code) === -1) return;
      activeLang = code;
      if (HAS_DOCUMENT) document.documentElement.lang = code;
    },
    t: t,
  };

  if (HAS_WINDOW) window.I18N = I18N;
  if (typeof module !== "undefined" && module.exports) module.exports = I18N;
})();
