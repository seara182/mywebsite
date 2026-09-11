# CheapSeats: Website Update Brief

Handover for the portfolio site at `E:\Dokumente\mywebsite` (GitHub Pages, `mika-jeske.de`). The sports app showcased there has been rebranded. This document lists what changed in the app, which website files still carry the old names, and the copy, screenshot and badge markup to use. Nothing on the website has been edited yet.

## 1. The rebrand

The app formerly known as "Bay Window" (also "Bay Area Tracker" in early docs and "Sports Window" on the live site) is now **CheapSeats**, subtitle **"Live Scores for Baseball & Football Fans"**. Version is 1.0.0. The app repository is still `seara182/bay-window` at `E:\Dokumente\Sports_App\bay-window` (Tauri 2, Rust + React/TypeScript).

What the app does now: a minimalist local desktop scoreboard that tracks live scores and upcoming game times for selected baseball and football teams. Team selection covers all 32 NFL and 30 MLB clubs; the two San Francisco teams are no longer a fixed default and should not be presented as the app's identity. Data comes from ESPN's public JSON API, highlight clips from the official NFL and MLB YouTube channel feeds. Team selection and a score cache are stored locally, the UI is in English and German, and the Microsoft Store delivers every update. No account, no telemetry.

Microsoft Store ID `9N6JHBV7G033` is reserved. The listing is not live, so badge links stay `#` for now (see section 6).

## 2. Website stack and the files you will touch

The site is React 18 written as `.jsx`, precompiled by Babel through `build.mjs` into plain `.js` and prerendered once per language (`index.html`, `en/`, `es/`, `fr/`, `it/`). The compiled `*.js` and the prerendered `index.html` files are committed. Edit the `.jsx` and `i18n.js` sources, then run `npm run build`; never edit `sections-b.js` or the prerendered HTML by hand.

The app appears in two places:

- **Homepage showcase**: the `Projects()` component in `E:\Dokumente\mywebsite\sections-b.jsx` (line 118). It reads all copy from `t("projects")` in `i18n.js` and links to `projects/sports-window/`. The preview card is a hand-built mock (a "Next Game" card with pitcher stats), not a screenshot.
- **Project subpage**: `E:\Dokumente\mywebsite\projects\sports-window\index.html`. This one is plain HTML, not React. It loads `../../i18n.js` and swaps text in place through `data-i18n` attributes, reading the `sports.*` keys. Images come from `ci/assets/Bilder/BayWindow/`.

All translatable strings for both live in `E:\Dokumente\mywebsite\i18n.js` under `projects` and `sports`, once per language block (de, en, fr, es, it).

## 3. Legacy name hits in the website folder

Grep for `Bay Window`, `bay-window`, `Bay Area Tracker`, `SportsApp`, `SpotsApp` (node_modules, .git and .playwright-mcp excluded). No hits for `Bay Area Tracker`, `SportsApp` or `SpotsApp`. The other two plus the live name "Sports Window" hit as follows.

Published files (tracked by git, served on the site):

