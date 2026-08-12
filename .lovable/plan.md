# Cours SGS — responsive mobile, tablette, desktop

Objectif : rendre la page Cours agréable sur les trois tailles d'écran, sans changer le contenu ni la logique de lecture/recherche.

## Problèmes constatés dans le code actuel

- Lecteur (`cours.$sectionId.tsx`) : les trois boutons Précédent / Assistant IA / Suivant sont en `grid-cols-3` fixe — sur 393 px les libellés sont tronqués et les cibles tactiles trop petites.
- L'en-tête (badge éditeur + référence + bouton Sommaire) passe mal sur petit écran : la référence longue pousse le bouton à la ligne.
- Le sommaire latéral n'apparaît qu'à partir de `lg` : sur tablette (768–1023 px) l'espace est disponible mais inutilisé, on reste en mode « feuille » mobile.
- Les listes de sommaire et de résultats sont figées à `max-h-[60vh]`, peu adapté au tiroir mobile plein écran.
- Le corps de page (`MarkdownView` dans une carte `p-5`) manque de respiration en lecture longue sur desktop : ligne trop large, tailles de titres identiques partout.
- Index (`cours.index.tsx`) : cartes de chapitres en `sm:grid-cols-2` seulement, très étroites sur grand écran ; barre de recherche limitée à `max-w-md` même en desktop.

## Ce qui sera fait

### Mobile (<640 px)
- Barre de navigation de page en deux zones : Précédent / Suivant côte à côte pleine largeur, bouton Assistant IA en pleine largeur au-dessus ; icônes seules si le libellé ne tient pas, avec `aria-label`.
- En-tête compacté : badge + référence tronquée sur une ligne, bouton Sommaire toujours accessible à droite.
- Tiroir sommaire en pleine hauteur avec liste défilante calée sur la hauteur du tiroir plutôt que `60vh`.
- Padding de carte réduit, typographie de lecture ajustée.

### Tablette (640–1023 px)
- Grille de contenu à deux colonnes dès `md` (sommaire 240 px + lecture) quand la largeur le permet, sinon tiroir.
- Boutons de navigation sur une ligne avec libellés complets.
- Index : chapitres en 2 colonnes, recherche pleine largeur.

### Desktop (≥1024 px)
- Sommaire collant (`sticky`) avec défilement propre, largeur 280–320 px.
- Largeur de lecture limitée (mesure confortable) et centrée.
- Index : chapitres en 3 colonnes à partir de `xl`.

## Détails techniques

- Modifications limitées au JSX/classes Tailwind de `src/routes/_authenticated/cours.$sectionId.tsx` et `src/routes/_authenticated/cours.index.tsx`.
- Extraction du bloc sommaire/recherche dans un composant local réutilisé par le tiroir et l'aside pour éviter la duplication.
- Aucune modification des server functions, du schéma, ni des données du cours.
- Vérification visuelle par captures Playwright aux largeurs 393, 820 et 1440 px.
