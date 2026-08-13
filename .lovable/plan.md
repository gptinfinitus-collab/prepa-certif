# Aligner la check-list d'audit sur le modèle de grille fourni

## Ce que contient l'exemplaire

Colonnes : Chapitre · Exigence/point d'audit · Conformité · Score · Constat/preuve · Écart constaté · Action · Responsable · Échéance.

## Ce que nous avons déjà (vérifié)

Table `audit_checklist_items` : `chapter`, `clause`, `requirement`, `guidance`, `position`, `status`, `evidence`, `finding`, `auditee`, `is_custom`.
Le scoring existe déjà côté calcul (`SCORE_WEIGHTS` : conforme 1 · observation 0,75 · NC mineure 0,5 · NC majeure 0 · NA/non traité exclus) et alimente la synthèse de conformité.

## Ce qui manque

1. **Score visible par ligne.** Le poids est calculé globalement mais jamais affiché sur la ligne (l'exemplaire montre 1,0 / 0,5 en face de chaque exigence).
2. **Écart constaté.** Aucune colonne dédiée : aujourd'hui `evidence` (preuve) et `finding` (constat) existent, mais l'écart par rapport à l'exigence est mélangé au constat.
3. **Plan d'action.** Pas de champ « Action » (correction / action corrective proposée).
4. **Responsable.** `auditee` = personne rencontrée pendant l'audit, ce n'est pas le responsable de l'action. Colonne manquante.
5. **Échéance.** Pas de date cible pour l'action corrective.
6. **Vue tableau.** L'exemplaire est une grille ; l'application n'a qu'une vue en cartes empilées. Une vue tableau dense (desktop) manque pour la saisie rapide et la relecture.
7. **Export incomplet.** Le CSV n'exporte que 7 colonnes ; il manque score, écart, action, responsable, échéance.
8. **Suivi des actions.** Aucune vue transversale « plan d'actions » (toutes les NC avec responsable et échéance, retards mis en évidence).

## Ce qui sera fait

### 1. Modèle de données
Migration ajoutant à `audit_checklist_items` : `gap` (écart constaté), `action` (action corrective), `owner` (responsable), `due_date` (échéance). Champs texte/date nullables, aucun impact sur l'existant, RLS et grants déjà en place sur la table.

### 2. Saisie par ligne
Sur chaque exigence : le badge de statut affiche désormais son score (Conforme · 1,0 / Observation · 0,75 / NC mineure · 0,5 / NC majeure · 0 / NA exclu). Un bloc « Traitement » repliable, ouvert automatiquement dès que le statut est une non-conformité ou une observation, regroupe Écart constaté, Action, Responsable, Échéance. Les lignes conformes restent compactes.

### 3. Vue tableau (desktop)
Bascule Cartes / Tableau dans la barre d'outils. Le tableau reprend exactement les colonnes de l'exemplaire, éditable en ligne, avec la même coloration de statut. Sur mobile la vue cartes reste imposée.

### 4. Exports
CSV enrichi des colonnes Score, Écart constaté, Action, Responsable, Échéance, et impression (print) mise à jour pour rendre la grille complète.

### 5. Plan d'actions
Section « Plan d'actions » sous la synthèse de conformité : toutes les lignes avec une action ou une NC, triées par échéance, avec un repère visuel pour les échéances dépassées et un compteur d'actions sans responsable ou sans date.

### Détails techniques
- Migration SQL : `ALTER TABLE public.audit_checklist_items ADD COLUMN gap text, ADD COLUMN action text, ADD COLUMN owner text, ADD COLUMN due_date date;`
- `src/lib/audit-checklists.ts` : étendre `AuditChecklistItem`, `ITEM_SELECT`, `buildChecklistCsv`, et exposer un helper `scoreLabel(status)`.
- `src/routes/_authenticated/check-lists.$auditId.tsx` : bloc de traitement, bascule tableau/cartes, nouveau composant `src/components/audit/ChecklistTable.tsx`.
- `src/components/audit/ActionPlan.tsx` : nouvelle section plan d'actions.
- Clés i18n ajoutées dans `src/i18n/locales/{fr,en}/audit.json`.
