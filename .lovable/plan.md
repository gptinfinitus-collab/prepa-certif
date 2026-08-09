# Espace Super Admin — voir et gérer les utilisateurs

Objectif : donner au compte `gptinfinitus@gmail.com` une page privée listant tous les utilisateurs de PREPA CERTIF, avec possibilité de désactiver, réactiver ou supprimer un compte. Gratuit aujourd'hui, la structure prépare une future monétisation par abonnement.

## Ce que verra le super admin

Nouvelle entrée « Administration » dans la barre latérale, visible uniquement pour lui, menant à `/admin`.

La page affiche :

- Cartes de synthèse : total d'utilisateurs, inscrits sur 7 / 30 jours, actifs sur 7 jours, comptes désactivés.
- Tableau des utilisateurs : nom, e-mail, date d'inscription, dernière connexion, certification active, nombre de documents et de séances terminées, statut (actif / désactivé).
- Recherche par nom ou e-mail, tri par date d'inscription ou dernière activité.
- Actions par ligne : désactiver / réactiver, supprimer (confirmation obligatoire).

Protections : le super admin ne peut ni se désactiver ni se supprimer lui-même ; aucun autre compte ne peut atteindre `/admin` ni les fonctions serveur associées.

## Détails techniques

### Base de données (migration)

- Enum `public.app_role` (`super_admin`, `admin`, `user`).
- Table `public.user_roles (id, user_id → auth.users, role, unique(user_id, role))` avec GRANT `select` à `authenticated`, `all` à `service_role`, RLS activée : chacun lit ses propres rôles ; aucune écriture côté client.
- Fonction `public.has_role(_user_id uuid, _role app_role)` en `security definer` (`stable`, `search_path = public`).
- Attribution du rôle `super_admin` à `gptinfinitus@gmail.com` : insertion depuis `auth.users` par e-mail confirmé, plus un trigger sur inscription/confirmation qui réattribue le rôle si le compte est recréé.
- Colonne `profiles.disabled_at timestamptz` pour l'affichage du statut (la désactivation réelle passe par le bannissement Auth).

### Fonctions serveur (`src/lib/admin.functions.ts`)

Toutes avec `.middleware([requireSupabaseAuth])`, vérification `has_role(userId, 'super_admin')` via `context.supabase` avant tout accès privilégié, puis `await import('@/integrations/supabase/client.server')` :

- `listUsers` : `auth.admin.listUsers()` agrégé avec `profiles`, `user_certifications`, `library_documents`, `user_lesson_progress`.
- `setUserDisabled` : `auth.admin.updateUserById` avec `ban_duration` (`876000h` pour désactiver, `none` pour réactiver) + mise à jour de `profiles.disabled_at`.
- `deleteUser` : `auth.admin.deleteUser` (les données liées partent en cascade).

Refus explicite si la cible est le super admin lui-même.

### Interface

- `src/routes/_authenticated/admin.tsx` : redirection vers `/dashboard` si l'utilisateur n'est pas super admin, tableau responsive (cartes empilées sur mobile), boutons d'action avec `AlertDialog` de confirmation et notifications `sonner`.
- `src/lib/admin.ts` : hook `useIsSuperAdmin` + hooks React Query pour la liste et les mutations.
- `src/components/AppShell.tsx` : lien « Administration » conditionnel.

### Tests

- Unitaires : logique de filtrage/tri et libellés de statut ; garde-fou « pas d'action sur soi-même ».
- E2E : un utilisateur non admin qui visite `/admin` est redirigé vers `/dashboard`.

## Hors périmètre pour l'instant

Abonnements, paiements et quotas : la table `user_roles` et le champ statut préparent le terrain, mais rien de facturable n'est implémenté maintenant.
