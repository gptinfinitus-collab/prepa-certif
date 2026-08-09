# Refonte de l'interface : sidebar, mobile, profil, paramètres, mode sombre

## Ce qui change

### 1. Navigation desktop — sidebar
- Sidebar fixe à gauche (rétractable en mode icônes) remplaçant la barre d'en-tête actuelle sur PC.
- Liens : Programme, Mon planning, Références ISO, Glossaire, Annexes, Ma bibliothèque, Paramètres.
- L'élément actif est mis en évidence ; le bouton de repli reste toujours visible.
- **En bas de la sidebar : carte profil** — photo, prénom + nom sur une ligne, e-mail en dessous, menu (Paramètres, Se déconnecter).

### 2. Navigation mobile
- Barre de navigation basse fixe (5 icônes : Accueil, Planning, Références, Bibliothèque, Profil) + en-tête compact avec le titre de la page.
- **Page d'accueil mobile repensée** : carte de bienvenue avec prénom et avatar, anneau de progression, bloc « Prochaine séance » proéminent, raccourcis rapides, aperçu des séances du jour.

### 3. Profil utilisateur (photo + identité)
- Boîte de dialogue de profil : upload d'une photo avec **recadrage** (zone carrée, zoom + déplacement, export en cercle/carré), plus champs Prénom et Nom.
- La photo est stockée dans un espace de stockage privé `avatars`, accessible uniquement par son propriétaire.
- Le prénom/nom s'affichent dans la sidebar, la nav mobile et l'accueil.

### 4. Page Paramètres (`/parametres`)
- Section Profil (photo, prénom, nom, e-mail en lecture seule).
- Section Apparence : **interrupteur mode sombre** (Clair / Sombre / Système).
- Section Étude : raccourci vers le planning.
- Section Compte : déconnexion.

### 5. Thème sombre « bleu nuit »
- Palette sombre retravaillée : fonds bleu nuit profonds, surfaces légèrement plus claires pour la hiérarchie, texte à contraste élevé (AA/AAA), accent ambré conservé pour les actions.
- Préférence mémorisée localement et appliquée avant le premier rendu pour éviter le flash blanc.

## Détails techniques

- **Base de données** : ajout de `first_name` et `last_name` sur `profiles` (le `display_name` existant reste synchronisé) ; création du bucket privé `avatars` avec politiques RLS par dossier utilisateur (`{user_id}/...`), lecture via URL signée.
- **Requêtes** : nouveaux hooks `useProfile` / `useUpdateProfile` / `useUploadAvatar` dans `src/lib/queries.ts`.
- **Layout** : nouveau `src/components/AppShell.tsx` (sidebar shadcn `collapsible="icon"` + `SidebarProvider` sur desktop, header + bottom-nav sur mobile via `useIsMobile`), utilisé par toutes les routes `_authenticated` et les pages publiques connectées. `AppHeader.tsx` est remplacé.
- **Recadrage** : composant `AvatarCropper` (canvas + gestes zoom/drag, sans dépendance lourde) exportant un blob JPEG 512×512.
- **Thème** : `ThemeProvider` léger (classe `dark` sur `<html>`, `localStorage`, script inline dans `__root.tsx` pour éviter le FOUC) + `Switch` shadcn dans Paramètres.
- **Tokens** : mise à jour du bloc `.dark` de `src/styles.css` (bleu nuit, contrastes vérifiés) ; aucune couleur en dur dans les composants.
- Correction au passage de l'erreur d'hydratation signalée sur `/auth`.
