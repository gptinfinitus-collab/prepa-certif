# Installabilité PWA (sans mode hors ligne)

Objectif : PREPA CERTIF installable sur téléphone et ordinateur, avec le sceau de la marque comme icône, et une invite d'installation affichée à la première connexion.

## Ce qui sera fait

1. **Icônes de marque**
   - Génération des icônes PNG carrées à partir du logo PREPA CERTIF (sceau bleu nuit) : 192x192, 512x512, 512x512 « maskable », plus une icône Apple 180x180.
   - `public/favicon.svg` conservé comme favicon vectoriel ; ajout d'un PNG de repli pour les navigateurs qui l'ignorent.

2. **Manifeste web** (`public/manifest.webmanifest`)
   - Nom « PREPA CERTIF », nom court « PREPA CERTIF », description, langue `fr`.
   - `display: standalone`, `start_url: /`, `scope: /`, couleur de thème bleu nuit, fond clair.
   - Liste des icônes ci-dessus.

3. **Balises dans l'en-tête racine** (`src/routes/__root.tsx`)
   - `link rel="manifest"`, `apple-touch-icon`, `meta theme-color`, icônes PNG.

4. **Invite d'installation à la première connexion**
   - Nouveau composant `InstallPrompt` monté dans la racine.
   - Écoute `beforeinstallprompt` (Chrome/Edge/Android) : affiche une carte discrète en bas d'écran « Installer PREPA CERTIF » avec boutons « Installer » et « Plus tard ».
   - Sur iOS Safari (pas de `beforeinstallprompt`) : affiche à la place les instructions « Partager → Sur l'écran d'accueil ».
   - Affichage une seule fois : mémorisation du choix dans `localStorage`, jamais affiché si l'app tourne déjà en mode installé (`display-mode: standalone`), ni dans l'aperçu Lovable (iframe).

## Points techniques

- Aucun service worker, aucun `vite-plugin-pwa`, aucun cache : uniquement le manifeste et les icônes. L'application reste donc en ligne uniquement.
- L'invite s'appuie sur l'événement natif du navigateur ; elle n'apparaît pas sur les navigateurs qui ne le supportent pas (hors iOS, traité par les instructions manuelles).
- Rien ne change côté données, authentification ou routes existantes.
