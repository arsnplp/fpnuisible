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

## ⚠ À compléter avant mise en ligne (recherchez « [ » dans les fichiers)

1. ~~Adresse postale~~ — fait : 1670 Chemin des Tuilières,
   13290 Aix-en-Provence (footer, contact, mentions légales, JSON-LD).
2. **E-mail** — `/contact/` et `/mentions-legales/`.
3. **Horaires exacts** — `/contact/` : `[08h00 – 21h00 à confirmer]`.
4. **Mentions légales** — forme juridique, SIRET, directeur de la
   publication, hébergeur.
5. **Dépigeonnage** — une phrase `[Certaines prestations spécifiques —
   à confirmer avec l'entreprise.]` sur `/depigeonnage/`.
6. **Certifications** (Certibiocide…) — à ajouter sur `/a-propos/` si
   l'entreprise les détient ; rien n'a été inventé.
7. ~~JSON-LD accueil~~ — fait : `streetAddress` et code postal 13290
   renseignés dans le bloc LocalBusiness de `index.html`.

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
