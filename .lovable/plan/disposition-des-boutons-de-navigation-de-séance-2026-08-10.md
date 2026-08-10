# Disposition des boutons de navigation de séance

## Objectif
Placer les 4 boutons de navigation de la page séance (Précédent, Continuer/Terminer, Ma note, Demander à l'IA) sur une seule ligne sur mobile, sans casser l'ergonomie desktop.

## Changements prévus

### 1. Conteneur de boutons
Dans `src/routes/_authenticated/seance.$moduleId.tsx`, remplacer le `div` actuel (`flex flex-wrap items-center gap-2`) par une grille responsive qui force une ligne de 4 colonnes sur mobile/tablette, puis repasse en flex sur desktop :

```text
mobile/tablette : grid grid-cols-4 gap-2
desktop (lg:)   : flex lg:flex-wrap lg:items-center lg:gap-2
```

### 2. Boutons adaptatifs
- Chaque bouton occupe une colonne sur mobile.
- Sur mobile : affichage compact `flex-col` avec icône au-dessus du texte réduit, ou texte tronqué selon la largeur.
- Sur desktop : comportement actuel conservé (icône à côté du texte).
- Le bouton "Continuer" / "Terminer" reste l'action principale (variante `default` ou `secondary`).

### 3. Gestion des états
- Conserver les états `disabled` sur "Précédent" et "Terminer" quand ils ne sont pas disponibles.
- Conserver le basculement "Continuer" → "Terminer la séance" / "Rouvrir la séance".

### 4. Vérification visuelle
- Vérifier sur mobile (360–411 px) que les 4 boutons tiennent sur une ligne sans chevauchement.
- Vérifier sur desktop que la disposition reprend son aspect actuel.
