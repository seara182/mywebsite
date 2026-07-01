/* Build step: compile the .jsx sources to plain .js AND prerender the page to
 * static HTML, once per language, so the full DOM text is served raw to search
 * spiders and LLM crawlers — then hydrated in the browser.
 *
 * 1. Compile each .jsx -> .js (Babel, classic runtime), wrapped in an IIFE so the
 *    repeated top-level `const { ... } = window.MJ;` in each file doesn't collide
 *    in the shared classic-script scope.
 * 2. Load i18n.js + widgets.js + the compiled component files into a Node sandbox
 *    that mimics the browser globals they touch (window/React), so they register
 *    on window.MJ / window.SECTIONS_*. Browser-only APIs (IntersectionObserver,
 *    document, localStorage) are only used inside effects/handlers, which don't
 *    run during server render, so they aren't needed here.
 * 3. For each supported language, force the active language and
 *    ReactDOMServer.renderToString(<App/>), then fill index.template.html and
 *    write /index.html (de) and /<lang>/index.html (en, fr, es, it).
 *
 * Run with: npm run build   (or: npm run watch)
 */
import { transformFileSync } from "@babel/core";
import { writeFileSync, readFileSync, mkdirSync, watch } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const JSX_FILES = ["primitives", "sections-a", "sections-new", "sections-b"];
const ORIGIN = "https://mika-jeske.de";

/* ---------- 1. compile ---------- */
function compile(name) {
  const { code } = transformFileSync(`${name}.jsx`, {
    presets: [["@babel/preset-react", { runtime: "classic" }]],
  });
  const wrapped = `// AUTO-GENERATED from ${name}.jsx by build.mjs — do not edit directly.\n(function () {\n${code}\n})();\n`;
  writeFileSync(`${name}.js`, wrapped);
  console.log(`  ${name}.jsx -> ${name}.js`);
}

/* ---------- 2. load the app into a Node sandbox ---------- */
function loadApp() {
  // Components share state across files via window.* — point window at the Node
  // global so their registrations are reachable here.
  global.window = global;
  global.React = React;
  // Referenced only inside the browser-guarded mount in sections-b (skipped here
  // because `document` is intentionally absent), but define a no-op for safety.
  global.ReactDOM = { hydrateRoot() {}, createRoot() { return { render() {} }; } };
  // navigator is a read-only global in modern Node and is never read during
  // server render (getLang is forced via __PRERENDER_LANG__), so it's left alone.

  const SCRIPTS = ["i18n.js", "widgets.js", ...JSX_FILES.map((f) => `${f}.js`)];
  for (const file of SCRIPTS) {
    vm.runInThisContext(readFileSync(file, "utf8"), { filename: file });
  }
  if (!global.I18N || !global.SECTIONS_B || !global.SECTIONS_B.App) {
    throw new Error("Sandbox load failed: window.I18N / window.SECTIONS_B.App not registered.");
  }
}

/* ---------- 3. prerender + emit per-language pages ---------- */
const pathForLang = (l) => (l === global.I18N.DEFAULT_LANG ? "/" : `/${l}/`);
const baseForLang = (l) => (l === global.I18N.DEFAULT_LANG ? "" : "../");
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function hreflangBlock(langs) {
  const lines = langs.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${pathForLang(l)}">`
  );
  lines.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/">`);
  return lines.join("\n");
}

function renderForLang(lang) {
  globalThis.__PRERENDER_LANG__ = lang;
  global.__ASSET_BASE__ = baseForLang(lang); // so asset() bakes the right depth in
  global.I18N.setActiveLang(lang);
  return ReactDOMServer.renderToString(React.createElement(global.SECTIONS_B.App));
}

function emitPages() {
  const template = readFileSync("index.template.html", "utf8");
  const langs = global.I18N.SUPPORTED;
  const hreflang = hreflangBlock(langs);

  for (const lang of langs) {
    const rootHtml = renderForLang(lang);
    global.I18N.setActiveLang(lang);
    const meta = global.I18N.t("meta");
    const title = escAttr(meta.title);
    const description = escAttr(meta.description);
    const canonical = ORIGIN + pathForLang(lang);
    const base = baseForLang(lang);

    // function replacements avoid `$`-pattern surprises in replacement strings
    const page = template
      .replace(/\{\{LANG\}\}/g, () => lang)
      .replace(/\{\{TITLE\}\}/g, () => title)
      .replace(/\{\{DESCRIPTION\}\}/g, () => description)
      .replace(/\{\{CANONICAL\}\}/g, () => canonical)
      .replace(/\{\{HREFLANG\}\}/g, () => hreflang)
      .replace(/\{\{BASE\}\}/g, () => base)
      .replace(/\{\{ROOT_HTML\}\}/g, () => rootHtml);

    const dir = lang === global.I18N.DEFAULT_LANG ? "." : lang;
    if (dir !== ".") mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, page);
    console.log(`  prerendered ${pathForLang(lang)} -> ${dir}/index.html`);
  }
}

function buildAll() {
  for (const name of JSX_FILES) compile(name);
  loadApp();
  emitPages();
  console.log("Build complete.");
}

buildAll();

if (process.argv.includes("--watch")) {
  console.log("Watching .jsx files for changes (Ctrl+C to stop)...");
  for (const name of JSX_FILES) {
    let timer = null;
    watch(`${name}.jsx`, () => {
      clearTimeout(timer); // debounce editors that fire multiple events per save
      timer = setTimeout(() => {
        try { buildAll(); } catch (e) { console.error(e.message); }
      }, 80);
    });
  }
}
