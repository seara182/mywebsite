# Design Guide: Avoiding "Vibe-Coding"
## A Practical Checklist for mika-jeske.de Subpages

---

## What is "Vibe-Coding"?

A design built on **aesthetic mood** rather than **intentional structure**. The result:
- Low contrast (hard to read, fails WCAG AA)
- Gradients applied everywhere (no semantic meaning)
- Emoji as functional icons (ambiguous, not scalable)
- No keyboard focus states (mobile users, assistive tech invisible)
- Animations ignoring `prefers-reduced-motion` (vestibular issues)
- Layouts that break at common viewport sizes (375px, 768px)
- Color picked "because it looks nice" (no token system, no rationale)
- Same aesthetic for entirely different contexts (a bank looks like a bakery)

**The smell test**: If you had to defend every choice to a colorblind user, someone on a screen reader, or someone with motion sensitivity — would your design hold up?

---

## The Anti-Vibe-Code Checklist

Use this before shipping any subpage or component. ✅ = production-ready, ❌ = needs rework.

### 1. Color & Contrast

- [ ] **Text contrast ≥ 4.5:1 (WCAG AA)** — test with [WebAIM](https://webaim.org/resources/contrastchecker/)
  - Headline + body copy: measure against the background it actually sits on
  - Interactive elements (links, buttons): 3:1 minimum for non-text, 4.5:1 for text
- [ ] **Color not the only way to convey meaning** — use shape, text, position, or icon alongside color
  - Example: "error state" = red border *and* ✗ icon *and* error message text (not just red background)
- [ ] **Token system in place** — every color named by *function*, not *feeling*
  - Good: `--ink`, `--paper`, `--accent`, `--sage`, `--plum`
  - Bad: `--vibrant-purple`, `--chill-blue`, `--sunset-orange`
- [ ] **Light/Dark modes both work** — redefine tokens under `@media (prefers-color-scheme: dark)` or `[data-theme="dark"]`
- [ ] **Color palette justifiable** — each color tied to brand, data, accessibility, or intentional hierarchy (not "it matches the vibes")

### 2. Typography

- [ ] **Font size scale consistent** — use size tokens, not arbitrary `18px`, `22px`, `31px`
  - Example tokens: `--fs-caption`, `--fs-body`, `--fs-lead`, `--fs-title`, `--fs-h1`, `--fs-h2`, `--fs-display`
- [ ] **Line-height appropriate for measure** — body copy: 1.5–1.6 (≤66ch wide), headings: 1.0–1.2
- [ ] **Letter-spacing intentional** — all-caps labels get +0.08em to +0.14em; body text: normal (0)
- [ ] **Font pairing tested** — if using multiple typefaces, they work together (not just "looked cool")
  - Example: serif headline + sans body (proven), sans + mono (okay), serif + script (usually fails)
- [ ] **Mobile readability** — base size ≥ 16px on mobile to avoid browser zoom-on-focus

### 3. Spacing & Layout

- [ ] **Consistent gutter & padding system** — use tokens: `--gutter`, `--section-y`, `--gap-*`
  - No magic numbers like `19px` or `47px` — multiples of 4, 8, or 16
- [ ] **Breakpoint test points defined** — test at 320px, 375px (mobile), 768px (tablet), 1200px (desktop), 1440px+ (wide)
  - Grid/flex behavior documented for each breakpoint
- [ ] **Column layout doesn't break** — 2-column at desktop gracefully becomes 1-column on mobile
- [ ] **Safe zone respected** — 16px+ gutter on all sides, even on mobile
- [ ] **Responsive images** — `max-width: 100%` on all `<img>`, explicit `aspect-ratio` where fixed
- [ ] **No horizontal scroll** — entire page scrolls only vertically (check `overflow-x: hidden` on `body`)

### 4. Focus & Keyboard Navigation

- [ ] **Focus indicator visible** — blue or accent-color outline, 2–3px, 3px offset minimum
  - All interactive elements: `<a>`, `<button>`, `<input>`, custom components
- [ ] **Focus indicator in both light & dark** — contrast ≥ 3:1 against background
- [ ] **Tab order logical** — top-to-bottom, left-to-right, no traps
  - Test with keyboard only: Tab, Shift+Tab, Enter, Space
- [ ] **Skip links present** — at least "Skip to main content" link (visible on focus)
- [ ] **Focus not hidden by overflow** — e.g., focused link in a scrollable container is scrolled into view
- [ ] **`:focus-visible` used, not `:focus`** — keyboard users get outline, mouse users don't (or both, as designed)

### 5. Semantic HTML & ARIA

- [ ] **Heading hierarchy intact** — `<h1>` once per page, then `<h2>`, `<h3>` in order (no skipping levels)
- [ ] **Form labels explicit** — every `<input>` has a `<label for="">` or `aria-label`
- [ ] **Buttons are buttons** — use `<button>` or `<a role="button">`, not a `<div onclick="…">`
- [ ] **Landmark roles used** — `<header>`, `<nav>`, `<main>`, `<footer>`, or explicit `role="region"`
- [ ] **List semantics** — repeated items use `<ul>`, `<ol>`, or `<dl>`; not divs pretending to be lists
- [ ] **Images have alt text** — `alt=""` only if decorative; otherwise describe content, not "image of…"
- [ ] **ARIA labels concise** — `aria-label="Close dialog"` (not "Click here to close the dialog box")

### 6. Motion & Animation

- [ ] **`prefers-reduced-motion` respected** — all transitions wrapped in `@media (prefers-reduced-motion: reduce)`
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```
- [ ] **No auto-play video/GIF** — user initiates motion (or `autoplay muted playsinline` for background video)
- [ ] **No flashing** — animations never flash >3 times per second (seizure risk)
- [ ] **Easing functions used** — `ease-in-out`, `cubic-bezier(…)` for natural feel (not linear)
- [ ] **Animation duration ≤ 600ms** — snappy, not slow or distracting (exception: long-form hero sequences ≤ 1.4s)

### 7. Component Consistency

- [ ] **Buttons** — use consistent padding, border-radius, font size across all similar buttons
- [ ] **Cards** — if you use a card component, all cards share border, shadow, padding, border-radius
- [ ] **Icons** — all the same style (SVG, or all emoji, or all text; not a mix)
  - If emoji, used *only* decoratively (not as "close button" or "add to list")
- [ ] **Forms** — input borders, padding, label position, error styling consistent across all inputs
- [ ] **Links** — underlined by default in body text; same color/hover/active state everywhere
- [ ] **Tooltips/modals** — same backdrop, same close button, same z-index hierarchy

### 8. Readability & Scannability

- [ ] **Contrast hierarchy visible** — headings darker/bolder than body, not just bigger
- [ ] **Line length reasonable** — body text: 50–75 characters (about 600–800px max width)
- [ ] **Whitespace intentional** — breathing room around sections, not packed-in
- [ ] **Callouts & emphasis clear** — bold, color, or box, not just italic or size
- [ ] **Lists scannable** — bullets, numbers, or consistent indentation; not paragraph prose

### 9. Accessibility Beyond WCAG

- [ ] **Language attribute set** — `<html lang="de">` or `lang="en"`; if mixing languages, mark with `<span lang="en">`
- [ ] **Viewport meta tag present** — `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] **Device zoom not disabled** — never `user-scalable=no` or `maximum-scale=1`
- [ ] **Text size adjustable** — no `font-size: 12px` on small-screen body text; use `clamp()` or calc()
- [ ] **Touch targets ≥ 44×44px** — buttons, links, form inputs (not including spacing)
- [ ] **Color blindness tested** — use [Coblis simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/) or browser DevTools
- [ ] **Screen reader tested** — NVDA (Windows), VoiceOver (Mac/iOS) for key flows

