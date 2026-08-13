# Check-list : ordre des chapitres et barre d'outils compacte

## 1. Ordre des chapitres

Aujourd'hui l'ordre des chapitres suit l'ordre d'apparition des lignes en base, ce qui fait remonter « 6. Planification » après « 9. Évaluation des performances ».

Correction : trier les chapitres par leur numéro (4, 5, 6, 7, 8, 9, 10), avec repli alphabétique pour les chapitres sans numéro. Le tri s'applique partout où les chapitres sont listés :
- les puces de filtre « Chapitres »,
- les sections repliables de la liste,
- la synthèse de conformité,
- l'export CSV et l'impression.

## 2. Barre d'outils figée plus discrète

La carte figée (filtres + recherche + puces chapitres + « Aller à ») occupe presque la moitié de l'écran sur mobile.

Nouvelle version : une seule ligne figée, sans carte lourde — juste la barre « Aller à… » (pleine largeur) et, à sa droite, un bouton d'icône Filtres qui ouvre le reste (Tout / Non traité / NC seulement, recherche, puces chapitres) dans un panneau repliable. Le panneau est fermé par défaut ; un point sur l'icône signale qu'un filtre ou une recherche est actif. Fond translucide léger, plus de bordure ni d'ombre marquée.

Sur desktop, la ligne reste sur une seule rangée et le panneau de filtres s'affiche de la même manière (repliable), pour garder une seule logique.

## Détails techniques
- `src/routes/_authenticated/check-lists.$auditId.tsx` : ajouter un comparateur `compareChapters` (extraction du préfixe numérique via regex, tri numérique puis alphabétique), l'appliquer à `chapters` et à `grouped` ; remplacer le bloc `sticky` (ligne ~418) par une rangée compacte + panneau `filtersOpen` (state local).
- `src/lib/audit-checklists.ts` : appliquer le même tri dans `complianceSummary` et dans l'ordre des lignes de `buildChecklistCsv`.
- Aucun changement de base de données ni de modèle.
