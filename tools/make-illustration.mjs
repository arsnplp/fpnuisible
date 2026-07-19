#!/usr/bin/env node
/**
 * Génère une illustration on-brand (SVG) pour une prestation / un article,
 * quand aucune vraie photo n'est disponible. Aux couleurs du site (noir/jaune,
 * rayures danger), avec l'icône du nuisible et son libellé.
 *
 * Usage :
 *   node tools/make-illustration.mjs <theme> [nom-fichier]
 *     theme      : guepes | frelons | chenilles | rats | cafards | pigeons | abeilles | generic
 *     nom-fichier: nom de sortie sans extension (défaut: blog-<theme>)
 *   → écrit site/assets/img/<nom-fichier>.svg
 *
 * Ex : node tools/make-illustration.mjs chenilles blog-chenilles-processionnaires
 *
 * Le SVG est vectoriel (léger, net partout) : pas besoin de WebP/AVIF pour lui.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const IMG = join(dirname(fileURLToPath(import.meta.url)), "..", "site", "assets", "img");

// Icônes ligne (repère 24x24, mêmes tracés que le formulaire de devis).
const THEMES = {
  guepes:   { label: "Guêpes",        icon: `<ellipse cx="12" cy="14" rx="5" ry="7"/><path d="M12 7V3M8 4l1.5 2M16 4l-1.5 2M7 12H2m20 0h-5M7 17l-3 2m16-2 3 2"/>` },
  frelons:  { label: "Frelons",       icon: `<circle cx="12" cy="8" r="5"/><path d="M12 13v8m-4-5h8"/>` },
  chenilles:{ label: "Chenilles",     icon: `<path d="M2 15q2-3 4 0t4 0 4 0"/><circle cx="18" cy="13" r="3"/><path d="M18 10l1-2.5M20.5 11l2-1.5"/>` },
  rats:     { label: "Rongeurs",      icon: `<path d="M4 14c0-4 3.5-7 8-7s8 3 8 7-3.5 6-8 6-8-2-8-6z"/><circle cx="16" cy="12" r="0.6"/><path d="M20 10c2-1 3-3 2-5-2 0-3.5 1-4 3"/>` },
  cafards:  { label: "Cafards",       icon: `<ellipse cx="12" cy="13" rx="6" ry="8"/><path d="M12 5V2M6 8L3 6m18 2 3-2M6 13H2m20 0h-4M6 18l-3 2m18-2 3 2"/>` },
  pigeons:  { label: "Pigeons",       icon: `<path d="M16 7c0-2 1.5-4 4-4-1 2 0 4-2 5l-1 1c0 5-4 9-10 9H3l4-4C4 12 3 8 5 5c2 3 5 4 8 4z"/><circle cx="17" cy="5" r="0.6"/>` },
  abeilles: { label: "Abeilles",      icon: `<path d="M12 3l7 4v6l-7 4-7-4V7z"/><path d="M12 3v14"/>` },
  generic:  { label: "Anti-nuisibles",icon: `<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>` },
};

const theme = (process.argv[2] || "").toLowerCase();
if (!THEMES[theme]) {
  console.error(`Thème inconnu "${theme}". Choix : ${Object.keys(THEMES).join(", ")}`);
  process.exit(1);
}
const out = process.argv[3] || `blog-${theme}`;
const { label, icon } = THEMES[theme];

// Illustration 1000x666 (ratio des cartes blog), noir/jaune, rayures danger.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="666" viewBox="0 0 1000 666" role="img" aria-label="${label} — FP Nature Nuisible">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1c1a15"/><stop offset="1" stop-color="#12100c"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="14%" r="55%">
      <stop offset="0" stop-color="#ffc400" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffc400" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#ffffff" opacity="0.05"/>
    </pattern>
    <pattern id="hz" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <rect width="40" height="40" fill="#12100c"/><rect width="20" height="40" fill="#ffc400"/>
    </pattern>
  </defs>

  <rect width="1000" height="666" fill="url(#bg)"/>
  <rect width="1000" height="666" fill="url(#glow)"/>
  <rect width="1000" height="666" fill="url(#dots)"/>

  <!-- icône du nuisible -->
  <svg x="360" y="150" width="280" height="280" viewBox="0 0 24 24" fill="none"
       stroke="#ffc400" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">
    ${icon}
  </svg>

  <!-- libellé -->
  <text x="500" y="500" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif"
        font-size="52" font-weight="800" letter-spacing="1" fill="#faf7f0">${label.toUpperCase()}</text>
  <text x="500" y="536" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif"
        font-size="19" font-weight="700" letter-spacing="4" fill="#ffc400">FP NATURE NUISIBLE</text>

  <!-- accent danger en bas -->
  <rect x="0" y="654" width="1000" height="12" fill="url(#hz)"/>
</svg>
`;

writeFileSync(join(IMG, out + ".svg"), svg);
console.log(`✅ site/assets/img/${out}.svg généré (thème : ${theme}).`);
console.log(`   Dans le bloc CARD de l'article : "image":"/assets/img/${out}.svg","imageW":1000,"imageH":666`);
