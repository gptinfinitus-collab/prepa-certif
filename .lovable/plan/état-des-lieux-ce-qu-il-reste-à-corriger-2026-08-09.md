# État des lieux : ce qu'il reste à corriger

Audit effectué à l'instant (tests, navigation mobile/tablette, sécurité base de données, SEO).

## Ce qui est déjà bon
- 110 tests unitaires verts, typage OK, aucun TODO/FIXME dans le code.
- Page Administration sur mobile (393 px) : aucun débordement horizontal, aucune erreur console.
- Menu complet accessible sur mobile et tablette (11 rubriques + Administration).
- Audit de contenu ISO clôturé (priorités 1 à 4).

## Points restants

### 1. Alertes de sécurité base de données (2 alertes, vérifiées comme non exploitables)
Le scanner signale deux points ; la vérification en base montre qu'aucun n'est réellement exploitable :
- La table des rôles n'a qu'une règle de lecture, donc **aucune écriture n'est possible** pour un utilisateur connecté : pas d'escalade de privilèges possible.
- Les fonctions sensibles (`bootstrap_super_admin`, `handle_new_user`) ne sont **pas exécutables** par un utilisateur connecté ; seule `has_role` l'est, ce qui est le fonctionnement normal et attendu.

À faire : rendre l'intention explicite en base (règles de refus d'écriture nommées sur la table des rôles), puis classer les deux alertes comme traitées avec une note dans la mémoire de sécurité pour éviter qu'elles ne reviennent.

### 2. Balises canonical absentes
Aucune page publique ne déclare de balise `canonical`. Sans elle, Google peut indexer plusieurs variantes d'URL (avec/sans `www`, domaine `.lovable.app`) et diluer le référencement.

À faire : ajouter une balise canonical auto-référente sur chaque page publique (accueil, connexion, références, annexes, glossaire, pages légales), pointant vers `https://prepa-certif.app`.

### 3. Google Search Console non connecté
Le site n'est rattaché à aucune propriété Search Console, donc aucun suivi d'indexation ni envoi de sitemap. À noter aussi : l'ancienne adresse `prepa-iso.lovable.app` figure encore côté Google alors que le domaine actuel est `prepa-certif.app`.

À faire (optionnel, nécessite votre autorisation Google) : connecter Search Console, vérifier la propriété `https://prepa-certif.app/` et soumettre le sitemap.

### 4. Vérification finale
Rejouer les tests unitaires et un contrôle visuel mobile/tablette après les corrections.

## Détails techniques
- Migration SQL : `CREATE POLICY` restrictives (INSERT/UPDATE/DELETE) sur `public.user_roles` limitées à `has_role(auth.uid(),'super_admin')`, sans élargir les droits actuels.
- `security--manage_security_finding` + `security--update_memory` pour clore `user_roles_missing_write_policy` et `SUPA_authenticated_security_definer_function_executable`.
- Ajout de `links: [{ rel: "canonical", href: ... }]` dans le `head()` de chaque route publique feuille uniquement (jamais dans `__root.tsx`).
- Search Console : flux `standard_connectors--connect` + vérification META dans le `<head>` racine.
