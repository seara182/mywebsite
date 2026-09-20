/* Renders the hero "brag" film for every language x theme, for both aspect
   ratios, and installs the results into ci/assets/video/.
 *
 * Resolution: the hero video is width:100% of the viewport, so on a Retina
 * laptop a 1920px file is stretched 1.5-1.8x and looks soft. The 16:9 film is
 * therefore rendered at 4K (a 3840x2160 master, kept in brag-output/, git-
 * ignored) and delivered at 2560x1440. The 9:16 film is shown on phones at
 * about 1:1, so it stays at 1080x1920 and is stream-copied. Everything is
 * remuxed with +faststart so playback can start before the file has downloaded.
 *
 * The compositions have no i18n of their own: the English inner text in
 * index.html is string-replaced from the STR table below, rendered, and the
 * English source is restored afterwards. The theme is a data-theme attribute
 * on <html>, which the composition's own CSS keys off.
 *
 *   node ci/build-brag.mjs                  # everything (20 renders, slow)
 *   node ci/build-brag.mjs --lang en --theme dark --aspect 16x9
 *   node ci/build-brag.mjs --no-install     # render only, don't touch ci/assets
 *
 * Because the substitution matches on exact inner text, any wording change in
 * a composition must be mirrored in TOK or that string silently stays English.
 * --verify-tokens (on by default) fails loudly instead.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, unlinkSync, mkdirSync } from "fs";
import { execFileSync } from "child_process";

/* English find-strings (inner text as it appears between > and < in index.html) -> token key */
const TOK = [
  ["Materials Science · B.Sc.", "OP_EYEBROW"],
  ["Measurement, sensors, thin films &amp; NDT.", "OP_HEAD"],
  ["DGZfP · 2025", "SELFIE_CAP"],
  ["Sputter deposition", "SPUTTER_CAP"],
  ["Profilometry", "PROFILO_CAP"],
  ["Thin-film research", "RS_EYEBROW"],
  ["Down at the small scale", "RS_HEAD"],
  ["DGZfP Science Student Award 2025", "AWARD"],
  ["Open to", "SEEK_EYEBROW"],
  ["A working-student role alongside the Master", "SEEK_HEAD"],
  ["Role", "SEEK_R1_K"],
  ["Working student, from November 2026", "SEEK_R1_V"],
  ["Fields", "SEEK_R2_K"],
  ["Measurement · sensors · thin films · NDT", "SEEK_R2_V"],
  ["Youth work", "VOLKIDS_CAP"],
  ["Confirmation group", "VOLPARTY_CAP"],
  ["Volunteering", "VT_EYEBROW"],
  ["Engagement that matters to me", "VT_HEAD"],
  ["THW · helpline · youth work", "VT_SUB"],
  ["Project", "CS_EYEBROW"],
  ["A desktop scoreboard for any NFL or MLB club.", "CS_DESC"],
  ["A desktop &amp; mobile scoreboard for any NFL or MLB club.", "CS_DESC"],
  ["Let's build something measurable.", "TAGLINE"],
];

