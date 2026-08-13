# Lecture fluide pendant que l'IA écrit

## Problème constaté

Dans `src/components/AssistantChat.tsx`, un effet appelle `bottomRef.scrollIntoView({ behavior: "smooth" })` à chaque nouveau fragment de texte reçu (`[messages.length, streamed]`). Résultat :

- la page est tirée en permanence vers le bas du texte en cours d'écriture, donc le début de la réponse passe hors écran et il faut remonter à la fin pour lire ;
- tout défilement manuel est immédiatement annulé par le prochain fragment : l'écran semble bloqué pendant la génération.

## Comportement cible

1. Dès que l'IA commence à répondre, on cale une seule fois le **haut de la réponse** en haut de l'écran (juste sous la question), et on n'y retouche plus.
2. Le texte s'affiche ensuite vers le bas : on lit au fil de l'écriture, sans saut.
3. L'écran reste librement scrollable pendant toute la génération (aucun auto-scroll forcé).
4. Un bouton discret « Aller en bas » apparaît si l'utilisateur n'est pas au bas de la conversation, pour rattraper la fin d'un coup.

## Détails techniques

Dans `src/components/AssistantChat.tsx` :

- supprimer l'effet d'auto-scroll continu sur `streamed` ;
- ajouter une `ref` sur la bulle assistant en cours (et sur le message utilisateur qui vient d'être envoyé) ; au premier rendu de la réponse (transition `busy` false → true), faire un `scrollIntoView({ block: "start" })` unique sur le début de l'échange, avec un léger décalage (`scroll-mt`) pour ne pas coller au header ;
- garder un scroll en bas uniquement à l'ouverture/changement de fil (`threadId`), sans `behavior: "smooth"` répété ;
- bouton flottant « Aller en bas » : affiché via un listener `scroll` (throttle par `requestAnimationFrame`) quand la distance au bas dépasse ~200 px, masqué sinon ; clic = `bottomRef.scrollIntoView({ behavior: "smooth" })`.

Libellés du bouton ajoutés dans `src/i18n/locales/fr/assistant.json` et `en/assistant.json` (`assistant.scrollToBottom`).

Vérification : envoi d'une question longue en preview (Playwright), contrôle que le début de la réponse reste visible, que le scroll manuel n'est pas repris en main, et que le bouton apparaît/disparaît correctement — sur desktop et mobile.
