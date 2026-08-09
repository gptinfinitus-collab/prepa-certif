# Bouton « Partager l'application » dans les Paramètres

## Ce qui change

Une nouvelle carte « Partager » dans la page Paramètres, placée juste avant la carte Compte :

- Titre : « Partager PREPA CERTIF », description : « Invitez un collègue à préparer sa certification. »
- Bouton principal **Partager** :
  - Sur mobile (et navigateurs compatibles), ouvre le panneau de partage natif du téléphone (WhatsApp, iMessage, LinkedIn…), avec le titre de l'app, une courte accroche et le lien `https://prepa-certif.app`.
  - Sur ordinateur (ou si le partage natif est indisponible), copie automatiquement le lien dans le presse-papiers avec la confirmation « Lien copié ».
- Bouton secondaire **Copier le lien**, toujours visible, avec un retour visuel (icône coche pendant 2 s) et une notification de confirmation.
- Le lien partagé affichera la vignette de marque déjà en place (og-image + titre/description).

## Détails techniques

- Nouveau composant `src/components/ShareApp.tsx` : bouton(s) utilisant `navigator.share` avec repli `navigator.clipboard.writeText`, notifications via `sonner` (déjà utilisé dans le projet), icônes `Share2` / `Copy` / `Check` de lucide-react.
- Détection du support côté client uniquement (dans un `useEffect`) pour éviter toute désynchronisation d'hydratation SSR.
- Intégration de la carte dans `src/routes/_authenticated/parametres.tsx`, en réutilisant les composants `Card` et `Button` existants — aucune couleur en dur, aucun changement de logique métier.
- Le lien partagé pointe vers le domaine public `https://prepa-certif.app`.
