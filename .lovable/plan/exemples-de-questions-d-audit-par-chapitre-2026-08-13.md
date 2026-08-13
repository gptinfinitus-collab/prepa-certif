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

# Pièces jointes : documents de preuve

Permettre de joindre des fichiers (photos, PDF, procédures) à chaque ligne de check-list, en complément du champ « Preuve constatée » qui reste textuel.

## Ce que verra l'utilisateur

Sur chaque ligne (vue cartes) : un bouton « Joindre un fichier » et la liste des pièces déjà jointes (nom, taille, date), chacune ouvrable dans un nouvel onglet et supprimable. Sur mobile, le sélecteur de fichier permet aussi de prendre une photo.

Dans l'en-tête de l'audit : le nombre total de pièces jointes. Dans la vue tableau : une petite icône trombone avec le compteur par ligne.

Limites : 10 Mo par fichier, formats images (JPG, PNG, HEIC converti côté navigateur non géré : refus explicite), PDF, Word, Excel. Message d'erreur clair si dépassement ou type refusé.

## Détails techniques

- Bucket de stockage privé `audit-evidence`, chemin `{user_id}/{checklist_id}/{item_id}/{uuid}-{nom}`, avec politiques sur `storage.objects` limitant lecture/écriture/suppression au propriétaire (préfixe = `auth.uid()`).
- Nouvelle table `audit_item_attachments` : `item_id` (→ `audit_checklist_items`, suppression en cascade), `checklist_id`, `user_id`, `storage_path`, `file_name`, `mime_type`, `size_bytes`. GRANT pour `authenticated` et `service_role`, RLS restreinte au propriétaire.
- `src/lib/audit-attachments.ts` : hooks `useItemAttachments(checklistId)` (chargement groupé par audit), `useUploadAttachment`, `useDeleteAttachment` (suppression du fichier puis de la ligne), et création d'URL signée à la demande pour l'ouverture.
- `src/components/audit/EvidenceAttachments.tsx` : bouton d'upload, état de progression, liste des pièces, confirmation de suppression.
- Intégration dans `src/routes/_authenticated/check-lists.$auditId.tsx` (bloc sous « Preuve constatée ») et compteur dans `src/components/audit/ChecklistTable.tsx`.
- Export CSV : nouvelle colonne « Pièces jointes » listant les noms de fichiers ; l'impression affiche la liste des noms (pas les fichiers eux-mêmes).
- Traductions ajoutées sous `audit.attachments.*` dans `fr/audit.json` et `en/audit.json`.
