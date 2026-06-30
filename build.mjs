/* Build step: compile the .jsx sources to plain .js (no in-browser Babel).
 *
 * Each output is wrapped in an IIFE so its top-level `const { ... } = window.MJ`
 * declarations stay file-local. As plain classic <script>s they'd otherwise
 * share one top-level scope and collide ("Identifier 'Reveal' already declared").
 * Everything shared between files goes through window.MJ / window.SECTIONS_*.
 *
 * Run with: npm run build   (or: npm run watch)
 */
import { transformFileSync } from "@babel/core";
import { writeFileSync, watch } from "node:fs";

const files = ["primitives", "sections-a", "sections-new", "sections-b"];

function compile(name) {
  const { code } = transformFileSync(`${name}.jsx`, {
    presets: [["@babel/preset-react", { runtime: "classic" }]],
  });
  const wrapped = `// AUTO-GENERATED from ${name}.jsx by build.mjs — do not edit directly.\n(function () {\n${code}\n})();\n`;
  writeFileSync(`${name}.js`, wrapped);
  console.log(`  ${name}.jsx -> ${name}.js`);
}

function buildAll() {
  for (const name of files) compile(name);
  console.log("Build complete.");
}

buildAll();

if (process.argv.includes("--watch")) {
  console.log("Watching .jsx files for changes (Ctrl+C to stop)...");
  for (const name of files) {
    let timer = null;
    watch(`${name}.jsx`, () => {
      clearTimeout(timer); // debounce editors that fire multiple events per save
      timer = setTimeout(() => { try { compile(name); } catch (e) { console.error(e.message); } }, 50);
    });
  }
}
