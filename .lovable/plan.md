# Plan global — Étapes 4 à 8 de PREPA CERTIF

Étapes 1 à 3 déjà validées : typographie Inter, build + tests, contenu pédagogique par norme.

## Étape 4 — Parcours Lead Auditor et profil d'examen

Ouvrir le troisième niveau, aujourd'hui verrouillé, en l'adaptant à l'organisme visé.

- Choix d'un organisme d'examen (PECB, CQI/IRCA, autre / non défini) stocké dans `profiles.exam_body`, proposé dans Paramètres et au déverrouillage du niveau.
- Déverrouillage du niveau Lead Auditor une fois l'organisme choisi, avec avertissement clair : le contenu reste une préparation, pas un cours officiel accrédité.
- Contenu spécifique Lead Auditor : conduite d'audit complet, gestion d'équipe, réunions d'ouverture/clôture, rédaction de non-conformités, rapport et suivi.
- Génération des questions d'entraînement adaptée au format de l'organisme (QCM court PECB, mises en situation longues IRCA).

## Étape 5 — Historique et révision des sessions d'entraînement

Les réponses sont déjà enregistrées mais jamais relues.

- Onglet « Historique » dans `/quiz` : liste des sessions (date, thème, score, mode).
- Détail d'une session : question, réponse donnée, réponse attendue, explication, feedback IA.
- Filtres par chapitre et par résultat ; bouton « Réentraîner mes erreurs » qui génère un quiz ciblé sur les thèmes les plus faibles (`user_topic_mastery`).

## Étape 6 — Onboarding guidé

- Écran de bienvenue à la première connexion : certification, niveau de parcours, date d'examen, jours de révision.
- Pré-remplissage automatique du planning à partir de ces réponses.
- Possibilité de passer l'étape et de la reprendre depuis Paramètres.

## Étape 7 — Espace Super Admin

Le compte `gptinfinitus@gmail.com` voit et gère tous les utilisateurs. Entrée « Administration » visible uniquement pour lui, vers `/admin`.

- Synthèse : total d'utilisateurs, inscrits sur 7 / 30 jours, actifs sur 7 jours, comptes désactivés.
- Tableau : nom, e-mail, inscription, dernière connexion, certification active, documents, séances terminées, statut.
- Recherche, tri, et actions par ligne : désactiver / réactiver, supprimer (confirmation obligatoire).
- Le super admin ne peut ni se désactiver ni se supprimer lui-même ; aucun autre compte n'accède à `/admin` ni aux fonctions serveur associées.

Base pour une future monétisation par abonnements — aucun paiement implémenté maintenant.

## Étape 8 — Vérification finale

Build de production, tests unitaires et e2e complets, passe responsive tablette et mobile, correction des régressions détectées.

## Détails techniques

### Migrations

- `profiles.exam_body text` (nullable) et `profiles.onboarded_at timestamptz`.
- Enum `public.app_role` (`super_admin`, `admin`, `user`) et table `public.user_roles (id, user_id, role, unique(user_id, role))` : GRANT `select` à `authenticated`, `all` à `service_role`, RLS activée, chacun lit ses propres rôles, aucune écriture côté client.
- Fonction `public.has_role(_user_id uuid, _role app_role)` en `security definer`, `stable`, `search_path = public`.
- Attribution du rôle `super_admin` à `gptinfinitus@gmail.com` depuis `auth.users` (e-mail confirmé) plus un trigger de réattribution si le compte est recréé.
- `profiles.disabled_at timestamptz` pour le statut affiché ; la désactivation effective passe par le bannissement Auth.

### Fonctions serveur

`src/lib/admin.functions.ts`, toutes avec `.middleware([requireSupabaseAuth])` et vérification `has_role(userId, 'super_admin')` via `context.supabase` avant tout accès privilégié, puis `await import('@/integrations/supabase/client.server')` dans le handler :

- `listUsers` : `auth.admin.listUsers()` agrégé avec `profiles`, `user_certifications`, `library_documents`, `user_lesson_progress`.
- `setUserDisabled` : `auth.admin.updateUserById` avec `ban_duration` (`876000h` / `none`) + `profiles.disabled_at`.
- `deleteUser` : `auth.admin.deleteUser` (données liées supprimées en cascade).

### Fichiers front

- `src/lib/tracks.ts`, `src/components/TrackSwitcher.tsx`, `src/routes/_authenticated/parametres.tsx` — organisme d'examen et déverrouillage Lead Auditor.
- `src/data/standard-extras.ts` — blocs pédagogiques niveau Lead Auditor.
- `src/routes/_authenticated/quiz.tsx` + nouveau composant d'historique — étape 5.
- `src/components/Onboarding.tsx` + `src/routes/_authenticated/dashboard.tsx` — étape 6.
- `src/routes/_authenticated/admin.tsx`, `src/lib/admin.ts`, `src/components/AppShell.tsx` — étape 7.

### Tests par étape

Chaque étape se termine par ses tests unitaires (logique de parcours, filtres d'historique, garde-fous admin) et e2e (déverrouillage, historique, onboarding, redirection `/admin` pour un non-admin), avant de passer à la suivante.
