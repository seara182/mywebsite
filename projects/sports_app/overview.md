# Bay Window

## Was ist das?

Bay Window ist eine Desktop-App, die auf einen Blick den aktuellen Stand zweier Lieblings-Sportteams zeigt — Spiele, Ergebnisse, Tabellenplatz, Kader und Geschichte. Standardmäßig sind das die San Francisco 49ers (NFL) und die San Francisco Giants (MLB), aber die App ist nicht auf diese beiden beschränkt: jedes der 32 NFL- bzw. 30 MLB-Teams lässt sich als aktives Team auswählen.

Die App wurde als Windows-Desktopanwendung gebaut (macOS/Linux sind über den gleichen Tauri-Unterbau ebenfalls möglich) und ist für den täglichen "kurzer Blick beim Hochfahren"-Gebrauch gedacht: Cache sorgt dafür, dass beim Start sofort Daten angezeigt werden, während im Hintergrund aktualisiert wird.

## Stack

- **Tauri 2** (Rust) als nativer Anwendungsrahmen
- **React 19 + TypeScript** für die Oberfläche
- **Vite 7** als Build-Tool
- Daten von **ESPNs öffentlicher JSON-API** (für die Giants zusätzlich die MLB Stats API als Fallback)
- Abruf über das Tauri-HTTP-Plugin (umgeht CORS-Beschränkungen im Browser)
- Persistenter Cache über `@tauri-apps/plugin-store`, sodass die App offline bzw. beim Kaltstart sofort etwas anzeigt
- Mehrsprachig (Englisch/Deutsch) über i18next, inklusive lokalisiertem Glossar und Regelwerk
- Automatisches Update-System: signierte Releases über GitHub, die App prüft beim Start auf neue Versionen und installiert sie auf Wunsch automatisch

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

- **Dashboard** — Hero-Karte mit dem nächsten/letzten Spiel (Gegner, Anstoßzeit, Spielort, TV-Sender), Countdown-Timer, sowie ein kompakter Head-to-Head-Verweis auf den aktuellen Gegner.
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
- **Einstellungen** — Sprache (Englisch/Deutsch), Hell-/Dunkelmodus, Schriftgröße, Standard-Tab beim Start, Autostart mit dem System (Desktop), Sidebar-Hintergrund-Voreinstellungen, sowie ein Demo-Modus.
- **Demo-Modus** — Ersetzt Live-Daten durch einen mitgelieferten statischen Beispiel-Datensatz (eine komplette Saison pro Team) — nützlich offline oder zum Ausprobieren ohne Netzwerkzugriff.
- **Automatische Updates** — Die App prüft beim Start, ob eine neuere signierte Version auf GitHub veröffentlicht wurde, und bietet bei Bedarf einen Ein-Klick-Download, Verifizierung, Installation und Neustart an.
- **Responsives Layout** — Unterhalb von 768px Breite wird die Seitenleiste zu einer ausklappbaren Schublade und die Titelleiste zu einem schlanken mobilen Header.

## Bekannte Einschränkungen

- Die App basiert auf ESPNs nicht offiziell dokumentierter öffentlicher JSON-API; Endpunkte könnten sich ohne Vorwarnung ändern oder eingeschränkt werden. Bei einem fehlgeschlagenen Abruf wird automatisch auf zwischengespeicherte Daten mit "veraltet"-Hinweis zurückgegriffen.
- Updates werden aktuell von Hand pro Plattform veröffentlicht (kein automatisierter Build/Sign-Prozess über CI).

## Screenshots

Im Ordner `screenshots/` liegen Aufnahmen der laufenden App:

- `01-dashboard-giants.png` — Dashboard-Ansicht der Giants (dunkles Theme): nächstes Spiel, Player-Spotlight, Lineup-Diagramm.
- `02-lineup-formation.png` — Lineup/Formation-Karte mit Spielerwerten und den letzten 5 Ergebnissen.
- `03-standings-venue-history.png` — NL-West-Tabelle, Ballpark-Infokarte (Oracle Park) und Beginn des History-Bereichs.
- `04-history-championships.png` — Saisonverlauf-Diagramm, Meistertitel-Banner, Statistik-Trend und Allzeit-Kennzahlen.
- `05-playoffs-roster.png` — Playoff-Bracket-Platzhalter (außerhalb der Saison) und Beginn der Kaderliste.
- `06-roster-full.png` — Vollständige, filterbare Kaderliste nach Positionsgruppen.
- `08-nfl-roster.png` — Kaderliste der 49ers (rotes Theme) zum Vergleich mit dem Giants-Theme.
- `09-nfl-hero-formation.png` — 49ers-Dashboard: Hero-Karte zum nächsten Spiel und Offense-Formation-Diagramm.