const STR = {
  de: { OP_EYEBROW:"Werkstoffwissenschaft · B.Sc.", OP_HEAD:"Messtechnik, Sensorik, Dünnschichten & ZfP.",
    SELFIE_CAP:"DGZfP · 2025", SPUTTER_CAP:"Sputterdeposition", PROFILO_CAP:"Profilometrie",
    RS_EYEBROW:"Dünnschichtforschung", RS_HEAD:"Ganz im Kleinen", AWARD:"DGZfP Science Student Award 2025",
    SEEK_EYEBROW:"Was ich suche", SEEK_HEAD:"Werkstudent neben dem Master",
    SEEK_R1_K:"Stelle", SEEK_R1_V:"Werkstudent, ab November 2026",
    SEEK_R2_K:"Themen", SEEK_R2_V:"Messtechnik, Sensorik, Dünnschichttechnik, ZfP",
    VOLKIDS_CAP:"Jugendarbeit", VOLPARTY_CAP:"Konfirmandengruppe",
    VT_EYEBROW:"Ehrenamt", VT_HEAD:"Engagement, das mir wichtig ist", VT_SUB:"THW · Beratung · Jugendarbeit",
    CS_EYEBROW:"Projekt", CS_DESC:"Ein Desktop- & Mobile-Scoreboard für jedes NFL- oder MLB-Team.",
    TAGLINE:"Lass uns etwas Messbares bauen." },
  en: { OP_EYEBROW:"Materials Science · B.Sc.", OP_HEAD:"Measurement, sensors, thin films & NDT.",
    SELFIE_CAP:"DGZfP · 2025", SPUTTER_CAP:"Sputter deposition", PROFILO_CAP:"Profilometry",
    RS_EYEBROW:"Thin-film research", RS_HEAD:"Down at the small scale", AWARD:"DGZfP Science Student Award 2025",
    SEEK_EYEBROW:"What I am looking for", SEEK_HEAD:"A working-student role alongside the Master",
    SEEK_R1_K:"Role", SEEK_R1_V:"Working student, from November 2026",
    SEEK_R2_K:"Fields", SEEK_R2_V:"Measurement, sensors, thin films, NDT",
    VOLKIDS_CAP:"Youth work", VOLPARTY_CAP:"Confirmation group",
    VT_EYEBROW:"Volunteering", VT_HEAD:"Engagement that matters to me", VT_SUB:"THW · helpline · youth work",
    CS_EYEBROW:"Project", CS_DESC:"A desktop & mobile scoreboard for any NFL or MLB club.",
    TAGLINE:"Let's build something measurable." },
  es: { OP_EYEBROW:"Ciencia de materiales · B.Sc.", OP_HEAD:"Medición, sensores, capas finas y END.",
    SELFIE_CAP:"DGZfP · 2025", SPUTTER_CAP:"Deposición por sputtering", PROFILO_CAP:"Perfilometría",
    RS_EYEBROW:"Investigación de capas finas", RS_HEAD:"A pequeña escala", AWARD:"DGZfP Science Student Award 2025",
    SEEK_EYEBROW:"Lo que busco", SEEK_HEAD:"Un puesto de estudiante en prácticas junto al máster",
    SEEK_R1_K:"Puesto", SEEK_R1_V:"Estudiante en prácticas, desde noviembre de 2026",
    SEEK_R2_K:"Áreas", SEEK_R2_V:"Metrología, sensores, capas finas, END",
    VOLKIDS_CAP:"Trabajo juvenil", VOLPARTY_CAP:"Grupo de confirmación",
    VT_EYEBROW:"Voluntariado", VT_HEAD:"Un compromiso que me importa", VT_SUB:"THW · asesoramiento · juventud",
    CS_EYEBROW:"Proyecto", CS_DESC:"Un marcador de escritorio y móvil para cualquier equipo de NFL o MLB.",
    TAGLINE:"Construyamos algo medible." },
  fr: { OP_EYEBROW:"Science des matériaux · B.Sc.", OP_HEAD:"Mesure, capteurs, couches minces & CND.",
    SELFIE_CAP:"DGZfP · 2025", SPUTTER_CAP:"Dépôt par pulvérisation", PROFILO_CAP:"Profilométrie",
    RS_EYEBROW:"Recherche couches minces", RS_HEAD:"À petite échelle", AWARD:"DGZfP Science Student Award 2025",
    SEEK_EYEBROW:"Ce que je cherche", SEEK_HEAD:"Un poste d’étudiant salarié en parallèle du master",
    SEEK_R1_K:"Poste", SEEK_R1_V:"Étudiant salarié, à partir de novembre 2026",
    SEEK_R2_K:"Domaines", SEEK_R2_V:"Métrologie, capteurs, couches minces, CND",
    VOLKIDS_CAP:"Travail jeunesse", VOLPARTY_CAP:"Groupe de confirmands",
    VT_EYEBROW:"Engagement bénévole", VT_HEAD:"Un engagement qui me tient à cœur", VT_SUB:"THW · écoute · jeunesse",
    CS_EYEBROW:"Projet", CS_DESC:"Un tableau des scores desktop & mobile pour toute équipe NFL ou MLB.",
    TAGLINE:"Construisons quelque chose de mesurable." },
  it: { OP_EYEBROW:"Scienza dei materiali · B.Sc.", OP_HEAD:"Misure, sensori, film sottili e CND.",
    SELFIE_CAP:"DGZfP · 2025", SPUTTER_CAP:"Deposizione sputter", PROFILO_CAP:"Profilometria",
    RS_EYEBROW:"Ricerca film sottili", RS_HEAD:"Alla piccola scala", AWARD:"DGZfP Science Student Award 2025",
    SEEK_EYEBROW:"Che cosa cerco", SEEK_HEAD:"Un impiego da studente lavoratore accanto al master",
    SEEK_R1_K:"Posizione", SEEK_R1_V:"Studente lavoratore, da novembre 2026",
    SEEK_R2_K:"Ambiti", SEEK_R2_V:"Metrologia, sensoristica, film sottili, CND",
    VOLKIDS_CAP:"Lavoro coi giovani", VOLPARTY_CAP:"Gruppo cresimandi",
    VT_EYEBROW:"Volontariato", VT_HEAD:"Un impegno a cui tengo", VT_SUB:"THW · ascolto · giovani",
    CS_EYEBROW:"Progetto", CS_DESC:"Un tabellone desktop e mobile per qualsiasi squadra NFL o MLB.",
    TAGLINE:"Costruiamo qualcosa di misurabile." },
};

