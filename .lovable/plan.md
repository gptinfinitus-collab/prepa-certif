# Journal CPD — suivi du développement professionnel continu

Nouveau module permettant à chaque utilisateur connecté d'enregistrer ses activités CPD (maintien de la certification IRCA Lead Auditor ISO 45001), avec objectif annuel, répartition par type, filtres, export CSV. Design, typographie et mode clair/sombre existants réutilisés tels quels.

## Base de données

Table `cpd_entries` : date, intitulé, type (Formation, Audit, Lecture, Conférence, Enseignement, Adhésion, Autre), heures (décimales), référence/preuve, notes, plus les horodatages de création/modification.

Table `cpd_settings` : objectif annuel d'heures (20 par défaut), une ligne par utilisateur.

Règles d'accès : chaque utilisateur voit, crée, modifie et supprime uniquement ses propres lignes. Aucune donnée partagée entre comptes.

## Page « Journal CPD »

Route protégée `/cpd`, ajoutée à la navigation latérale (et au menu mobile « Plus »), avec l'icône d'un journal.

Contenu, de haut en bas :

1. **Jauge circulaire** : heures cumulées de l'année sélectionnée / objectif annuel, pourcentage au centre, objectif modifiable via un champ numérique enregistré immédiatement.
2. **Répartition par type** : barres horizontales avec total d'heures et part relative pour chaque type de l'année sélectionnée.
3. **Filtres** : sélecteur d'année (années présentes dans les entrées + année en cours) et sélecteur de type (« Tous » par défaut).
4. **Liste des entrées** : tableau trié par date décroissante (date, intitulé, badge de type coloré, heures, actions modifier/supprimer). Sur mobile, affichage en cartes empilées.
5. **Nouvelle entrée** : bouton ouvrant une modale — date, intitulé, type, heures (requis), référence, notes (optionnels). Le même formulaire sert à la modification.
6. **Suppression** : boîte de confirmation avant retrait définitif.
7. **Export CSV** : toutes années confondues, colonnes Date, Activité, Type, Heures, Référence, Notes.
8. **État vide** : message d'invitation avec bouton d'ajout quand aucune entrée n'existe.

Interface en français, responsive mobile/tablette/desktop, compatible mode sombre.

## Détails techniques

- Migration Supabase : `cpd_entries` et `cpd_settings` avec GRANT (authenticated/service_role), RLS activée, policies `auth.uid() = user_id`, trigger `set_updated_at` existant sur `cpd_entries`.
- `src/lib/cpd.ts` : hooks TanStack Query (`useCpdEntries`, `useUpsertCpdEntry`, `useDeleteCpdEntry`, `useCpdSettings`, `useSaveCpdTarget`) sur le client Supabase navigateur, invalidation de cache après mutation, comme `src/lib/queries.ts`.
- `src/routes/_authenticated/cpd.tsx` : page dans `AppShell`, `head()` propre (titre/description/og).
- `src/components/cpd/` : `CpdRing` (SVG circulaire tokenisé), `CpdEntryDialog` (Dialog + validation Zod), `CpdTypeBreakdown`.
- Composants shadcn existants uniquement (Card, Dialog, Select, Input, Textarea, Table, Badge, AlertDialog, Button) ; couleurs via tokens sémantiques, aucun code couleur en dur.
- Ajout du lien dans `navItems` de `src/components/AppShell.tsx`.
- CSV généré côté client (Blob + lien de téléchargement), échappement des guillemets/points-virgules.
- Tests unitaires sur les fonctions pures (agrégation par type, total annuel, génération CSV).
