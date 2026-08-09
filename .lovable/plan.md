# PREPA IRCA 45001 — application de préparation

Application web en français qui déroule le programme de 21 jours (3 semaines) fourni dans le fichier JSON, avec connexion Google et Apple gérée par Lovable Cloud et sauvegarde de la progression par utilisateur.

## Contenu repris du fichier

- 3 semaines, 21 jours (types : cours, révision, pratique, examen blanc, repos, bilan)
- Pour chaque jour : objectif, cours en markdown, point clé, quiz avec corrigé
- Glossaire et annexes
- Métadonnées (titre, sous-titre, mode d'emploi, note de droit d'auteur)

## Écrans

1. **Accueil `/`** — page publique : présentation du programme, aperçu des 3 semaines, bouton « Se connecter pour commencer », note de droit d'auteur.
2. **Connexion `/auth`** — Google et Apple (+ e-mail/mot de passe en secours).
3. **Tableau de bord `/dashboard`** (connecté) — les 21 jours groupés par semaine, état terminé/en cours, barre de progression globale, bouton « Reprendre ».
4. **Jour `/jour/$id`** (connecté) — objectif, cours (markdown), point clé encadré, quiz interactif : on répond/on révèle le corrigé question par question, auto-évaluation, bouton « Marquer le jour comme terminé », navigation jour précédent/suivant.
5. **Glossaire `/glossaire`** avec recherche, **Annexes `/annexes`**.

## Authentification et données

- Activation de Lovable Cloud, puis connexion Google et Apple gérées par Lovable (e-mail/mot de passe conservé comme option).
- Table `profiles` (nom affiché, avatar) créée automatiquement à l'inscription.
- Table `day_progress` : utilisateur, jour, terminé, score auto-évalué, date — accessible uniquement à son propriétaire.
- Le contenu pédagogique reste un fichier statique dans l'application (pas de base de données) : plus rapide, disponible hors connexion partielle.

## Design

Direction sobre et professionnelle « qualité / audit » : fond clair sablé, accent bleu profond + touche ambre pour la progression, typographie à empattement pour les titres et sans-serif lisible pour les longs textes de cours. Tout en jetons de design (mode clair et sombre).

## Détails techniques

- Contenu importé dans `src/data/program.ts` (typé) depuis le JSON fourni.
- Routes TanStack : `/`, `/auth`, `/glossaire`, `/annexes` publiques ; pages protégées sous `_authenticated/` (dashboard, jour).
- Rendu markdown via `react-markdown` + `remark-gfm`.
- Progression lue/écrite via le client Supabase du navigateur avec RLS `auth.uid()`, mise en cache par TanStack Query.
- Métadonnées SEO propres par page (titre, description, og/twitter).
