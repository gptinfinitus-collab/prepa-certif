# Plan — Réponses écrites et évaluation automatique des flashcards

## Objectif
Transformer les flashcards en exercice actif : l'utilisateur doit saisir sa réponse à la main avant de voir le verso. Le système évalue automatiquement cette réponse par rapport à la réponse attendue, stocke le résultat, puis propose de passer à la carte suivante. Ce mode remplace le mode "retourner/mémoriser" actuel par défaut.

## Vue d'ensemble du flux

```text
Carte affichée (question)
        │
        ▼
Zone de saisie + bouton "Vérifier"
        │
        ▼
Appel serveur : évalue réponse vs réponse attendue
        │
        ▼
Affichage du verdict (correct / partiel / incorrect) + explication
        │
        ▼
Retour du verso + bouton "Carte suivante"
```

## Décisions produit

- **Évaluation automatique** : un modèle de langage compare la réponse saisie à la réponse attendue et renvoie un statut + un court feedback.
- **Stockage durable** : chaque réponse saisie et son évaluation sont conservées en base pour permettre un suivi de progression.
- **Mode par défaut** : toutes les flashcards passent en mode "réponse écrite". Pas de toggle dans cette itération.
- **Verdicts possibles** : `correct`, `partial`, `incorrect`.
- **Comportement pédagogique** : même en cas de réponse correcte, le verso s'affiche pour que l'utilisateur puisse comparer les formulations.

## Changements techniques

### 1. Schéma base de données

Ajouter des colonnes à `public.user_flashcard_progress` pour stocker la dernière réponse écrite et son évaluation :

- `user_answer text` — réponse saisie par l'utilisateur.
- `evaluation_status text` — `correct`, `partial`, `incorrect`, ou `null`.
- `evaluation_feedback text` — explication courte générée par l'IA.
- `evaluated_at timestamp with time zone` — date de l'évaluation.

La clé existante `(user_id, module_id, card_key)` reste la clé d'unicité. Un nouvel essai sur la même carte écrase les valeurs précédentes (comportement suffisant pour un suivi de maîtrise).

### 2. Évaluation côté serveur

Créer une `createServerFn` protégée `evaluateFlashcardAnswer` dans un fichier client-safe (par exemple `src/lib/flashcards.functions.ts`) :

- Lit `LOVABLE_API_KEY` côté serveur.
- Envoie un prompt structuré au modèle `google/gemini-2.5-flash` via le Lovable AI Gateway (`/chat/completions`, `response_format: { type: "json_object" }`).
- Le prompt demande un JSON strict : `{ "status": "correct|partial|incorrect", "feedback": "..." }`.
- Règles d'évaluation dans le prompt : comparer le sens, pas les mots exacts ; tolérance aux synonymes ; pénaliser les omissions majeures ; un statut `partial` quand l'idée est là mais incomplète.

### 3. Hooks et mutations

- `useEvaluateFlashcardAnswer(moduleId)` : appelle la server function, puis persiste le résultat dans `user_flashcard_progress` via Supabase.
- `useFlashcardProgress(moduleId)` : retourne déjà les statuts ; il sera étendu pour lire les nouvelles colonnes.
- `useSetFlashcardStatus(moduleId)` : reste utilisé pour marquer `again` / `mastered` après évaluation.

### 4. Interface `FlashcardDeck`

Modifier `src/components/course/LessonBlocks.tsx` :

- Afficher un champ de saisie textarea sous la question.
- Bouton principal "Vérifier ma réponse" (désactivé si champ vide).
- Après évaluation :
  - afficher le verso,
  - afficher le verdict avec une couleur (vert / orange / rouge),
  - afficher le feedback IA,
  - afficher les boutons "À revoir" / "Acquise" pour enregistrer le statut final.
- Gérer les états de chargement et d'erreur (erreur IA, rate limit, crédits épuisés).
- Adapter le layout mobile : champ pleine largeur, boutons empilés si besoin.

### 5. Mise à jour du modèle de données TypeScript

- Étendre `FlashcardStatus` si nécessaire.
- Ajouter les types de réponse de l'évaluation côté client.

## Fichiers concernés

- `src/components/course/LessonBlocks.tsx` — UI des flashcards.
- `src/lib/learning.ts` — hooks `useFlashcardProgress`, `useSetFlashcardStatus` et nouvelle mutation.
- `src/lib/flashcards.functions.ts` — server function d'évaluation.
- `src/integrations/supabase/types.ts` — types générés (mise à jour automatique après migration).
- Migration SQL pour `public.user_flashcard_progress`.

## Critères d'acceptation

1. Sur mobile et desktop, l'utilisateur peut taper sa réponse avant de retourner la carte.
2. Le clic sur "Vérifier" appelle l'IA et affiche un verdict + feedback.
3. Le verso s'affiche toujours après évaluation.
4. Les boutons "À revoir" / "Acquise" mettent à jour la progression comme avant.
5. La réponse et l'évaluation sont persistées en base et rechargées si l'utilisateur revient sur la carte.
6. En cas d'indisponibilité IA, un message d'erreur clair s'affiche et l'utilisateur peut quand même retourner la carte manuellement.

## Hors périmètre

- Pas de mode classique conservé dans cette itération.
- Pas de multi-réponses / plusieurs essais conservés séparément.
- Pas de tableau de bord dédié à l'historique des réponses écrites.
