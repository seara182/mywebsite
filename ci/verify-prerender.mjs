/* Raw-HTTP / raw-file verification that every language page ships its full text
 * and semantic markers WITHOUT executing any JavaScript — i.e. exactly what a
 * search spider or LLM crawler (curl, GPTBot, ClaudeBot, Firecrawl) receives.
 *
 * Default: reads the built files from disk (offline, checks the build output).
 * Live:    `node ci/verify-prerender.mjs https://mika-jeske.de` fetches the
 *          deployed URLs with a plain fetch (no browser).
 *
 * Exits non-zero if any language is missing content or markers.
 */
import { readFileSync } from "node:fs";

const base = process.argv[2] && /^https?:\/\//.test(process.argv[2]) ? process.argv[2].replace(/\/$/, "") : null;

// lang -> { path, file, needle (a sentence unique to that language) }
const PAGES = [
  { lang: "de", path: "/",    file: "index.html",    needle: "Werkstoffwissenschaftler" },
  { lang: "en", path: "/en/", file: "en/index.html", needle: "materials scientist focused on measurement" },
  { lang: "fr", path: "/fr/", file: "fr/index.html", needle: "scientifique des matériaux" },
  { lang: "es", path: "/es/", file: "es/index.html", needle: "científico de materiales" },
  { lang: "it", path: "/it/", file: "it/index.html", needle: "scienziato dei materiali" },
];

async function getHtml(page) {
  if (base) {
    const res = await fetch(base + page.path, { redirect: "manual" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  }
  return readFileSync(page.file, "utf8");
}

function checkPage(html, page) {
  const problems = [];

  // 1. #root actually contains prerendered markup (not an empty CSR shell)
  const root = html.match(/<div id="root">([\s\S]*?)<\/body>/);
  const rootInner = root ? root[1] : "";
  if (rootInner.replace(/\s/g, "").length < 2000) problems.push("#root looks empty / too small (CSR shell?)");

  // 2. the language's own text is present in the raw HTML
  if (!html.includes(page.needle)) problems.push(`missing localized text: "${page.needle}"`);

  // 3. <html lang> matches the page
  const langAttr = (html.match(/<html lang="([a-z-]+)"/) || [])[1];
  if (langAttr !== page.lang) problems.push(`<html lang="${langAttr}"> != "${page.lang}"`);

  // 4. full reciprocal hreflang block (5 languages + x-default)
  for (const l of ["de", "en", "fr", "es", "it", "x-default"]) {
    if (!html.includes(`hreflang="${l}"`)) problems.push(`missing hreflang="${l}"`);
  }

  // 5. semantic landmarks / reveal markers present in the served DOM
  if (!/<main[\s>]/.test(html)) problems.push("missing <main> landmark");
  if (!html.includes('<nav aria-label')) problems.push("missing <nav> landmark");
  if (!/<h1[\s>]/.test(html)) problems.push("missing <h1>");
  if (!html.includes("js-reveal")) problems.push("missing reveal markup (js-reveal)");

  // 6. self-referential canonical
  if (!html.includes(`rel="canonical"`)) problems.push("missing canonical");

  return problems;
}

let failed = 0;
for (const page of PAGES) {
  try {
    const html = await getHtml(page);
    const problems = checkPage(html, page);
    if (problems.length) {
      failed++;
      console.log(`✗ ${page.path}`);
      for (const p of problems) console.log(`    - ${p}`);
    } else {
      console.log(`✓ ${page.path}  (lang=${page.lang}, full text + markers present)`);
    }
  } catch (e) {
    failed++;
    console.log(`✗ ${page.path}  — ${e.message}`);
  }
}

console.log(failed ? `\n${failed} page(s) FAILED verification.` : "\nAll pages verified: full text + SEO/semantic markers served without JS.");
process.exit(failed ? 1 : 0);
