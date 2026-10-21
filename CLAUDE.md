# mywebsite — Mika Jeske

Static personal site on GitHub Pages (Strato domain). Source of truth: this folder. Compiled `*.js` are committed (Pages serves them); build with `node build.mjs`. Brand tokens live in `ci/`.

## GDPR: no external traffic (hard rule)

The site must stay 100% cookie-free and static, with no consent banner. The only banner is the informational site notice (`mountNotice` in `widgets.js`, copy in `notice.*`); it asks for nothing and stores only its dismissal in localStorage, next to `lang` and `theme` (disclosed in `impressum/` §7).

1. **No external CDNs.** Never add `<script src="https://...">` or `<link href="https://...">` (unpkg, Google Fonts, etc.).
2. **Vendor locally.** Need a third-party lib (e.g. React)? Download the minified file into `ci/vendor/` and link it relatively.
3. **Zero cookies.**
4. **Exception: `projects/cheapseats/app/`** is the CheapSeats web app, built in `bay-window` (`npm run deploy:web`), never edited here. It fetches ESPN/MLB/theScore from the visitor's browser and stores data in IndexedDB (no cookies); that is disclosed in `impressum/` §6 and the app's own privacy statement. The rest of the site stays external-free, and nothing outside `projects/cheapseats/app/` may load from it. `app/` and `cheapseats/app/` only hold a redirect page and a self-unregistering `sw.js` for the two old URLs; the install guide still shows the short `mika-jeske.de/cheapseats/app`, which forwards.

## CheapSeats install guide

`projects/cheapseats/install/` is the install guide for all five platforms: iPhone, iPad, Mac and Android get Add to Home Screen / Add to Dock steps with drawn mockups (labels are `cheapseats.install.*` i18n keys; the light Apple/Google UI colours in its mockup block depict those systems' UI and are the only non-token colours allowed there), Windows gets the Microsoft Store band. The page guesses the device from the user agent, says which one it picked, and keeps all five one click away. Links between the CheapSeats page, the guide and `/projects/cheapseats/app/` carry `?lang=` (`i18n.js` reads it on sub-pages; the app honours en/de/es on first launch). `screen-*.webp` in `ci/assets/Bilder/CheapSeats/install/` are the app screens inside the drawings, captured from the web build.

## Design

Follow the "Mika Jeske" design system (`ci/tokens/*.css`, skill in `.claude/skills/Mika Jeske Design System/`): reuse tokens, never invent fonts/palettes/motion. Aesthetic review: `design-critic` agent (`.claude/agents/`). Design/release briefs are local-only: `DESIGN_GUIDE_anti-vibecode.md`, `RELEASE_BRIEF_v1.1.md`, `_notes/`.

## Local-only (gitignored) files

`.claude/`, `_notes/`, `projects/*` (except `cheapseats`), `private/master/CLAUDE.md`, `PWChange.*`, briefs, `node_modules/`, lighthouse/audit reports, brag video masters. See `.gitignore`. `private/master/CLAUDE.md` is a separate, scoped directive for that sub-app.

## graphify

Knowledge graph in `graphify-out/` (`/graphify` skill).

- Codebase questions: run `graphify query "<question>"` first (also `graphify path "<A>" "<B>"`, `graphify explain "<concept>"`) instead of raw grep.
- Use `graphify-out/wiki/index.md` for navigation if present; `GRAPH_REPORT.md` only for broad architecture review.
- After modifying code: `graphify update .` (AST-only, free).

## AI skills

`sync-ai-skills.sh` installs the global skill set on a new machine.
