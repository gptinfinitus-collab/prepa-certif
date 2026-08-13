# Marges des pages Check-lists

## Constat
Les autres pages enveloppent leur contenu dans un conteneur avec marges (`mx-auto max-w-… px-4 py-6 …`), mais les deux pages check-lists n'en ont pas :
- `src/routes/_authenticated/check-lists.index.tsx` (ligne 83) : `<div className="space-y-8">`
- `src/routes/_authenticated/check-lists.$auditId.tsx` (lignes 147, 155, 167) : `<div className="space-y-6">` etc.

Le contenu colle donc aux bords gauche/droite.

## Correction
Appliquer le même conteneur que les autres pages :
- Liste : `mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:py-8`
- Éditeur (les 3 états : chargement, non trouvé, contenu) : `mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8`

Aucun changement de logique métier ; uniquement des classes de mise en page. La barre d'outils collante et l'impression PDF restent inchangées.
