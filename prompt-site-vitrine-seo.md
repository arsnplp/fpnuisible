# PROMPT — SITE VITRINE LOCAL ULTRA-SEO (générique, tous métiers)

Tu es à la fois développeur web senior, expert SEO local et directeur artistique.
Ta mission : créer un site vitrine statique COMPLET, professionnel et ultra-optimisé
pour le référencement, pour l'entreprise décrite dans le BRIEF ci-dessous.

Tu travailles en autonomie : tu ne poses AUCUNE question. Toute information
manquante est remplacée par un placeholder [entre crochets] clairement visible,
et listée à la fin dans le README. Tu n'inventes JAMAIS de fait vérifiable
(certification, diplôme, année de création, nombre de clients, avis) : soit
l'info est dans le brief, soit elle est [à compléter].

---

## BRIEF À REMPLIR (remplace chaque champ avant d'envoyer le prompt)

- Métier / activité : [ex. plombier, paysagiste, serrurier, toiletteur…]
- Nom commercial exact : […]
- Nom de domaine final : [https://exemple.fr]
- Téléphone : […] — E-mail : [… ou "à compléter"]
- Adresse complète : [… ou "à compléter, ville seulement"]
- Horaires / disponibilité : [ex. 7j/7 8h-20h, urgences le jour même]
- Ville principale : […] + zone d'intervention : [rayon X km / département / liste]
- Villes à cibler individuellement (10 à 25) : […]
- Prestations (4 à 8), avec pour chacune 2-3 phrases de détail : […]
- Tarifs indicatifs si connus : [ex. dépannage 90-150 €…]
- Preuves sociales : [note Google, nombre d'avis, 2-3 citations d'avis réels]
- Arguments différenciants : [ex. artisan seul, garantie, éco-responsable…]
- Charte graphique : [2 couleurs principales — sinon : "déduis-les du logo"]
- Logo : [fichier fourni dans /logo — sinon : logo texte temporaire]
- Ancien site à analyser : [URL — sinon "aucun"]
- Photos : [fournies dans /images avec noms imposés — sinon "gabarits temporaires"]

---

## ÉTAPE 0 — ANALYSE (obligatoire avant d'écrire une ligne de code)

1. Si un ancien site est fourni : récupère et analyse TOUTES ses pages
   (services réels, villes, tarifs, ton, arguments, coordonnées, sitemap.xml).
   Les infos de l'ancien site priment sur tes suppositions.
2. Si un logo est fourni : OUVRE-LE et regarde-le. Le nom écrit dessus et ses
   couleurs font foi pour la marque et la charte.
3. Établis la liste finale : prestations, villes, mots-clés principaux
   (1 mot-clé principal par page, format "prestation + ville/zone").

## CONTRAINTES TECHNIQUES (non négociables)

1. **HTML/CSS/JS statique pur.** Aucun framework, aucun build, aucune dépendance
   externe (pas de CDN, pas de jQuery, pas de Google Fonts en ligne — police
   auto-hébergée en woff2 dans /assets/fonts, avec `font-display: swap`).
2. **URLs propres par dossier** : chaque page = `dossier-avec-mots-cles/index.html`
   (ex. `/depannage-plomberie-lyon/`). Liens internes en chemins absolus (`/page/`).
3. Un seul fichier `assets/css/style.css` (variables CSS pour la charte), un seul
   `assets/js/main.js` (menu mobile, apparitions au scroll respectant
   `prefers-reduced-motion`, gestion du formulaire avec constante `FORM_ENDPOINT`
   vide + commentaire expliquant comment brancher Formspree/Web3Forms).
4. **Performance** : images en JPG/WebP compressées (< 300 Ko), attributs
   `width`/`height` exacts sur CHAQUE `<img>`, `loading="lazy"` partout sauf
   l'image du hero (`fetchpriority="high"`), CSS unique < 40 Ko.
5. Si pas de photos : génère des gabarits SVG aux couleurs de la charte, avec le
   nom du visuel et la taille recommandée écrits dessus, et un tableau de
   correspondance dans le README (nom de fichier exact → description de la photo
   à fournir → dimensions).

## STRUCTURE DU SITE (toutes ces pages, sans exception)

| Page | URL | Rôle |
|---|---|---|
| Accueil | `/` | hub principal |
| 1 page PAR prestation | `/mot-cle-prestation/` | SEO service |
| 1 page PAR ville ciblée | `/metier-ville/` (ex. `/plombier-vienne/`) | SEO local |
| Hub des villes | `/zone-intervention/` | liste et lie toutes les pages ville |
| Devis | `/devis/` | formulaire visuel complet |
| Blog | `/blog/` + 3 articles + `_modele-article.html` | contenu |
| Contact | `/contact/` | NAP + carte + formulaire |
| À propos | `/a-propos/` | confiance |
| Mentions légales | `/mentions-legales/` | noindex,follow |
| 404 | `/404.html` | personnalisée, noindex |
| `sitemap.xml`, `robots.txt`, `README.md` | racine | technique |

## RÈGLES SEO ON-PAGE (chiffrées, à respecter sur CHAQUE page)

1. `<title>` unique, ≤ 65 caractères, mot-clé principal au début, format
   "Mot-clé + ville (dept) — Marque" ou variante naturelle.
2. `<meta name="description">` unique, 140-160 caractères, avec le mot-clé, un
   bénéfice concret et le **numéro de téléphone**.
3. **Un seul `<h1>`** par page, contenant le mot-clé principal. Hiérarchie
   H2/H3 logique, jamais de saut de niveau.
4. `<link rel="canonical">` absolu sur chaque page. `lang="fr"` sur `<html>`.
5. Open Graph complet (title, description, url, image, site_name, locale) +
   `twitter:card`. Prévoir une image `og-image.jpg` 1200×630.
6. **JSON-LD** (dans un `@graph`) :
   - Accueil : `LocalBusiness` (@id réutilisable, name, telephone au format
     +33…, address complète, geo lat/lon, openingHours, areaServed, priceRange,
     hasOfferCatalog listant les prestations avec leurs URLs) + `WebSite` +
     `FAQPage` ;
   - Pages prestation et ville : `Service` (provider = @id du LocalBusiness,
     areaServed) + `BreadcrumbList` + `FAQPage` ;
   - Articles : `BlogPosting` (headline, image, datePublished, author/publisher).
   Le JSON-LD doit être du JSON strictement valide. Ne mets PAS de aggregateRating
   auto-proclamé (pénalisable) : les avis restent visibles en texte.
7. **Contenu** : 600-900 mots par page prestation, 350-500 mots par page ville.
   Chaque page prestation contient : dangers/enjeux, méthode en étapes,
   "quand agir", tarifs (fourchette si connue, sinon "devis gratuit, prix ferme
   annoncé avant intervention"), FAQ de 4 questions (visible en accordéons
   `<details>` ET en JSON-LD FAQPage identique).
8. **Pages ville — INTERDICTION des doorway pages** : chaque page ville doit
   avoir un contenu réellement unique : 1 paragraphe géographique spécifique
   (distance depuis la base, caractère de la commune, nuisances/besoins typiques
   du bâti local), délai d'intervention réaliste, FAQ localisée (3 questions
   mentionnant la ville), liens vers 4 villes voisines. Pas de texte dupliqué
   à la ville près.
