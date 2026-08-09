# PREPA IRCA 45001 — application de préparation

Application web en français qui déroule le programme fourni dans le fichier JSON, avec une **durée de préparation configurable** (pas figée à 21 jours), connexion Google et Apple gérée par Lovable Cloud et sauvegarde de la progression par utilisateur.

## Contenu repris du fichier

- Les 21 séances fournies (types : cours, révision, pratique, examen blanc, repos, bilan) deviennent des **modules** indépendants de toute date fixe
- Pour chaque module : objectif, cours en markdown, point clé, quiz avec corrigé
- Glossaire et annexes
- Métadonnées (titre, sous-titre, mode d'emploi, note de droit d'auteur)

## Planning configurable

À la première connexion (et modifiable à tout moment dans « Mon planning ») :

- date de début et date de l'examen/formation
- rythme : nombre de séances par jour ou de jours de repos par semaine, jours travaillés
- durée totale déduite automatiquement, ou choix direct « je veux tout couvrir en N jours »
- les modules sont alors répartis sur le calendrier réel de l'utilisateur ; les libellés type « Lundi 20/07 » sont recalculés au lieu d'être codés en dur
- si le temps est plus court que le nombre de modules, l'application regroupe plusieurs modules par jour ; s'il est plus long, elle intercale des jours de révision
- indicateur « en avance / en retard » par rapport au planning

## Écrans

1. **Accueil `/`** — page publique : présentation du programme, aperçu des semaines, bouton « Se connecter pour commencer », note de droit d'auteur.
2. **Connexion `/auth`** — Google et Apple (+ e-mail/mot de passe en secours).
3. **Mon planning `/planning`** (connecté) — configuration de la période et du rythme, aperçu du calendrier généré.
4. **Tableau de bord `/dashboard`** (connecté) — les modules groupés par semaine de planning, état terminé/en cours, progression globale, « Reprendre ».
5. **Séance `/seance/$id`** (connecté) — objectif, cours (markdown), point clé encadré, quiz interactif (révélation du corrigé question par question, auto-évaluation), « Marquer comme terminé », navigation précédent/suivant.
6. **Références ISO `/references`** — voir ci-dessous.
7. **Glossaire `/glossaire`** avec recherche, **Annexes `/annexes`**.

## Références ISO

Les textes intégraux d'ISO 45001:2018 et ISO 19011:2018 sont sous droit d'auteur : ils ne peuvent pas être téléchargés ni redistribués dans l'application. La page Références fournira à la place :

- la fiche de chaque norme utile (ISO 45001:2018, ISO 19011:2018, ISO/IEC 17021-1, ISO 45002) avec liens directs vers l'aperçu gratuit et l'achat sur iso.org
- pour chaque norme, le sommaire des chapitres et un résumé original par clause, relié aux séances du programme
- une **bibliothèque personnelle** : l'utilisateur peut téléverser sa propre copie achetée (PDF), stockée de façon privée et visible uniquement par lui


## Authentification et données

- Activation de Lovable Cloud, puis connexion Google et Apple gérées par Lovable (e-mail/mot de passe conservé comme option).
- Table `profiles` (nom affiché, avatar) créée automatiquement à l'inscription.
- Table `study_plans` : utilisateur, date de début, date d'examen, jours travaillés, séances par jour — un planning par utilisateur.
- Table `module_progress` : utilisateur, module, terminé, score auto-évalué, date — accessible uniquement à son propriétaire.
- Stockage privé (bucket `iso-library`) pour les PDF téléversés par l'utilisateur, accès limité à son propre dossier.
- Le contenu pédagogique reste un fichier statique dans l'application (pas de base de données) : plus rapide, disponible hors connexion partielle.

## Design

Direction sobre et professionnelle « qualité / audit » : fond clair sablé, accent bleu profond + touche ambre pour la progression, typographie à empattement pour les titres et sans-serif lisible pour les longs textes de cours. Tout en jetons de design (mode clair et sombre).

## Détails techniques

- Contenu importé dans `src/data/program.ts` (typé) depuis le JSON fourni ; `dayLabel` conservé en libellé d'origine mais la date affichée est calculée depuis le planning.
- Calcul du calendrier dans un module pur `src/lib/schedule.ts` (répartition des modules sur les jours ouvrés choisis, regroupement ou jours de révision selon la durée).
- Routes TanStack : `/`, `/auth`, `/references`, `/glossaire`, `/annexes` publiques ; pages protégées sous `_authenticated/` (planning, dashboard, séance, bibliothèque personnelle).
- Rendu markdown via `react-markdown` + `remark-gfm`.
- Planning et progression lus/écrits via le client Supabase du navigateur avec RLS `auth.uid()`, mise en cache par TanStack Query.
- Métadonnées SEO propres par page (titre, description, og/twitter).
