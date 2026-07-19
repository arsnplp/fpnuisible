#!/usr/bin/env node
/**
 * Générateur de la liste du blog + du sitemap.
 *
 * Lit chaque article dans site/blog/<slug>/index.html, en extrait le bloc
 * <!-- CARD {json} --> placé dans le <head>, puis régénère :
 *   - les cartes de site/blog/index.html (entre les marqueurs BLOG:AUTO)
 *   - les <url> d'articles de site/sitemap.xml (entre les marqueurs BLOG:AUTO)
 * Les articles sont triés du plus récent au plus ancien (champ "date").
 *
 * Un article SANS bloc CARD est ignoré (ex : brouillon, contenu hors sujet).
 * Un article dont le titre contient "[" est ignoré (modèle non rempli).
 *
 * Usage : node tools/build-blog.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "site");
const BLOG_DIR = join(SITE, "blog");
const INDEX = join(BLOG_DIR, "index.html");
const SITEMAP = join(SITE, "sitemap.xml");
const BASE = "https://fpnaturenuisible.fr";

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
  "août", "septembre", "octobre", "novembre", "décembre"];

function dateHumaine(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const jour = d === 1 ? "1er" : String(d);
  return `${jour} ${MOIS[m - 1]} ${y}`;
}

// -- Collecte des articles -------------------------------------------------
const articles = [];
for (const slug of readdirSync(BLOG_DIR, { withFileTypes: true })) {
  if (!slug.isDirectory()) continue;                       // ignore _modele-article.html
  const file = join(BLOG_DIR, slug.name, "index.html");
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const m = html.match(/<!--\s*CARD\s*([\s\S]*?)-->/);
  if (!m) { console.log(`  · ignoré (pas de bloc CARD) : blog/${slug.name}/`); continue; }
  let card;
  try {
    card = JSON.parse(m[1].trim());
  } catch (e) {
    console.error(`  ✗ CARD JSON invalide dans blog/${slug.name}/ : ${e.message}`);
    process.exitCode = 1;
    continue;
  }
  if (String(card.title).includes("[")) {
    console.log(`  · ignoré (modèle non rempli) : blog/${slug.name}/`);
    continue;
  }
  for (const k of ["title", "teaser", "tag", "date", "image", "imageAlt", "imageW", "imageH"]) {
    if (card[k] === undefined) {
      console.error(`  ✗ champ CARD manquant "${k}" dans blog/${slug.name}/`);
      process.exitCode = 1;
    }
  }
  card.slug = slug.name;
  articles.push(card);
}

articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); // récent -> ancien

if (!articles.length) { console.error("Aucun article valide trouvé."); process.exit(1); }

// -- Génération des cartes -------------------------------------------------
const REVEAL = ["reveal", "reveal reveal-d1", "reveal reveal-d2"];
const cards = articles.map((a, i) => `        <a class="card ${REVEAL[i % 3]}" href="/blog/${a.slug}/">
          <div class="card__img card__img--wide"><img src="${a.image}" alt="${a.imageAlt}" loading="lazy" width="${a.imageW}" height="${a.imageH}"></div>
          <div class="card__body">
            <div class="post-card__meta"><span class="tag">${a.tag}</span> <time datetime="${a.date}">${dateHumaine(a.date)}</time></div>
            <h3>${a.title}</h3>
            <p>${a.teaser}</p>
            <span class="card__link">Lire l'article →</span>
          </div>
        </a>`).join("\n");

// -- Génération des <url> du sitemap ---------------------------------------
const urls = articles.map((a) => `  <url>
    <loc>${BASE}/blog/${a.slug}/</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("\n");

// -- Remplacement entre marqueurs ------------------------------------------
function remplace(file, inner, indent) {
  const src = readFileSync(file, "utf8");
  const re = /(<!-- BLOG:AUTO-START -->)[\s\S]*?(<!-- BLOG:AUTO-END -->)/;
  if (!re.test(src)) { console.error(`  ✗ marqueurs BLOG:AUTO absents de ${file}`); process.exit(1); }
  const out = src.replace(re, `$1\n${inner}\n${indent}$2`);
  if (out !== src) writeFileSync(file, out);
  return out !== src;
}

const c1 = remplace(INDEX, cards, "        ");
const c2 = remplace(SITEMAP, urls, "  ");

console.log(`\n✅ ${articles.length} articles : ${articles.map((a) => a.slug).join(", ")}`);
console.log(`   blog/index.html ${c1 ? "mis à jour" : "déjà à jour"} · sitemap.xml ${c2 ? "mis à jour" : "déjà à jour"}`);
