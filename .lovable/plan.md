# Exemples de questions d'audit par chapitre

Ajouter, pour chaque chapitre des check-lists, une courte liste de questions types que l'auditeur peut poser sur le terrain (questions d'ouverture d'entretien, avant d'entrer dans le détail des exigences).

## Ce que verra l'utilisateur

Dans une check-list ouverte, sous le titre de chaque chapitre, un petit bloc repliable « Questions à poser » listant 4 à 6 questions concrètes, par exemple pour « 4. Contexte » :

- Comment avez-vous identifié les enjeux internes et externes qui influencent la S&ST ?
- Qui a participé à cette analyse et à quelle date a-t-elle été revue ?
- Comment le changement climatique a-t-il été examiné dans cette analyse ?

Le bloc est replié par défaut (pour ne pas alourdir l'écran mobile), s'ouvre d'un clic, et n'apparaît pas à l'impression / dans le rapport PDF.

## Contenu à rédiger

Questions rédigées avec nos propres mots (pas d'extrait littéral des normes), pour chaque chapitre des modèles existants :

- ISO 45001 (chapitres 4 à 10)
- ISO 19011 (étapes du processus d'audit)
- ISO 9001, ISO 14001, ISO/IEC 27001

Chaque chapitre : 4 à 6 questions, formulées ouvertes (« Comment… », « Montrez-moi… », « Qui… »), orientées preuve.

## Détails techniques

- `src/data/audit-checklists.ts` : ajouter un champ optionnel `questions?: string[]` à `ChecklistSectionTemplate` et le renseigner sur chaque section des modèles FR.
- `src/data/audit-checklists.en.ts` : mêmes questions traduites en anglais sur chaque section.
- `src/lib/audit-checklists.ts` : petit sélecteur `chapterQuestions(template, chapter)` retournant les questions d'un chapitre (les lignes stockées en base ne portent que le libellé de chapitre ; l'appariement se fait sur ce libellé, avec repli sur une liste vide pour les chapitres personnalisés).
- `src/routes/_authenticated/check-lists.$auditId.tsx` : dans l'en-tête de chapitre existant, insérer le bloc repliable alimenté par le template déjà résolu via `findTemplate(locale, checklist.template_id)`. Classe `print:hidden`.
- `src/i18n/locales/fr/audit.json` et `en/audit.json` : clés `chapterQuestions.title` (« Questions à poser » / « Questions to ask ») et `chapterQuestions.hint`.
- Aucun changement de base de données, aucune modification des exports CSV.
