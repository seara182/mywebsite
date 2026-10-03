# Graph Report - Mika-Jeske.de  (2026-10-03)

## Corpus Check
- 51 files · ~2,316,565 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 28 file(s) not represented in the graph (top: .css 10, .otf 8, (none) 3)

## Summary
- 1062 nodes · 2137 edges · 68 communities (51 shown, 12 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 213 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `281380d2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- primitives.js
- primitives.jsx
- package.json
- Hero
- verify-contrast.mjs
- mountLanguageSwitcher
- xk
- sections-new.jsx
- ri
- brag-output/composition/hyperframes.json
- brag-vertical/composition/hyperframes.json
- devDependencies
- scripts
- scripts
- i18n.js
- wi
- sections-b.jsx
- scripts
- babel.config.json
- sync-ai-skills.sh
- react-dom.production.min.js
- react.production.min.js
- m
- CheapSeats: Multi-Platform Porting & Distribution Plan
- Changelog
- build-brag.mjs
- build.mjs
- tj
- mywebsite — Mika Jeske
- HyperFrames Composition Project
- HyperFrames Composition Project
- HyperFrames Composition Project
- HyperFrames Composition Project
- ni
- Brag plan — a cinematic tour of mika-jeske.de
- dist-BMnS_qxa.js
- CheapSeats
- emitPages
- _updateDotLottieInstanceState
- x
- decorate-C0oFmnNg.js
- _draw
- e
- _loadFromData
- base-dotlottie-wc.js
- sections-a.js
- _$AI
- finalize
- requestUpdate
- performUpdate
- dotlottie-wc — vendored
- createRenderRoot
- sections-new.js
- Sd
- _onClick
- _onPointerDown
- _onPointerEnter
- _onPointerLeave
- _onPointerMove
- _onPointerUp
- removeEventListener
- cancelAnimationFrame
- unobserve

## God Nodes (most connected - your core abstractions)
1. `m()` - 47 edges
2. `xk()` - 43 edges
3. `x()` - 38 edges
4. `_updateDotLottieInstanceState()` - 28 edges
5. `ri()` - 25 edges
6. `v()` - 23 edges
7. `_draw()` - 22 edges
8. `b()` - 22 edges
9. `dh()` - 21 edges
10. `c()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `S()` --indirect_call--> `A()`  [INFERRED]
  ci/vendor/react.production.min.js → sections-a.js
- `w()` --indirect_call--> `R()`  [INFERRED]
  sections-b.js → ci/vendor/react.production.min.js
- `k()` --indirect_call--> `c()`  [INFERRED]
  sections-b.js → i18n.min.js
- `w()` --indirect_call--> `r()`  [INFERRED]
  sections-b.js → primitives.js
- `w()` --indirect_call--> `d()`  [INFERRED]
  sections-b.js → primitives.js

## Import Cycles
- None detected.

## Communities (68 total, 12 thin omitted)

### Community 0 - "primitives.js"
Cohesion: 0.10
Nodes (25): c(), b(), d(), f(), g(), h(), i(), m() (+17 more)

### Community 1 - "primitives.jsx"
Cohesion: 0.09
Nodes (23): BlobPhoto(), _depth(), GlowShape(), Parallax(), prefersReduced(), Pressable(), onMove(), _pxListen() (+15 more)

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (14): description, name, private, version, @babel/core, @babel/preset-react, cspell, @cspell/dict-de-de (+6 more)

### Community 3 - "Hero"
Cohesion: 0.16
Nodes (14): Hero(), apply(), offTheme(), onRefused(), onReplay(), onResize(), onScroll(), progress() (+6 more)

### Community 4 - "verify-contrast.mjs"
Cohesion: 0.10
Nodes (18): css, dark, HERE, light, lum(), NON_TEXT, PAIRS, ratio() (+10 more)

### Community 5 - "mountLanguageSwitcher"
Cohesion: 0.19
Nodes (10): arm(), mountContactChip(), mountLanguageSwitcher(), closeMenu(), openMenu(), renderHint(), renderLabels(), renderTheme() (+2 more)

### Community 6 - "xk"
Cohesion: 0.10
Nodes (34): F(), J(), Bf(), bj(), Bk(), cf(), $d(), Db() (+26 more)

### Community 7 - "sections-new.jsx"
Cohesion: 0.17
Nodes (4): SEEBECK_T, SIGMA_TIME, TornEdge(), tornPath()

### Community 8 - "ri"
Cohesion: 0.19
Nodes (41): ac(), Ce(), dh(), b(), c(), d(), e(), f() (+33 more)

### Community 9 - "brag-output/composition/hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 10 - "brag-vertical/composition/hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 11 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @babel/core, @babel/preset-react, cspell, @cspell/dict-de-de, @cspell/dict-es-es, @cspell/dict-fr-fr, @cspell/dict-it-it (+3 more)

### Community 12 - "scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, check, dev, publish, render, type

### Community 13 - "scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, check, dev, publish, render, type

### Community 14 - "i18n.js"
Cohesion: 0.30
Nodes (11): applyTheme(), getLang(), langFromPath(), onPrerenderedHome(), pathForLang(), readTheme(), resolvePath(), safeStorage() (+3 more)

### Community 15 - "wi"
Cohesion: 0.08
Nodes (40): aa(), af(), ah(), ai(), bi(), df(), ea(), ef() (+32 more)

### Community 17 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, build:changelog, spellcheck, verify, verify:contrast, watch

### Community 23 - "react-dom.production.min.js"
Cohesion: 0.05
Nodes (60): $a(), Ab(), Ag(), bc(), Bd(), be(), Bg(), Cg() (+52 more)

### Community 24 - "react.production.min.js"
Cohesion: 0.12
Nodes (22): y(), q, Fa(), Qh(), B(), C(), D(), E() (+14 more)

### Community 25 - "m"
Cohesion: 0.13
Nodes (22): B(), Cc(), cd(), gh(), Gk(), $h(), hh(), jd() (+14 more)

### Community 26 - "CheapSeats: Multi-Platform Porting & Distribution Plan"
Cohesion: 0.12
Nodes (16): 1. Distribution Strategy & Cost Matrix, 2. Track 1: Android Port (Tauri v2 $\rightarrow$ Google Play), 3. Track 2: iOS & Mobile Web PWA ("Add to Home Screen"), 4. Track 3: macOS Desktop (Personal & Future Public Path), 5. Execution Roadmap, CheapSeats: Multi-Platform Porting & Distribution Plan, Current Setup (Free / Personal):, Free Cloudflare Worker Code (`cors-proxy.js`): (+8 more)

### Community 27 - "Changelog"
Cohesion: 0.07
Nodes (26): Accessibility, Accessibility, Accessibility, Changelog, Fixed, Fixed, Fixed, Fixed (+18 more)

### Community 28 - "build-brag.mjs"
Cohesion: 0.14
Nodes (11): apply(), argv, COMPS, esc(), LANGS, only, POSTER_W, STR (+3 more)

### Community 31 - "build.mjs"
Cohesion: 0.22
Nodes (12): buildAll(), bundleCSS(), compile(), JSX_FILES, loadApp(), minifyCSS(), minifyVendored(), React (+4 more)

### Community 32 - "tj"
Cohesion: 0.20
Nodes (12): bh(), ch(), Ck(), Id(), Ie(), ii(), ji(), me() (+4 more)

### Community 33 - "mywebsite — Mika Jeske"
Cohesion: 0.22
Nodes (7): Agent instructions, AI skills, Design, GDPR: no external traffic (hard rule), graphify, Local-only (gitignored) files, mywebsite — Mika Jeske

### Community 35 - "HyperFrames Composition Project"
Cohesion: 0.25
Nodes (7): Commands, Documentation, HyperFrames Composition Project, Key Rules, Linting — ALWAYS RUN AFTER CHANGES, Project Structure, Skills — USE THESE FIRST

### Community 36 - "HyperFrames Composition Project"
Cohesion: 0.25
Nodes (7): Commands, Documentation, HyperFrames Composition Project, Key Rules, Linting — ALWAYS RUN AFTER CHANGES, Project Structure, Skills — USE THESE FIRST

### Community 37 - "HyperFrames Composition Project"
Cohesion: 0.25
Nodes (7): Commands, Documentation, HyperFrames Composition Project, Key Rules, Linting — ALWAYS RUN AFTER CHANGES, Project Structure, Skills — USE THESE FIRST

### Community 38 - "HyperFrames Composition Project"
Cohesion: 0.25
Nodes (7): Commands, Documentation, HyperFrames Composition Project, Key Rules, Linting — ALWAYS RUN AFTER CHANGES, Project Structure, Skills — USE THESE FIRST

### Community 39 - "ni"
Cohesion: 0.16
Nodes (19): Eg(), hc(), Hk(), ia(), jk(), Kk(), Li(), Lk() (+11 more)

### Community 40 - "Brag plan — a cinematic tour of mika-jeske.de"
Cohesion: 0.29
Nodes (6): Assets (local, from repo, copied into composition/assets/), Brag plan — a cinematic tour of mika-jeske.de, Brand (verbatim from ci/tokens/), Music cue guidance, Planning rubric, Storyboard (beats, timings in seconds)

### Community 41 - "dist-BMnS_qxa.js"
Cohesion: 0.02
Nodes (4): c, l, M(), P()

### Community 42 - "CheapSeats"
Cohesion: 0.29
Nodes (6): Aufbau / Architektur, Bekannte Einschränkungen, CheapSeats, Funktionen / Features, Stack, Was ist das?

### Community 43 - "emitPages"
Cohesion: 0.47
Nodes (6): baseForLang(), emitPages(), escAttr(), hreflangBlock(), pathForLang(), renderForLang()

### Community 48 - "_updateDotLottieInstanceState"
Cohesion: 0.09
Nodes (40): _animationLoop(), _cleanupCanvas(), _cleanupStateMachineListeners(), destroy(), __destroy_into_raw(), _drainPlayerEvents(), _drainSmEvents(), free() (+32 more)

### Community 49 - "x"
Cohesion: 0.05
Nodes (42): animation_id(), clear_slot(), current_marker(), g(), get_slot_str(), get_slot_type(), get_slots_str(), get_state_machine() (+34 more)

### Community 50 - "decorate-C0oFmnNg.js"
Cohesion: 0.08
Nodes (16): _$AE(), _$AK(), attributeChangedCallback(), b, disconnectedCallback(), firstUpdated(), getPropertyOptions(), getUpdateComplete() (+8 more)

### Community 51 - "_draw"
Cohesion: 0.10
Nodes (25): addEventListener(), clearSlot(), clearSlots(), _draw(), ee(), getWorker(), ie(), _isKeyframeArray() (+17 more)

### Community 52 - "e"
Cohesion: 0.09
Nodes (27): broadcastMessage(), D(), dispatch(), e(), getSlot(), getSlotIds(), getTransform(), h() (+19 more)

### Community 53 - "_loadFromData"
Cohesion: 0.14
Nodes (21): assignAnimationToWorker(), B(), constructor(), _create(), _createCore(), _dispatchError(), _fetchData(), _initWasm() (+13 more)

### Community 54 - "base-dotlottie-wc.js"
Cohesion: 0.20
Nodes (11): adoptedCallback(), attributeChangedCallback(), connectedCallback(), disconnectedCallback(), _init(), ge(), ie, n (+3 more)

### Community 55 - "sections-a.js"
Cohesion: 0.23
Nodes (8): A(), C(), D(), F(), I(), j(), S(), W()

### Community 56 - "_$AI"
Cohesion: 0.29
Nodes (12): render(), a(), _$AI(), _$AR(), constructor(), createElement(), G(), j() (+4 more)

### Community 57 - "finalize"
Cohesion: 0.25
Nodes (9): addInitializer(), createProperty(), _$Ei(), finalize(), finalizeStyles(), getPropertyDescriptor(), observedAttributes(), p() (+1 more)

### Community 58 - "requestUpdate"
Cohesion: 0.25
Nodes (8): C(), _$E_(), _$EP(), _$Eu(), _$Ev(), he(), requestUpdate(), scheduleUpdate()

### Community 59 - "performUpdate"
Cohesion: 0.32
Nodes (8): de(), _$EM(), _$ET(), performUpdate(), render(), shouldUpdate(), update(), willUpdate()

### Community 60 - "dotlottie-wc — vendored"
Cohesion: 0.40
Nodes (4): Contents, dotlottie-wc — vendored, Local patch — re-apply on any upgrade, Weight

### Community 61 - "createRenderRoot"
Cohesion: 1.33
Nodes (3): connectedCallback(), createRenderRoot(), enableUpdating()

### Community 65 - "sections-new.js"
Cohesion: 0.47
Nodes (3): h(), v(), x()

### Community 66 - "Sd"
Cohesion: 0.13
Nodes (18): ci(), Dg(), ff(), hb(), pd(), qa(), sc(), Sd() (+10 more)

## Knowledge Gaps
- **167 isolated node(s):** `presets`, `$schema`, `registry`, `blocks`, `components` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 382 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `F()` connect `xk` to `dist-BMnS_qxa.js`, `wi`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `J()` connect `xk` to `_updateDotLottieInstanceState`, `dist-BMnS_qxa.js`, `_loadFromData`, `ri`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `xk()` connect `xk` to `Sd`, `ri`, `wi`, `react-dom.production.min.js`, `react.production.min.js`, `m`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `xk()` (e.g. with `F()` and `J()`) actually correct?**
  _`xk()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `x()` (e.g. with `n()` and `o()`) actually correct?**
  _`x()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `ri()` (e.g. with `c()` and `d()`) actually correct?**
  _`ri()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `presets`, `$schema`, `registry` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._