9. **Maillage interne (obligatoire)** :
   - Footer sur TOUTES les pages : colonne prestations (toutes), colonne villes
     (7-8 principales + lien "toutes les communes"), colonne entreprise,
     bloc NAP complet (nom-adresse-téléphone identiques partout) ;
   - Pages prestation → pages villes + articles de blog liés + devis ;
   - Pages ville → toutes les prestations + villes voisines ;
   - Articles → prestations concernées via un encart CTA ;
   - Fil d'Ariane visible + BreadcrumbList sur toutes les pages internes.
10. `alt` descriptif et spécifique sur chaque image (pas de "image1").
11. `robots.txt` (Allow all + Disallow du modèle d'article + ligne Sitemap) et
    `sitemap.xml` complet (toutes les pages indexables, lastmod, priorités :
    accueil 1.0, prestations 0.9, hub/devis 0.8, villes 0.7, blog 0.6).
    Mentions légales et 404 : `noindex, follow`, exclues du sitemap.

## RÈGLES DESIGN (le site doit paraître conçu par un studio, pas généré)

1. Charte stricte : 2 couleurs de marque + 1 fond neutre + noir/blanc cassé,
   en variables CSS. AUCUN dégradé violet générique, aucune police par défaut :
   une police de caractère distinctive auto-hébergée (graisses fortes pour les
   titres, ex. style signalétique/éditorial adapté au métier).
2. **Mobile-first** : menu burger, grilles qui passent en 1 colonne,
   **barre fixe en bas d'écran sur mobile avec 2 boutons : "Appeler" (tel:) et
   "Devis"**, zones tactiles ≥ 44 px, aucun débordement horizontal.
3. Accueil dans cet ordre : hero (H1 + sous-titre + 2 CTA : appel + devis +
   badges de confiance : note d'avis, disponibilité, garantie) → bandeau
   urgence/accroche → grille des prestations (cartes cliquables) → "pourquoi
   nous" (4 piliers) → déroulement en 4 étapes numérotées → zone d'intervention
   (liste de villes cliquables + carte) → avis clients (citations réelles du
   brief) → FAQ → aperçu blog (3 cartes) → bande CTA finale.
4. Micro-détails qui font pro : ombres franches ou subtiles mais cohérentes,
   états hover, focus visibles, accordéons FAQ en `<details>` stylés, icônes
   SVG inline (pas de bibliothèque), page 404 avec de l'humour lié au métier.
5. Téléphone cliquable (`tel:+33…`) répété : topbar, hero, sidebar des pages
   prestation, FAQ, bande CTA, footer, barre mobile.

## FORMULAIRES (devis + contact)

Formulaire de devis en 3 blocs : 1) type de besoin en cartes radio cliquables
avec icônes SVG (une par prestation + "autre"), 2) urgence (select),
3) coordonnées (nom, tél requis, email facultatif, code postal/ville, message,
case RGPD obligatoire avec mention de conservation). Message de succès stylé.
JS : si `FORM_ENDPOINT` est vide → mode démo (succès affiché, rien envoyé),
sinon POST fetch avec gestion d'erreur proposant d'appeler. Le README explique
comment brancher l'endpoint en 1 ligne.

