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
    { code: "de", name: "Deutsch" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "it", name: "Italiano" },
  ];

  var TRANSLATIONS = {
    de: {
      meta: {
        title: "Mika Jeske · Werkstoffwissenschaft & Messtechnik",
        description: "Mika Jeske, Werkstoffwissenschaftler (B.Sc.) mit Fokus auf Messtechnik, Sensorik und zerstörungsfreie Prüfung. Seit Oktober 2026 im Master Metrologie und Messtechnik in Braunschweig und auf der Suche nach einer Werkstudentenstelle.",
      },
      hero: { eyebrow: "Werkstoffwissenschaft · B.Sc.", eyebrow2: "Metrologie · M.Sc.", scrollHint: "Scroll", aiImageLabel: "KI-bearbeitetes Bild", portraitAlt: "Porträt von Mika Jeske, dem Urheber und Protagonisten dieser Seite, in einem grauen Anzug, weißem Hemd und einer gestrickten Krawatte in Terrakotta. Mika zeigt auf den eigenen Namen und lächelt; mittellanges braunes Haar, braune Augen, glatt rasiert. Das Bild wurde mit KI-Werkzeugen bearbeitet." },
      trailer: { cv: "Lebenslauf", story: "Der kleine Maßstab", cheapseats: "CheapSeats", volunteering: "Ehrenamt", caption: "Such dir einen Einstieg aus oder scroll einfach weiter", enterLabel: "Zur Seite", replay: "Erneut abspielen" },
      intro: {
        headline: "Moin, ich bin Mika. Werkstoffwissenschaftler mit Fokus auf Messtechnik.",
        p1: "Beim PC-Bau mit meinem Cousin Jack ging es irgendwann um Kupferkühlkörper und Diamant-Wärmeleitpaste. Er hat gar nicht gemerkt, dass er damit mitten in meinem Fach gelandet war. Das mag ich an der Werkstoffwissenschaft: Sie steckt in Dingen, die man sowieso in der Hand hält. Altglas, das wieder zur Flasche wird, gehört genauso dazu.",
        p2: "Genau wird es für mich in der Messtechnik. Eine Zahl abzulesen ist einfach. Zu beurteilen, ob sie stimmt, ist Handwerk. Deshalb studiere ich seit Oktober Metrologie und Messtechnik im Master in Braunschweig. Ein Rasterelektronenmikroskop habe ich zu Hause nicht. Also baue ich nebenher diese Website und eigene Projekte, um beim Programmieren und beim Darstellen von Daten weiterzukommen.",
        photos: [
          "Bei der DGZfP in Magdeburg, die Einladung gehörte zum Award",
        ],
      },
      nav: { werkstudent: "Werkstudent", ehrenamt: "Ehrenamt", lebenslauf: "Lebenslauf", projekt: "Projekt", skipLabel: "Zum Abschnitt springen", newTab: "öffnet in neuem Tab" },
      seeking: {
        heading: "Ich suche eine Werkstudentenstelle",
        rows: [
          { k: "Stelle", v: "Werkstudent, ab November 2026" },
          { k: "Ort", v: "Braunschweig und Umgebung" },
          { k: "Umfang", v: "Bis 20 Stunden pro Woche neben dem Studium" },
          { k: "Themen", v: "Messtechnik, Sensorik, Dünnschichttechnik, ZfP" },
        ],
        cta: "Mein LinkedIn",
      },
      story: {
        heading: "Wie ich im Kleinen gelandet bin",
        p1: "Physik und Chemie haben mich schon in der Schule gepackt, reine Theorie hat mich aber nie gereizt. Eine Weile stand Pharmazie im Raum, das ist bei uns Familiensache. Dann kam die Werkstoffwissenschaft dazwischen, und die war so praktisch, wie ich es gesucht hatte.",
        p2: "Hängen geblieben bin ich im Mikro- und Nanobereich, weil dort alles filigran und fast schon ästhetisch ist. Ich habe lange auf Turnierniveau getanzt, und ein Professor hat mich darauf gebracht, dass das zusammenpasst. Die Parallele meine ich ernst: Beides verlangt Kontrolle und Eleganz im Detail.",
        figure: {
          x: "Temperatur (°C)",
          y: "Seebeck-Koeffizient (µV/K)",
          caption: "Relativer Seebeck-Koeffizient gesputterter Dünnschichten über die Temperatur. Nickel ist negativ, Silber und Aluminium sind positiv. Aus meiner Bachelorarbeit.",
        },
        figure2: {
          x: "Zeit (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Bismut ist normalerweise ein PTC-Leiter. Als gesputterte polykristalline Dünnschicht kehrt sich das um. Das ist ein Korngrenzeneffekt, den meine Bachelorarbeit berührt hat.",
        },
      },
      cleanroomTear: {
        intro: "Die nüchternste Zeile in meinem Lebenslauf war für mich die spannendste Zeit.",
        label: "Reinraum aufreißen",
        heading: "Unter der Oberfläche, im ISO-2-Reinraum",
        p1: "Ein halbes Jahr habe ich im ISO-2-Reinraum des Zentrums für Mikro- und Nanotechnik (ZMN) der TU Ilmenau gearbeitet: Magnetron-Sputtern, Profilometrie, REM/EDX, TiOₓ-Dünnschichten. Der Kontrast ist fast absurd. Die Umgebung ist bis ins Letzte kontrolliert, und mittendrin liegen Proben unter einem Quadratmillimeter, die sich partout nicht so verhalten wollen, wie sie sollen.",
        p2: "Ehrlich gesagt war es großartig dort. Endlich habe ich das getan, wovon ich vorher nur die Theorie kannte, und es fühlte sich an wie Forschung, wie man sie sich als Kind vorstellt.",
        p3: "Konkret waren das Ag-, Al-, Ni- und Bi-Schichten, der TFA-Aufbau und temperaturabhängige Transportmessungen. Darauf baut meine Bachelorarbeit auf.",
        photos: ["Sputterkammer, hier wächst die Schicht im Vakuum", "ISO-2-Reinraum, voll vermummt", "Profilometrie: Schichtdicke nachmessen", "Proben, kleiner als ein Fingernagel"],
      },
      confiTear: {
        label: "Mehr über meine Jugendarbeit erfahren:",
        teaser: "Mehrere Jahre lang habe ich Jugendliche durch Konfirmation und Freizeiten begleitet. Das hat mich mehr geprägt als so manche Vorlesung.",
        heading: "Sehen und gesehen werden",
        p1: "Über mehrere Jahre habe ich Gruppen in der Konfi- und offenen Jugendarbeit der Evangelischen Kirche in Ilmenau geleitet. Was die eigentliche Aufgabe ist, sagt einem vorher keiner: ansprechbar bleiben, während Jugendliche Glauben, Zweifel und das ganz normale Erwachsenwerden für sich sortieren. An Tagen, die bei mir selbst viel Luft nach oben hatten, kam oft jemand mit eigenen Themen. Mich dann ganz zurückzunehmen, hat öfter mich sortiert als den anderen.",
        p2: "Wer erwartet, dass Jugendliche aus sich herausgehen, muss im Lager als Erster im schrägen Kostüm dastehen. Wer dafür zu befangen ist, bekommt es von niemandem zurück. Ohne Angst vorangehen und vorleben, was man von anderen erwartet: So verstehe ich Zusammenarbeit seitdem, auch außerhalb der Jugendarbeit.",
        photos: ["Ausnahmsweise mal vor der Kamera", "Mittendrin", "Abendprogramm auf Freizeit"],
      },
      reunion: {
        heading: "Ein Wiedersehen planen",
        p1: "Nebenbei betreue ich {{site}}, die Seite zum Abitreffen meines Jahrgangs. Eine Karte zeigt, wie weit wir uns inzwischen verteilt haben. Dazu gibt es einen Countdown aus reiner Vorfreude und ein Kontaktformular, über das man sich meldet.",
        p2: "Die alten Schulfarben habe ich bewusst genommen, das fühlte sich einfach richtig an. Am liebsten schreibe ich den Jahrgangs-Newsletter, wegen der Antworten, die zurückkommen.",
        linkLabel: "ggi-abitur2022.de",
      },
      collaborations: {
        heading: "Mit Freunden",
        p1: "Im Filmclub der Uni haben Hendrik und ich schnell gemerkt, dass wir beide filmverrückt sind, nur von verschiedenen Seiten der Kamera aus. Er wollte dahinter stehen, ich davor.",
        entries: [
          {
            label: "Der Hochsitz", genre: "Kurzfilm · Horror/Thriller",
            note: "Ein paar Semester später hat Hendrik mich tatsächlich vor seine Kamera geholt. Der Hochsitz ist ein Kurzfilm von php, also Richard Hollandmoritz und Hendrik E. Peters. Richard hat Regie geführt, Hendrik stand hinter der Kamera, und ich durfte davor stehen (eigentlich meistens sitzen). Der Dreh hat einfach nur Spaß gemacht, und Hendriks andere Filme sind genauso gut.",
            href: "https://www.hendrik-e-peters.com/portfolio/filme/der-hochsitz/der-hochsitz.html",
            linkLabel: "Zum Film",
          },
          {
            label: "Popcorngeraschel", genre: "Podcast",
            note: "Den Podcast haben Hendrik und ich gestartet, weil wir sowieso nie aufgehört haben, über die Filme aus dem Programm unseres Studentenkinos zu reden. Inzwischen ist er offline, aber er hat uns eine kleine, richtig treue Hörer:innenschaft eingebracht: im Schnitt rund 50 Hörer:innen pro Folge, in der Spitze über 200, insgesamt im vierstelligen Bereich.",
          },
        ],
        posterCaption: "Offizielles Filmplakat",
        creditsBefore: "Danke an Richard und Hendrik von php. Ihr habt mich vor die Kamera geholt, und der Dreh war einer der schönsten Zufälle im Studium. Schaut euch ",
        creditsPortfolioLabel: "Hendriks Portfolio",
        creditsMiddle: " an oder folgt ",
        creditsInstagramLabel: "php auf Instagram",
        creditsAfter: ".",
      },
      resume: {
        title: "Lebenslauf",
        experienceHeading: "Berufserfahrung", educationHeading: "Bildungsweg",
        skillsHeading: "Kompetenzen", awardLabel: "Auszeichnung",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Praktikant Industrial Engineering", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualifizierung eines Betriebsmittels für den Serieneinsatz: Versuchsplanung, Prozesskontrolle und Prozessautomatisierung", "Evaluation und Beschaffung von Viskosimeter-Systemen mit eigenständigen Messreihen und Beschaffungsempfehlung", "Charakterisierung bleifreier Pastenalternativen mittels optischer Mikroskopie und Röntgenografie", "Neu entwickeltes Pastenmischer-Gerät gemeinsam mit der Fertigung eingeführt, inzwischen im Einsatz auf 100 % der relevanten Produktionsschritte"] },
        { role: "Wissenschaftlicher Assistent", org: "Zentrum für Mikro- und Nanotechnik · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Sputter-Abscheidung metallischer Dünnschichten (Al, Ag, Ti, Si) und Strukturierung per Lift-off im Reinraum", "Profilometrie, REM-Topografieanalyse und elektrische Charakterisierung (Van-der-Pauw)"] },
      ],
      education: [
        { role: "M.Sc. Metrologie und Messtechnik", org: "Technische Universität Braunschweig", period: "seit 10.2026", accent: true,
          points: ["Vertiefungsrichtung Sensorik und Messprinzipien, knüpft direkt an die Bachelorarbeit zu gesputterten Dünnschichten an", "Basisteil Metrologie: Messdatenauswertung und messtechnische Statistik", "Enge Anbindung an die Physikalisch-Technische Bundesanstalt als nationales Metrologieinstitut"] },
        { role: "B.Sc. Werkstoffwissenschaft · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Schwerpunkt metallische Werkstoffe, Dünnschichttechnik und Fertigungsverfahren", "Bachelorarbeit: Temperaturabhängige elektrische Eigenschaften gesputterter Dünnschichten (Note 1,0)", "Nominierung für die Studienstiftung des deutschen Volkes"] },
        { role: "Allgemeine Hochschulreife · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        heading: "Ehrenamt",
        photos: [
          "Anti-Rassismus-Workshop an einer Grundschule",
          "Vorbesprechung unseres Podcasts zum Studentenkino-Programm",
        ],
      },
      engagement: [
        { role: "Helfer in Grundausbildung", org: "Technisches Hilfswerk · OV Friedrichshafen, ab 11.2026 OV Peine", period: "seit 10.2025", accent: true,
          points: ["Grundausbildung im Zivil- und Katastrophenschutz im Team, mit Ausrichtung auf Fachberatung CBRN-Abwehr"] },
        { role: "Telefonberater · Nummer gegen Kummer", org: "Kinderschutzbund · Friedrichshafen, ab 11.2026 Braunschweig", period: "seit 02.2026",
          points: ["Ausbildung zur telefonischen Beratung für Kinder und Jugendliche in Krisensituationen", "Aktive Beratung auf systemisch-psychologischer Grundlage"] },
        { role: "Ehrenamtliche Gruppenleitung", org: "Evangelische Kirche Mitteldeutschland · Ilmenau", period: "seit 2022",
          points: ["Mehrjährige Gruppenleitung im mehrköpfigen Leitungsteam für Konfirmations- und offene Jugendarbeit", "Nach dem Umzug: Ansprechpartner, Eventplanung und Koordination im Team der Ehrenamtlichen", "Gemeinsam mit dem Leitungsteam Freizeiten und Events mit über 150 Teilnehmenden geleitet"] },
        { role: "Gewähltes Mitglied der Studierendenvertretung", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Studienausschuss im Universitätssenat: mit dem Gremium Hochschulpolitik und Studienordnungen mitgestaltet", { before: "Mitgestalter ", link: { href: "https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html", text: "Wahl-O-Mat zur Thüringer Landtagswahl 2024" }, after: " (bpb · MDR)" }] },
      ],
      skills: [
        { group: "Materialanalyse", items: ["REM / SEM", "Röntgenografie", "Profilometrie", "Gefügeanalyse", "Dünnschichttechnik", "Viskosimetrie"] },
        { group: "Methoden", items: ["Werkstoffcharakterisierung", "Reinraumarbeit", "Versuchsplanung", "Qualitätsprüfung", "Prozessautomatisierung"] },
        { group: "Software", items: ["LaTeX", "KI-Tools", "MS Office", "SAP", "FreeCAD"] },
        { group: "Sprachen", items: ["Deutsch (Muttersprache)", "Englisch (verhandlungssicher)"] },
      ],
      projects: {
        title: "CheapSeats",
        p1: "CheapSeats ist mein Sport-Dashboard für Windows. Du suchst dir aus 32 NFL- und 30 MLB-Teams eins pro Liga aus, machst die App auf und siehst, wann dein Team als Nächstes spielt und wie das letzte Spiel ausging. Läuft gerade ein Spiel, verfolgst du es Spielzug für Spielzug, und wenn sich der Spielstand ändert, sagt dir die App Bescheid.",
        p2: "Vorwissen brauchst du keins: Jede Abkürzung hat einen Tooltip, und ein Regelwerk ist eingebaut. CheapSeats gibt es kostenlos im Microsoft Store, auf Deutsch, Englisch und Spanisch. Du brauchst kein Konto, und die App schickt keine Nutzungsdaten nach Hause.",
        features: ["Live-Tracking", "Benachrichtigungen", "Player-Spotlight", "Lineup-Diagramm", "Standings & Venue", "History & Playoffs", "Roster mit Filter"],
        cta: "CheapSeats ansehen",
      },
      footer: {
        /* madeBy: no longer shown on the home page, still used by the CheapSeats footer */
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email:"E-Mail schreiben", phone: "Anrufen",
        emailAria: "E-Mail an Mika Jeske schreiben", phoneAria: "Mika Jeske anrufen",
        legal: "Impressum & Datenschutz",
        disclaimer: "Das Porträtbild sowie einzelne Textpassagen und die Übersetzungen dieser Seite wurden mit KI-Unterstützung erstellt bzw. überarbeitet und von mir inhaltlich geprüft. Maßgeblich ist die deutsche Fassung.",
        privacyNote: "Einzelne Personen wurden aus Datenschutz- oder rechtlichen Gründen unkenntlich gemacht.",
      },
      contact: { chip: "Kontakt aufnehmen" },
      langSwitcher: { selectLabel: "Sprache wählen", globeAria: "Sprache und Erscheinungsbild", optionAria: "{lang} auswählen" },
      theme: { label: "Erscheinungsbild", auto: "Auto", light: "Hell", dark: "Dunkel", groupAria: "Erscheinungsbild wählen", autoAria: "Automatisch – dem Gerät folgen", lightAria: "Helles Erscheinungsbild", darkAria: "Dunkles Erscheinungsbild" },
      cheapseats: {
        nav: { features: "Funktionen", deepDive: "Einblicke", mobile: "Mobil", tech: "Technik", updates: "Updates", download: "Jetzt herunterladen", menu: "Abschnitte", customize: "Anpassen", trailer: "Trailer" },
        backLink: "Startseite", title: "CheapSeats",
        heroSub: "CheapSeats ist mein Sport-Dashboard für Windows. App auf, und du siehst, wann dein Team als Nächstes spielt und wie das letzte Spiel ausging. Die Daten vom letzten Mal stehen sofort da, neue lädt die App im Hintergrund nach. Du suchst dir aus 32 NFL- und 30 MLB-Teams eins pro Liga aus. Voreingestellt ist keins.",
        dashboardK: "Dark & Light", dashboardV: "Dieselbe Übersicht, einmal dunkel und einmal hell: nächstes Spiel, letztes Ergebnis und Player-Spotlight.",
        trailerHeading: "Trailer",
        trailerLede: "Einmal kurz durchs Dashboard, bevor du die App installierst.",
        player: { play: "Abspielen", pause: "Pause", mute: "Ton aus", unmute: "Ton an", volume: "Lautstärke", seek: "Position im Video", fullscreen: "Vollbild", controls: "Videosteuerung" },
        featuresHeading: "Was die App kann",
        featuresLede: "Die wichtigen Zahlen stehen oben, und jeder Fachbegriff hat eine Erklärung. Ich wollte, dass man hinsieht und Bescheid weiß.",
        features: [
          { title: "Live-Dashboard", desc: "Das nächste Spiel mit Gegner, Anstoßzeit, Spielort, TV-Sender und den letzten fünf Duellen. Dazu ein Countdown bis zum Kickoff und ein Hinweis, wenn das Wetter schlecht wird." },
          { title: "Live-Tracking", desc: "Läuft ein Spiel, siehst du Play-by-Play in Echtzeit: Spielstand, Inning bzw. Viertel, Down und Distance bzw. Balls und Strikes, dazu eine Timeline der Scoring-Plays." },
          { title: "Benachrichtigungen", desc: "Ist die App im Vordergrund, blinkt nur die Taskleiste. Ist sie minimiert, kommt ein Toast. Du kannst dich einmalig an Anstoß oder ersten Wurf erinnern lassen und Spielstand-Alerts einschalten, höchstens einer alle 5 Sekunden." },
          { title: "Player-Spotlight", desc: "Eine Karte für den wichtigsten Spieler, die App wählt ihn selbst aus (Quarterback bzw. Starting Pitcher): Saisonwerte und der Trend gegenüber dem Karriereschnitt." },
          { title: "Formations-Diagramm", desc: "Die Aufstellung, eingezeichnet auf Feld oder Diamond: im Football die Offense-Gruppen, im Baseball die Feldpositionen." },
          { title: "Division-Tabelle", desc: "Die komplette Tabelle mit W/L, Heim und Auswärts, Run-Differential und Streak. Jede Abkürzung hat einen Tooltip aus dem Glossar." },
          { title: "Venue & History", desc: "Stadiondaten (Baujahr, Kapazität, Maße, Belag) und die kuratierte Saisonhistorie mit Trendkurven, Meistertiteln und All-Time-Rekorden." },
          { title: "Roster & Playoffs", desc: "Die Kaderliste, filterbar nach Positionsgruppe und durchsuchbar nach Name und Nummer. In der Postseason kommt das Playoff-Bracket dazu, auch wenn dein Team nicht dabei ist." },
          { title: "Watercooler", desc: "Gesprächsstoff zum nächsten Spiel: wie brisant es ist und was es fürs Playoff-Rennen heißt, die Recap-Schlagzeile, der herausragende Spieler, Meilensteine und wer bei deinem Team verletzt ist." },
          { title: "Instant Classic", desc: "Drei Spiele pro Woche aus der ganzen Liga, die ein „Hast du das gesehen?!“ wert sind. Ausgewählt nach Spannung, Verlängerung, Führungswechseln und Aufholjagden, mit Link zum Highlight-Clip." },
          { title: "Teams ansehen", desc: "Jedes andere Team öffnest du mit einem Klick, im Team-Selektor oder in der Tabelle: Spielplan, Kader, Tabelle, Playoffs und Watercooler. Dein eigenes Team bleibt dabei eingestellt." },
          { title: "Regelwerk & Formeln", desc: "Ein durchsuchbares Regelwerk mit den Grundlagen von NFL und MLB. Neue Kapitel erklären jede Wertung der App mit den echten Formeln." },
        ],
        easeHeading: "Du brauchst kein Vorwissen",
        easeDesc: "Noch nie ein Football- oder Baseballspiel gesehen? Macht nichts.",
        easeTicks: ["Beim ersten Start eine Tour in wenigen Schritten, die du jederzeit überspringen kannst", "Tooltips für jede Abkürzung und jede Position", "Ein durchsuchbares Regelwerk mit den Grundlagen von NFL und MLB"],
        fans: [
          { desc: "Alle 32 NFL- und 30 MLB-Teams stehen zur Wahl, eins pro Sportart. Oder keins, wenn dich eine Liga nicht interessiert." },
          { desc: "Für Zahlenmenschen: Win/Loss-Kurven, Meistertitel und Scoring-Trends der letzten acht Saisons." },
          { desc: "Für Ungeduldige: der Countdown bis zum Kickoff in Tagen, Stunden, Minuten und Sekunden, dazu Head-to-Head, Spielinfos und Saisonkontext." },
        ],
        customHeading: "Anpassen",
        customDesc: "Du kannst die App in den Farben deines Teams laufen lassen oder einen von 15 Farbverläufen nehmen.",
        customTicks: ["Hell- oder Dunkelmodus, auf Wunsch mit Sport-Icon", "Sidebar-Hintergründe, manche dezent, manche illustriert", "Schriftgröße und Standard-Tab einstellbar"],
        everywhereHeading: "Passt auch aufs Handy",
        everywhereLede: "Das Layout geht vom Desktop bis aufs Telefon mit, mit denselben Daten. Die Seitennavigation merkt sich, wo du warst, und springt direkt zu jedem Bereich.",
        techHeading: "Unter der Haube",
        techLede: "Die App zeigt zuerst, was im Cache liegt, und holt dann neue Daten. Jeder API-Aufruf läuft für sich: fällt einer aus, funktioniert der Rest weiter. Updates kommen über den Microsoft Store.",
        spec: [
          { dt: "Plattform", dd: "<strong>Tauri 2</strong> auf Rust-Basis, also eine native App. Ein Binary für Windows, macOS und mobile Layouts." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, gebaut mit <strong>Vite 7</strong>." },
          { dt: "Architektur", dd: "Gebaut, damit sich weitere Sportarten leicht ergänzen lassen: NFL und MLB teilen sich dieselbe Grundstruktur, nur Daten, Regeln und Glossar sind sportartspezifisch." },
          { dt: "Daten & Offline", dd: "Die Live-Daten kommen aus der öffentlichen <strong>ESPN-JSON-API</strong> und werden dauerhaft gecacht. Deshalb läuft die App auch offline, und zum Ausprobieren ohne Netz gibt es einen Demo-Modus." },
          { dt: "Sprache", dd: "<strong>i18next</strong> mit Deutsch, Englisch und Spanisch, jede Sportart mit eigenem Glossar. Tooltips erklären jede Abkürzung." },
          { dt: "Updates", dd: "Kommen automatisch über den <strong>Microsoft Store</strong>. Kein eigener Installer, nichts von Hand." },
          { dt: "Lizenzen", dd: "Keine Liga-Logos oder Spielerfotos; die Millionen dafür sind als Ein-Personen-Projekt schlicht nicht drin. Falls mir jemand einen Lizenzdeal schenken möchte: sehr gern ;)" },
        ],
        comingBadge: "Microsoft Store", comingText: "CheapSeats gibt es nur im Microsoft Store. Kostenlos, und das bleibt auch so.",
        comingSoon: "Bald verfügbar",
        githubBtn: "Zum Microsoft Store", backFooter: "Zurück zur Startseite",
        screenshotNote: "Die Screenshots auf dieser Seite stammen aus der Entwicklung und können vom aktuellen Stand der App abweichen.",
        updateBanner: {
          pill: "Neu",
          ticker: "+++ CheapSeats v1.3.1 ist da +++ Jetzt auch auf Spanisch +++ Andere Teams ansehen, ohne dein eigenes zu wechseln +++ Drei Instant Classics pro Woche im Watercooler +++ Es gibt jetzt einen Trailer +++ Versprochen: CheapSeats bleibt kostenlos +++",
          cta: "Was ist neu →",
        },
        changelogHeading: "Was sich getan hat",
        changelogLede: "Klick auf eine Karte, dann geht das komplette Changelog auf (nur auf Englisch).",
        changelog: {
          soon: { title: "Weitere Funktionen" },
          v13: {
            tag: "v1.3.1 · Aktuell", title: "Sandlot to Sunday",
            items: [
              "Spanisch als dritte App-Sprache, samt Glossar, Regelwerk und Datenschutzerklärung",
              "Andere Teams ansehen, ohne dein eigenes zu wechseln: Spielplan, Kader, Tabelle und Playoffs",
              "Instant Classic im Watercooler: drei Spiele pro Woche aus der ganzen Liga, die ein „Hast du das gesehen?!“ wert sind",
              "Die letzten fünf Duelle auf der Hero-Karte, Meilenstein-Tracker, Verletzungsüberblick und ein Spiel „An diesem Tag“",
              "Wetterhinweis zum nächsten Spiel, Playoff-Bracket für alle Teams in der Postseason und Regelwerk-Kapitel mit den Formeln hinter den Werten",
            ],
          },
          v12: {
            tag: "v1.2", title: "Watercooler Conversations",
            items: [
              "Der Watercooler: Brisanz und Playoff-Rennen zum nächsten Spiel, dazu Recap-Schlagzeile und herausragender Spieler des letzten Spiels",
              "Willkommensbildschirm beim ersten Start und kurze Tour zur Auswahl deiner NFL- und MLB-Teams",
              "Über 1.200 frei lizenzierte Spielerfotos, dazu zweifarbige Team-Farbmarker überall in der App",
              "Die Highlight-Suche schaut zuerst in die Playlist der Liga und sucht danach automatisch weiter",
              "Screenreader kündigen jetzt neue Watercooler-Themen an",
            ],
          },
          v11: {
            tag: "v1.1", title: "Yours, Live and in Color",
            items: [
              "Live-Tracking: Echtzeit-Play-by-Play, aktuelles Inning/Viertel, Down-Distance bzw. Ball-Strike-Zähler und eine Scoring-Play-Timeline",
              "Benachrichtigungen: Taskleisten-Blinken, Toast beim Minimieren, Kickoff-Erinnerung und optionale Spielstand-Alerts",
              "Offizieller Release im Microsoft Store: signierte Auto-Updates, kein Installer, kein UAC-Prompt",
              "Team-Auswahl bleibt über Neustarts hinweg erhalten, Autostart mit Windows",
              "Rund 40 % schnellerer Start bei kaltem Cache",
            ],
          },
          v10: {
            tag: "v1.0 · Erstveröffentlichung", title: "First Kickoff",
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
        title: "Mika Jeske · Materials Science & Measurement",
        description: "Mika Jeske, materials scientist (B.Sc.) focused on measurement technology, sensor technology and non-destructive testing. Studying the Master in Metrology and Measurement Technology in Braunschweig since October 2026 and looking for a working-student role.",
      },
      hero: { eyebrow: "Materials Science · B.Sc.", eyebrow2: "Metrology · M.Sc.", scrollHint: "Scroll", aiImageLabel: "AI-edited image", portraitAlt: "Portrait of Mika Jeske, the creator and protagonist of this site, in a grey suit, white dress shirt and a burnt sienna knitted tie. Mika is pointing towards their own name and smiling; medium-length brown hair, brown eyes, neatly shaven. The image was edited using AI tools." },
      trailer: { cv: "CV", story: "The small scale", cheapseats: "CheapSeats", volunteering: "Volunteering", caption: "Pick a way in or just keep scrolling", enterLabel: "Enter the site", replay: "Replay" },
      intro: {
        headline: "Hey, I'm Mika. A materials scientist focused on measurement.",
        p1: "Building a PC with my cousin Jack, we ended up on copper heatsinks and diamond thermal paste. He had no idea he had landed in the middle of my field. That is what I like about materials science: it sits inside things you are already holding. Waste glass melted back into bottles counts too.",
        p2: "Measurement is where it gets exact for me. Reading a number is easy. Judging whether it is right is a craft. That is why I have been studying the Master in Metrology and Measurement Technology in Braunschweig since October. I do not have a scanning electron microscope at home. So I build this site and my own projects on the side, to get further with programming and with presenting data.",
        photos: [
          "At the DGZfP in Magdeburg, the invitation came with the award",
        ],
      },
      nav: { werkstudent: "Working student", ehrenamt: "Volunteering", lebenslauf: "CV", projekt: "Project", skipLabel: "Skip to section", newTab: "opens in a new tab" },
      seeking: {
        heading: "I am looking for a working-student role",
        rows: [
          { k: "Role", v: "Working student, from November 2026" },
          { k: "Where", v: "Braunschweig and the surrounding area" },
          { k: "Hours", v: "Up to 20 hours a week alongside the degree" },
          { k: "Fields", v: "Measurement, sensors, thin films, NDT" },
        ],
        cta: "My LinkedIn",
      },
      story: {
        heading: "How I ended up in the small scale",
        p1: "Physics and chemistry gripped me back in school, but pure theory never tempted me. For a while pharmacy was on the table, which runs in my family. Then materials science came along, and it was as practical as I had hoped.",
        p2: "What stuck was the micro- and nano-scale, because everything there is fine and almost aesthetic. I danced at competition level for a long time, and a professor pointed out to me that the two fit together. I mean the parallel seriously: both demand control and elegance in the detail.",
        figure: {
          x: "Temperature (°C)",
          y: "Seebeck coefficient (µV/K)",
          caption: "Relative Seebeck coefficient of sputtered thin films vs. temperature. Nickel is negative, silver and aluminium are positive. From my Bachelor's thesis.",
        },
        figure2: {
          x: "Time (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Bismuth is normally a PTC conductor. Sputtered as a polycrystalline thin film, it inverts to NTC. That is a grain-boundary effect my Bachelor's thesis touched upon.",
        },
      },
      cleanroomTear: {
        intro: "The driest line in my résumé was, for me, the most exciting stretch of time.",
        label: "Tear open the cleanroom",
        heading: "Beneath the surface, in the ISO‑2 cleanroom",
        p1: "I spent half a year in the ISO 2 cleanroom of the Center for Micro- and Nanotechnology (ZMN) at TU Ilmenau: magnetron sputtering, profilometry, SEM/EDX, TiOₓ thin films. The contrast is almost absurd. The environment is controlled down to the last detail, and in the middle of it sit samples smaller than a square millimetre that flatly refuse to behave the way they should.",
        p2: "Honestly, it was great in there. I was finally doing the thing I had only known in theory, and it felt like research the way you imagine it as a child.",
        p3: "Concretely, that meant Ag, Al, Ni and Bi films, the TFA setup and temperature-dependent transport measurements. My bachelor’s thesis builds on them.",
        photos: ["Sputtering chamber, where the film grows under vacuum", "ISO‑2 cleanroom, fully suited up", "Profilometry: measuring film thickness", "Samples smaller than a fingernail"],
      },
      confiTear: {
        label: "Learn more about my youth work:",
        teaser: "For several years I guided teenagers through confirmation and camps. That shaped me more than many a lecture.",
        heading: "Seeing and being seen",
        p1: "For several years I led groups in the confirmation and open youth work of the Protestant Church in Ilmenau. Nobody tells you beforehand what the actual job is: staying approachable whilst young people sort out faith, doubt and the ordinary business of growing up. On days when I had plenty of room for improvement myself, someone would often come to me with something of their own. Stepping back completely in those moments sorted me out more often than it sorted them.",
        p2: "Anyone who expects young people to come out of their shell has to be the first at camp in the ridiculous costume. Anyone too self-conscious for that gets nothing back. Going first without fear and living out what you expect from others: that is how I have understood working together ever since, outside youth work too.",
        photos: ["For once, in front of the camera", "Right in the middle of it", "Evening programme on a youth camp"],
      },
      reunion: {
        heading: "Planning a reunion",
        p1: "On the side, I run {{site}}, the site for my graduating class's reunion. A map shows how far we have all scattered since. There is also a countdown built from pure anticipation and a contact form for getting in touch.",
        p2: "I deliberately kept the old school colours, it just felt right. My favourite part is writing the year-group newsletter, because of the replies that come back.",
        linkLabel: "ggi-abitur2022.de",
      },
      collaborations: {
        heading: "With Friends",
        p1: "In our university's film club, Hendrik and I figured out fast that we were both obsessed with cinema, just from opposite sides of the camera. He wanted to stand behind it, I wanted to stand in front.",
        entries: [
          {
            label: "Der Hochsitz", genre: "Short film · Horror/Thriller",
            note: "A few semesters later Hendrik actually put me in front of his camera. Der Hochsitz is a short film by php, aka Richard Hollandmoritz and Hendrik E. Peters. Richard directed, Hendrik was behind the camera, and I got to stand in front of it (actually, mostly sit). The shoot was honestly a blast, and the rest of Hendrik's films are just as good.",
            href: "https://www.hendrik-e-peters.com/portfolio/filme/der-hochsitz/der-hochsitz.html",
            linkLabel: "Watch the film",
          },
          {
            label: "Popcorngeraschel", genre: "Podcast",
            note: "Hendrik and I started the podcast because we couldn't stop talking about the films from our student cinema's programme anyway. It's offline now, but it earned us a small, genuinely loyal audience: around 50 listeners per episode on average, peaks over 200, and combined plays in the thousands.",
          },
        ],
        posterCaption: "Official film poster",
        creditsBefore: "Thank you to Richard and Hendrik of php. You put me in front of the camera, and that shoot turned out to be one of the best surprises of my studies. Check out ",
        creditsPortfolioLabel: "Hendrik's portfolio",
        creditsMiddle: " or follow ",
        creditsInstagramLabel: "php on Instagram",
        creditsAfter: ".",
      },
      resume: {
        title: "CV",
        experienceHeading: "Work Experience", educationHeading: "Education",
        skillsHeading: "Skills", awardLabel: "Award",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Industrial Engineering Intern", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualifying production equipment for series deployment: test planning, process control and process automation", "Evaluating and sourcing viscometer systems through independent test series and a procurement recommendation", "Characterising lead-free paste alternatives using optical microscopy and X-ray imaging", "Introduced a newly developed paste-mixer device together with production, now deployed across 100% of the relevant production steps"] },
        { role: "Research Assistant", org: "Center for Micro- and Nanotechnology · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Sputter deposition of metallic thin films (Al, Ag, Ti, Si) and lift-off patterning in the cleanroom", "Profilometry, SEM topography analysis and electrical characterisation (van der Pauw)"] },
      ],
      education: [
        { role: "M.Sc. Metrology and Measurement Technology", org: "Technische Universität Braunschweig", period: "since 10.2026", accent: true,
          points: ["Specialisation in sensor technology and measurement principles, a direct continuation of the bachelor's thesis on sputtered thin films", "Metrology core: measurement data evaluation and metrological statistics", "Closely tied to the Physikalisch-Technische Bundesanstalt, Germany's national metrology institute"] },
        { role: "B.Sc. Materials Science · 2.0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Focus on metallic materials, thin-film technology and manufacturing processes", "Bachelor's thesis: Temperature-dependent electrical properties of sputtered thin films (grade 1.0)", "Nominated for the German National Academic Foundation (Studienstiftung)"] },
        { role: "German university entrance qualification (Abitur) · 1.8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        heading: "Volunteering",
        photos: [
          "Anti-racism workshop at a primary school",
          "Planning our podcast on the student-cinema programme",
        ],
      },
      engagement: [
        { role: "Volunteer, Basic Training", org: "Technisches Hilfswerk · OV Friedrichshafen, from 11.2026 OV Peine", period: "since 10.2025", accent: true,
          points: ["Basic training in civil and disaster protection as part of a team, with a focus on CBRN defence advisory work"] },
        { role: "Telephone Counsellor · Kids' Helpline", org: "Kinderschutzbund · Friedrichshafen, from 11.2026 Braunschweig", period: "since 02.2026",
          points: ["Trained in telephone counselling for children and young people in crisis situations", "Active counselling grounded in systemic psychology"] },
        { role: "Volunteer Group Leader", org: "Protestant Church in Central Germany · Ilmenau", period: "since 2022",
          points: ["Several years leading groups as part of a multi-person leadership team, in confirmation classes and open youth work", "After relocating: contact person, event planning and coordination within the volunteer team", "Led camps and events together with the leadership team, with over 150 participants"] },
        { role: "Elected Student Representative", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Academic affairs committee in the university senate: helped shape higher-education policy and study regulations with the committee", { before: "Co-developed the ", link: { href: "https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html", text: "Wahl-O-Mat voting-aid tool for the 2024 Thuringia state election" }, after: " (bpb · MDR)" }] },
      ],
      skills: [
        { group: "Material Analysis", items: ["SEM", "X-ray imaging", "Profilometry", "Microstructure analysis", "Thin-film technology", "Viscometry"] },
        { group: "Methods", items: ["Materials characterisation", "Cleanroom work", "Experimental design", "Quality testing", "Process automation"] },
        { group: "Software", items: ["LaTeX", "AI tools", "MS Office", "SAP", "FreeCAD"] },
        { group: "Languages", items: ["German (native)", "English (business fluent)"] },
      ],
      projects: {
        title: "CheapSeats",
        p1: "CheapSeats is my sports dashboard for Windows. You pick one team per league from 32 NFL and 30 MLB clubs, open the app and see when your team plays next and how the last game went. If a game is on, you follow it play by play, and when the score changes, the app lets you know.",
        p2: "You don't need any prior knowledge: every abbreviation has a tooltip, and a rule book is built in. CheapSeats is free in the Microsoft Store, in German, English and Spanish. You don't need an account, and the app sends no usage data home.",
        features: ["Live tracking", "Notifications", "Player spotlight", "Lineup diagram", "Standings & venue", "History & playoffs", "Filterable roster"],
        cta: "View CheapSeats",
      },
      footer: {
        /* madeBy: no longer shown on the home page, still used by the CheapSeats footer */
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email:"Send an email", phone: "Call me",
        emailAria: "Send an email to Mika Jeske", phoneAria: "Call Mika Jeske",
        legal: "Legal notice & Privacy",
        disclaimer: "The portrait photo, some text passages, and the translations on this site were created or edited with AI assistance and reviewed by the author. The German version is authoritative.",
        privacyNote: "Some individuals have been blurred for privacy or legal reasons.",
      },
      contact: { chip: "Contact me now" },
      langSwitcher: { selectLabel: "Select Language", globeAria: "Language and appearance", optionAria: "Select {lang}" },
      theme: { label: "Appearance", auto: "Auto", light: "Light", dark: "Dark", groupAria: "Choose appearance", autoAria: "Automatic – follow device", lightAria: "Light appearance", darkAria: "Dark appearance" },
      cheapseats: {
        nav: { features: "Features", deepDive: "Close-ups", mobile: "Mobile", tech: "Tech", updates: "Updates", download: "Download now", menu: "Sections", customize: "Customise", trailer: "Trailer" },
        backLink: "Home", title: "CheapSeats",
        heroSub: "CheapSeats is my sports dashboard for Windows. Open the app and you see when your team plays next and how the last game went. The data from last time is there straight away, whilst the app fetches fresh numbers in the background. You pick one team per league from the 32 in the NFL and the 30 in MLB. None is preset.",
        dashboardK: "Dark & Light", dashboardV: "The same overview, once dark and once light: next game, last result and player spotlight.",
        trailerHeading: "Trailer",
        trailerLede: "A quick run through the dashboard before you install the app.",
        player: { play: "Play", pause: "Pause", mute: "Mute", unmute: "Unmute", volume: "Volume", seek: "Video position", fullscreen: "Fullscreen", controls: "Video controls" },
        featuresHeading: "What the app can do",
        featuresLede: "The numbers that matter sit at the top, and every piece of jargon has an explanation. I wanted you to look at it and know where things stand.",
        features: [
          { title: "Live dashboard", desc: "The next game with opponent, kickoff time, venue, broadcaster and the last five meetings. Plus a countdown to kickoff and a note when the weather turns bad." },
          { title: "Live tracking", desc: "While a game is on you get play-by-play in real time: score, inning or quarter, down and distance or balls and strikes, and a timeline of the scoring plays." },
          { title: "Notifications", desc: "If the app is in the foreground, only the taskbar blinks. If it is minimised, you get a toast. You can set a one-time reminder for kickoff or first pitch and switch on score alerts, at most one every 5 seconds." },
          { title: "Player Spotlight", desc: "A card for the key player, picked by the app itself (quarterback or starting pitcher): season stats and the trend against the career average." },
          { title: "Formation diagram", desc: "The lineup, drawn onto the field or the diamond: offensive groupings in football, field positions in baseball." },
          { title: "Division standings", desc: "The full standings with W/L, home and away, run differential and streak. Every abbreviation has a tooltip from the glossary." },
          { title: "Venue & history", desc: "Stadium data (year built, capacity, dimensions, surface) and the curated season history with trend charts, championships and all-time records." },
          { title: "Roster & playoffs", desc: "The roster, filterable by position group and searchable by name and number. In the postseason the playoff bracket joins it, even if your team isn't in it." },
          { title: "Watercooler", desc: "Talking points for the next game: how much is at stake and what it means for the playoff race, the recap headline, the standout player, milestones and who on your team is injured." },
          { title: "Instant Classic", desc: "Three games a week from across the league that are worth a “did you see that?!”. Picked for closeness, overtime, lead changes and comebacks, with a link to the highlight clip." },
          { title: "Browse any team", desc: "You open any other team with one click, from the team selector or the standings: schedule, roster, standings, playoffs and Watercooler. Your own team stays set." },
          { title: "Rule Book & formulas", desc: "A searchable rule book with the basics of the NFL and MLB. New chapters explain every rating in the app with the actual formulas." },
        ],
        easeHeading: "You don't need to know the sport",
        easeDesc: "Never watched a football or baseball game? Doesn't matter.",
        easeTicks: ["On first launch, a tour in a few steps that you can skip at any time", "Tooltips for every abbreviation and every position", "A searchable rule book with the basics of the NFL and MLB"],
        fans: [
          { desc: "All 32 NFL and 30 MLB teams are on offer, one per sport. Or none, if a league isn't your thing." },
          { desc: "For the stats nerds: win/loss curves, championships and scoring trends across the last eight seasons." },
          { desc: "For the impatient: the countdown to kickoff in days, hours, minutes and seconds, plus head-to-head, game info and season context." },
        ],
        customHeading: "Customise",
        customDesc: "You can run the app in your team's colours or take one of 15 gradients.",
        customTicks: ["Light or dark mode, with the sport icon if you like", "Sidebar backgrounds, some subtle, some illustrated", "Font size and default tab are adjustable"],
        everywhereHeading: "Fits on a phone too",
        everywhereLede: "The layout follows from desktop down to phone, with the same data. The side navigation remembers where you were and jumps straight to any section.",
        techHeading: "Under the hood",
        techLede: "The app first shows what is in the cache, then fetches new data. Every API call runs on its own: if one fails, the rest keeps working. Updates arrive through the Microsoft Store.",
        spec: [
          { dt: "Platform", dd: "<strong>Tauri 2</strong> on top of Rust, so a native app. One binary for Windows, macOS and mobile layouts." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, built with <strong>Vite 7</strong>." },
          { dt: "Architecture", dd: "Built so more sports are easy to add: NFL and MLB share the same foundation, and only data, rules and glossary are specific to each sport." },
          { dt: "Data & Offline", dd: "Live data comes from the public <strong>ESPN JSON API</strong> and is kept in a persistent cache. That is why the app also works offline, and there is a demo mode for trying it without a network." },
          { dt: "Language", dd: "<strong>i18next</strong> with German, English and Spanish, each sport with its own glossary. Tooltips explain every abbreviation." },
          { dt: "Updates", dd: "They arrive automatically through the <strong>Microsoft Store</strong>. No separate installer, nothing to do by hand." },
          { dt: "Licensing", dd: "No league logos or player photos; the millions that costs are simply out of reach for a one-person project. If anyone wants to gift me a licensing deal, I would love to talk ;)" },
        ],
        comingBadge: "Microsoft Store", comingText: "CheapSeats is only available in the Microsoft Store. Free, and it stays that way.",
        comingSoon: "Coming soon",
        githubBtn: "To the Microsoft Store", backFooter: "Back to home",
        screenshotNote: "Screenshots on this page are from development builds and may differ from the current version of the app.",
        updateBanner: {
          pill: "New",
          ticker: "+++ CheapSeats v1.3.1 is here +++ Now in Spanish too +++ Browse other teams without switching your own +++ Three Instant Classics a week in the Watercooler +++ There is a trailer now +++ Promise: CheapSeats stays free +++",
          cta: "See what's new →",
        },
        changelogHeading: "What's changed",
        changelogLede: "Click a card and the full changelog opens.",
        changelog: {
          soon: { title: "More features" },
          v13: {
            tag: "v1.3.1 · Current", title: "Sandlot to Sunday",
            items: [
              "Spanish as a third app language, including the glossary, Rule Book and privacy statement",
              "Browse any team without changing the one you follow: schedule, roster, standings and playoffs",
              "Instant Classic in the Watercooler: three games a week from across the league that are worth a “did you see that?!”",
              "Rivalry line on the hero card, milestone tracker, injury digest and an On this day game",
              "Weather note for the next game, the playoff bracket for every team in the postseason and Rule Book sections with the formulas behind the ratings",
            ],
          },
          v12: {
            tag: "v1.2", title: "Watercooler Conversations",
            items: [
              "The Watercooler: next-game stakes and playoff race, plus the last game's recap headline and standout player",
              "A first-launch welcome screen and short tour to pick your NFL and MLB teams",
              "Over 1,200 freely licensed player photos, plus two-tone team color markers throughout",
              "Smarter highlight-clip discovery: checks the league's own playlist first and keeps retrying automatically",
              "Screen readers now announce new Watercooler talking points",
            ],
          },
          v11: {
            tag: "v1.1", title: "Yours, Live and in Color",
            items: [
              "Live tracking: real-time play-by-play, current inning/quarter, down-distance or balls-strikes, and a scoring-play timeline",
              "Notifications: taskbar blink, toast when minimized, a kickoff reminder and optional score-change alerts",
              "Official Microsoft Store release: signed auto-updates, no installer, no UAC prompt",
              "Team selection now persists across restarts, plus auto-start with Windows",
              "About 40% faster startup on a cold cache",
            ],
          },
          v10: {
            tag: "v1.0 · Initial release", title: "First Kickoff",
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
        title: "Mika Jeske · Science des matériaux & métrologie",
        description: "Mika Jeske, scientifique des matériaux (B.Sc.) spécialisé en métrologie, capteurs et contrôle non destructif. En master de métrologie et techniques de mesure à Brunswick depuis octobre 2026 et à la recherche d’un poste d’étudiant salarié.",
      },
      hero: { eyebrow: "Science des matériaux · B.Sc.", eyebrow2: "Métrologie · M.Sc.", scrollHint: "Scroll", aiImageLabel: "Image retouchée par IA", portraitAlt: "Portrait de Mika Jeske, créateur et protagoniste de ce site, en costume gris, chemise blanche et cravate tricotée terre de Sienne brûlée. Mika pointe son propre nom en souriant ; cheveux bruns mi-longs, yeux marron, rasé de près. L'image a été retouchée à l'aide d'outils d'IA." },
      trailer: { cv: "Parcours", story: "La petite échelle", cheapseats: "CheapSeats", volunteering: "Bénévolat", caption: "Choisis une entrée ou continue simplement à défiler", enterLabel: "Entrer sur le site", replay: "Revoir" },
      intro: {
        headline: "Salut, moi c’est Mika. Scientifique des matériaux, spécialisé en métrologie.",
        p1: "En montant un PC avec mon cousin Jack, on a fini sur les dissipateurs en cuivre et la pâte thermique au diamant. Il ne s’est même pas rendu compte qu’il venait d’atterrir en plein dans mon domaine. C’est ce qui me plaît dans la science des matériaux : elle se cache dans des objets qu’on a déjà en main. Le verre usagé refondu en bouteilles en fait partie.",
        p2: "C’est en métrologie que ça devient exact pour moi. Relever un chiffre est simple. Juger s’il est juste est un métier. C’est pourquoi je suis depuis octobre le master en métrologie et techniques de mesure à Brunswick. Je n’ai pas de microscope électronique à balayage chez moi. Alors je construis en parallèle ce site et mes propres projets, pour progresser en programmation et en présentation de données.",
        photos: [
          "À la DGZfP à Magdebourg, l’invitation faisait partie du prix",
        ],
      },
      nav: { werkstudent: "Étudiant salarié", ehrenamt: "Bénévolat", lebenslauf: "Parcours", projekt: "Projet", skipLabel: "Aller à la section", newTab: "s'ouvre dans un nouvel onglet" },
      seeking: {
        heading: "Je cherche un poste d’étudiant salarié",
        rows: [
          { k: "Poste", v: "Étudiant salarié, à partir de novembre 2026" },
          { k: "Lieu", v: "Brunswick et ses environs" },
          { k: "Volume", v: "Jusqu’à 20 heures par semaine en parallèle des études" },
          { k: "Domaines", v: "Métrologie, capteurs, couches minces, CND" },
        ],
        cta: "Mon LinkedIn",
      },
      story: {
        heading: "Comment j'en suis venu à l'échelle microscopique",
        p1: "La physique et la chimie m’ont passionné dès le lycée, mais la théorie pure ne m’a jamais tenté. Un temps, la pharmacie a été envisagée, c’est une affaire de famille chez nous. Puis la science des matériaux est arrivée, et elle était aussi pratique que je l’espérais.",
        p2: "Je suis resté accroché au domaine micro- et nanométrique, parce que tout y est fin et presque esthétique. J’ai longtemps dansé en compétition, et c’est un professeur qui m’a fait remarquer que les deux vont ensemble. Je prends ce parallèle au sérieux : les deux exigent du contrôle et de l’élégance dans le détail.",
        figure: {
          x: "Température (°C)",
          y: "Coefficient Seebeck (µV/K)",
          caption: "Coefficient Seebeck relatif de couches minces pulvérisées en fonction de la température. Le nickel est négatif, l'argent et l'aluminium sont positifs. Extrait de mon mémoire de licence.",
        },
        figure2: {
          x: "Temps (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Le bismuth est normalement un conducteur PTC. Pulvérisé en couche mince polycristalline, il s'inverse en NTC. C'est un effet de joints de grains que mon mémoire de licence a abordé.",
        },
      },
      cleanroomTear: {
        intro: "La ligne la plus sobre de mon CV a été, pour moi, la période la plus passionnante.",
        label: "Ouvrir la salle blanche",
        heading: "Sous la surface, dans la salle blanche ISO‑2",
        p1: "J’ai passé six mois dans la salle blanche ISO‑2 du Centre de micro- et nanotechnologies (ZMN) de la TU Ilmenau : pulvérisation magnétron, profilométrie, MEB/EDX, couches minces de TiOₓ. Le contraste est presque absurde. L’environnement est contrôlé jusqu’au moindre détail, et au milieu se trouvent des échantillons de moins d’un millimètre carré qui refusent obstinément de se comporter comme ils le devraient.",
        p2: "Honnêtement, c’était formidable d’y travailler. Je faisais enfin ce dont je ne connaissais que la théorie, et ça ressemblait à la recherche telle qu’on l’imagine enfant.",
        p3: "Concrètement, il s’agissait de couches d’Ag, d’Al, de Ni et de Bi, du dispositif TFA et de mesures de transport en fonction de la température. Mon mémoire de licence s’appuie dessus.",
        photos: ["Chambre de pulvérisation, la couche y croît sous vide", "Salle blanche ISO‑2, intégralement équipé", "Profilométrie : mesure de l'épaisseur des couches", "Échantillons plus petits qu'un ongle"],
      },
      confiTear: {
        label: "En savoir plus sur mon animation jeunesse :",
        teaser: "Pendant plusieurs années, j'ai accompagné des jeunes en catéchèse et en camps. Cela m'a plus marqué que bien des cours magistraux.",
        heading: "Voir et être vu",
        p1: "Pendant plusieurs années, j’ai animé des groupes de catéchèse et d’animation jeunesse ouverte à l’Église protestante d’Ilmenau. Personne ne vous dit à l’avance quelle est la véritable mission : rester accessible pendant que des jeunes démêlent foi, doutes et le simple fait de grandir. Les jours où mon propre moral laissait à désirer, quelqu’un venait souvent me voir avec ses propres sujets. Me mettre complètement de côté dans ces moments-là m’a recentré plus souvent que lui.",
        p2: "Celui qui attend des jeunes qu’ils sortent de leur coquille doit être le premier en costume ridicule au camp. Celui qui est trop gêné pour cela n’obtient rien en retour. Avancer sans crainte et incarner ce que l’on attend des autres : c’est ainsi que je conçois la collaboration depuis, en dehors de l’animation jeunesse aussi.",
        photos: ["Exceptionnellement devant l'objectif", "En plein cœur de l'action", "Soirée animée pendant un camp"],
      },
      reunion: {
        heading: "Organiser des retrouvailles",
        p1: "À côté, je m'occupe de {{site}}, le site des retrouvailles de ma promotion du baccalauréat. Une carte montre à quel point nous nous sommes dispersés depuis. Il y a aussi un compte à rebours né d'une pure impatience et un formulaire de contact pour se manifester.",
        p2: "J'ai délibérément repris les anciennes couleurs de l'école, cela me semblait tout simplement juste. Ce que je préfère, c'est rédiger la newsletter de la promotion, pour les réponses qui reviennent.",
        linkLabel: "ggi-abitur2022.de",
      },
      collaborations: {
        heading: "Entre amis",
        p1: "Dans le ciné-club de la fac, Hendrik et moi avons vite compris qu'on était tous les deux mordus de cinéma, juste chacun d'un côté différent de la caméra. Lui voulait rester derrière, moi je voulais être devant.",
        entries: [
          {
            label: "Der Hochsitz", genre: "Court métrage · Horreur/Thriller",
            note: "Quelques semestres plus tard, Hendrik m'a vraiment mis devant sa caméra. Der Hochsitz est un court métrage de php, autrement dit Richard Hollandmoritz et Hendrik E. Peters. Richard a réalisé, Hendrik était derrière la caméra, et moi devant (surtout assis, en fait). Le tournage était vraiment hyper fun, et le reste des films d'Hendrik vaut tout autant le détour.",
            href: "https://www.hendrik-e-peters.com/portfolio/filme/der-hochsitz/der-hochsitz.html",
            linkLabel: "Voir le film",
          },
          {
            label: "Popcorngeraschel", genre: "Podcast",
            note: "Hendrik et moi avons lancé le podcast parce qu'on n'arrêtait de toute façon pas de parler des films au programme de notre ciné-club étudiant. Il est à l'arrêt maintenant, mais il nous a valu un petit public vraiment fidèle : environ 50 auditeurs/trices par épisode en moyenne, des pics à plus de 200 et plusieurs milliers d'écoutes au total.",
          },
        ],
        posterCaption: "Affiche officielle du film",
        creditsBefore: "Merci à Richard et Hendrik de php. Vous m'avez mis devant la caméra, et ce tournage a été l'une des plus belles surprises de mes études. Découvrez ",
        creditsPortfolioLabel: "le portfolio de Hendrik",
        creditsMiddle: " ou suivez ",
        creditsInstagramLabel: "php sur Instagram",
        creditsAfter: ".",
      },
      resume: {
        title: "Parcours",
        experienceHeading: "Expérience professionnelle", educationHeading: "Formation",
        skillsHeading: "Compétences", awardLabel: "Distinction",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Stagiaire en ingénierie industrielle", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualification d'un équipement de production pour un déploiement en série : planification des essais, contrôle et automatisation des processus", "Évaluation et acquisition de systèmes viscosimétriques, avec séries de mesures menées de façon autonome et recommandation d'achat", "Caractérisation d'alternatives de pâtes sans plomb par microscopie optique et radiographie", "Introduction, avec la production, d'un nouveau dispositif mélangeur de pâte, désormais déployé sur 100 % des étapes de production concernées"] },
        { role: "Assistant de recherche", org: "Centre de micro- et nanotechnologies · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Dépôt par pulvérisation cathodique de couches minces métalliques (Al, Ag, Ti, Si) et structuration par lift-off en salle blanche", "Profilométrie, analyse topographique par MEB et caractérisation électrique (méthode de van der Pauw)"] },
      ],
      education: [
        { role: "Master (M.Sc.) en métrologie et techniques de mesure", org: "Technische Universität Braunschweig", period: "depuis 10.2026", accent: true,
          points: ["Spécialisation en capteurs et principes de mesure, dans le prolongement direct du mémoire de licence sur les couches minces pulvérisées", "Tronc commun de métrologie : exploitation des données de mesure et statistiques métrologiques", "Lien étroit avec la Physikalisch-Technische Bundesanstalt, institut national allemand de métrologie"] },
        { role: "Licence (B.Sc.) en science des matériaux · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Spécialisation en matériaux métalliques, technologie des couches minces et procédés de fabrication", "Mémoire de licence : propriétés électriques en fonction de la température de couches minces pulvérisées (note 1,0)", "Nommé pour la Fondation nationale allemande pour les études (Studienstiftung)"] },
        { role: "Baccalauréat allemand (Abitur) · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        heading: "Bénévolat",
        photos: [
          "Atelier antiraciste dans une école primaire",
          "Préparation de notre podcast sur le programme du cinéma étudiant",
        ],
      },
      engagement: [
        { role: "Bénévole, formation de base", org: "Technisches Hilfswerk · OV Friedrichshafen, à partir de 11.2026 OV Peine", period: "depuis 10.2025", accent: true,
          points: ["Formation de base en protection civile et gestion des catastrophes en équipe, orientée vers le conseil spécialisé en défense NRBC"] },
        { role: "Conseiller téléphonique · Ligne d'écoute pour enfants", org: "Kinderschutzbund · Friedrichshafen, à partir de 11.2026 Brunswick", period: "depuis 02.2026",
          points: ["Formation au conseil téléphonique pour enfants et adolescents en situation de crise", "Conseil actif fondé sur une approche psychologique systémique"] },
        { role: "Responsable de groupe bénévole", org: "Église protestante d'Allemagne centrale · Ilmenau", period: "depuis 2022",
          points: ["Plusieurs années à la tête de groupes en équipe d'encadrement, dans la catéchèse et l'animation jeunesse ouverte", "Après le déménagement : interlocuteur, organisation d'événements et coordination au sein de l'équipe de bénévoles", "Direction, avec l'équipe d'encadrement, de camps et d'événements réunissant plus de 150 participants"] },
        { role: "Membre élu de la représentation étudiante", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Commission des affaires académiques au sénat universitaire : contribution, avec la commission, à la politique de l'enseignement supérieur et aux règlements d'études", { before: "Co-concepteur du ", link: { href: "https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html", text: "Wahl-O-Mat, outil d'aide au vote pour les élections régionales de Thuringe 2024" }, after: " (bpb · MDR)" }] },
      ],
      skills: [
        { group: "Analyse des matériaux", items: ["MEB", "Radiographie", "Profilométrie", "Analyse microstructurale", "Technologie des couches minces", "Viscosimétrie"] },
        { group: "Méthodes", items: ["Caractérisation des matériaux", "Travail en salle blanche", "Planification d'essais", "Contrôle qualité", "Automatisation des processus"] },
        { group: "Logiciels", items: ["LaTeX", "Outils IA", "MS Office", "SAP", "FreeCAD"] },
        { group: "Langues", items: ["Allemand (langue maternelle)", "Anglais (courant professionnel)"] },
      ],
      projects: {
        title: "CheapSeats",
        p1: "CheapSeats est mon tableau de bord sportif pour Windows. Tu choisis une équipe par ligue parmi les 32 de la NFL et les 30 de la MLB, tu ouvres l'application et tu vois quand ton équipe joue son prochain match et comment le dernier s'est terminé. Si un match est en cours, tu le suis action par action, et quand le score change, l'application te prévient.",
        p2: "Pas besoin de connaissances préalables : chaque abréviation a son infobulle, et un livret de règles est intégré. CheapSeats est gratuit sur le Microsoft Store, en allemand, en anglais et en espagnol. Tu n'as pas besoin de compte, et l'application n'envoie aucune donnée d'utilisation.",
        features: ["Suivi en direct", "Notifications", "Joueur à l'honneur", "Diagramme de composition", "Classement et stade", "Historique et playoffs", "Effectif filtrable"],
        cta: "Découvrir CheapSeats",
      },
      footer: {
        /* madeBy: no longer shown on the home page, still used by the CheapSeats footer */
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email:"Envoyer un e-mail", phone: "M'appeler",
        emailAria: "Envoyer un e-mail à Mika Jeske", phoneAria: "Appeler Mika Jeske",
        legal: "Mentions légales & confidentialité",
        disclaimer: "Le portrait, certains passages de texte et les traductions de ce site ont été créés ou retravaillés avec l'aide de l'IA et relus par l'auteur. La version allemande fait foi.",
        privacyNote: "Certaines personnes ont été floutées pour des raisons de confidentialité ou juridiques.",
      },
      contact: { chip: "Me contacter" },
      langSwitcher: { selectLabel: "Choisir la langue", globeAria: "Langue et apparence", optionAria: "Sélectionner le {lang}" },
      theme: { label: "Apparence", auto: "Auto", light: "Clair", dark: "Sombre", groupAria: "Choisir l'apparence", autoAria: "Automatique – suivre l'appareil", lightAria: "Apparence claire", darkAria: "Apparence sombre" },
      cheapseats: {
        nav: { features: "Fonctions", deepDive: "Aperçus", mobile: "Mobile", tech: "Technique", updates: "Mises à jour", download: "Télécharger", menu: "Sections", customize: "Personnaliser", trailer: "Bande-annonce" },
        backLink: "Accueil", title: "CheapSeats",
        heroSub: "CheapSeats est mon tableau de bord sportif pour Windows. Tu ouvres l'application et tu vois quand ton équipe joue son prochain match et comment le dernier s'est terminé. Les données de la dernière fois sont là tout de suite, l'application charge les nouvelles en arrière-plan. Tu choisis une équipe par ligue parmi les 32 de la NFL et les 30 de la MLB. Aucune n'est préréglée.",
        dashboardK: "Dark & Light", dashboardV: "La même vue d'ensemble, une fois sombre et une fois claire : prochain match, dernier résultat et joueur à l'honneur.",
        trailerHeading: "Bande-annonce",
        trailerLede: "Un tour rapide du tableau de bord avant d'installer l'application.",
        player: { play: "Lire", pause: "Pause", mute: "Couper le son", unmute: "Activer le son", volume: "Volume", seek: "Position dans la vidéo", fullscreen: "Plein écran", controls: "Commandes vidéo" },
        featuresHeading: "Ce que l'application sait faire",
        featuresLede: "Les chiffres importants sont en haut, et chaque terme technique a son explication. Je voulais qu'on regarde et qu'on sache où on en est.",
        features: [
          { title: "Tableau de bord en direct", desc: "Le prochain match avec l'adversaire, l'heure du coup d'envoi, le lieu, le diffuseur et les cinq dernières confrontations. En plus, un compte à rebours jusqu'au coup d'envoi et une note quand la météo se gâte." },
          { title: "Suivi en direct", desc: "Pendant un match, tu as le play-by-play en temps réel : score, manche ou quart-temps, down et distance ou balles et strikes, et une chronologie des actions marquantes." },
          { title: "Notifications", desc: "Si l'application est au premier plan, seule la barre des tâches clignote. Si elle est réduite, tu reçois une notification. Tu peux demander un rappel unique au coup d'envoi ou au premier lancer et activer les alertes de score, au plus une toutes les 5 secondes." },
          { title: "Joueur à l'honneur", desc: "Une carte pour le joueur clé, choisi par l'application elle-même (quarterback ou lanceur partant) : ses statistiques de la saison et la tendance par rapport à sa moyenne de carrière." },
          { title: "Diagramme de formation", desc: "La composition, dessinée sur le terrain ou le diamant : les groupes offensifs au football américain, les positions sur le terrain au baseball." },
          { title: "Classement de division", desc: "Le classement complet avec victoires/défaites, domicile et extérieur, différentiel de points et série en cours. Chaque abréviation a son info-bulle tirée du glossaire." },
          { title: "Stade et historique", desc: "Les données du stade (année de construction, capacité, dimensions, surface) et l'historique sélectionné des saisons avec courbes de tendance, titres remportés et records historiques." },
          { title: "Effectif et playoffs", desc: "L'effectif, filtrable par groupe de poste et consultable par nom et numéro. En phase finale s'y ajoute le tableau des playoffs, même si ton équipe n'y est pas." },
          { title: "Watercooler", desc: "De quoi discuter avant le prochain match : l'enjeu et ce qu'il change dans la course aux playoffs, la manchette du récap, le joueur en vue, les jalons et les blessés de ton équipe." },
          { title: "Instant Classic", desc: "Trois matchs par semaine, toutes équipes confondues, qui méritent un « tu as vu ça ?! ». Choisis selon l'écart, les prolongations, les changements de leader et les remontées, avec un lien vers le résumé vidéo." },
          { title: "Consulter n'importe quelle équipe", desc: "Tu ouvres n'importe quelle autre équipe d'un clic, depuis le sélecteur ou le classement : calendrier, effectif, classement, playoffs et Watercooler. Ton équipe, elle, ne change pas." },
          { title: "Guide des règles et formules", desc: "Un guide des règles consultable avec les bases de la NFL et de la MLB. De nouveaux chapitres expliquent chaque note de l'application avec les vraies formules." },
        ],
        easeHeading: "Pas besoin de connaître le sport",
        easeDesc: "Jamais vu un match de football américain ou de baseball ? Ce n'est pas grave.",
        easeTicks: ["Au premier lancement, une visite en quelques étapes que tu peux passer à tout moment", "Des info-bulles pour chaque abréviation et chaque poste", "Un guide des règles consultable avec les bases de la NFL et de la MLB"],
        fans: [
          { desc: "Les 32 équipes NFL et les 30 équipes MLB sont au choix, une par sport. Ou aucune, si une ligue ne t'intéresse pas." },
          { desc: "Pour les passionnés de chiffres : courbes victoires/défaites, titres remportés et tendances de points sur les huit dernières saisons." },
          { desc: "Pour les impatients : le compte à rebours jusqu'au coup d'envoi en jours, heures, minutes et secondes, avec le face-à-face, les infos du match et le contexte de la saison." },
        ],
        customHeading: "Personnaliser",
        customDesc: "Tu peux faire tourner l'application aux couleurs de ton équipe ou prendre l'un des 15 dégradés.",
        customTicks: ["Mode clair ou sombre, avec l'icône du sport si tu veux", "Des fonds de barre latérale, certains sobres, d'autres illustrés", "Taille du texte et onglet par défaut réglables"],
        everywhereHeading: "Tient aussi sur un téléphone",
        everywhereLede: "La mise en page suit du bureau jusqu'au téléphone, avec les mêmes données. La navigation latérale retient où tu en étais et saute directement à chaque section.",
        techHeading: "Sous le capot",
        techLede: "L'application affiche d'abord ce qui se trouve dans le cache, puis va chercher les nouvelles données. Chaque appel d'API tourne de son côté : si l'un échoue, le reste continue de fonctionner. Les mises à jour arrivent via le Microsoft Store.",
        spec: [
          { dt: "Plateforme", dd: "<strong>Tauri 2</strong> sur une base Rust, donc une application native. Un seul binaire pour Windows, macOS et les mises en page mobiles." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, compilé avec <strong>Vite 7</strong>." },
          { dt: "Architecture", dd: "Conçue pour ajouter facilement d'autres sports : la NFL et la MLB partagent la même base, seuls les données, les règles et le glossaire sont propres à chaque sport." },
          { dt: "Données et hors ligne", dd: "Les données en direct viennent de l'<strong>API JSON publique d'ESPN</strong> et sont gardées dans un cache persistant. L'application fonctionne donc aussi hors ligne, et il y a un mode démo pour l'essayer sans réseau." },
          { dt: "Langue", dd: "<strong>i18next</strong> en allemand, anglais et espagnol, chaque sport avec son propre glossaire. Des info-bulles expliquent chaque abréviation." },
          { dt: "Mises à jour", dd: "Elles arrivent automatiquement via le <strong>Microsoft Store</strong>. Pas d'installeur séparé, rien à faire à la main." },
          { dt: "Licences", dd: "Aucun logo de ligue ni photo de joueur ; les millions que ça coûte sont hors de portée pour un projet solo. Si quelqu'un veut m'offrir un accord de licence, j'en discute avec grand plaisir ;)" },
        ],
        comingBadge: "Microsoft Store", comingText: "CheapSeats n'existe que sur le Microsoft Store. C'est gratuit, et ça le restera.",
        comingSoon: "Bientôt disponible",
        githubBtn: "Vers le Microsoft Store", backFooter: "Retour à l'accueil",
        screenshotNote: "Les captures d'écran de cette page proviennent de versions de développement et peuvent différer de la version actuelle de l'application.",
        updateBanner: {
          pill: "Nouveau",
          ticker: "+++ CheapSeats v1.3.1 est là +++ Maintenant aussi en espagnol +++ Consulter d'autres équipes sans changer la tienne +++ Trois Instant Classics par semaine dans le Watercooler +++ Il y a maintenant une bande-annonce +++ Promis : CheapSeats reste gratuite +++",
          cta: "Voir les nouveautés →",
        },
        changelogHeading: "Ce qui a changé",
        changelogLede: "Clique sur une carte et le changelog complet s'ouvre (en anglais uniquement).",
        changelog: {
          soon: { title: "Plus de fonctionnalités" },
          v13: {
            tag: "v1.3.1 · Actuelle", title: "Sandlot to Sunday",
            items: [
              "L'espagnol comme troisième langue de l'application, avec le glossaire, le guide des règles et la déclaration de confidentialité",
              "Consulter n'importe quelle équipe sans changer celle que tu suis : calendrier, effectif, classement et playoffs",
              "Instant Classic dans le Watercooler : trois matchs par semaine, toutes équipes confondues, qui méritent un « tu as vu ça ?! »",
              "Ligne rivalité sur la carte principale, suivi des jalons, résumé des blessures et un match « Ce jour-là »",
              "Note météo pour le prochain match, tableau des playoffs pour toutes les équipes en phase finale et chapitres du guide des règles avec les formules derrière les notes",
            ],
          },
          v12: {
            tag: "v1.2", title: "Watercooler Conversations",
            items: [
              "Le Watercooler : enjeux et course aux playoffs du prochain match, plus la manchette du récap et le joueur en vue du dernier match",
              "Un écran de bienvenue au premier lancement et une courte visite pour choisir tes équipes NFL et MLB",
              "Plus de 1 200 photos de joueurs sous licence libre, plus des marqueurs de couleur d'équipe à deux tons dans toute l'application",
              "Recherche de highlights plus maligne : consulte d'abord la playlist officielle de la ligue, puis réessaie automatiquement",
              "Les lecteurs d'écran annoncent désormais les nouveaux sujets du Watercooler",
            ],
          },
          v11: {
            tag: "v1.1", title: "Yours, Live and in Color",
            items: [
              "Suivi en direct : play-by-play en temps réel, quart-temps ou manche en cours, down-distance ou balles-strikes, et une chronologie des actions marquantes",
              "Notifications : icône clignotante dans la barre des tâches, notification à la réduction, rappel au coup d'envoi et alertes de score optionnelles",
              "Sortie officielle sur le Microsoft Store : mises à jour automatiques signées, sans installeur, sans invite UAC",
              "La sélection d'équipe est désormais conservée entre les redémarrages, plus le démarrage automatique avec Windows",
              "Environ 40 % plus rapide au démarrage avec un cache froid",
            ],
          },
          v10: {
            tag: "v1.0 · Première version", title: "First Kickoff",
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
        title: "Mika Jeske · Ciencia de materiales y metrología",
        description: "Mika Jeske, científico de materiales (B.Sc.) centrado en metrología, sensórica y ensayos no destructivos. Desde octubre de 2026 curso el máster en Metrología y Técnicas de Medición en Brunswick y busco un puesto de estudiante en prácticas.",
      },
      hero: { eyebrow: "Ciencia de materiales · B.Sc.", eyebrow2: "Metrología · M.Sc.", scrollHint: "Scroll", aiImageLabel: "Imagen editada con IA", portraitAlt: "Retrato de Mika Jeske, creador y protagonista de este sitio, con traje gris, camisa blanca y corbata de punto en siena tostada. Mika señala su propio nombre y sonríe; pelo castaño de media melena, ojos marrones, bien afeitado. La imagen se editó con herramientas de IA." },
      trailer: { cv: "Trayectoria", story: "La pequeña escala", cheapseats: "CheapSeats", volunteering: "Voluntariado", caption: "Elige una entrada o sigue bajando sin más", enterLabel: "Entrar en el sitio", replay: "Repetir" },
      intro: {
        headline: "Hola, soy Mika. Científico de materiales centrado en la metrología.",
        p1: "Montando un PC con mi primo Jack acabamos hablando de disipadores de cobre y pasta térmica con diamante. Ni se dio cuenta de que había aterrizado justo en mi campo. Eso es lo que me gusta de la ciencia de materiales: está dentro de cosas que ya tienes en la mano. El vidrio usado fundido de nuevo en botellas también cuenta.",
        p2: "Donde se vuelve exacto para mí es en la metrología. Leer un número es fácil. Juzgar si es correcto es un oficio. Por eso estudio desde octubre el máster en Metrología y Técnicas de Medición en Brunswick. En casa no tengo un microscopio electrónico de barrido. Así que en paralelo construyo esta web y mis propios proyectos, para avanzar programando y presentando datos.",
        photos: [
          "En la DGZfP en Magdeburgo, la invitación venía con el premio",
        ],
      },
      nav: { werkstudent: "Estudiante en prácticas", ehrenamt: "Voluntariado", lebenslauf: "Trayectoria", projekt: "Proyecto", skipLabel: "Ir a la sección", newTab: "se abre en una pestaña nueva" },
      seeking: {
        heading: "Busco un puesto de estudiante en prácticas",
        rows: [
          { k: "Puesto", v: "Estudiante en prácticas, desde noviembre de 2026" },
          { k: "Lugar", v: "Brunswick y alrededores" },
          { k: "Jornada", v: "Hasta 20 horas por semana junto a los estudios" },
          { k: "Áreas", v: "Metrología, sensores, capas finas, END" },
        ],
        cta: "Mi LinkedIn",
      },
      story: {
        heading: "Cómo llegué a la pequeña escala",
        p1: "La física y la química me atraparon ya en el instituto, pero la teoría pura nunca me tentó. Durante un tiempo se barajó la farmacia, que en mi familia es tradición. Después se cruzó la ciencia de materiales, y era tan práctica como yo buscaba.",
        p2: "Me quedé enganchado al ámbito micro y nanométrico, porque allí todo es fino y casi estético. Bailé mucho tiempo a nivel de competición, y fue un profesor quien me hizo ver que las dos cosas encajan. El paralelismo lo digo en serio: ambos exigen control y elegancia en el detalle.",
        figure: {
          x: "Temperatura (°C)",
          y: "Coeficiente Seebeck (µV/K)",
          caption: "Coeficiente Seebeck relativo de capas finas pulverizadas frente a la temperatura. El níquel es negativo, la plata y el aluminio son positivos. De mi trabajo de fin de grado.",
        },
        figure2: {
          x: "Tiempo (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "El bismuto es normalmente un conductor PTC. Pulverizado como capa fina policristalina, invierte a NTC. Es un efecto de bordes de grano que mi trabajo de fin de grado abordó.",
        },
      },
      cleanroomTear: {
        intro: "La línea más escueta de mi currículum fue, para mí, la época más apasionante.",
        label: "Abrir la sala blanca",
        heading: "Bajo la superficie, en la sala blanca ISO‑2",
        p1: "Pasé medio año en la sala blanca ISO‑2 del Centro de Micro- y Nanotecnología (ZMN) de la TU Ilmenau: pulverización catódica por magnetrón, perfilometría, SEM/EDX, capas finas de TiOₓ. El contraste es casi absurdo. El entorno está controlado hasta el último detalle, y en medio hay muestras de menos de un milímetro cuadrado que se niegan rotundamente a comportarse como deberían.",
        p2: "Sinceramente, allí se estaba genial. Por fin hacía aquello de lo que solo conocía la teoría, y se sentía como la investigación tal como uno se la imagina de niño.",
        p3: "En concreto fueron capas de Ag, Al, Ni y Bi, el montaje TFA y mediciones de transporte en función de la temperatura. Sobre eso se apoya mi trabajo de fin de grado.",
        photos: ["Cámara de pulverización, aquí crece la capa en vacío", "Sala blanca ISO‑2, completamente equipado", "Perfilometría: midiendo el grosor de la capa", "Muestras más pequeñas que una uña"],
      },
      confiTear: {
        label: "Saber más sobre mi trabajo juvenil:",
        teaser: "Durante varios años acompañé a jóvenes en la catequesis y en campamentos. Eso me marcó más que muchas clases de la universidad.",
        heading: "Ver y ser visto",
        p1: "Durante varios años dirigí grupos de catequesis confirmatoria y trabajo juvenil abierto en la Iglesia Evangélica de Ilmenau. Nadie te dice antes cuál es la verdadera tarea: seguir siendo accesible mientras los jóvenes ordenan su fe, sus dudas y el simple hecho de crecer. En los días en que mi propio ánimo dejaba que desear, a menudo alguien se acercaba con sus propios asuntos. Hacerme a un lado del todo en esos momentos me recompuso a mí más veces que a ellos.",
        p2: "Quien espera que los jóvenes se abran tiene que ser el primero en ponerse el disfraz ridículo en el campamento. Quien es demasiado tímido para eso no recibe nada a cambio. Ir por delante sin miedo y dar ejemplo de lo que se espera de los demás: así entiendo desde entonces la colaboración, también fuera del trabajo juvenil.",
        photos: ["Excepcionalmente, delante de la cámara", "En pleno ajetreo", "Programa de noche en un campamento"],
      },
      reunion: {
        heading: "Organizando un reencuentro",
        p1: "Aparte, gestiono {{site}}, la web del reencuentro de mi promoción de bachillerato. Un mapa muestra lo dispersos que estamos ya. Además hay una cuenta atrás nacida de pura ilusión y un formulario de contacto para escribir.",
        p2: "Mantuve a propósito los antiguos colores del instituto, sencillamente se sentía bien. Lo que más me gusta es redactar el boletín de la promoción, por las respuestas que llegan.",
        linkLabel: "ggi-abitur2022.de",
      },
      collaborations: {
        heading: "Con amigos",
        p1: "En el cineclub de la universidad, Hendrik y yo descubrimos enseguida que los dos éramos unos apasionados del cine, aunque desde lados distintos de la cámara. Él quería quedarse detrás, yo quería estar delante.",
        entries: [
          {
            label: "Der Hochsitz", genre: "Cortometraje · Terror/Thriller",
            note: "Unos semestres después, Hendrik me puso de verdad delante de su cámara. Der Hochsitz es un cortometraje de php, o sea, Richard Hollandmoritz y Hendrik E. Peters. Richard dirigió, Hendrik estuvo detrás de la cámara y yo delante (bueno, sobre todo sentado). El rodaje fue sencillamente muy divertido, y el resto del trabajo de Hendrik merece la pena igual.",
            href: "https://www.hendrik-e-peters.com/portfolio/filme/der-hochsitz/der-hochsitz.html",
            linkLabel: "Ver el cortometraje",
          },
          {
            label: "Popcorngeraschel", genre: "Podcast",
            note: "Hendrik y yo empezamos el podcast porque de todas formas no parábamos de hablar de las películas del programa de nuestro cine universitario. Ahora está parado, pero nos dejó una audiencia pequeña y muy fiel: unos 50 oyentes por episodio de media, picos de más de 200 y miles de reproducciones en total.",
          },
        ],
        posterCaption: "Cartel oficial de la película",
        creditsBefore: "Gracias a Richard y Hendrik de php. Me pusisteis delante de la cámara, y ese rodaje fue una de las mejores sorpresas de la carrera. Echa un vistazo al ",
        creditsPortfolioLabel: "portfolio de Hendrik",
        creditsMiddle: " o sigue a ",
        creditsInstagramLabel: "php en Instagram",
        creditsAfter: ".",
      },
      resume: {
        title: "Trayectoria",
        experienceHeading: "Experiencia profesional", educationHeading: "Formación académica",
        skillsHeading: "Competencias", awardLabel: "Distinción",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Becario en ingeniería industrial", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Cualificación de un equipo de producción para su despliegue en serie: planificación de ensayos, control y automatización de procesos", "Evaluación y adquisición de sistemas viscosimétricos mediante series de medición independientes y recomendación de compra", "Caracterización de alternativas de pasta sin plomo mediante microscopía óptica y radiografía", "Introducción, junto con producción, de un nuevo dispositivo mezclador de pasta, ahora implementado en el 100 % de los pasos de producción relevantes"] },
        { role: "Asistente de investigación", org: "Centro de Micro- y Nanotecnología · TU Ilmenau", period: "04.2025 – 10.2025",
          points: ["Deposición por pulverización catódica de capas finas metálicas (Al, Ag, Ti, Si) y estructuración por lift-off en sala blanca", "Perfilometría, análisis topográfico por SEM y caracterización eléctrica (método de van der Pauw)"] },
      ],
      education: [
        { role: "Máster (M.Sc.) en Metrología y Técnicas de Medición", org: "Technische Universität Braunschweig", period: "desde 10.2026", accent: true,
          points: ["Especialización en sensores y principios de medición: continuación directa del trabajo de fin de grado sobre capas finas pulverizadas", "Módulo base de metrología: evaluación de datos de medición y estadística metrológica", "Estrecha vinculación con la Physikalisch-Technische Bundesanstalt, el instituto metrológico nacional alemán"] },
        { role: "Grado (B.Sc.) en Ciencia de Materiales · 2,0", org: "Technische Universität Ilmenau", period: "10.2022 – 09.2026",
          points: ["Especialización en materiales metálicos, tecnología de capas finas y procesos de fabricación", "Trabajo de fin de grado: propiedades eléctricas en función de la temperatura de capas finas pulverizadas (nota 1,0)", "Nominado para la Fundación Nacional Académica Alemana (Studienstiftung)"] },
        { role: "Bachillerato alemán (Abitur) · 1,8", org: "Gymnasium Groß Ilsede", period: "2013 – 2022", points: [] },
      ],
      engagementSection: {
        heading: "Voluntariado",
        photos: [
          "Taller antirracista en una escuela primaria",
          "Preparando nuestro pódcast sobre el programa del cine estudiantil",
        ],
      },
      engagement: [
        { role: "Voluntario, formación básica", org: "Technisches Hilfswerk · OV Friedrichshafen, a partir de 11.2026 OV Peine", period: "desde 10.2025", accent: true,
          points: ["Formación básica en protección civil y gestión de catástrofes en equipo, orientada al asesoramiento especializado en defensa NRBQ"] },
        { role: "Consejero telefónico · Línea de ayuda infantil", org: "Kinderschutzbund · Friedrichshafen, a partir de 11.2026 Brunswick", period: "desde 02.2026",
          points: ["Formación en asesoramiento telefónico para niños y adolescentes en situaciones de crisis", "Asesoramiento activo basado en un enfoque psicológico sistémico"] },
        { role: "Líder de grupo voluntario", org: "Iglesia Evangélica de Alemania Central · Ilmenau", period: "desde 2022",
          points: ["Varios años liderando grupos como parte de un equipo de coordinación, en catequesis confirmatoria y trabajo juvenil abierto", "Tras la mudanza: persona de contacto, organización de eventos y coordinación dentro del equipo de voluntariado", "Dirección, junto con el equipo de coordinación, de campamentos y eventos con más de 150 participantes"] },
        { role: "Representante estudiantil electo", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Comisión de asuntos académicos en el senado universitario: contribución, junto con la comisión, a la política de educación superior y a los reglamentos de estudio", { before: "Co-creador del ", link: { href: "https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html", text: "Wahl-O-Mat, herramienta de ayuda al voto para las elecciones regionales de Turingia de 2024" }, after: " (bpb · MDR)" }] },
      ],
      skills: [
        { group: "Análisis de materiales", items: ["SEM", "Radiografía", "Perfilometría", "Análisis microestructural", "Tecnología de capas finas", "Viscosimetría"] },
        { group: "Métodos", items: ["Caracterización de materiales", "Trabajo en sala blanca", "Diseño de experimentos", "Control de calidad", "Automatización de procesos"] },
        { group: "Software", items: ["LaTeX", "Herramientas de IA", "MS Office", "SAP", "FreeCAD"] },
        { group: "Idiomas", items: ["Alemán (lengua materna)", "Inglés (nivel profesional avanzado)"] },
      ],
      projects: {
        title: "CheapSeats",
        p1: "CheapSeats es mi panel deportivo para Windows. Eliges un equipo por liga entre los 32 de la NFL y los 30 de la MLB, abres la app y ves cuándo juega tu equipo el próximo partido y cómo acabó el último. Si hay un partido en curso, lo sigues jugada a jugada, y cuando cambia el marcador, la app te avisa.",
        p2: "No necesitas saber nada de antemano: cada abreviatura tiene su tooltip y hay un reglamento integrado. CheapSeats es gratis en la Microsoft Store, en alemán, inglés y español. No necesitas cuenta, y la app no envía datos de uso.",
        features: ["Seguimiento en vivo", "Notificaciones", "Jugador destacado", "Diagrama de alineación", "Clasificación y estadio", "Historial y playoffs", "Plantilla filtrable"],
        cta: "Ver CheapSeats",
      },
      footer: {
        /* madeBy: no longer shown on the home page, still used by the CheapSeats footer */
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email:"Enviar un correo", phone: "Llamarme",
        emailAria: "Enviar un correo a Mika Jeske", phoneAria: "Llamar a Mika Jeske",
        legal: "Aviso legal y privacidad",
        disclaimer: "El retrato, algunos pasajes de texto y las traducciones de este sitio se crearon o revisaron con ayuda de IA y fueron revisados por el autor. La versión alemana es la vinculante.",
        privacyNote: "Algunas personas han sido difuminadas por motivos de privacidad o legales.",
      },
      contact: { chip: "Contáctame" },
      langSwitcher: { selectLabel: "Elegir idioma", globeAria: "Idioma y apariencia", optionAria: "Seleccionar {lang}" },
      theme: { label: "Apariencia", auto: "Auto", light: "Claro", dark: "Oscuro", groupAria: "Elegir apariencia", autoAria: "Automático: seguir el dispositivo", lightAria: "Apariencia clara", darkAria: "Apariencia oscura" },
      cheapseats: {
        nav: { features: "Funciones", deepDive: "Detalles", mobile: "Móvil", tech: "Técnica", updates: "Actualizaciones", download: "Descargar ahora", menu: "Secciones", customize: "Personalizar", trailer: "Tráiler" },
        backLink: "Inicio", title: "CheapSeats",
        heroSub: "CheapSeats es mi panel deportivo para Windows. Abres la app y ves cuándo juega tu equipo el próximo partido y cómo acabó el último. Los datos de la última vez aparecen al instante y la app carga los nuevos en segundo plano. Eliges un equipo por liga entre los 32 de la NFL y los 30 de la MLB. No hay ninguno predeterminado.",
        dashboardK: "Dark & Light", dashboardV: "La misma vista general, una vez en oscuro y otra en claro: próximo partido, último resultado y jugador destacado.",
        trailerHeading: "Tráiler",
        trailerLede: "Una vuelta rápida por el panel antes de instalar la app.",
        player: { play: "Reproducir", pause: "Pausa", mute: "Silenciar", unmute: "Activar sonido", volume: "Volumen", seek: "Posición del vídeo", fullscreen: "Pantalla completa", controls: "Controles de vídeo" },
        featuresHeading: "Lo que hace la app",
        featuresLede: "Las cifras importantes están arriba y cada término técnico tiene su explicación. Quería que uno mirase y supiera cómo están las cosas.",
        features: [
          { title: "Panel en vivo", desc: "El próximo partido con rival, hora de inicio, sede, cadena televisiva y los últimos cinco enfrentamientos. Además, una cuenta atrás hasta el inicio y un aviso cuando el tiempo se pone feo." },
          { title: "Seguimiento en vivo", desc: "Mientras hay partido ves el jugada a jugada en tiempo real: marcador, inning o cuarto, down y distancia o bolas y strikes, y una línea de tiempo de las jugadas de anotación." },
          { title: "Notificaciones", desc: "Si la app está en primer plano, solo parpadea la barra de tareas. Si está minimizada, llega un aviso emergente. Puedes pedir un recordatorio único para el inicio o el primer lanzamiento y activar las alertas de marcador, como mucho una cada 5 segundos." },
          { title: "Jugador destacado", desc: "Una tarjeta para el jugador clave, que la app elige sola (quarterback o lanzador abridor): sus estadísticas de la temporada y la tendencia respecto a su media de carrera." },
          { title: "Diagrama de formación", desc: "La alineación, dibujada sobre el campo o el diamante: las agrupaciones ofensivas en fútbol americano, las posiciones de campo en béisbol." },
          { title: "Clasificación de división", desc: "La clasificación completa con victorias/derrotas, local y visitante, diferencial de carreras y racha. Cada abreviatura tiene su tooltip del glosario." },
          { title: "Estadio e historial", desc: "Los datos del estadio (año de construcción, capacidad, dimensiones, superficie) y el historial seleccionado de temporadas con gráficos de tendencia, títulos ganados y récords históricos." },
          { title: "Plantilla y playoffs", desc: "La plantilla, filtrable por grupo de posición y con búsqueda por nombre y número. En la postemporada se suma el cuadro de playoffs, aunque tu equipo no esté." },
          { title: "Watercooler", desc: "Temas de conversación para el próximo partido: qué hay en juego y qué supone para la carrera por los playoffs, el titular del recap, el jugador destacado, los hitos y quién está lesionado en tu equipo." },
          { title: "Instant Classic", desc: "Tres partidos por semana de toda la liga que merecen un «¿viste eso?». Elegidos por igualdad, prórroga, cambios de liderato y remontadas, con enlace al vídeo de highlights." },
          { title: "Explorar cualquier equipo", desc: "Abres cualquier otro equipo con un clic, desde el selector o la clasificación: calendario, plantilla, clasificación, playoffs y Watercooler. Tu equipo sigue siendo el mismo." },
          { title: "Reglamento y fórmulas", desc: "Un reglamento con buscador y lo básico de la NFL y la MLB. Nuevos capítulos explican cada valoración de la app con las fórmulas reales." },
        ],
        easeHeading: "No hace falta saber del deporte",
        easeDesc: "¿Nunca has visto un partido de fútbol americano o de béisbol? No pasa nada.",
        easeTicks: ["En el primer inicio, un recorrido en pocos pasos que puedes saltarte cuando quieras", "Tooltips para cada abreviatura y cada posición", "Un reglamento con buscador y lo básico de la NFL y la MLB"],
        fans: [
          { desc: "Los 32 equipos de la NFL y los 30 de la MLB están para elegir, uno por deporte. O ninguno, si una liga no te interesa." },
          { desc: "Para los amantes de los números: curvas de victorias/derrotas, títulos ganados y tendencias de anotación de las últimas ocho temporadas." },
          { desc: "Para los impacientes: la cuenta atrás hasta el inicio en días, horas, minutos y segundos, además del cara a cara, la información del partido y el contexto de la temporada." },
        ],
        customHeading: "Personalizar",
        customDesc: "Puedes usar la app con los colores de tu equipo o elegir uno de 15 degradados.",
        customTicks: ["Modo claro u oscuro, con el icono del deporte si quieres", "Fondos para la barra lateral, unos sobrios y otros ilustrados", "Tamaño de letra y pestaña predeterminada ajustables"],
        everywhereHeading: "También cabe en el móvil",
        everywhereLede: "El diseño se adapta desde el escritorio hasta el teléfono, con los mismos datos. La navegación lateral recuerda dónde estabas y salta directamente a cada sección.",
        techHeading: "Bajo el capó",
        techLede: "La app muestra primero lo que hay en la caché y luego trae los datos nuevos. Cada llamada a la API va por su cuenta: si una falla, el resto sigue funcionando. Las actualizaciones llegan a través de la Microsoft Store.",
        spec: [
          { dt: "Plataforma", dd: "<strong>Tauri 2</strong> sobre una base de Rust, o sea, una app nativa. Un único binario para Windows, macOS y diseños móviles." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, compilado con <strong>Vite 7</strong>." },
          { dt: "Arquitectura", dd: "Pensada para añadir más deportes con facilidad: la NFL y la MLB comparten la misma base, y solo los datos, las reglas y el glosario son específicos de cada deporte." },
          { dt: "Datos y sin conexión", dd: "Los datos en vivo vienen de la <strong>API JSON pública de ESPN</strong> y se guardan en una caché persistente. Por eso la app también funciona sin conexión, y hay un modo demo para probarla sin red." },
          { dt: "Idioma", dd: "<strong>i18next</strong> en alemán, inglés y español, cada deporte con su propio glosario. Los tooltips explican cada abreviatura." },
          { dt: "Actualizaciones", dd: "Llegan solas a través de la <strong>Microsoft Store</strong>. Sin instalador aparte, nada que hacer a mano." },
          { dt: "Licencias", dd: "Sin logos de ligas ni fotos de jugadores; los millones que cuesta eso están fuera del alcance de un proyecto individual. Si alguien quiere regalarme un acuerdo de licencia, encantado de hablarlo ;)" },
        ],
        comingBadge: "Microsoft Store", comingText: "CheapSeats solo está en la Microsoft Store. Es gratis, y así se queda.",
        comingSoon: "Próximamente",
        githubBtn: "A la Microsoft Store", backFooter: "Volver al inicio",
        screenshotNote: "Las capturas de pantalla de esta página son de versiones en desarrollo y pueden diferir de la versión actual de la aplicación.",
        updateBanner: {
          pill: "Nuevo",
          ticker: "+++ Ya está aquí CheapSeats v1.3.1 +++ Ahora también en español +++ Explora otros equipos sin cambiar el tuyo +++ Tres Instant Classics por semana en el Watercooler +++ Ahora hay tráiler +++ Promesa: CheapSeats sigue siendo gratis +++",
          cta: "Ver novedades →",
        },
        changelogHeading: "Qué ha cambiado",
        changelogLede: "Haz clic en una tarjeta y se abre el changelog completo (solo en inglés).",
        changelog: {
          soon: { title: "Más funciones" },
          v13: {
            tag: "v1.3.1 · Actual", title: "Sandlot to Sunday",
            items: [
              "El español como tercer idioma de la app, con el glosario, el reglamento y la declaración de privacidad",
              "Explora cualquier equipo sin cambiar el que sigues: calendario, plantilla, clasificación y playoffs",
              "Instant Classic en el Watercooler: tres partidos por semana de toda la liga que merecen un «¿viste eso?»",
              "Línea de rivalidad en la tarjeta principal, seguimiento de hitos, resumen de lesiones y un partido de «Un día como hoy»",
              "Aviso del tiempo para el próximo partido, cuadro de playoffs para todos los equipos en la postemporada y capítulos del reglamento con las fórmulas detrás de las valoraciones",
            ],
          },
          v12: {
            tag: "v1.2", title: "Watercooler Conversations",
            items: [
              "El Watercooler: qué está en juego y la carrera por los playoffs del próximo partido, además del titular del recap y el jugador destacado del último partido",
              "Una pantalla de bienvenida en el primer inicio y un breve recorrido para elegir tus equipos de NFL y MLB",
              "Más de 1.200 fotos de jugadores con licencia libre, además de marcadores de color de equipo de dos tonos en toda la app",
              "Búsqueda de highlights más inteligente: revisa primero la lista de reproducción propia de la liga y luego lo vuelve a intentar automáticamente",
              "Los lectores de pantalla ahora anuncian los nuevos temas del Watercooler",
            ],
          },
          v11: {
            tag: "v1.1", title: "Yours, Live and in Color",
            items: [
              "Seguimiento en vivo: jugada a jugada en tiempo real, inning o cuarto actual, down-distancia o cuenta de bolas-strikes, y una línea de tiempo de las jugadas de anotación",
              "Notificaciones: parpadeo en la barra de tareas, aviso emergente al minimizar, recordatorio de inicio y alertas de cambio de marcador opcionales",
              "Lanzamiento oficial en la Microsoft Store: actualizaciones automáticas firmadas, sin instalador, sin aviso de UAC",
              "La selección de equipo ahora se conserva entre reinicios, además de inicio automático con Windows",
              "Arranque alrededor de un 40 % más rápido con caché frío",
            ],
          },
          v10: {
            tag: "v1.0 · Lanzamiento inicial", title: "First Kickoff",
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
        title: "Mika Jeske · Scienza dei materiali e metrologia",
        description: "Mika Jeske, scienziato dei materiali (B.Sc.) specializzato in metrologia, sensoristica e controlli non distruttivi. Da ottobre 2026 frequento il master in Metrologia e tecniche di misura a Braunschweig e cerco un impiego da studente lavoratore.",
      },
      hero: { eyebrow: "Scienza dei materiali · B.Sc.", eyebrow2: "Metrologia · M.Sc.", scrollHint: "Scroll", aiImageLabel: "Immagine modificata con IA", portraitAlt: "Ritratto di Mika Jeske, autore e protagonista di questo sito, in completo grigio, camicia bianca e cravatta in maglia color terra di Siena bruciata. Mika indica il proprio nome e sorride; capelli castani di media lunghezza, occhi marroni, ben rasato. L'immagine è stata modificata con strumenti di IA." },
      trailer: { cv: "Percorso", story: "La piccola scala", cheapseats: "CheapSeats", volunteering: "Volontariato", caption: "Scegli un ingresso o continua semplicemente a scorrere", enterLabel: "Entra nel sito", replay: "Riproduci di nuovo" },
      intro: {
        headline: "Ciao, sono Mika. Scienziato dei materiali, specializzato in metrologia.",
        p1: "Montando un PC con mio cugino Jack siamo finiti sui dissipatori in rame e sulla pasta termica al diamante. Non si è nemmeno accorto di essere atterrato in pieno nel mio campo. È questo che mi piace della scienza dei materiali: sta dentro cose che hai già in mano. Anche il vetro usato rifuso in bottiglie nuove.",
        p2: "È in metrologia che per me diventa esatto. Leggere un numero è semplice. Giudicare se sia giusto è un mestiere. Per questo da ottobre frequento il master in Metrologia e tecniche di misura a Braunschweig. A casa non ho un microscopio elettronico a scansione. Così in parallelo costruisco questo sito e i miei progetti, per crescere nella programmazione e nella presentazione dei dati.",
        photos: [
          "Alla DGZfP a Magdeburgo, l'invito faceva parte del premio",
        ],
      },
      nav: { werkstudent: "Studente lavoratore", ehrenamt: "Volontariato", lebenslauf: "Percorso", projekt: "Progetto", skipLabel: "Vai alla sezione", newTab: "si apre in una nuova scheda" },
      seeking: {
        heading: "Cerco un impiego da studente lavoratore",
        rows: [
          { k: "Posizione", v: "Studente lavoratore, da novembre 2026" },
          { k: "Luogo", v: "Braunschweig e dintorni" },
          { k: "Impegno", v: "Fino a 20 ore a settimana accanto agli studi" },
          { k: "Ambiti", v: "Metrologia, sensoristica, film sottili, CND" },
        ],
        cta: "Il mio LinkedIn",
      },
      story: {
        heading: "Come sono approdato alla piccola scala",
        p1: "La fisica e la chimica mi hanno conquistato già a scuola, ma la teoria pura non mi ha mai attirato. Per un periodo si è valutata la farmacia, che da noi è tradizione di famiglia. Poi è arrivata la scienza dei materiali, ed era pratica proprio come la cercavo.",
        p2: "Sono rimasto agganciato al mondo micro e nanometrico, perché lì tutto è fine e quasi estetico. Ho ballato a lungo a livello agonistico, ed è stato un professore a farmi notare che le due cose stanno bene insieme. Il parallelo lo dico sul serio: entrambi richiedono controllo ed eleganza nel dettaglio.",
        figure: {
          x: "Temperatura (°C)",
          y: "Coefficiente di Seebeck (µV/K)",
          caption: "Coefficiente di Seebeck relativo di film sottili depositati per sputtering in funzione della temperatura. Il nichel è negativo, l'argento e l'alluminio sono positivi. Dalla mia tesi di laurea.",
        },
        figure2: {
          x: "Tempo (min)",
          y: "σ Ni (MS/m)",
          y2: "σ Bi (MS/m)",
          caption: "Il bismuto è normalmente un conduttore PTC. Depositato come film sottile policristallino per sputtering, si inverte in NTC. È un effetto di bordo grano che la mia tesi di laurea ha toccato.",
        },
      },
      cleanroomTear: {
        intro: "La riga più sobria del mio curriculum è stata, per me, il periodo più appassionante.",
        label: "Aprire la camera bianca",
        heading: "Sotto la superficie, nella camera bianca ISO‑2",
        p1: "Ho passato sei mesi nella camera bianca ISO‑2 del Centro per la micro- e nanotecnologia (ZMN) della TU Ilmenau: sputtering magnetronico, profilometria, SEM/EDX, film sottili di TiOₓ. Il contrasto è quasi assurdo. L'ambiente è controllato fin nei minimi dettagli e, nel mezzo, ci sono campioni di meno di un millimetro quadrato che si rifiutano ostinatamente di comportarsi come dovrebbero.",
        p2: "Sinceramente, lì si stava benissimo. Finalmente facevo ciò di cui conoscevo solo la teoria, e sembrava la ricerca come la si immagina da bambini.",
        p3: "In concreto erano strati di Ag, Al, Ni e Bi, il setup TFA e misure di trasporto in funzione della temperatura. Su questo si basa la mia tesi di laurea.",
        photos: ["Camera di sputtering, qui lo strato cresce sotto vuoto", "Camera bianca ISO‑2, completamente bardato", "Profilometria: misura dello spessore degli strati", "Campioni più piccoli di un'unghia"],
      },
      confiTear: {
        label: "Scopri di più sul mio lavoro con i giovani:",
        teaser: "Per diversi anni ho accompagnato ragazzi nel catechismo e nei campi. Mi ha segnato più di tante lezioni universitarie.",
        heading: "Vedere ed essere visti",
        p1: "Per diversi anni ho guidato gruppi di catechismo e di lavoro giovanile aperto presso la Chiesa evangelica di Ilmenau. Nessuno ti dice prima quale sia il vero compito: restare accessibile mentre i ragazzi fanno i conti con fede, dubbi e il semplice fatto di crescere. Nei giorni in cui il mio stesso umore lasciava a desiderare, capitava spesso che qualcuno venisse da me con le proprie questioni. Mettermi del tutto da parte in quei momenti ha rimesso in ordine me più spesso di loro.",
        p2: "Chi si aspetta che i ragazzi escano dal proprio guscio deve essere il primo, al campo, a indossare il costume buffo. Chi è troppo impacciato per farlo non riceve nulla in cambio. Andare avanti senza paura e dare l'esempio di ciò che ci si aspetta dagli altri: è così che da allora intendo la collaborazione, anche fuori dal lavoro giovanile.",
        photos: ["Per una volta, davanti all'obiettivo", "Nel pieno dell'azione", "Programma serale durante un campo"],
      },
      reunion: {
        heading: "Organizzare una rimpatriata",
        p1: "A margine, mi occupo di {{site}}, il sito della rimpatriata della mia classe di maturità. Una mappa mostra quanto ci siamo ormai dispersi. In più ci sono un conto alla rovescia nato da pura attesa e un modulo di contatto per farsi vivi.",
        p2: "Ho ripreso di proposito i vecchi colori della scuola, mi sembrava semplicemente giusto. Ciò che preferisco è scrivere la newsletter della classe, per le risposte che arrivano.",
        linkLabel: "ggi-abitur2022.de",
      },
      collaborations: {
        heading: "Con gli amici",
        p1: "Nel cineclub dell'università, io ed Hendrik abbiamo capito subito di essere entrambi appassionati di cinema, anche se da lati opposti della macchina da presa. Lui voleva restare dietro, io volevo stare davanti.",
        entries: [
          {
            label: "Der Hochsitz", genre: "Cortometraggio · Horror/Thriller",
            note: "Qualche semestre dopo Hendrik mi ha davvero messo davanti alla sua camera. Der Hochsitz è un cortometraggio di php, cioè Richard Hollandmoritz ed Hendrik E. Peters. Richard ha diretto, Hendrik era dietro la macchina da presa, e io davanti (anzi, per lo più seduto). Le riprese sono state semplicemente divertentissime, e anche il resto del lavoro di Hendrik vale la pena.",
            href: "https://www.hendrik-e-peters.com/portfolio/filme/der-hochsitz/der-hochsitz.html",
            linkLabel: "Guarda il film",
          },
          {
            label: "Popcorngeraschel", genre: "Podcast",
            note: "Io ed Hendrik abbiamo lanciato il podcast perché comunque non la smettevamo mai di parlare dei film del programma del nostro cineclub universitario. Ora è fermo, ma ci ha regalato un pubblico piccolo e molto fedele: in media circa 50 ascoltatori per episodio, picchi oltre 200 e ascolti complessivi nell'ordine delle migliaia.",
          },
        ],
        posterCaption: "Locandina ufficiale del film",
        creditsBefore: "Grazie a Richard ed Hendrik di php. Mi avete messo davanti alla camera, e quelle riprese sono state una delle sorprese più belle degli studi. Dai un'occhiata al ",
        creditsPortfolioLabel: "portfolio di Hendrik",
        creditsMiddle: " o segui ",
        creditsInstagramLabel: "php su Instagram",
        creditsAfter: ".",
      },
      resume: {
        title: "Percorso",
        experienceHeading: "Esperienza professionale", educationHeading: "Formazione",
        skillsHeading: "Competenze", awardLabel: "Riconoscimento",
        awardName: "DGZfP Science Student Award 2025", linkedinLabel: "LinkedIn",
      },
      experience: [
        { role: "Tirocinante in Industrial Engineering", org: "ifm prover gmbh", location: "Tettnang", period: "11.2025 – 04.2026", accent: true,
          points: ["Qualifica di un'attrezzatura di produzione per l'impiego in serie: pianificazione delle prove, controllo e automazione di processo", "Valutazione e approvvigionamento di sistemi viscosimetrici con serie di misure autonome e raccomandazione d'acquisto", "Caratterizzazione di paste alternative senza piombo mediante microscopia ottica e radiografia", "Introduzione, insieme alla produzione, di un nuovo dispositivo mescolatore di pasta, ora impiegato nel 100% delle fasi di produzione rilevanti"] },
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
        heading: "Volontariato",
        photos: [
          "Laboratorio antirazzismo in una scuola primaria",
          "Riunione preparatoria del nostro podcast sul programma del cinema studentesco",
        ],
      },
      engagement: [
        { role: "Volontario in formazione di base", org: "Technisches Hilfswerk · OV Friedrichshafen, da 11.2026 OV Peine", period: "da 10.2025", accent: true,
          points: ["Formazione di base nella protezione civile e nella gestione delle catastrofi in team, con orientamento alla consulenza specialistica in difesa CBRN"] },
        { role: "Consulente telefonico · Numero per l'infanzia", org: "Kinderschutzbund · Friedrichshafen, da 11.2026 Braunschweig", period: "da 02.2026",
          points: ["Formazione alla consulenza telefonica per bambini e adolescenti in situazioni di crisi", "Consulenza attiva su base sistemico-psicologica"] },
        { role: "Guida di gruppo volontaria", org: "Chiesa evangelica della Germania centrale · Ilmenau", period: "dal 2022",
          points: ["Pluriennale guida di gruppi come parte di un team di coordinamento, nel catechismo e nel lavoro giovanile aperto", "Dopo il trasferimento: referente, organizzazione di eventi e coordinamento all'interno del team di volontari", "Direzione, insieme al team di coordinamento, di campi ed eventi con oltre 150 partecipanti"] },
        { role: "Membro eletto della rappresentanza studentesca", org: "TU Ilmenau", period: "2024 – 2026", last: true,
          points: ["Commissione per gli affari accademici nel senato universitario: contributo, insieme alla commissione, alla politica universitaria e ai regolamenti didattici", { before: "Co-realizzatore del ", link: { href: "https://www.mdr.de/nachrichten/thueringen/landtagswahl/wahl-o-mat-landtag-alternativen-112.html", text: "Wahl-O-Mat per le elezioni regionali della Turingia 2024" }, after: " (bpb · MDR)" }] },
      ],
      skills: [
        { group: "Analisi dei materiali", items: ["SEM", "Radiografia", "Profilometria", "Analisi microstrutturale", "Tecnologia dei film sottili", "Viscosimetria"] },
        { group: "Metodi", items: ["Caratterizzazione dei materiali", "Lavoro in camera bianca", "Pianificazione delle prove", "Controllo qualità", "Automazione di processo"] },
        { group: "Software", items: ["LaTeX", "Strumenti IA", "MS Office", "SAP", "FreeCAD"] },
        { group: "Lingue", items: ["Tedesco (madrelingua)", "Inglese (fluente in ambito professionale)"] },
      ],
      projects: {
        title: "CheapSeats",
        p1: "CheapSeats è la mia dashboard sportiva per Windows. Scegli una squadra per lega tra le 32 della NFL e le 30 della MLB, apri l'app e vedi quando gioca la tua squadra la prossima partita e com'è finita l'ultima. Se c'è una partita in corso, la segui azione per azione, e quando cambia il punteggio l'app ti avvisa.",
        p2: "Non ti serve sapere nulla prima: ogni abbreviazione ha il suo tooltip e c'è un regolamento integrato. CheapSeats è gratis sul Microsoft Store, in tedesco, inglese e spagnolo. Non ti serve un account, e l'app non invia dati di utilizzo.",
        features: ["Tracking live", "Notifiche", "Giocatore in evidenza", "Diagramma della formazione", "Classifica e stadio", "Storia e playoff", "Rosa filtrabile"],
        cta: "Scopri CheapSeats",
      },
      footer: {
        /* madeBy: no longer shown on the home page, still used by the CheapSeats footer */
        linkedinLabel: "LinkedIn", madeBy: "Made by Mika",
        email:"Scrivi un'e-mail", phone: "Chiama",
        emailAria: "Scrivi un'e-mail a Mika Jeske", phoneAria: "Chiama Mika Jeske",
        legal: "Note legali & privacy",
        disclaimer: "Il ritratto, alcuni passaggi di testo e le traduzioni di questo sito sono stati creati o rielaborati con l'ausilio dell'IA e rivisti dall'autore. Fa fede la versione tedesca.",
        privacyNote: "Alcune persone sono state rese irriconoscibili per motivi di privacy o legali.",
      },
      contact: { chip: "Contattami" },
      langSwitcher: { selectLabel: "Scegli la lingua", globeAria: "Lingua e aspetto", optionAria: "Seleziona {lang}" },
      theme: { label: "Aspetto", auto: "Auto", light: "Chiaro", dark: "Scuro", groupAria: "Scegli l'aspetto", autoAria: "Automatico – segui il dispositivo", lightAria: "Aspetto chiaro", darkAria: "Aspetto scuro" },
      cheapseats: {
        nav: { features: "Funzioni", deepDive: "Dettagli", mobile: "Mobile", tech: "Tecnica", updates: "Aggiornamenti", download: "Scarica ora", menu: "Sezioni", customize: "Personalizza", trailer: "Trailer" },
        backLink: "Home", title: "CheapSeats",
        heroSub: "CheapSeats è la mia dashboard sportiva per Windows. Apri l'app e vedi quando gioca la tua squadra la prossima partita e com'è finita l'ultima. I dati dell'ultima volta ci sono subito, quelli nuovi l'app li carica in background. Scegli una squadra per lega tra le 32 della NFL e le 30 della MLB. Nessuna è preimpostata.",
        dashboardK: "Dark & Light", dashboardV: "La stessa panoramica, una volta scura e una volta chiara: prossima partita, ultimo risultato e giocatore in evidenza.",
        trailerHeading: "Trailer",
        trailerLede: "Un giro veloce nella dashboard prima di installare l'app.",
        player: { play: "Riproduci", pause: "Pausa", mute: "Disattiva audio", unmute: "Attiva audio", volume: "Volume", seek: "Posizione del video", fullscreen: "Schermo intero", controls: "Controlli video" },
        featuresHeading: "Cosa sa fare l'app",
        featuresLede: "I numeri che contano stanno in alto e ogni termine tecnico ha la sua spiegazione. Volevo che uno guardasse e sapesse come stanno le cose.",
        features: [
          { title: "Dashboard live", desc: "La prossima partita con avversario, orario d'inizio, sede, emittente e gli ultimi cinque scontri. In più un conto alla rovescia fino al fischio d'inizio e un avviso quando il tempo si mette male." },
          { title: "Tracking live", desc: "Durante una partita vedi il play-by-play in tempo reale: punteggio, inning o quarto, down e distanza o ball e strike, e una timeline delle azioni realizzative." },
          { title: "Notifiche", desc: "Se l'app è in primo piano, lampeggia solo la barra delle applicazioni. Se è ridotta a icona, arriva una notifica toast. Puoi farti ricordare una volta il fischio d'inizio o il primo lancio e attivare gli avvisi sul punteggio, al massimo uno ogni 5 secondi." },
          { title: "Giocatore in evidenza", desc: "Una scheda per il giocatore chiave, che l'app sceglie da sola (quarterback o lanciatore partente): le statistiche di stagione e l'andamento rispetto alla media di carriera." },
          { title: "Diagramma della formazione", desc: "La formazione, disegnata sul campo o sul diamante: i reparti offensivi nel football, le posizioni in campo nel baseball." },
          { title: "Classifica di division", desc: "La classifica completa con vittorie/sconfitte, casa e trasferta, differenziale punti e serie in corso. Ogni abbreviazione ha il suo tooltip dal glossario." },
          { title: "Stadio e storia", desc: "I dati dello stadio (anno di costruzione, capienza, dimensioni, superficie) e la storia curata delle stagioni con curve di tendenza, titoli vinti e record di sempre." },
          { title: "Rosa e playoff", desc: "La rosa, filtrabile per reparto e consultabile per nome e numero. Nella postseason si aggiunge il tabellone dei playoff, anche se la tua squadra non c'è." },
          { title: "Watercooler", desc: "Argomenti di conversazione per la prossima partita: quanto c'è in gioco e cosa significa per la corsa ai playoff, il titolo del recap, il giocatore migliore, i traguardi e chi è infortunato nella tua squadra." },
          { title: "Instant Classic", desc: "Tre partite a settimana da tutta la lega che meritano un «hai visto che roba?!». Scelte per equilibrio, supplementari, cambi di vantaggio e rimonte, con link al video degli highlight." },
          { title: "Esplora ogni squadra", desc: "Apri qualsiasi altra squadra con un clic, dal selettore o dalla classifica: calendario, rosa, classifica, playoff e Watercooler. La tua squadra resta quella." },
          { title: "Regolamento e formule", desc: "Un regolamento consultabile con le basi di NFL e MLB. Nuovi capitoli spiegano ogni valore dell'app con le formule vere." },
        ],
        easeHeading: "Non serve conoscere lo sport",
        easeDesc: "Non hai mai visto una partita di football o di baseball? Non importa.",
        easeTicks: ["Al primo avvio, un tour in pochi passaggi che puoi saltare quando vuoi", "Tooltip per ogni abbreviazione e ogni ruolo", "Un regolamento consultabile con le basi di NFL e MLB"],
        fans: [
          { desc: "Tutte le 32 squadre NFL e le 30 squadre MLB sono a scelta, una per sport. Oppure nessuna, se una lega non ti interessa." },
          { desc: "Per gli appassionati di numeri: curve vittorie/sconfitte, titoli vinti e andamento dei punti nelle ultime otto stagioni." },
          { desc: "Per gli impazienti: il conto alla rovescia fino al fischio d'inizio in giorni, ore, minuti e secondi, oltre a testa a testa, informazioni sulla partita e contesto della stagione." },
        ],
        customHeading: "Personalizza",
        customDesc: "Puoi usare l'app con i colori della tua squadra o prendere uno dei 15 gradienti.",
        customTicks: ["Tema chiaro o scuro, con l'icona dello sport se vuoi", "Sfondi per la barra laterale, alcuni sobri, altri illustrati", "Dimensione del testo e scheda predefinita regolabili"],
        everywhereHeading: "Sta anche su un telefono",
        everywhereLede: "Il layout si adatta dal desktop fino al telefono, con gli stessi dati. La navigazione laterale ricorda dov'eri e salta direttamente a ogni sezione.",
        techHeading: "Sotto il cofano",
        techLede: "L'app mostra prima quello che c'è nella cache, poi va a prendere i dati nuovi. Ogni chiamata API va per conto suo: se una fallisce, il resto continua a funzionare. Gli aggiornamenti arrivano tramite il Microsoft Store.",
        spec: [
          { dt: "Piattaforma", dd: "<strong>Tauri 2</strong> su base Rust, quindi un'app nativa. Un unico binario per Windows, macOS e layout mobili." },
          { dt: "Frontend", dd: "<strong>React 19 + TypeScript</strong>, compilato con <strong>Vite 7</strong>." },
          { dt: "Architettura", dd: "Pensata per aggiungere facilmente altri sport: NFL e MLB condividono la stessa base e solo dati, regole e glossario sono specifici di ogni sport." },
          { dt: "Dati e offline", dd: "I dati in tempo reale arrivano dall'<strong>API JSON pubblica di ESPN</strong> e restano in una cache persistente. Per questo l'app funziona anche offline, e c'è una modalità demo per provarla senza rete." },
          { dt: "Lingua", dd: "<strong>i18next</strong> in tedesco, inglese e spagnolo, ogni sport con il suo glossario. I tooltip spiegano ogni abbreviazione." },
          { dt: "Aggiornamenti", dd: "Arrivano da soli tramite il <strong>Microsoft Store</strong>. Nessun installer separato, niente da fare a mano." },
          { dt: "Licenze", dd: "Nessun logo di lega o foto di giocatori; i milioni che costano sono fuori portata per un progetto individuale. Se qualcuno vuole regalarmi un accordo di licenza, ne parlo molto volentieri ;)" },
        ],
        comingBadge: "Microsoft Store", comingText: "CheapSeats si trova solo sul Microsoft Store. È gratis, e resta così.",
        comingSoon: "In arrivo",
        githubBtn: "Vai al Microsoft Store", backFooter: "Torna alla home",
        screenshotNote: "Gli screenshot in questa pagina provengono da versioni di sviluppo e potrebbero differire dalla versione attuale dell'app.",
        updateBanner: {
          pill: "Novità",
          ticker: "+++ CheapSeats v1.3.1 è arrivata +++ Ora anche in spagnolo +++ Esplora altre squadre senza cambiare la tua +++ Tre Instant Classic a settimana nel Watercooler +++ Ora c'è un trailer +++ Promesso: CheapSeats resta gratuita +++",
          cta: "Scopri le novità →",
        },
        changelogHeading: "Cosa è cambiato",
        changelogLede: "Clicca su una scheda e si apre il changelog completo (solo in inglese).",
        changelog: {
          soon: { title: "Altre funzioni" },
          v13: {
            tag: "v1.3.1 · Attuale", title: "Sandlot to Sunday",
            items: [
              "Lo spagnolo come terza lingua dell'app, con glossario, regolamento e informativa sulla privacy",
              "Esplora qualsiasi squadra senza cambiare quella che segui: calendario, rosa, classifica e playoff",
              "Instant Classic nel Watercooler: tre partite a settimana da tutta la lega che meritano un «hai visto che roba?!»",
              "Riga sulla rivalità nella scheda principale, tracker dei traguardi, riepilogo degli infortuni e una partita di «In questo giorno»",
              "Avviso meteo per la prossima partita, tabellone playoff per tutte le squadre nella postseason e capitoli del regolamento con le formule dietro i valori",
            ],
          },
          v12: {
            tag: "v1.2", title: "Watercooler Conversations",
            items: [
              "Il Watercooler: posta in gioco e corsa ai playoff della prossima partita, più il titolo del recap e il giocatore migliore dell'ultima partita",
              "Una schermata di benvenuto al primo avvio e un breve tour per scegliere le tue squadre NFL e MLB",
              "Oltre 1.200 foto di giocatori con licenza libera, più indicatori dei colori di squadra a due toni in tutta l'app",
              "Ricerca degli highlight più intelligente: controlla prima la playlist ufficiale della lega, poi riprova automaticamente",
              "Gli screen reader ora annunciano i nuovi argomenti del Watercooler",
            ],
          },
          v11: {
            tag: "v1.1", title: "Yours, Live and in Color",
            items: [
              "Tracking live: play-by-play in tempo reale, inning o quarto attuale, down-distance o conteggio ball-strike, e una timeline delle azioni realizzative",
              "Notifiche: icona lampeggiante nella barra delle applicazioni, notifica toast alla riduzione a icona, promemoria al fischio d'inizio e avvisi opzionali sui cambi di punteggio",
              "Rilascio ufficiale sul Microsoft Store: aggiornamenti automatici firmati, nessun installer, nessun prompt UAC",
              "La selezione della squadra ora viene mantenuta tra i riavvii, oltre all'avvio automatico con Windows",
              "Avvio circa il 40% più veloce con cache fredda",
            ],
          },
          v10: {
            tag: "v1.0 · Prima versione", title: "First Kickoff",
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

  /* ---------- theme ----------
     This lives here, in a file the <head> already loads render-blocking
     before any stylesheet, because the attribute has to be on <html> before
     first paint. Anything later — a module, an onload handler, the React
     bundle at the end of <body> — and a reader who chose dark gets a white
     flash on every navigation. Which is every language switch, since those
     are real page loads to /en/, /fr/ and so on.

     Reuses safeStorage() rather than adding a second storage path: it is
     already the one wrapper that survives Safari private mode and blocked
     site data, where localStorage access throws rather than returning null.

     Three states. "auto" is the absence of the attribute, which lets the
     prefers-color-scheme branch in colors.css decide; "light" and "dark"
     pin color-scheme and override the OS. */
  var THEMES = ["auto", "light", "dark"];
  var activeTheme = "auto";

  function readTheme() {
    var ls = safeStorage();
    try {
      var v = ls && ls.getItem("theme");
      return THEMES.indexOf(v) === -1 ? "auto" : v;
    } catch (e) { return "auto"; }
  }

  function applyTheme(theme) {
    if (!HAS_DOCUMENT) return;
    var el = document.documentElement;
    if (theme === "auto") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", theme);
  }

  function setTheme(code) {
    if (THEMES.indexOf(code) === -1) return;
    activeTheme = code;
    var ls = safeStorage();
    try { if (ls) ls.setItem("theme", code); } catch (e) {}
    applyTheme(code);
    if (HAS_WINDOW) window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: code } }));
  }

  activeTheme = readTheme();
  applyTheme(activeTheme);

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
    THEMES: THEMES,
    getTheme: function () { return activeTheme; },
    setTheme: setTheme,
    t: t,
  };

  if (HAS_WINDOW) window.I18N = I18N;
  if (typeof module !== "undefined" && module.exports) module.exports = I18N;
})();
