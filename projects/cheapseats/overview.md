# CheapSeats

## Was ist das?

CheapSeats ist eine Desktop-App, die auf einen Blick den aktuellen Stand zweier Lieblings-Sportteams zeigt — Spiele, Ergebnisse, Tabellenplatz, Kader und Geschichte. Standardmäßig sind das die San Francisco 49ers (NFL) und die San Francisco Giants (MLB), aber die App ist nicht auf diese beiden beschränkt: jedes der 32 NFL- bzw. 30 MLB-Teams lässt sich als aktives Team auswählen.

Die App wurde als Windows-Desktopanwendung gebaut (macOS/Linux sind über den gleichen Tauri-Unterbau ebenfalls möglich) und ist für den täglichen "kurzer Blick beim Hochfahren"-Gebrauch gedacht: Cache sorgt dafür, dass beim Start sofort Daten angezeigt werden, während im Hintergrund aktualisiert wird.

## Stack

- **Tauri 2** (Rust) als nativer Anwendungsrahmen
- **React 19 + TypeScript** für die Oberfläche
- **Vite 7** als Build-Tool
- Daten aus einer Fallback-Kette kostenloser, unauthentifizierter öffentlicher APIs: die offizielle **MLB Stats API** als primäre Quelle für MLB-Live-Daten, **ESPNs öffentliche JSON-API** als primäre Quelle für NFL sowie als Fallback für MLB, und **TheScore** als letzte Reserve für beide Sportarten — bewusst so gewählt, dass die App ohne API-Keys, geteiltes Kontingent oder Bezahlstufe bei beliebig vielen Nutzern kostenlos betreibbar bleibt
- Abruf über das Tauri-HTTP-Plugin (umgeht CORS-Beschränkungen im Browser)
- Persistenter Cache über `@tauri-apps/plugin-store`, sodass die App offline bzw. beim Kaltstart sofort etwas anzeigt
- Mehrsprachig (Englisch/Deutsch) über i18next, inklusive lokalisiertem Glossar und Regelwerk
- Vertrieb und Auto-Updates über den **Microsoft Store** (signierte MSIX-Pakete): die App prüft bei jedem Start auf eine neue Version und bietet ein Ein-Klick-Update an — kein Installer, kein manueller Download, kein UAC-Prompt

## Aufbau / Architektur

Die App folgt einem klaren, einseitigen Datenfluss:

```
ESPN-API  →  Parser (rohes JSON → einheitliches Datenmodell)  →  Daten-Provider (Cache + Status)  →  Ansichten (Rendering)
```

- Jeder Parser ist defensiv geschrieben: fehlende oder unerwartete Felder führen nie zu einem Absturz, sondern werden als "—" angezeigt.
- Jeder Endpunkt wird unabhängig abgerufen — schlägt einer fehl, bleiben die übrigen Bereiche der App weiterhin funktionsfähig, und es wird der zuletzt zwischengespeicherte Stand mit einem "veraltet"-Hinweis angezeigt.
- Ein gemeinsames Datenmodell (`types/domain.ts`) abstrahiert die Unterschiede zwischen American Football (NFL) und Baseball (MLB), sodass dieselben Ansichten für beide Sportarten funktionieren.
- Die Oberfläche ist in Sektionen aufgeteilt, zwischen denen eine Seitenleiste mit Sprungnavigation (inkl. aktiver Scroll-Markierung) wechselt.

## Funktionen / Features

**Hauptbereiche (über die Seitenleiste erreichbar):**

