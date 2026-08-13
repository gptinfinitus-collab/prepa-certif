# Corriger la transition de page « double animation »

## Le problème

Au clic sur un lien de navigation, la page **actuelle** rejoue l'animation d'entrée (montée + fondu) avant que la nouvelle page n'apparaisse. On voit donc deux mouvements au lieu d'un.

## La cause

Dans `src/components/AppShell.tsx` (ligne 437), le conteneur animé utilise :

```tsx
<div key={pathname} className="page-enter">{children}</div>
```

`pathname` vient de `useRouterState({ select: s => s.location.pathname })`, qui bascule sur la **nouvelle URL dès le clic**, pendant que la navigation est encore en cours. Le contenu affiché est encore celui de l'ancienne page, mais le changement de `key` la démonte/remonte : l'ancienne page rejoue l'animation. Quand la nouvelle page arrive enfin, elle s'affiche sans animation propre (ou en second mouvement).

## La correction

1. **Baser la `key` sur la route réellement résolue**, pas sur l'URL en attente : utiliser l'identifiant du dernier match résolu (`s.matches[s.matches.length - 1]?.id`, avec repli sur `s.resolvedLocation?.pathname`). Ainsi le remontage — et donc l'animation — se déclenche exactement au moment où le nouveau contenu s'affiche, une seule fois.
2. **Alléger la cascade** dans `src/styles.css` : le sélecteur `.page-enter > * > *` anime tous les petits-enfants avec des délais jusqu'à 160 ms, ce qui donne une impression de lenteur et un second mouvement perçu. Réduire à un seul mouvement d'ensemble (fondu + montée de 12 px, ~260 ms) et supprimer les délais en cascade, en conservant `prefers-reduced-motion`.
3. Vérifier ensuite dans l'aperçu : navigation Dashboard → Assistant → Check-lists, un seul mouvement de bas en haut, aucun soubresaut de la page quittée.

## Détails techniques

- Fichiers touchés : `src/components/AppShell.tsx` (calcul de la clé du conteneur `<main>`), `src/styles.css` (blocs `page-enter` / `page-rise-anim`).
- Aucune modification de logique métier, de données ou de routes.
