# Plateforme multi-certifications + IA (Quiz, Assistant, Documents)

L'application devient une plateforme de préparation à plusieurs certifications ISO, et non plus seulement IRCA ISO 45001. À la connexion, l'utilisateur choisit la certification qu'il prépare ; il peut en suivre plusieurs en parallèle et basculer de l'une à l'autre.

## Étape 1 — Multi-certifications

- **Catalogue** : ISO 9001, 14001, 45001, 27001, 22000, 50001, 13485, 22301, 37001, plus la possibilité de créer une **certification personnalisée** (nom, organisme, description, chapitres).
- **Écran de choix après connexion** : cartes des normes, recherche, indication « cursus complet disponible » ou « préparation libre » selon la norme.
- **Plusieurs cursus en parallèle** : chaque certification a son propre planning, sa progression, ses documents et ses quiz. Un **sélecteur de certification** en haut de l'application permet de basculer ; le choix courant est mémorisé.
- Tout le contenu de l'app (accueil, planning, séances, glossaire, annexes, références) est filtré sur la certification active.
- Le nom du produit et les textes ne parlent plus uniquement d'IRCA 45001 ; ISO 45001 devient un cursus parmi d'autres. Plus aucune mention d'un nombre fixe de séances.

## Étape 2 — Contenu rédigé, norme par norme

- Le cursus **ISO 45001 existant est migré** tel quel comme premier cursus complet.
- Les autres normes démarrent avec leur **squelette officiel** (chapitres 4 à 10, exigences clés, glossaire propre à la norme, références) et sont marquées « cursus en cours de rédaction ».
- Pour une norme sans cursus rédigé : planning libre sur ses chapitres, documents personnels, quiz IA et assistant restent pleinement utilisables.
- L'ajout ultérieur d'un cursus rédigé se fait sans toucher au code (même structure de données que 45001).

## Étape 3 — Nouvelle identité visuelle

- Typographie corporate : **IBM Plex Serif** (titres) + **IBM Plex Sans** (texte) — sérieux, normatif, excellente lisibilité en bleu nuit.
- Chaque certification a une **couleur d'accent** dérivée des tokens du thème (pas de couleur en dur), pour repérer d'un coup d'œil le cursus actif.

## Étape 4 — Navigation : Quiz remplace Profil, avatar en haut à droite

- Barre mobile : Accueil, Planning, Références, Docs, **Quiz**.
- **Avatar rond en haut à droite** (desktop et mobile) : menu Profil, Paramètres, mode sombre, Déconnexion — plus de carte profil en bas de sidebar.
- Sélecteur de certification placé en haut de la sidebar (desktop) et dans l'en-tête (mobile).

## Étape 5 — Documents de cours et base de connaissances (RAG)

- La page Docs accepte deux catégories : **normes personnelles** et **documents de cours**, rattachés à une certification.
- Chaque document est indexé (extraction du texte, découpage, vectorisation) pour servir de base de connaissances à l'IA, avec un statut visible : en attente / indexé / erreur, et relance possible.

## Étape 6 — Quiz IA

- Page `/quiz` : entraînements générés par l'IA à partir de la certification active, de ses chapitres et de vos documents indexés (choix du chapitre, nombre de questions, QCM ou question ouverte).
- Correction commentée avec renvoi à la clause concernée.
- **Analyse du niveau de préparation** : score par chapitre, points faibles, recommandations, historique des sessions — par certification.

## Étape 7 — Assistant conversationnel

- Page `/assistant` : chat en streaming, réponses appuyées sur la norme active et vos documents, avec citation des sources. Fils de conversation conservés par certification.

## Détails techniques

- Base de données : `certifications` (catalogue partagé, en lecture pour tous) + `user_certifications` (cursus suivis, certification active, norme personnalisée), et ajout d'une colonne `certification_id` sur `study_plans`, `module_progress`, ainsi que sur les nouvelles tables `documents`, `document_chunks`, `quiz_sessions`, `quiz_answers`, `chat_threads`, `chat_messages`. RLS stricte par utilisateur + GRANTs sur chaque table.
- Contenu des cursus : `src/data/programs/<code>.json` typés par le même schéma que le programme actuel, chargés via un registre `src/data/certifications.ts` ; les normes sans cursus fournissent uniquement chapitres + glossaire.
- Contexte applicatif : `CertificationProvider` (certification active, persistée en base et en local) consommé par l'AppShell et toutes les pages.
- IA : Lovable AI Gateway côté serveur — embeddings pour l'indexation/recherche sémantique, modèle de chat pour le quiz et l'assistant, sortie structurée pour la génération de quiz et l'analyse.
- Extraction PDF/DOCX compatible runtime Worker (bibliothèque JS pure), découpage ~1000 caractères avec recouvrement.
- Endpoints : `createServerFn` pour indexation, génération de quiz et analyse ; route serveur de streaming pour le chat.
- Migration des données existantes : les plannings et progressions actuels sont rattachés automatiquement au cursus ISO 45001.