- **Dashboard** — Hero-Karte mit dem nächsten/letzten Spiel (Gegner, Anstoßzeit, Spielort, TV-Sender), Countdown-Timer, sowie ein kompakter Head-to-Head-Verweis auf den aktuellen Gegner. Läuft ein verfolgtes Spiel gerade, verwandelt sich dieselbe Karte an Ort und Stelle in eine Live-Ansicht mit aktuellem Spielstand und Spielphase (Inning/Outs bzw. Viertel/Down-Distance); ein Klick — auf die Hero-Karte oder auf das kompakte Nächstes-Spiel-Widget unten links in der Seitenleiste — öffnet eine Detailansicht mit Linescore, aktueller Spielsituation (Schlagduell bzw. Ballbesitz), Scoring-Plays, TV-/Radio-/Streaming-Links und, sobald verfügbar, einem Highlight-Clip. Von dort aus lässt sich für genau dieses Spiel eine einmalige Erinnerung zu Anstoß bzw. erstem Wurf scharfschalten (löst sich nach dem Auslösen selbst wieder), getrennt von der App-weiten Option, bei Spielstand-Änderungen benachrichtigt zu werden.
- **Spotlight** — Eine automatisch ausgewählte Spielerkarte (z. B. der Quarterback bzw. Starting Pitcher) mit aktuellen Saisonwerten und Trend-Pfeilen gegenüber der Karrierebilanz.
- **Lineup / Formation** — Eine visuelle Aufstellung auf einem Feld-/Diamond-Diagramm: bei der NFL die aktuelle Offense-Personnel-Gruppierung, bei der MLB die Lineup-Positionen auf dem Spielfeld, jeweils mit Spielerwerten darunter.
- **Standings** — Die Tabelle der eigenen Division, inklusive aller relevanten Statistik-Spalten (Siege/Niederlagen, Heim-/Auswärtsbilanz, Rückstand, Run-/Punktdifferenz, Serie etc.), mit Tooltips, die jeden Fachbegriff erklären.
- **Venue (Ballpark/Stadium)** — Informationen zum Heimstadion (Baujahr, Kapazität, Spielfeldmaße, Belag) plus eine durchklickbare Sammlung kurioser Fakten.
- **History** — Saisonverlauf als Liniendiagramm (Reguläre Saison/Playoffs/Meisterschaft markiert), eine Galerie aller Meistertitel als "Pennant"-Banner, ein Statistik-Trend der letzten acht Saisons (z. B. Team-ERA oder Punkte erzielt/zugelassen) sowie Kennzahlen wie Allzeit-Siege, beste moderne Saison und längste Siegesserie. Dieser Bereich ist (wie auch Venue-Fun-Facts) für die beiden San-Francisco-Teams handkuratiert; andere Teams zeigen die automatisch verfügbaren ESPN-Daten.
- **Playoffs** — Eine Playoff-Bracket-Ansicht, die sich automatisch befüllt, sobald die Postseason begonnen hat (außerhalb der Saison erscheint ein Platzhalter).
- **Roster** — Die vollständige, nach Positionsgruppen sortierte Kaderliste mit Filter (Name, Position, Nummer), Alter, Größe und Gewicht; ein Klick auf einen Spieler öffnet ein Detail-Panel mit dessen Saison- und Karrierestatistiken.
- **Team Hub / Team Selector** — Übersicht und Auswahl, welches NFL- bzw. MLB-Team aktuell verfolgt wird; jedes Team bekommt automatisch sein eigenes Farbschema aus den ESPN-Daten (die beiden San-Francisco-Teams haben ein handabgestimmtes Farbschema als "Easter Egg").

**Weitere Funktionen:**

- **Rule Book** — Ein durchsuchbares Nachschlagewerk mit Erklärungen zu NFL- und MLB-Grundlagen sowie einem "Wie schaue ich das?"-Überblick für Einsteiger, erreichbar über ein Buch-Symbol in der Kopfzeile.
- **Glossar-Tooltips** — Praktisch jeder Fachbegriff und jede Statistik-Abkürzung in der App ist mit einem Tooltip versehen, der den Begriff erklärt (zweisprachig EN/DE).
- **Head-to-Head-Historie** — Direktvergleich der bisherigen Begegnungen mit dem nächsten Gegner.
- **Einstellungen** — Sprache (Englisch/Deutsch), Hell-/Dunkelmodus, Schriftgröße, Standard-Tab beim Start, das zuletzt gewählte Team wird für den nächsten Start gemerkt, Autostart mit Windows, Sidebar-Hintergrund-Voreinstellungen, ein optionaler (standardmäßig deaktivierter) Windows-Hinweis bei Spielstand-Änderungen laufender Spiele — läuft die App bereits im Fokus, blinkt stattdessen nur die Taskleiste, statt mit einem Toast zu unterbrechen, gedrosselt auf maximal ein Update alle 5 Sekunden bei schnellem Spielgeschehen —, ein Button, der die Datenschutzerklärung direkt in einem Overlay öffnet (kein Verlassen der App nötig), sowie ein Demo-Modus.
- **Demo-Modus** — Ersetzt Live-Daten durch einen mitgelieferten statischen Beispiel-Datensatz (eine komplette Saison pro Team) — nützlich offline oder zum Ausprobieren ohne Netzwerkzugriff. Sowohl MLB- als auch NFL-Tab enthalten zusätzlich ein dauerhaftes Live-Spiel-Beispiel (bei der MLB: Giants gegen die Royals, angelehnt an die World Series 2014 mit Bumgarner am Wurf), damit sich die Live-Ansicht auch ohne ein tatsächlich laufendes Spiel ausprobieren lässt.
- **Automatische Updates** — Vertrieb ausschließlich über den Microsoft Store: die App prüft bei jedem Start auf eine neue Version und bietet ein Ein-Klick-Update mit Neustart an, ohne separaten Installer oder manuellen Download. Signierte Binaries mit verifizierter Herkunft.
- **Responsives Layout** — Unterhalb von 768px Breite wird die Seitenleiste zu einer ausklappbaren Schublade und die Titelleiste zu einem schlanken mobilen Header. Glossar-Tooltips lassen sich auf Touch-Geräten per Long-Press öffnen.

## Bekannte Einschränkungen

- Die App basiert auf ESPNs nicht offiziell dokumentierter öffentlicher JSON-API; Endpunkte könnten sich ohne Vorwarnung ändern oder eingeschränkt werden. Bei einem fehlgeschlagenen Abruf wird automatisch auf zwischengespeicherte Daten mit "veraltet"-Hinweis zurückgegriffen.
- Der Release-Workflow ist noch manuell (Signierung pro Plattform von Hand); eine CI/CD-Pipeline für automatisierte Builds ist für v1.2 in Arbeit.
- Vertrieb erfolgt ausschließlich über den Microsoft Store — kein Sideloading, keine GitHub-Releases zum direkten Download mehr.
