#!/usr/bin/env node
/* Verifies that every text-on-surface pair in the design tokens clears
   WCAG AA, in BOTH colour schemes, by reading ci/tokens/colors.css rather
   than a copy of the palette kept somewhere else.

   This exists because the original audit could only flag contrast as
   "unverified — needs a browser contrast picker", and a finding nobody can
   re-check is a finding that silently rots. A palette edit that drops a
   pair below 4.5:1 now fails the build instead.

   Scope: the token layer. It cannot see text rendered over photographs
   (.hero-ailabel) or opacity applied at the call site — those need a real
   browser and are covered in the axe/Lighthouse pass. */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(HERE, "tokens", "colors.css"), "utf8");

/* ---- token extraction -------------------------------------------------
   Values are declared either as a bare hex or as light-dark(a, b). Later
   declarations win, matching the cascade, so we just keep overwriting. */
const light = new Map(), dark = new Map();
const DECL = /(--[\w-]+)\s*:\s*([^;]+);/g;
for (const [, name, rawValue] of css.matchAll(DECL)) {
  const value = rawValue.trim();
  const ld = value.match(/^light-dark\(\s*(#[0-9A-Fa-f]{6})\s*,\s*(#[0-9A-Fa-f]{6})\s*\)$/);
  if (ld) { light.set(name, ld[1]); dark.set(name, ld[2]); continue; }
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    light.set(name, value);
    if (!dark.has(name)) dark.set(name, value); // unchanged across modes
  }
}
/* A token defined only in the light :root and never remapped applies to
   both schemes; the loop above seeds that, but a later light-dark() must
   still override the dark copy. Re-run to let light-dark() win. */
for (const [, name, rawValue] of css.matchAll(DECL)) {
  const ld = rawValue.trim().match(/^light-dark\(\s*(#[0-9A-Fa-f]{6})\s*,\s*(#[0-9A-Fa-f]{6})\s*\)$/);
  if (ld) { light.set(name, ld[1]); dark.set(name, ld[2]); }
}

/* ---- WCAG 2.1 relative luminance / contrast ---- */
const srgb = h => h.slice(1).match(/../g).map(x => {
  const v = parseInt(x, 16) / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
});
const lum = h => { const [r, g, b] = srgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/* ---- the contract ----
   Every pair a reader can actually end up looking at. --text-faint is
   absent on purpose: it is decorative/disabled only, which colors.css
   states at its declaration. */
const AA = 4.5, AA_LARGE = 3;
const PAIRS = [
  ["--text-strong", "--paper"],   ["--text-body", "--paper"],   ["--text-muted", "--paper"],
  ["--text-strong", "--paper-2"], ["--text-body", "--paper-2"], ["--text-muted", "--paper-2"],
  ["--on-dark-strong", "--plum"], ["--on-dark-body", "--plum"], ["--on-dark-muted", "--plum"],
  ["--on-dark-strong", "--sage"], ["--on-dark-body", "--sage"], ["--on-dark-muted", "--sage"],
  ["--on-dark-strong", "--plum-soft"], ["--on-dark-body", "--plum-soft"], ["--on-dark-muted", "--plum-soft"],
  ["--on-dark-strong", "--sage-soft"], ["--on-dark-body", "--sage-soft"], ["--on-dark-muted", "--sage-soft"],
];
/* The shape motif, against the paper bands only.

   This is NOT a WCAG assertion — the silhouettes are aria-hidden pure
   decoration, which 1.4.11 exempts outright. It is a design regression
   guard for the dark-mode inversion: --ink flips from near-black to
   near-white there, and getting that backwards would make every GlowShape
   and BlobPhoto vanish into the page (1.03:1) without failing any text
   check. 3:1 is borrowed as a "clearly visible" threshold.

   The plum/sage bands are deliberately excluded. A near-black shape on
   plum is 1.48:1 by design: it is separated by the white glow halo
   (--glow-white), not by its own contrast, and asserting a ratio there
   would be asserting against the brand. */
const NON_TEXT = [
  ["--ink", "--paper"], ["--ink", "--paper-2"],
  /* Accent marks — timeline dots, the rule inside an Eyebrow, badges, link
     underlines. These DO convey meaning, so 1.4.11's 3:1 genuinely applies.
     --accent resolves to --plum in light and --plum-lift in dark; both are
     checked against the paper of their own scheme. */
  ["--plum-lift", "--paper"], ["--sage-lift", "--paper"],
];

let failed = 0, checked = 0;
for (const [scheme, tokens] of [["light", light], ["dark", dark]]) {
  console.log(`\n  ${scheme.toUpperCase()}`);
  for (const [list, min, kind] of [[PAIRS, AA, "text"], [NON_TEXT, AA_LARGE, "non-text"]]) {
    for (const [fg, bg] of list) {
      const f = tokens.get(fg), b = tokens.get(bg);
      if (!f || !b) { console.log(`    MISSING  ${fg} on ${bg}`); failed++; continue; }
      const r = ratio(f, b); checked++;
      const ok = r >= min;
      if (!ok) failed++;
      console.log(`    ${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(6)}:1  (min ${min}, ${kind})  ${fg} on ${bg}`);
    }
  }
}
console.log(`\n  ${checked} pairs checked, ${failed} failing`);
if (failed) { console.error("\nContrast contract violated.\n"); process.exit(1); }
console.log("  Contrast contract holds in both schemes.\n");
