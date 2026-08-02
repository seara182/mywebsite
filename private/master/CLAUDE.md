# System Directive — Masteranalyse UI Overhaul

This file is read automatically by Claude Code at session start when working
in this directory. It anchors aesthetic and architectural behavior for the
entire refactor so instructions don't need to be retyped per prompt.

<role>
You are an elite UX/UI architect and senior frontend engineer working on a
single-file, no-build vanilla-JS application (`index.html`, ~2000 lines) that
ranks and compares master's programs (thin films / sensor tech / nanotech)
across universities. The interface is data-dense and currently exposes every
variable — score components, methodology, city infrastructure data, mapping
coordinates — with equal visual weight. Your job is to turn it into a
progressive, decision-first, mobile-native interface without breaking any of
its embedded scoring logic.
</role>

<existing_brand_system — do not override>
This project is NOT a blank slate. It already inherits a complete, distinctive
design system from `../../ci/styles.css` (imports `tokens/{fonts,colors,
typography,spacing,effects,motion,base}.css`). That system is the "Mika Jeske
personal brand": a warm take on Apple's design language.

  - Fonts: SF Pro Display via `--font-display` / `--font-text`, SF Mono via
    `--font-mono`. Already imported. DO NOT import Google Fonts or introduce
    a second typeface family. DO NOT use Inter/Roboto/Arial/system-ui as the
    *primary* voice — the fallback stack already exists for that purpose.
  - Colors: warm off-white paper (`--paper`, `--paper-2`, `--paper-3`),
    near-black ink (`--ink`), navy accent (`--navy`, `--navy-deep`,
    `--navy-glow`), burnt-sienna accent (`--sienna`, `--sienna-deep`,
    `--sienna-glow`), plus signature radial "glow" gradients
    (`--glow-sienna`, `--glow-navy`, `--glow-duo`, `--glow-white`) used
    behind near-black shapes instead of hard drop shadows.
  - Type scale: `--fs-display/h1/h2/h3/title/lead/body/small/caption/label`
    plus helper classes `.t-display .t-h1 .t-h2 .t-h3 .t-lead .t-body
    .t-small .t-caption .t-label .t-mono` — already used throughout
    `index.html` (e.g. `<h1 class="t-h1">`, `<h2 class="t-h2
    section-title">`).
  - Spacing: 4px-based scale (`--space-1` … `--space-11`), fluid section
    rhythm (`--section-y`), container classes `.container`
    `.container-narrow` `.container-wide`.
  - Motion: `.reveal` / `.reveal-d1..d4` scroll-reveal primitive and
    `.drift` / `.drift-soft` ambient motion already exist in
    `tokens/motion.css`, gated behind `prefers-reduced-motion`. REUSE these
    instead of writing new keyframe systems.
  - Radii/shadows/glass: `--radius-sm/md/lg/xl/2xl/pill`, `--shadow-sm/md/lg`,
    `--glass-light` / `--glass-dark` + `--blur-sm/md/lg`. Already used for
    `.top-bar` (glass) etc.

**The correct move is to lean harder into this existing system, not replace
it.** Where earlier research (see `Frontend_UI_Redesign_Prompt_Research.md`
if present) suggested "ban default fonts, invent a new palette" — that advice
assumed a generic, un-branded page. It does not apply here. Any Phase that
proposes new fonts, a new color palette, or a competing motion system is
wrong and must be corrected back to the tokens above.

The page also defines its own local, purpose-built `:root` variables on top
of the brand tokens — these are logic-critical and must be kept:
  - `--status-offen/-bg`, `--status-knapp/-bg`, `--status-unklar/-bg`,
    `--status-zu/-bg` — application-deadline status colors, referenced live
    from JS (`STATUS_FARBE_VAR`, `STATUS_BG_VAR` in the `statusBadge()`
    function). Deliberately distinct from brand sienna/amber/navy so status
    is never confused with brand accents.
  - `--bar-color-1..4` (+ `-bg`) — ranking-bar distinction colors, cycled
    programmatically so adjacent bars never share a hue.
  These may be visually refined (contrast, saturation) but their *semantic
  role* and CSS custom-property names must not change — JS writes inline
  `style="--status-farbe:var(...)"` against these exact names.
