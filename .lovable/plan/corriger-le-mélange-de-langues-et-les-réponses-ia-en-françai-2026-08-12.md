# Corriger le mélange de langues et les réponses IA en français

Audit du code : plusieurs couches restent figées en français, et l'IA se cale sur la langue de l'interface plutôt que sur la langue de la question.

## Ce qui est encore en français (constaté dans le code)

1. **Planning / rythme** — `src/lib/schedule.ts:112,121,141,143` : « En retard de X séance(s) », « En avance de X séance(s) », dates par défaut en `fr-FR`. C'est exactement ce qu'on voit sur la capture.
2. **Onboarding** — `src/lib/onboarding.ts:110-120` : phrases de rythme (« X séances à votre rythme… », « Rythme serré : … ») en dur.
3. **Lecteur de séance** — `src/lib/lesson-sections.ts:48,52,111` : « Erreurs fréquentes », « Quiz de fin de séance », « Objectif de la séance : ».
4. **Organismes d'examen** — `src/lib/exam-bodies.ts:27-67` : libellés, styles d'examen et avertissement d'indépendance uniquement en français.
5. **Types CPD** — `src/lib/cpd.ts:8` : « Conférence » et libellés associés.
6. **Formulaires d'authentification** — `src/lib/auth-schemas.ts:12-53` : messages de validation et d'erreur en français.
7. **Pages légales** — `src/lib/legal.ts:16-111` : éditeur, hébergeur, date de mise à jour, titres, plus `src/components/LegalPage.tsx:39` « Dernière mise à jour : ».
8. **Divers UI** — `src/components/QuizTrainer.tsx:175` « (pas de réponse) ».

## Pourquoi l'IA répond en français à une question en anglais

- `src/routes/api/chat.ts:42` et `src/lib/ai.functions.ts:36` imposent « Réponds en français » dès que la langue de l'interface est FR, sans tenir compte de la langue réellement employée par l'apprenant.
- Plusieurs prompts de `src/lib/ai.functions.ts` (génération de quiz `:230-272`, correction `:340-353`, analyse de préparation `:416-433`) n'ont aucune variante anglaise : même en interface EN, ces sorties reviennent en français.

## Ce qui sera fait

**1. Langue de réponse de l'IA**
Règle unique dans tous les prompts : répondre dans la langue de la question de l'apprenant ; à défaut de signal clair, utiliser la langue de l'interface. Appliqué au chat assistant (streaming), à l'évaluation des flashcards et aux fonctions IA quiz/correction/analyse.

**2. Prompts IA bilingues complets**
Variantes anglaises pour la génération de questions, la correction des réponses ouvertes et l'analyse de préparation, avec consignes de sortie (commentaires, niveaux, intitulés) dans la bonne langue.

**3. Libellés métier restants**
Rythme et dates de planning, textes d'onboarding, étapes du lecteur de séance, organismes d'examen, types CPD, messages de validation d'authentification, en-têtes légaux : tous passés par les fichiers de traduction FR/EN, avec la locale active fournie par l'appelant.

**4. Filet de sécurité**
Extension du test de parité i18n existant avec un test anti-régression qui échoue si une chaîne visible en français subsiste dans les fichiers concernés ou si `fr-FR` est codé en dur.

**5. Vérification**
Parcours complet de l'application en anglais (accueil, tableau de bord, séance, quiz, CPD, assistant, paramètres, pages légales) et test réel d'une question posée en anglais puis en français à l'assistant, pour confirmer la langue de réponse.

## Détails techniques

- Nouvelles clés dans `src/i18n/locales/{fr,en}/` (namespaces `common`, `course`, `quiz`, `cpd`, `legal`) ; aucune donnée en base modifiée, seuls les libellés affichés changent.
- Les fonctions pures (`schedule.ts`, `onboarding.ts`, `lesson-sections.ts`, `exam-bodies.ts`) renverront des clés + paramètres au lieu de phrases, traduites au point d'affichage.
- Côté serveur, `locale` reste transmise dans le corps de requête ; la consigne de langue devient « langue de la question, sinon `locale` ».

## Hors périmètre

- Traduction des documents téléversés par les utilisateurs.
- URLs localisées (`/en/...`) et langues autres que FR/EN.