### 10. Performance & Code Quality

- [ ] **No unused CSS** — production bundle doesn't ship unused Tailwind, CSS-in-JS, or style blocks
- [ ] **CSS custom properties used** — not hex values scattered through stylesheets
- [ ] **No inline styles** — `style="…"` used only for dynamic values, not static rules
- [ ] **Images optimized** — PNG for graphics, JPEG for photos; WebP if supported; `srcset` for retina
- [ ] **JavaScript only where needed** — animations via CSS, layout via Flexbox/Grid, not JS-driven
- [ ] **No third-party font bloat** — Google Fonts load asynchronously; web-safe fallback in stack

---

## Practical Workflow

### Before Starting a New Subpage

1. **Copy the template** from `projects/cheapseats/index.html` or `index.template.html`
2. **Define your color tokens** — what's the *function* of each color?
   - Accent (primary action)
   - Neutral (text, borders)
   - Success/Error/Warning (semantic colors)
   - Background & surface (for cards, sections)
3. **Choose your typography scale** — typically 4–6 font sizes; copy from existing pages
4. **Set breakpoints** — 320px (mobile), 768px (tablet switch), 1200px (desktop)
5. **Build mobile-first** — mobile layout first, then enhance for larger screens

### During Development

- [ ] Test with keyboard only (disable mouse)
- [ ] Test with screen reader (NVDA Portable)
- [ ] Test in light & dark modes
- [ ] Check contrast in both modes
- [ ] Test at breakpoints: 375px, 768px, 1440px
- [ ] Toggle `prefers-reduced-motion` in DevTools
- [ ] Disable images; alt text should still make sense

### Before Shipping

- [ ] Run axe DevTools (Chrome/Firefox) — ≥ 95 score
- [ ] Run Lighthouse (Chrome DevTools) — Accessibility ≥ 90
- [ ] Manual check of every checklist item above
- [ ] Code review: another person reads your CSS and asks "why?" for every color/size/spacing choice
- [ ] Live testing on actual mobile device (not just DevTools emulation)