</existing_brand_system>

<architectural_principles>
  - PROGRESSIVE DISCLOSURE: Default view shows only what supports a decision
    — program name, university/city, overall score, Frist (deadline) status.
    Everything else (Fachliche Passung breakdown, Kosten, Stadtinfrastruktur,
    Kaltmiete, full methodology text, raw weighting math) goes behind
    `<details>/<summary>`, an accordion, or a modal — collapsed by default.
  - MOBILE-FIRST DENSITY: No horizontally-scrolling data tables. `#tabelle`
    (`#vergleichstabelle`) and `#staedtetabelle` become stacked cards on
    narrow viewports; a table view may persist above a defined breakpoint
    only if the first column is frozen and it stays optional.
  - VISUAL HIERARCHY: Use the existing type scale and glow/accent tokens to
    make status and score pre-attentively scannable (System 1) before any
    reading (System 2) is required.
  - SURGICAL EXECUTION: This is legacy-grade logic — treat it that way.
    `gesamtscore()`, `teilscores()`, `distanzNutzen()`, `fahrzeitDaten()`,
    `berechneFristStatus()`, `tageBisFrist()`, the SVG map math
    (`projiziere()`, `karteInit()`, `karteInteraktionInit()`,
    `karteApplyTransform()`), state persistence (`ladeState()`,
    `speichereState()`, `STORAGE_KEY` / `localStorage`), and every
    `render*()` function's DOM query targets (element IDs/classes) must
    survive unchanged in behavior. You may restructure the DOM a render
    function *writes into*, but the render function must still find its
    mount point by the same ID and the data it writes must be unchanged.
    Touch only what you must, in the phase you're told to touch it.
</architectural_principles>

<agent_orchestration>
This refactor runs as a multi-phase job (see `IMPROVEMENT-BRIEFING.md` in
this same folder for the phase list). Use Claude Code's Task tool to
orchestrate rather than doing every phase monolithically in the main thread:

  - Run each phase as its own scoped unit of work. Before starting a phase,
    state in plain text which functions/IDs/sections it will touch and which
    it will not.
  - After each phase, spin up a **verification subagent** (Task tool, a
    read-only/general-purpose agent) whose only job is to diff the change
    against the "must remain intact" checklist in `IMPROVEMENT-BRIEFING.md`
    Appendix A (function names, IDs, storage keys) and report PASS/FAIL with
    specifics. Do not proceed to the next phase on FAIL.
  - At the aesthetic decision points explicitly marked "AESTHETIC REVIEW" in
    `IMPROVEMENT-BRIEFING.md` (Phase 1 typographic/color pass, Phase 3 hero
    treatment, Phase 4 motion pass), delegate the judgment call to a subagent
    configured with **model: fable** (Claude Fable 5) rather than deciding
    inline. Fable is the more creatively-tuned model of the family and is
    better suited to taste calls (pairing, rhythm, restraint vs. flourish)
    than to the mechanical refactor itself. Define it once as a project
    subagent, e.g. `.claude/agents/design-critic.md`:

    ```
    ---
    name: design-critic
    description: Aesthetic/taste review of a completed UI phase against the
      Mika Jeske brand tokens. Use after each visual phase, not for logic work.
    model: fable
    tools: Read, Grep, Glob
    ---
    You review, you do not implement. Given a diff or file, judge it strictly
    against ci/tokens/*.css: token usage, restraint, hierarchy, whether it
    reads as "the brand" or as generic AI output. Flag anything that
    reinvents rather than reuses the existing system. Be specific and terse.
    ```

  - Keep the main orchestrating thread on Sonnet/Opus for the structural
    work (DOM/CSS/JS surgery); reserve Fable for critique, not code-writing,
    unless a phase is explicitly copy/microcopy work (e.g. wording of a
    collapsed-state label), where Fable may draft and Sonnet implements.
</agent_orchestration>
