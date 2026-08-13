# Synthèse de conformité par chapitre

Ajouter, sur chaque check-list d'audit, une synthèse chiffrée du niveau de conformité : un taux par chapitre (4, 5, 6, 7, 8, 9, 10…) et un taux global, dans l'esprit du tableau de référence fourni.

## Ce que verra l'utilisateur

Un bloc « Synthèse de conformité » ajouté en haut de la page d'un audit (sous la barre d'avancement), repliable :

- Un tableau : Chapitre | Évalués | Conforme / Partiel / Non conforme / Sans objet | Taux de conformité (barre + %).
- Une ligne « Conformité globale » en gras avec le taux total.
- Une note de bas de tableau rappelant la règle de notation.
- Les chapitres sans aucune ligne évaluée affichent « — » (comme dans le modèle fourni) et n'entrent pas dans le calcul global.
- Le bloc est inclus dans l'impression/PDF et dans l'export CSV (nouvelles lignes de synthèse en fin de fichier).

## Règle de notation proposée

| Statut de la ligne | Note |
| --- | --- |
| Conforme | 1 |
| Observation | 0,75 |
| Non-conformité mineure | 0,5 |
| Non-conformité majeure | 0 |
| Sans objet | exclu de la moyenne |
| Non traité | exclu de la moyenne (compté dans « restant à évaluer ») |

Taux d'un chapitre = somme des notes / nombre de lignes évaluées. Taux global = même calcul sur toutes les lignes évaluées de l'audit (pas une moyenne des chapitres, pour ne pas surpondérer les petits chapitres).

Un indicateur « couverture » (part de lignes évaluées) accompagne le taux global pour éviter de lire 100 % alors que 3 lignes seulement ont été évaluées.

## Détails techniques

- `src/lib/audit-checklists.ts` : ajouter `SCORE_WEIGHTS` et une fonction pure `complianceSummary(items)` retournant `{ byChapter: [{ chapter, evaluated, counts, rate }], overall: { evaluated, total, rate, coverage } }`. Le chapitre est dérivé de `item.chapter` (ordre naturel par première position rencontrée). Étendre `buildChecklistCsv` avec un bloc de synthèse optionnel.
- `src/components/audit/ComplianceSummary.tsx` : nouveau composant présentiel (tableau + `Progress` + badges), mémoïsé, styles cohérents avec `STATUS_STYLES`, classes `print:` pour l'impression.
- `src/routes/_authenticated/check-lists.$auditId.tsx` : calcul via `useMemo` sur les items déjà chargés (aucune requête supplémentaire), insertion du composant sous la barre d'avancement, ajout des lignes de synthèse à l'export CSV.
- `src/i18n/locales/fr/audit.json` et `en/audit.json` : clés `audit.compliance.*` (titre, en-têtes de colonnes, « Conformité globale », note de notation, couverture).
- Aucune modification de base de données : tout est calculé à partir des statuts déjà enregistrés.
