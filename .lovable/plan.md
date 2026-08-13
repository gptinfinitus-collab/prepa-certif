# Corriger les réponses de l'IA qui se coupent et tournent en boucle

## Ce qui se passe réellement

Deux causes distinctes, confirmées par les journaux et le code.

**1. La réponse se coupe et disparaît.** La dernière requête IA (13/08, 03:48) est enregistrée en `cancelled (http 499)` après 52 secondes : le flux a été interrompu en cours de rédaction. Or la réponse n'est enregistrée en base qu'une fois la génération **entièrement** terminée (`src/routes/api/chat.ts`). Résultat : tout le texte déjà affiché est perdu à l'écran, la question de l'utilisateur reste seule, et il repose la même question — d'où l'impression de boucle.

**2. L'IA se répète vraiment.** L'historique envoyé au modèle est lu avec `order("created_at", ascending: true).limit(12)` : ce sont les **12 plus anciens** messages du fil, pas les 12 derniers. Passé 12 messages, le modèle ne voit plus jamais les échanges récents et ressert les mêmes explications à chaque tour.

## Corrections prévues

### Côté serveur (`src/routes/api/chat.ts`, `src/lib/chat.server.ts`)

1. **Historique correct** : lire les 12 messages les plus récents (tri décroissant puis remise en ordre chronologique) au lieu des 12 premiers.
2. **Sauvegarde du partiel** : enregistrer la réponse même si le flux est interrompu (annulation, coupure réseau, erreur), avec une marque de réponse incomplète, au lieu de tout perdre.
3. **Interruption propre** : propager `request.signal` vers l'appel du modèle pour arrêter la génération dès que le client part, et déclencher la sauvegarde du partiel.
4. **Battement de cœur SSE** : émettre un commentaire keep-alive toutes les ~10 s pour éviter que les intermédiaires réseau ne coupent un flux long.
5. **Longueur bornée** : limiter le nombre de jetons de sortie et demander des réponses structurées mais concises, pour ramener les générations sous la barre des ~30 s (certaines réponses dépassent 2 700 jetons aujourd'hui).

### Côté interface (`src/components/AssistantChat.tsx`)

6. **Ne plus effacer le texte affiché** en cas d'erreur ou de coupure : le texte reçu reste visible, avec une mention « réponse interrompue » et un bouton **Réessayer**.
7. **Fin de tour sans clignotement** : ne vider `streamed`/`pending` qu'après le rechargement des messages persistés, pour supprimer le flash et la sensation de boucle.
8. **Annulation volontaire** : le bouton d'envoi devient « Arrêter » pendant la génération ; la partie déjà rédigée est conservée.

### Traductions

Nouvelles clés FR/EN dans `assistant.json` : réponse interrompue, réessayer, arrêter.

## Vérification

- Test unitaire sur l'ordre de l'historique (les 12 derniers messages, en ordre chronologique).
- Test manuel dans le navigateur : envoi d'une question longue, coupure en cours de route, contrôle que le texte partiel reste affiché et est bien retrouvé après rechargement de la page.
