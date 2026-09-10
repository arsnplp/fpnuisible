# Site FP Nature Nuisible — fpnaturenuisible.fr

Site statique (HTML/CSS/JS pur, aucune dépendance) optimisé SEO, pour
l'activité anti-nuisibles à **Aix-en-Provence et dans le pays d'Aix**.
Il se déploie tel quel sur n'importe quel hébergement statique
(Netlify, Vercel, Cloudflare Pages, OVH, o2switch…) : il suffit de
mettre le contenu de ce dossier à la racine du domaine.

## Structure

| URL | Rôle |
|---|---|
| `/` | Accueil |
| `/destruction-nid-de-guepes/` … `/recuperation-essaim-abeilles/` | 6 pages prestations (guêpes, frelons, dératisation, désinsectisation, dépigeonnage, abeilles) |
| `/anti-nuisibles-<ville>/` | 22 pages ville (Aix + pays d'Aix) |
| `/zone-intervention/` | Hub qui liste toutes les pages ville |
| `/devis/` | Formulaire de devis (à connecter, voir plus bas) |
| `/blog/` + articles | Blog, extensible via `/blog/_modele-article.html` |
| `/contact/`, `/a-propos/`, `/mentions-legales/`, `/404.html` | Pages annexes |
| `sitemap.xml`, `robots.txt` | SEO technique |

Le header/footer est dupliqué dans chaque page : pour le modifier
partout, faire un rechercher/remplacer sur l'ensemble des fichiers.

## État des informations de l'entreprise

> Ce fichier est à la racine du dépôt, **hors de `site/`**, pour ne pas être servi en ligne.

1. ~~Adresse postale~~ — 1670 Chemin des Tuilières, Aix-en-Provence.
   ⚠ **Code postal à trancher** : le site affiche 13290, le registre
   (Insee/RNE) indique 13080, la Base Adresse Nationale 13100. Aligner
   partout sur le code postal de la **fiche Google** (footer ×50, contact,
   JSON-LD `postalCode`, `llms.txt`). Les mentions légales reprennent
   l'adresse exacte du registre (13080).
2. ~~Mentions légales~~ — fait le 10/09/2026 : F.P NATURE, SAS au capital
   de 500 €, RCS Aix-en-Provence 791 757 081, SIRET 791 757 081 00017,
   TVA FR51791757081, directeur de publication Pascal Viou (Président).
   Identité aussi dans le footer, `/a-propos/`, le JSON-LD et `llms.txt`.
3. **E-mail** — aucun pour l'instant (ligne retirée de `/contact/` et des
   mentions légales). À ajouter, idéalement en @fpnaturenuisible.fr.
4. **Horaires exacts** — non confirmés, `/contact/` affiche « 7 jours sur 7 ».
5. **Certifications** (Certibiocide…) — à ajouter sur `/a-propos/` si
   l'entreprise les détient ; rien n'a été inventé.

## Connecter le formulaire (devis + contact)

Dans `assets/js/main.js`, remplacer :

```js
var FORM_ENDPOINT = "";
```

par l'URL de votre service (Formspree, Web3Forms, Google Forms…),
ex. `var FORM_ENDPOINT = "https://formspree.io/f/XXXXXXX";`.
Tant que la constante est vide, le formulaire affiche la confirmation
sans rien envoyer (mode démo).

## Images

✅ Toutes les photos fournies ont été intégrées (compressées en JPG,
dimensions déclarées à jour). L'image de partage `og-image.jpg`
(1200×630) a été générée à partir de la photo principale.
Pour remplacer une photo plus tard : écraser le fichier dans
`assets/img/` en gardant le même nom et des dimensions proches.


Améliorations possibles : `service-depigeonnage.jpg` est petite
(350×350) et `zone-carte.jpg` couvre tout le département 13 — une
photo plus grande / une carte centrée pays d'Aix seraient un plus.

## Ajouter un article de blog

1. Copier `/blog/_modele-article.html` vers `/blog/mon-slug/index.html`
   (slug court avec le mot-clé, ex. `eloigner-guepes-terrasse`).
2. Remplacer tous les `[PLACEHOLDERS]` et **la balise robots**
   (`noindex` → `index, follow`) comme indiqué dans les commentaires.
3. Ajouter la carte de l'article sur `/blog/index.html` (bloc commenté
   prévu) et éventuellement sur l'accueil.
4. Ajouter l'URL dans `sitemap.xml`.

## SEO — ce qui est en place

- 1 mot-clé principal par page, titles ≤ 68 caractères, descriptions
  ≤ 165 avec le téléphone, URLs propres avec mots-clés.
- JSON-LD : LocalBusiness (accueil), Service + FAQPage + BreadcrumbList
  (prestations et villes), BlogPosting (articles).
- Maillage interne : footer → prestations + villes ; pages ville →
  prestations + villes voisines ; prestations → villes + blog.
- 22 pages locales à contenu unique (pas de doorway pages dupliquées).
- Tarifs indicatifs affichés (90–180 € nids, 130–300 € dératisation) —
  repris de l'ancien site frelons-aix.fr.

## SEO — actions hors site recommandées (backlinks)

1. **Fiche Google Business Profile** : la lier au nouveau domaine,
   publier des photos d'intervention, répondre aux avis.
2. **Pages Jaunes** (profil déjà noté 5/5) + annuaires locaux 13/84.
3. Rediriger l'ancien domaine **frelons-aix.fr** vers le nouveau
   (redirections 301 page à page si possible : ancienne page frelons →
   `/destruction-nid-de-frelons/`, pages villes → `/anti-nuisibles-…/`).
4. Mairies et groupes locaux (signalement frelon asiatique), CCI,
   associations de commerçants d'Aix.
5. Déclarer le site dans **Google Search Console** + envoyer
   `sitemap.xml`.
