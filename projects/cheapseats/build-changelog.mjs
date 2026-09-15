// Converts CheapSeats-Features-and-Changelog.md into changelog-content.js
// (a plain <script> the static page includes, no runtime fetch/parser needed).
// Run manually after editing the .md: node projects/cheapseats/build-changelog.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const md = readFileSync(join(dir, "CheapSeats-Features-and-Changelog.md"), "utf8");

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// "## v1.1.0: Title" -> id "v1-1" (major.minor only, so a later patch bump
// or reworded title doesn't move the anchor cards link to).
function versionId(heading) {
  const m = heading.match(/^v(\d+)\.(\d+)/);
  return m ? `v${m[1]}-${m[2]}` : null;
}

const lines = md.split(/\r?\n/);
let html = "";
let listOpen = false;
function closeList() { if (listOpen) { html += "</ul>\n"; listOpen = false; } }

for (const raw of lines) {
  const line = raw.trim();
  if (!line) { closeList(); continue; }

  let m;
  if ((m = line.match(/^###\s+(.*)/))) { closeList(); html += `<h3>${inline(m[1])}</h3>\n`; }
  else if ((m = line.match(/^##\s+(.*)/))) {
    closeList();
    const id = versionId(m[1]);
    html += `<h2${id ? ` id="${id}"` : ""}>${inline(m[1])}</h2>\n`;
  }
  else if ((m = line.match(/^#\s+(.*)/))) { closeList(); html += `<h1>${inline(m[1])}</h1>\n`; }
  else if ((m = line.match(/^-\s+(.*)/))) {
    if (!listOpen) { html += "<ul>\n"; listOpen = true; }
    html += `<li>${inline(m[1])}</li>\n`;
  }
  else { closeList(); html += `<p>${inline(line)}</p>\n`; }
}
closeList();

writeFileSync(join(dir, "changelog-content.js"), `window.CHANGELOG_HTML = ${JSON.stringify(html)};\n`);
console.log("Wrote changelog-content.js");
