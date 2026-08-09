# Image de partage, icône installée et onglets mobiles

## 1. Image de partage (aperçu de lien)

Aujourd'hui, quand un lien vers l'application est partagé (WhatsApp, LinkedIn, iMessage…), l'aperçu affiche une capture d'écran automatique de la page de connexion. Objectif : une vignette de marque propre construite autour du logo.

- Créer `public/og-image.png` (1200 x 630) : logo PREPA CERTIF centré, fond bleu nuit de la charte, titre « PREPA CERTIF » et sous-titre « Préparation aux certifications ISO ». Généré depuis le SVG de marque existant, donc identique au logo de l'app.
- Déclarer `og:image` (+ `og:image:width`, `og:image:height`, `og:image:alt`) et `twitter:image` avec l'URL absolue `https://prepa-certif.app/og-image.png` dans le `head()` de chaque page publique : accueil/connexion, CGU, confidentialité, cookies, mentions légales, glossaire, références, annexes. Jamais sur `__root`.

## 2. Icône de l'application installée (PWA)

Sur l'écran d'accueil, le logo apparaît en cercle blanc débordant du carré de l'icône : les fichiers actuels ne respectent pas la zone de sécurité des icônes maskables et gardent un fond blanc.

- Régénérer les icônes avec un fond bleu nuit plein (plus de fond blanc) et le logo en blanc :
  - `icon-192.png` et `icon-512.png` : logo occupant ~72 % de la surface, marges homogènes.
  - `icon-maskable-512.png` : logo réduit à ~60 % (zone de sécurité maskable de 80 %), fond plein jusqu'aux bords pour que le rognage circulaire d'Android ne coupe rien.
  - `apple-touch-icon.png` (180x180) : même composition, coins gérés par iOS.
- Passer `background_color` du manifeste de `#ffffff` au bleu nuit pour un écran de lancement cohérent.
- Aligner `favicon.png` sur la même composition.

## 3. Onglets Quiz sur mobile

Sur `/quiz`, les quatre onglets (Entraînement, Historique, Mon niveau, Fiches) passent à la ligne : « Fiches » se retrouve seul en dessous et déborde visuellement du fond de la barre.

- Remplacer le retour à la ligne par une barre d'onglets défilante horizontalement sur mobile : suppression de `flex-wrap`, ajout d'un défilement horizontal sans barre de scroll visible, onglets non compressibles, et retour à une disposition normale à partir de `sm:`.
- Ajuster la taille de texte et le padding des onglets sur mobile pour que les quatre restent lisibles et que la barre garde sa hauteur unique.
- Appliquer le même correctif aux autres barres d'onglets multi-éléments de l'app pour éviter le problème ailleurs.

## Détails techniques

- Icônes et vignette générées via ImageMagick à partir du SVG de marque, écrites dans `public/` (fichiers réels, pas de pointeurs d'assets).
- Balises `head()` ajoutées uniquement sur les routes feuilles, en URL absolue https.
- Onglets : ajustement de classes Tailwind sur `TabsList` / `TabsTrigger` dans `src/routes/_authenticated/quiz.tsx` (+ éventuelle utilitaire `no-scrollbar` dans `src/styles.css`). Aucune modification de logique métier.

## Vérification

- Contrôle visuel des icônes en 192/512 et du rendu maskable (rognage circulaire).
- Contrôle du rendu des onglets en 390 px, 411 px et tablette : aucun retour à la ligne, aucun débordement.
- Vérification que `/og-image.png` est servi et que les balises apparaissent dans le HTML rendu.
- Note : l'icône installée nécessite une réinstallation de l'app sur le téléphone, et les aperçus déjà en cache chez WhatsApp/LinkedIn mettent un moment à se rafraîchir.