const COMPS = [
  /* master: hyperframes --resolution preset; deliver: downscaled size for the site */
  { dir: "brag-output/composition",   aspect: "16x9", master: "landscape-4k", deliver: "2560:1440" },
  { dir: "brag-vertical/composition", aspect: "9x16", master: null,           deliver: null },
];
/* x264 for the downscaled 16:9 delivery file. aq-mode 3 spends bits on dark
   areas, which is where banding and blocking show up in these films. */
const X264 = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-profile:v", "high",
              "-pix_fmt", "yuv420p", "-x264-params", "aq-mode=3", "-movflags", "+faststart"];
const LANGS = ["de", "en", "es", "fr", "it"];
const THEMES = ["light", "dark"];
const OUT = "ci/assets/video";
const POSTER_AT = "4";   /* photo 2-up scene: no text, so posters carry no language */

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf("--" + name);
  return i === -1 ? fallback : argv[i + 1];
};
const only = {
  langs:   opt("lang")   ? [opt("lang")]   : LANGS,
  themes:  opt("theme")  ? [opt("theme")]  : THEMES,
  aspects: opt("aspect") ? [opt("aspect")] : COMPS.map(c => c.aspect),
};
const install = !argv.includes("--no-install");

const esc = s => s.replace(/&/g, "&amp;");
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: "pipe" });

/* Fail loudly if a composition's wording drifted away from TOK, rather than
   silently shipping English inside a translated film. */
function verifyTokens(src, dir) {
  const missing = TOK
    .filter(([find]) => !src.includes(">" + find + "<"))
    .map(([, key]) => key);
  /* CS_DESC has two spellings (landscape / vertical); only one can ever match. */
  const real = missing.filter(k => k !== "CS_DESC");
  if (real.length) {
    throw new Error(`${dir}: these tokens no longer match any inner text: ${real.join(", ")}\n` +
      `Update TOK in ci/build-brag.mjs to the new wording.`);
  }
}

function apply(src, lang, theme) {
  let html = src;
  for (const [find, key] of TOK) {
    const val = STR[lang][key];
    if (val == null) continue;
    html = html.split(">" + find + "<").join(">" + esc(val) + "<");
  }
  /* light is the composition's authored default, so only dark needs the flag */
  if (theme === "dark") html = html.replace(/<html(\s)/, '<html data-theme="dark"$1');
  return html;
}

if (install) mkdirSync(OUT, { recursive: true });
let made = 0;

for (const { dir, aspect, master, deliver } of COMPS) {
  if (!only.aspects.includes(aspect)) continue;
  const idx = `${dir}/index.html`;
  const bak = `${dir}/index.src.html`;
  if (!existsSync(bak)) copyFileSync(idx, bak);
  const src = readFileSync(bak, "utf8");
  verifyTokens(src, dir);

  try {
    for (const lang of only.langs) {
      for (const theme of only.themes) {
        const stem = `brag_${lang}-${aspect}_${theme}`;
        process.stdout.write(`${aspect} ${lang} ${theme} … `);
        writeFileSync(idx, apply(src, lang, theme));
        const renderArgs = ["hyperframes", "render", "--quality", "looks"];
        if (master) renderArgs.push("--resolution", master);
        run("npx", [...renderArgs, "--output", `../${stem}.mp4`], dir);
        const rendered = `${dir}/../${stem}.mp4`;
        if (install) {
          /* strip audio: the site plays the hero muted, and it saves ~340 KB */
          const video = deliver
            ? ["-vf", `scale=${deliver}:flags=lanczos`, ...X264]
            : ["-c:v", "copy", "-movflags", "+faststart"];
          run("ffmpeg", ["-y", "-loglevel", "error", "-i", rendered, ...video, "-an", `${OUT}/${stem}.mp4`]);
          run("ffmpeg", ["-y", "-loglevel", "error", "-ss", POSTER_AT, "-i", rendered,
                         ...(deliver ? ["-vf", `scale=${deliver}:flags=lanczos`] : []),
                         "-frames:v", "1", "-q:v", "3", `${OUT}/${stem}.jpg`]);
        }
        made++;
        console.log("ok");
      }
    }
  } finally {
    copyFileSync(bak, idx);   /* always restore English, even on a failed render */
    unlinkSync(bak);
  }
}
console.log(`\n${made} render(s) done.`);
