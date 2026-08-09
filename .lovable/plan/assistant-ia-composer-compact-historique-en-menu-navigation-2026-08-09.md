# Assistant IA : composer compact, historique en menu, navigation plus rapide

## 1. Zone de saisie plus compacte

Dans `src/components/AssistantChat.tsx` :

- Le champ passe de 2 lignes fixes à **1 ligne auto-extensible** (croissance jusqu'à ~5 lignes puis scroll interne), pour libérer la lecture de la réponse sur mobile.
- Placeholder raccourci et discret : « Votre question… » en `text-sm` et couleur atténuée.
- Bouton d'envoi transformé en **bouton rond icône seule** placé à droite dans la même ligne que le champ (plus de bloc « Envoyer » sur une deuxième ligne). Libellé accessible conservé (`aria-label="Envoyer"`).
- Hauteur totale du composer réduite d'environ moitié ; le raccourci Entrée = envoyer est conservé, Maj+Entrée = nouvelle ligne.

## 2. Menu hamburger pour l'historique

- La colonne latérale des conversations est supprimée du flux de la page.
- Un bouton hamburger (icône) est ajouté en tête de la conversation ; il ouvre un panneau latéral (composant `Sheet` déjà présent dans le projet) contenant :
  - le bouton « Nouvelle conversation »,
  - la liste des fils, avec le fil actif mis en évidence,
  - la suppression d'un fil.
- Le panneau se ferme automatiquement à la sélection d'un fil.
- Même comportement sur mobile, tablette et desktop : la conversation occupe toute la largeur utile.

## 3. Transitions d'apparition des pages

- Ajout d'une animation d'entrée légère (fondu + léger glissement, ~150–200 ms) appliquée au contenu de page dans `src/components/AppShell.tsx`, rejouée à chaque changement d'URL.
- Utilisation des utilitaires d'animation déjà disponibles (`tw-animate-css`), sans nouvelle dépendance.
- Respect de `prefers-reduced-motion` : pas d'animation pour les utilisateurs qui la désactivent.

## 4. Chargement perçu plus rapide

Trois causes concrètes de lenteur, corrigées :

- **Vérification d'authentification réseau à chaque navigation** : `src/routes/_authenticated/route.tsx` appelle `supabase.auth.getUser()` (aller-retour serveur) avant l'affichage de chaque page protégée. Remplacé par la lecture de session locale, avec repli sur la vérification serveur uniquement s'il n'y a pas de session.
- **Aucun préchargement au survol** : activation du préchargement à l'intention (survol/appui) dans `src/router.tsx`, et suppression du `defaultPreloadStaleTime: 0` qui annulait tout bénéfice de cache.
- **Requêtes rejouées à chaque retour de page** : ajout d'un `staleTime` par défaut (≈ 60 s) et désactivation du refetch au focus fenêtre sur le `QueryClient`, pour que les pages déjà visitées s'affichent instantanément.
- Ajout d'états de chargement discrets (squelettes) plutôt qu'un écran vide pendant la première récupération de la conversation.

## Détails techniques

- Fichiers touchés : `src/components/AssistantChat.tsx`, `src/components/AppShell.tsx`, `src/routes/_authenticated/route.tsx`, `src/router.tsx`.
- Aucune modification du backend, du schéma de données ni de la route `/api/chat`.
- Les tests unitaires et E2E existants sont exécutés après implémentation ; toute régression détectée est corrigée dans la foulée.