- `E:\Dokumente\mywebsite\i18n.js`: "Sports Window" 20 times, four keys per language: `projects.title`, `projects.cta`, `sports.title`, `sports.madeByFooter`. Also the `projects.description` and `sports.heroSub` strings in all five languages still describe the app as following "two favourite teams" with the 49ers and Giants as default. Line 979 has a code comment mentioning `/projects/sports-window/`.
- `E:\Dokumente\mywebsite\projects\sports-window\index.html`: `<title>` (line 7), canonical URL (line 8), hero text (line 238), image alt texts (lines 248, 320), footer (line 388) and the GitHub button (line 366), which points to `https://github.com/seara182/sports-window`. The actual repo is `seara182/bay-window`; verify which URL should be public before changing it.
- `E:\Dokumente\mywebsite\sections-b.jsx` line 141: `href={asset("projects/sports-window/")}`.
- `E:\Dokumente\mywebsite\sitemap.xml` line 67: `https://mika-jeske.de/projects/sports-window/`.
- `E:\Dokumente\mywebsite\package.json` line 9: the `spellcheck` script names `projects/sports-window/index.html`.
- `E:\Dokumente\mywebsite\.gitignore` lines 3 and 4: un-ignore rules for `projects/sports_app/` and `projects/sports-window/`.
- `E:\Dokumente\mywebsite\app\index.html`: a stale placeholder page ("Bay Window", "Your sports dashboard, reimagined.", release date TBD). It is tracked and served at `/app/`. Delete it or redirect it to the project subpage.
- `E:\Dokumente\mywebsite\projects\sports_app\overview.md` line 1 and line 5: "Bay Window", plus the whole description built around the two SF teams. The eight screenshots in `projects\sports_app\screenshots\` are from June and show the old branding.
- `E:\Dokumente\mywebsite\ci\assets\Bilder\BayWindow\`: the folder name itself. Nine `<img src>` values in the subpage depend on it, so leave it or rename it in one pass with all nine references.
- Prerendered outputs `index.html`, `en\index.html`, `es\index.html`, `fr\index.html`, `it\index.html` contain the "Sports Window" strings baked in; they regenerate on `npm run build`.

Not published (gitignored, local only), listed for completeness:

- `_notes\design-and-new.md` lines 81 to 89, `_notes\design-brief.local.md` lines 67, 80, 100, `_notes\fixes-and-code.md` lines 17, 36 to 41, `_notes\website-texts.local.md` lines 143 to 150.
- `.claude\skills\Mika Jeske Design System\` (readme.md, Card.prompt.md, core.card.html, type-headings.html, ui_kits\personal_site\sections-b.jsx, _ds_bundle.js).

On the URL: renaming `/projects/sports-window/` to `/projects/cheapseats/` touches the directory, the canonical tag, the sitemap, `package.json`, `.gitignore`, the `sections-b.jsx` href and the `i18n.js` comment. GitHub Pages has no server redirects, so the old folder would need a small HTML meta-refresh page. Keeping the path and only changing the visible name is the smaller change.

`ci\cspell-words.txt` will need `CheapSeats` added, or `npm run spellcheck` fails on the new strings.

## 4. Portfolio card copy

Title line: **CheapSeats**

Subtitle: Live Scores for Baseball & Football Fans

Paragraph (87 words):

CheapSeats is a desktop scoreboard for Windows that follows any of the 32 NFL and 30 MLB clubs you select. It shows the live score of a running game and the start time of the next one, with links to highlight clips from the official league YouTube channels. Data comes from ESPN's public JSON API; team selection and a score cache are stored locally, so the last known state appears at launch. The interface is in English and German, and there is no account and no telemetry.

The German, French, Spanish and Italian blocks in `i18n.js` need equivalents. Keep the product name "CheapSeats" and the English subtitle unchanged in every language.

## 5. Screenshot

Source, relative to `E:\Dokumente\mywebsite`: `../Sports_App/bay-window/assets/store/screenshot-desktop-1.png`

Absolute: `E:\Dokumente\Sports_App\bay-window\assets\store\screenshot-desktop-1.png`

1920 x 1080 PNG, 396 KB. It shows the CheapSeats dashboard for the San Francisco 49ers in the dark theme: custom title bar, left sidebar (Dashboard, Spotlight, Formation, Standings, Venue, History, Playoffs, Team Hub, team selector) over a blurred stadium image with a next-game countdown card, and a main column with the next-game hero card, a head-to-head row, the last-game score card with a highlights thumbnail, a player spotlight card and the top of a formation diagram.

Existing project images live in `E:\Dokumente\mywebsite\ci\assets\Bilder\BayWindow\` with names like `Main_Baseball_Light.png` and `History_Dark.png`. The website `.gitignore` ignores `screenshot*.png`, so the file must be renamed on copy or git will not track it. Suggested destination, following the existing naming pattern:

`E:\Dokumente\mywebsite\ci\assets\Bilder\BayWindow\Main_Football_Dark.png`

Copy command (PowerShell, from anywhere):

```powershell
Copy-Item "E:\Dokumente\Sports_App\bay-window\assets\store\screenshot-desktop-1.png" "E:\Dokumente\mywebsite\ci\assets\Bilder\BayWindow\Main_Football_Dark.png"
```

Natural placement: replace the light-mode baseball hero image on the subpage (line 248, `Main_Baseball_Light.png`) or add it as the first `.shot` in the deep-dive row. The other eight images in that folder predate the rebrand; check each for the old name in the title bar before keeping them.

## 6. Download badges

Exact markup from the app README, to be reused verbatim. This goes into the plain-HTML subpage `projects\sports-window\index.html` as is:

```html
<p>
  <a href="#" style="display:inline-block;padding:10px 18px;border:1px solid #888;border-radius:8px;text-decoration:none;color:inherit;">
    <strong>Microsoft Store</strong><br>Following soon
  </a>
  <span aria-disabled="true" style="display:inline-block;padding:10px 18px;border:1px solid #888;border-radius:8px;opacity:0.5;cursor:not-allowed;">
    <strong>Apple App Store</strong><br>Coming soon
  </span>
  <span aria-disabled="true" style="display:inline-block;padding:10px 18px;border:1px solid #888;border-radius:8px;opacity:0.5;cursor:not-allowed;">
    <strong>Google Play</strong><br>Coming soon
  </span>
