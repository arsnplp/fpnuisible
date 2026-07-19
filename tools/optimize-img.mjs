#!/usr/bin/env node
/**
 * Optimisation d'images pour le web (WebP + AVIF).
 *
 * Deux usages :
 *
 *   node tools/optimize-img.mjs
 *       Pour chaque photo .jpg/.jpeg/.png de site/assets/img/ (hors liste SKIP),
 *       (re)génère un jumeau .webp ET .avif s'il manque ou est plus vieux que la
 *       source. Le HTML n'est pas touché : nginx sert le meilleur format au
 *       navigateur (négociation par en-tête Accept), avec repli sur l'original.
 *
 *   node tools/optimize-img.mjs <source> <nom-destination> [largeurMax=1400]
 *       Traite une photo brute (n'importe quelle taille/format) : redimensionne
 *       à largeurMax, écrit site/assets/img/<nom-destination>.jpg PUIS ses
 *       jumeaux .webp/.avif. Ex :
 *       node tools/optimize-img.mjs ~/photo.HEIC blog-chenilles 1400
 *
 * Requiert cwebp et avifenc (brew install webp libavif). sips (macOS) pour le resize.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG = join(ROOT, "site", "assets", "img");

// Images qui NE reçoivent PAS de jumeaux webp/avif (servies telles quelles) :
//  - og-image : les crawlers sociaux (WhatsApp/Facebook) veulent du JPEG
//  - favicon / apple-touch : attendus en PNG par les navigateurs/OS
const SKIP = new Set(["og-image.jpg", "favicon-48.png", "apple-touch-icon.png"]);

const Q_WEBP = "80";                 // qualité WebP (photos)
const AVIF = ["--min", "24", "--max", "32", "-s", "5"]; // quantizeurs AVIF + vitesse

function plusRecentQue(a, b) {        // a est-il plus récent que b (ou b absent) ?
  if (!existsSync(b)) return true;
  return statSync(a).mtimeMs > statSync(b).mtimeMs;
}

function convertir(jpgPath) {
  const noExt = jpgPath.replace(/\.(jpe?g|png)$/i, "");
  let n = 0;
  const webp = noExt + ".webp";
  const avif = noExt + ".avif";
  if (plusRecentQue(jpgPath, webp)) {
    execFileSync("cwebp", ["-quiet", "-q", Q_WEBP, jpgPath, "-o", webp]);
    n++;
  }
  if (plusRecentQue(jpgPath, avif)) {
    execFileSync("avifenc", [...AVIF, jpgPath, avif], { stdio: "ignore" });
    n++;
  }
  return { webp, avif, n };
}

function ko(p) { return existsSync(p) ? Math.round(statSync(p).size / 1024) : 0; }

// ---- Mode 2 : traiter une photo brute -----------------------------------
const [, , srcArg, destArg, largeurArg] = process.argv;
if (srcArg && destArg) {
  const largeur = largeurArg || "1400";
  const dest = join(IMG, destArg.replace(/\.\w+$/, "") + ".jpg");
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "72",
    "-Z", largeur, srcArg, "--out", dest], { stdio: "ignore" });
  const { n } = convertir(dest);
  console.log(`✅ ${basename(dest)} — JPG ${ko(dest)}Ko · WebP ${ko(dest.replace(/\.jpg$/, ".webp"))}Ko · AVIF ${ko(dest.replace(/\.jpg$/, ".avif"))}Ko`);
  console.log(`   → ${dest.replace(/\.jpg$/, "")}.{jpg,webp,avif} générés. Commit + push pour mettre en ligne.`);
  process.exit(0);
}

// ---- Mode 1 : optimiser toutes les photos du dossier --------------------
let total = 0, faits = 0;
console.log("Optimisation WebP + AVIF de site/assets/img/ :\n");
for (const f of readdirSync(IMG).sort()) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  if (SKIP.has(f)) { console.log(`  · ignoré (sert l'original) : ${f}`); continue; }
  const src = join(IMG, f);
  const { webp, avif, n } = convertir(src);
  total++;
  if (n) faits++;
  const gainW = Math.round((1 - ko(webp) / ko(src)) * 100);
  const gainA = Math.round((1 - ko(avif) / ko(src)) * 100);
  console.log(`  ${n ? "✓" : "="} ${f.padEnd(30)} ${String(ko(src)).padStart(4)}Ko → webp ${String(ko(webp)).padStart(4)}Ko (-${gainW}%) · avif ${String(ko(avif)).padStart(4)}Ko (-${gainA}%)`);
}
console.log(`\n${total} images · ${faits} (re)générées, ${total - faits} déjà à jour.`);