## BLOG EXTENSIBLE

3 articles de 700-900 mots réellement utiles (guides d'identification,
erreurs à éviter, "combien ça coûte") avec chapô, H2/H3, listes à puces,
tableau comparatif si pertinent, encart CTA vers une prestation, BlogPosting
JSON-LD, date. Plus un fichier `/blog/_modele-article.html` : gabarit complet
commenté ([PLACEHOLDERS], balise robots en noindex à inverser, procédure en 6
étapes pour publier : copier, remplir, réindexer, carte sur l'index du blog,
sitemap).

## ORDRE DE TRAVAIL IMPOSÉ

1. Analyse (étape 0) → liste pages + mots-clés.
2. Arborescence des dossiers, police, favicons (depuis le logo), gabarits images.
3. `style.css` complet puis `main.js`.
4. Accueil, puis pages prestations, puis pages villes, puis annexes, puis blog.
5. `sitemap.xml`, `robots.txt`, `README.md` (ce qui reste [à compléter],
   comment brancher le formulaire, comment remplacer les images, comment
   ajouter un article, conseils backlinks : fiche Google Business, annuaires
   locaux, redirection 301 de l'ancien domaine, Search Console + sitemap).
6. **CONTRÔLE QUALITÉ FINAL — exécute réellement ces vérifications et corrige
   avant de rendre :**
   - [ ] chaque lien interne `href`/`src` pointe vers un fichier qui existe ;
   - [ ] tous les `<title>` ≤ 65 caractères et descriptions ≤ 160 (compte-les) ;
   - [ ] tout le JSON-LD parse sans erreur (valide-le) ;
   - [ ] un seul H1 par page ; canonical présent partout ;
   - [ ] aucun reste d'un autre métier/ville/téléphone (cherche les incohérences) ;
   - [ ] toutes les infos inventables sont [entre crochets] et listées au README ;
   - [ ] le site s'affiche correctement : lance un serveur local
         (`python3 -m http.server`) et vérifie que les pages clés répondent 200.

Rends l'ensemble des fichiers, puis termine par un résumé : pages créées,
mots-clés ciblés, ce qui reste à compléter, et les 5 actions SEO hors-site
à faire après la mise en ligne.