</p>
```

The same markup as JSX, for the `Projects()` component in `sections-b.jsx` (style strings as objects, `<br />` self-closed, `aria-disabled` kept):

```jsx
<p>
  <a href="#" style={{ display: "inline-block", padding: "10px 18px", border: "1px solid #888", borderRadius: 8, textDecoration: "none", color: "inherit" }}>
    <strong>Microsoft Store</strong><br />Following soon
  </a>
  <span aria-disabled="true" style={{ display: "inline-block", padding: "10px 18px", border: "1px solid #888", borderRadius: 8, opacity: 0.5, cursor: "not-allowed" }}>
    <strong>Apple App Store</strong><br />Coming soon
  </span>
  <span aria-disabled="true" style={{ display: "inline-block", padding: "10px 18px", border: "1px solid #888", borderRadius: 8, opacity: 0.5, cursor: "not-allowed" }}>
    <strong>Google Play</strong><br />Coming soon
  </span>
</p>
```

Once the Store listing is live, change the Microsoft Store `href` from `#` to `https://apps.microsoft.com/detail/9N6JHBV7G033` and the label from "Following soon" to something like "Get it from the Store". The badge labels are English in the source; if they go through `i18n.js`, add keys instead of hardcoding.

## 7. Distribution is now Store exclusive

The app is distributed only through the Microsoft Store. This replaces the earlier plan of GitHub Releases downloads with a built-in update checker, and it changes what the website should say about getting the app.

What went away on the app side: the Tauri updater plugin, its GitHub Releases endpoint, the signing key it needed, and the in-app "Update available" prompt. All of it is deleted rather than switched off, so no build of the app contacts GitHub. The Store client installs the app and delivers later versions, which is the behaviour Store policy expects anyway.

What this means for website copy: do not offer a direct download link, a portable build, or an installer. The Microsoft Store badge in section 6 is the only distribution route. Wording that implies a manual download ("Download for Windows", "Get the installer") should not appear. Apple App Store and Google Play badges stay disabled placeholders, since no macOS, iOS or Android build is planned for now.

The packaging itself changed too, which matters if the project page describes the build. Earlier notes said Tauri cannot emit MSIX, which is correct: its bundler supports NSIS and MSI on Windows and nothing else. The app now wraps Tauri's own release executable with `MakeAppx.exe` from the Windows SDK, driven by `packaging/msix/build-msix.ps1`, and the Store logos are rasterized from `icon.svg` at every display scale Windows uses. The package goes to Partner Center unsigned, because Partner Center signs it with the account certificate during ingestion. A GitHub Actions workflow runs the same script on a version tag and keeps the `.msix` as a build artifact, so the repository publishes no releases.

## 8. Privacy policy page (blocks the Store submission)

Partner Center requires a public URL to a privacy policy before the listing can go through, since the app makes network requests (ESPN, YouTube). The text is already written at `E:\Dokumente\Sports_App\bay-window\docs\privacy.md` in the app repo: no account, no telemetry, no analytics, no crash reports, no personal data collected; what it stores locally via the Tauri store plugin (settings, a team-data cache, a game-summary cache); where its network calls go. Use that file as the source content, copied over rather than re-written from scratch.

**This needs to be its own page, not a section added to `impressum/index.html`.** The user wants a URL he can hand to Microsoft, and later put in the app itself, without it pointing at his Impressum, which carries his legal name and address under German disclosure law. So:

- New standalone page, plain HTML like `impressum/index.html` (same shell: `../ci/styles.css`, the same `body`/`main`/`h1`/`h2`/`.back` styles, no i18n.js dependency, no build step). Suggested path: `E:\Dokumente\mywebsite\projects\sports-window\privacy\index.html` (or under whatever the project folder is renamed to, see section 3) so it reads as part of the CheapSeats project rather than a generic site-wide document.
- It must not link to `/impressum/`, and `/impressum/` must not link to it. No cross-reference between the two pages in either direction.
- It should still be a normal, indexable page: reachable by direct URL, addable to `sitemap.xml`, no `noindex`. The ask is separation from the Impressum, not obscurity.
- Own `<title>` (e.g. "Privacy Policy · CheapSeats"), own canonical tag pointing at its own URL, a `.back` link that goes to the CheapSeats project subpage rather than the site homepage.
- English only is fine; this is a Store compliance document, not marketing copy, and the German audience already has the Impressum's Datenschutzerklärung for the site itself.

Once the page is live, the Partner Center privacy policy URL field gets that page's URL, and the same URL should replace whatever placeholder (if any) sits in the app's own Settings/About panel.

## 9. Status

The rebrand is done and pushed: `github.com/seara182/bay-window` shows CheapSeats on both `main` and the working branch. The MSIX package builds clean and is ready for a Partner Center upload; it needs no code signing certificate because Partner Center signs it on ingestion, and it was verified installable locally with a throwaway test certificate.

What's blocking submission is the privacy policy URL in section 8: it does not exist yet, and Partner Center will not accept the listing without one. That page is the next thing to build. On the website side nothing else has been edited; this brief is still the only new file.
