# Check-lists d'audit + sidebar rangée en sections repliables

## 1. Nouvelle page « Check-lists d'audit »

Un vrai outil de terrain : on part d'un modèle ISO, on le personnalise, on le remplit pendant l'audit, on exporte le résultat.

### Parcours utilisateur

```text
/check-lists                    /check-lists/{audit}
┌────────────────────────┐      ┌─────────────────────────────────┐
│ Mes audits (en cours,  │      │ En-tête : audité, périmètre,    │
│ terminés) + progression│ ───► │ dates, auditeur, avancement     │
│                        │      ├─────────────────────────────────┤
│ Modèles ISO à démarrer │      │ Exigences groupées par chapitre │
│ (45001, 9001, 14001,   │      │ · statut C / NC maj / NC min /  │
│  27001, 19011)         │      │   Observation / N.A.            │
│ + check-list vierge    │      │ · preuves, constat, personne    │
└────────────────────────┘      │   rencontrée, ligne perso       │
                                ├─────────────────────────────────┤
                                │ Synthèse + Export PDF / CSV     │
                                └─────────────────────────────────┘
```

### Contenu fourni

- Modèles clause par clause pour les normes déjà présentes dans le catalogue (ISO 45001:2018/Amd 1:2024 en priorité, puis 9001, 14001, 27001), plus un modèle « conduite d'audit ISO 19011:2026 » (préparation, réunion d'ouverture, collecte de preuves, réunion de clôture, rapport).
- Chaque ligne = intitulé de l'exigence reformulé (jamais le texte littéral de la norme), référence de clause, questions d'audit suggérées, preuves attendues.
- Modèles bilingues FR/EN, comme le reste du contenu.

### Remplissage

- Statut par ligne : Conforme, Non-conformité majeure, Non-conformité mineure, Observation / piste d'amélioration, Non applicable.
- Champs libres : preuves constatées, constat rédigé, personne rencontrée.
- Ajout, réécriture et suppression de lignes personnelles ; réorganisation par chapitre.
- Sauvegarde automatique, barre d'avancement, filtres (non traité, NC seulement, par chapitre), recherche.
- Bouton « Demander à l'IA » sur une ligne : formulation du constat ou rappel de l'exigence, via l'assistant déjà en place.

### Exports

- **PDF** : rapport d'audit imprimable (en-tête audit, tableau par chapitre, synthèse des NC, pied de page paginé) via l'impression navigateur, à la charte de l'app.
- **CSV** : une ligne par exigence (chapitre, référence, intitulé, statut, preuves, constat).

### Base de données

Deux tables privées par utilisateur (RLS stricte sur `auth.uid()`) :

- `audit_checklists` : titre, certification, modèle d'origine, entité auditée, périmètre, dates, auditeur, statut (brouillon / en cours / terminé).
- `audit_checklist_items` : rattachement à la check-list, chapitre, référence de clause, intitulé, ordre, statut, preuves, constat, personne rencontrée, indicateur « ligne personnalisée ».

## 2. Sidebar rangée en sections repliables

Groupes proposés (ordre conservé pour les usages fréquents en haut) :

| Section | Modules |
| --- | --- |
| Préparation | Tableau de bord, Planning, Quiz, Assistant IA |
| Audit terrain | **Check-lists d'audit** |
| Contenu | Cours SGS, Références, Glossaire, Annexes, Bibliothèque, Liens utiles |
| Mon parcours | Journal CPD, Mes certifications |
| Réglages | Paramètres, Administration (super admin uniquement) |

Comportement : sections ouvertes par défaut, état d'ouverture mémorisé localement, la section contenant la page active s'ouvre automatiquement ; en sidebar repliée (icônes seules) les titres disparaissent et un simple séparateur marque les groupes ; mêmes groupes dans le panneau mobile ; barre d'onglets mobile inchangée.

## Détails techniques

- Modèles statiques : `src/data/audit-checklists.ts` / `.en.ts`, typés, avec test unitaire de parité FR/EN et d'unicité des identifiants.
- Routes : `src/routes/_authenticated/check-lists.index.tsx` et `check-lists.$auditId.tsx`, avec `head()` SEO dédié et namespace i18n `audit`.
- Données : hooks React Query dans `src/lib/audit-checklists.ts` (liste, création depuis modèle, mise à jour optimiste ligne par ligne, suppression).
- Migration : deux tables + `GRANT` + RLS + trigger `updated_at`.
- Exports : CSV côté client ; PDF via une feuille `@media print` dédiée sur une vue rapport.
- Sidebar : `navItems` transformé en `navGroups` dans `src/components/AppShell.tsx`, rendu avec `Collapsible` (shadcn), clés i18n dans `nav.json` FR/EN.
