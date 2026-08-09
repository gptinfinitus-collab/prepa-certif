# Image de partage : le logo PREPA CERTIF

Aujourd'hui, quand un lien vers l'application est partagé (WhatsApp, LinkedIn, iMessage…), l'aperçu affiche une capture d'écran automatique de la page de connexion. L'objectif : afficher une vignette de marque propre, construite autour du logo.

## Ce qui sera fait

1. **Créer une vignette de partage** `public/og-image.png` au format 1200 x 630 : logo PREPA CERTIF centré, fond de la charte (bleu nuit), titre « PREPA CERTIF » et sous-titre « Préparation aux certifications ISO ». Générée à partir du SVG existant (`src/components/BrandLogo.tsx`), donc strictement identique au logo de l'app.

2. **Déclarer la vignette dans les métadonnées** de chaque page publique, avec l'URL absolue `https://prepa-certif.app/og-image.png` :
   - `og:image` (+ `og:image:width`, `og:image:height`, `og:image:alt`)
   - `twitter:image`
   Pages concernées : accueil/connexion, CGU, confidentialité, cookies, mentions légales, glossaire, références, annexes.

## Détails techniques

- Génération de l'image via un rendu du SVG de marque redimensionné et composé sur un canevas 1200x630 (ImageMagick), écrit dans `public/`.
- Ajout des balises dans le `head()` de chaque route feuille concernée (jamais sur `__root`), en URL absolue https comme l'exigent les scrapers d'aperçu.
- Aucune modification de logique applicative, de base de données ou d'authentification.

## Vérification

- Contrôle que `/og-image.png` est servi correctement et que les balises `og:image` / `twitter:image` apparaissent dans le HTML rendu.
- Les aperçus déjà en cache chez WhatsApp/LinkedIn peuvent mettre un moment à se rafraîchir après publication.
