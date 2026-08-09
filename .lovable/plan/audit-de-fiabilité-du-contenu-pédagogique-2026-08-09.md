# Audit de fiabilité du contenu pédagogique

Objectif : vérifier que tout le contenu de cours de PREPA CERTIF est exact, à jour et cohérent avec les normes ISO officielles, puis livrer un rapport d'écarts avant toute correction.

## Périmètre exact

| Source | Volume |
| --- | --- |
| `src/data/program.json` — cursus ISO 45001 rédigé | 21 modules, 100 questions de quiz, 27 termes de glossaire |
| `src/data/program.json` — annexes | plan d'audit, fiche NC, checklist, fiches de révision, examen blanc (20 QCM) |
| `src/data/lesson-extras.ts` | extras pédagogiques ISO 45001 (exemple, regard auditeur, point examen, mise en situation) |
| `src/data/standards.ts` | squelettes HLS de 9001, 14001, 27001, 22000 (chapitres 4 à 10 + annexes/domaines) |
| `src/data/standard-extras.ts` | extras par chapitre et par norme + extras de méthodologie |
| `src/data/lead-auditor.ts` | 6 modules Lead Auditor (processus d'audit, ISO 19011, profils PECB / CQI-IRCA) |
| `src/data/curriculum.ts` | assemblage des cursus, rattachement des extras, références |

## Méthode de vérification

Chaque affirmation vérifiable est confrontée à deux sources :

1. **Textes ISO indexés dans l'application** — les documents que vous avez téléversés (ISO 45001:2018, supports de cours) sont déjà découpés en extraits dans la base. Interrogation directe des extraits pour confronter la numérotation des chapitres, les termes définis et les exigences citées.
2. **Sources publiques** — recherche web sur les pages officielles ISO, les structures HLS publiées (Annexe SL / Appendice 2 des directives ISO), ISO 19011:2018, et les schémas d'examen PECB et CQI/IRCA, pour tout ce qui n'est pas couvert par les documents indexés (notamment 9001, 14001, 27001:2022, 22000).

Un écart n'est retenu que s'il est confirmé par au moins une source citable.

## Grille de contrôle

Pour chaque élément de contenu :

- **Numérotation et intitulés de chapitres** — libellés exacts, sous-chapitres réellement existants (ex. 27001:2022 a 93 mesures en Annexe A réparties en 4 thèmes, plus les 114 mesures / 14 domaines de la version 2013).
- **Exactitude des exigences** — pas d'exigence inventée, pas d'exigence attribuée au mauvais chapitre, distinction « exigence » / « bonne pratique ».
- **Vocabulaire normatif** — usage correct de *doit* / *devrait*, « informations documentées » et non « procédures/enregistrements », termes définis conformes au chapitre 3 de chaque norme.
- **Millésimes** — cohérence des versions annoncées (45001:2018, 9001:2015, 14001:2015, 27001:2022, 22000:2018, 19011:2018) partout dans l'app, y compris libellés d'interface et références.
- **Quiz et examen blanc** — chaque réponse est vérifiée contre la norme ; les questions ambiguës ou à réponse multiple implicite sont signalées.
- **Glossaire** — définitions conformes aux définitions normatives, pas de paraphrase fausse.
- **Contenu Lead Auditor** — conformité à ISO 19011:2018 (principes, cycle PDCA du programme d'audit, types de constats, classification des NC) et exactitude des affirmations sur les examens PECB / CQI-IRCA (durée, format, prérequis) — toute donnée d'examen non confirmable publiquement sera signalée comme à retirer ou à neutraliser.
- **Cohérence interne** — un même concept n'est pas défini différemment entre `program.json`, les extras et les squelettes HLS ; le générateur HLS ne produit pas d'exigences inapplicables à une norme donnée.
- **Droit d'auteur** — vérification qu'aucun passage ne reproduit littéralement un texte ISO protégé au-delà de la citation courte, et que la mention de non-reproduction est présente.

## Livrable : le rapport

Un fichier `docs/audit-contenu.md` versionné dans le projet, structuré ainsi :

- Synthèse : nombre d'éléments contrôlés, nombre d'écarts par gravité.
- Tableau des écarts, une ligne par écart : `fichier:ligne` · élément concerné · ce qui est écrit · ce qui est exact · source de vérification · gravité.
- Gravités : **Critique** (fausse une réponse d'examen ou inverse une exigence), **Majeur** (imprécision qui induit en erreur), **Mineur** (formulation, millésime, typographie normative).
- Une section « corrections proposées » avec le texte de remplacement exact prêt à appliquer.

Aucune modification du contenu de cours ne sera faite à cette étape : vous validerez le rapport, puis j'appliquerai les corrections retenues dans un second passage.

## Déroulé technique

1. Extraction de l'ensemble du contenu en un corpus contrôlable (script de lecture, sans modification des fichiers source).
2. Interrogation des extraits ISO indexés en base pour les points couverts par vos documents.
3. Recherches web ciblées, par norme, pour les points non couverts (structures de chapitres, versions, schémas d'examen).
4. Contrôle des quiz : chaque paire question/réponse vérifiée individuellement.
5. Contrôles de cohérence automatisés (millésimes, numérotation, vocabulaire normatif) via des tests unitaires ajoutés à `tests/unit/` afin que les régressions futures soient détectées.
6. Rédaction du rapport et récapitulatif en fin de tâche.

Les vérifications les plus volumineuses (quiz, extras des cinq normes) seront réparties sur plusieurs analyses menées en parallèle pour limiter la durée et le coût.
