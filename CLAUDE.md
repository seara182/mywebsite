# mywebsite — Mika Jeske

Static personal site on GitHub Pages (Strato domain). Source of truth: this folder. Compiled `*.js` are committed (Pages serves them); build with `node build.mjs`. Brand tokens live in `ci/`.

## GDPR: no external traffic (hard rule)

The site must stay 100% cookie-free and static, with no consent banner.

1. **No external CDNs.** Never add `<script src="https://...">` or `<link href="https://...">` (unpkg, Google Fonts, etc.).
2. **Vendor locally.** Need a third-party lib (e.g. React)? Download the minified file into `ci/vendor/` and link it relatively.
3. **Zero cookies.**

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
