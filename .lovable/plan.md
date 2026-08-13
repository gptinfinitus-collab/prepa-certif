# Pourquoi 33 exigences — et comment aller plus loin

## Le constat (vérifié)

Le nombre 33 ne vient pas d'un bug : c'est exactement le nombre de lignes du modèle
`iso45001Checklist` dans `src/data/audit-checklists.ts`. Le modèle couvre bien tous les
chapitres 4 à 10, mais avec **une seule ligne par (sous-)clause** :

```text
4.1 4.2 4.3 4.4 | 5.1 5.2 5.3 5.4 | 6.1.1 6.1.2.1 6.1.2.2 6.1.2.3 6.1.3 6.1.4 6.2.1 6.2.2
7.1 7.2 7.3 7.4 7.5 | 8.1.1 8.1.2 8.1.3 8.1.4 8.2 | 9.1.1 9.1.2 9.2 9.3 | 10.1 10.2 10.3
```

Or une clause comme 7.5 regroupe en réalité 7.5.1 / 7.5.2 / 7.5.3, et 9.2 contient
programme d'audit, critères, indépendance, rapport, suites données. En audit réel on
coche exigence par exigence, pas clause par clause : d'où l'impression de check-list trop
courte. Autre point : les lignes sont copiées **au moment de la création** de l'audit,
donc un audit déjà ouvert ne reçoit pas automatiquement les nouvelles lignes.

## Ce que je propose de faire

1. **Enrichir le modèle ISO 45001** au niveau « une ligne = une exigence auditable »
   (chaque « il faut / l'organisme doit » de la norme, reformulé avec nos mots, sans
   citation littérale). On passe d'environ 33 à environ 110-130 lignes, réparties sur les
   sous-clauses réelles : 6.1.2.1 dangers, 6.1.2.2 risques, 7.5.1/7.5.2/7.5.3,
   8.1.1/8.1.2 hiérarchie des mesures/8.1.3 conduite du changement/8.1.4.1-8.1.4.3
   achats-sous-traitance-externalisation, 8.2 urgence, 9.1.1/9.1.2, 9.2.1/9.2.2,
   9.3 (avec toutes les entrées et sorties de revue de direction), 10.1/10.2/10.3.
   Les points « changement climatique » de l'Amd 1:2024 en 4.1 et 4.2 restent identifiés
   comme lignes distinctes.

2. **Même traitement pour ISO 19011:2026** (déroulement de l'audit, actuellement 14 lignes)
   afin de couvrir chaque étape : déclenchement, revue documentaire, plan, réunion
   d'ouverture, recueil et vérification des preuves, constats, conclusions, réunion de
   clôture, rapport, suivi.

3. **Garder 9001 / 14001 / 27001 en version synthétique** pour l'instant (ce sont des
   modèles de secours), sauf si vous voulez le même niveau de détail.

4. **Mettre à jour les deux langues** : `src/data/audit-checklists.ts` (FR) et
   `src/data/audit-checklists.en.ts` (EN) restent strictement alignés, même ordre, même
   nombre de lignes.

5. **Gérer votre audit déjà ouvert** : un bouton « Mettre à jour depuis le modèle » sur la
   page de l'audit, qui ajoute uniquement les lignes manquantes (comparaison par clause +
   intitulé) sans jamais toucher aux statuts, preuves et constats déjà saisis.

## Détails techniques

- `src/data/audit-checklists.ts` / `.en.ts` : extension des tableaux `sections[].items[]`.
  La structure `{ clause, requirement, guidance }` ne change pas, donc aucune migration
  de schéma.
- `src/lib/audit-checklists.ts` : nouvelle fonction `syncItemsFromTemplate(checklistId)`
  qui lit les lignes existantes, calcule le delta avec le modèle et fait un `insert` des
  manquantes avec un `position` intercalé (pas de `delete`, pas d'`update`).
- `src/routes/_authenticated/check-lists.$auditId.tsx` : bouton dans l'en-tête + invalidation
  de la requête des items.
- La synthèse de conformité, les filtres par chapitre, le menu « Aller à… » et l'export CSV
  s'adaptent automatiquement puisqu'ils dérivent des lignes chargées.
- Attention volume : environ 120 lignes sur mobile — le filtre par chapitre déjà en place
  reste le mode de navigation principal, et les chapitres seront repliables par défaut
  au-delà de 60 lignes.

## Ce que ça change pour vous

Votre audit en cours affichera « x / 120 » environ après mise à jour, avec le détail
sous-clause par sous-clause, ce qui correspond au niveau attendu d'un audit Lead Auditor.