---

## Red Flags

🚨 **Stop and rework if you see:**

- Gradient on top of gradient (no semantic reason)
- Emoji as functional UI (× button, + button, etc.)
- Text lighter than 40% opacity on white background
- `transform: rotate()` without `prefers-reduced-motion` guard
- `position: fixed` sidebar with no keyboard focus trap escape
- No `:focus-visible` on any interactive element
- "It looks cool in dark mode, but we'll worry about light mode later"
- Sass nested >4 levels deep (CSS bloat coming)
- Font sizes: 12px, 15px, 19px, 26px, 31px (no system, no scale)
- `@media (prefers-reduced-motion)` not implemented at all

---

## Reference: This Site's Design System

Your existing site uses these tokens. **Reuse them; don't create new ones.**

```css
:root {
  /* Color tokens */
  --ink: #1a1a1a;                   /* Text, headings */
  --paper: #faf9f6;                  /* Background */
  --sage: #7a9e85;                   /* Calm accent, captions */
  --plum: #6b5880;                   /* Deep accent, bands */
  --honey: #d9c062;                  /* Warm highlight */
  --accent: #6b5880;                 /* Interactive (use --plum) */
  
  /* Typography */
  --font-display: "Courier Prime", system-ui;
  --font-text: system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --fs-caption: 11px;
  --fs-small: 13px;
  --fs-body: 16px;
  --fs-lead: 18px;
  --fs-title: 20px;
  --fs-h3: 24px;
  --fs-h2: 32px;
  --fs-h1: 48px;
  --fs-display: 64px;
  --lh-tight: 1.2;
  --lh-normal: 1.5;
  --lh-relaxed: 1.75;
  
  /* Spacing */
  --gutter: clamp(20px, 5vw, 64px);
  --section-y: clamp(56px, 8vw, 112px);
  --gap-sm: 8px;
  --gap-md: 16px;
  --gap-lg: 32px;
  
  /* Radius & Shadow */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.16);
  
  /* Easing */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #faf9f6;
    --paper: #1a1a1a;
    /* (override only what changes; tone stays consistent) */
  }
}
```

Copy this into your new subpage's `<style>` block. Do not invent new tokens.

---

## Examples

### ❌ Vibe-Coded
```html
<div style="background: linear-gradient(135deg, #a78bfa, #ec4899); padding: 40px; border-radius: 20px;">
  <h2 style="color: #64748b; font-size: 32px; margin: 0;">
    Explore Features 💫
  </h2>
  <p style="color: #94a3b8; font-size: 14px; line-height: 1.4;">
    Discover what makes us different...
  </p>
  <button style="background: transparent; border: none; cursor: pointer;">
    👉 Learn More
  </button>
</div>
```

**Problems:**
- Gradient with no semantic reason (just looks nice)
- Gray text (likely fails contrast)
- No focus state on button
- Emoji as functional icon
- Inline styles everywhere
- No tokens, no system

### ✅ Anti-Vibe-Coded
```html
<section class="feature-band">
  <div class="container">
    <h2>Explore Features</h2>
    <p>Discover what makes us different…</p>
    <a href="#features" class="cta-button">Learn More</a>
  </div>
</section>

<style>
.feature-band {
  background: var(--plum);
  color: var(--on-dark-strong);
  padding: var(--section-y) 0;
}
.feature-band h2 {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  line-height: 1.12;
  margin: 0;
  color: var(--on-dark-strong);
}
.feature-band p {
  font-size: var(--fs-lead);
  line-height: var(--lh-relaxed);
  color: var(--on-dark-body);
  margin: var(--gap-md) 0 0;
}
.cta-button {
  display: inline-block;
  padding: 12px 24px;
  background: var(--paper);
  color: var(--ink);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
  margin-top: var(--gap-md);
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.cta-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .cta-button { transition: none; }
}
</style>
```

**Why this works:**
- Colors are intentional (plum band for visual break, paper button for contrast)
- Typography follows system (fs-h2, fs-lead)
- Focus visible and keyboard-accessible
- No emoji, no confusion
- Respects motion preferences
- All choices justified (not "because it looks nice")
- Will work in light/dark without rework

---

## Further Reading

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — the standard
- [Web Accessibility by Design](https://www.smashingmagazine.com/2018/04/designing-accessibility/) — Smashing Magazine
- [Design Systems 101](https://www.nngroup.com/articles/design-systems-101/) — Nielsen Norman Group
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) — MDN
- [System Font Stack](https://systemfontstack.com/) — for fast, native typography

---

**Last Updated**: 2026-09-12  
**Maintained By**: Mika Jeske  
**Status**: Live for mika-jeske.de subpages (CheapSeats, Leben, etc.)
