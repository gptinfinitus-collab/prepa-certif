# Parcours à niveaux + lecteur de cours séquencé

Deux renforcements, sans refonte visuelle : l'app garde la sidebar, les cartes, le planning et le thème actuels.

## 1. Trois niveaux de parcours, pas une « prépa Lead Auditor » générique

Chaque certification expose désormais un parcours en trois niveaux :

- **Maîtrise ISO 45001** (actif) — comprendre et appliquer la norme
- **Auditeur interne** (actif) — conduire un audit interne, preuves, constats
- **Lead Auditor** (à venir) — affiché comme verrouillé, avec la mention qu'un profil d'examen documenté (PECB, CQI/IRCA…) sera nécessaire

Règles produit appliquées partout (dashboard, quiz, examen blanc, assistant) :

- Aucun écran ne prétend reproduire l'examen d'un organisme précis.
- Les examens blancs sont libellés « entraînement PREPA CERTIF », avec une note explicite : formats et règles varient selon l'organisme.
- Un sélecteur de niveau (dans l'en-tête du programme) filtre séances, quiz et progression ; la progression est suivie par niveau.

L'architecture prévoit un futur « profil d'examen » (durée, nombre de questions, seuil, types autorisés) que l'on branchera sur un niveau sans retoucher le contenu.

## 2. Le cours n'est plus une longue page

La séance devient un vrai cours numérique découpé en étapes navigables, dans l'ordre imposé :

```text
Pourquoi c'est important → Objectifs → Cours (sous-sections)
→ Exemples → Regard de l'auditeur → Preuves à rechercher
→ Point examen → Erreurs fréquentes → Mise en situation
→ À retenir → Flashcards → Quiz de fin
```

Lecteur de cours :

- Sommaire latéral (desktop) / repliable + barre de progression fixe (mobile)
- Une étape à la fois, boutons Précédent / Suivant / Continuer, « Reprendre où j'en étais »
- Marquage automatique des sections lues ; séance terminée seulement quand toutes les sections obligatoires sont vues et le quiz soumis
- Note personnelle, favori, et bouton « Poser la question à l'Assistant IA » avec le contexte de la section

Blocs de contenu réutilisables : Définition, Important, Point examen, Regard de l'auditeur, Erreur fréquente, Exemple, Cas pratique avec correction dépliable, Tableau comparatif, Flashcards, Mini-quiz.

## 3. Quiz plus exigeants

- Types : QCM simple/multiple, Vrai-Faux, mise en situation, identifier la clause, choisir la meilleure preuve, y a-t-il non-conformité, chaîne danger/risque, hiérarchie des mesures
- Minimum 40 % de questions de mise en situation ; jamais uniquement des numéros de clause
- Explication systématique pour la bonne réponse **et** pour l'erreur choisie
- Suivi de la maîtrise par thème et de l'historique d'erreurs (alimente l'analyse de préparation existante)

## Détails techniques

- Contenu stocké en base (pas dans les composants) : tables `learning_tracks`, `lessons`, `lesson_sections` (type + ordre + JSON), `flashcards`, `quiz_questions`/`quiz_choices`, et côté utilisateur `user_lesson_progress` (section courante, sections lues), `user_quiz_attempts`, `user_answers`, `user_topic_mastery`, `user_flashcard_progress`, `user_notes` — chacune avec GRANT + RLS scopée sur `auth.uid()`.
- `src/data/curriculum` sert de source de seed pour ISO 45001 ; les autres normes gardent leur squelette actuel.
- `seance.$moduleId.tsx` est réécrit en lecteur par étapes (`?section=` dans l'URL) ; `MarkdownView` reste utilisé à l'intérieur des blocs texte.
- Nouveau `src/components/course/` : `SectionNav`, `CourseProgressBar`, et les cartes de blocs.
- Le niveau actif est stocké sur le profil utilisateur, à côté de `active_certification`.

## Découpage

1. Schéma base + seed ISO 45001 découpé en sections
2. Lecteur de cours par étapes + blocs visuels + progression fine
3. Niveaux (Maîtrise / Auditeur interne / Lead Auditor verrouillé) et filtrage
4. Moteur de quiz enrichi + maîtrise par thème + garde-fous de formulation
5. Tests unitaires et e2e

Chaque étape se termine par ses tests avant de passer à la suivante.
