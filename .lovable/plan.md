# Évolution PREPA IRCA 45001 : Quiz IA, chat IA, documents de cours, nouvelle identité

## Étape 1 — Nettoyage du discours « 21 séances » + nouvelle typographie

- Suppression de toute mention d'un nombre fixe de séances (accueil, dashboard, planning, méta-descriptions). Le programme est présenté comme une bibliothèque de modules que chacun répartit dans son propre planning.
- Typographie corporate : **IBM Plex Serif** pour les titres et **IBM Plex Sans** pour le texte (sérieux, normatif, très lisible, excellent en mode sombre). Chargement via `<link>` dans la route racine, tokens `--font-display` / `--font-body` mis à jour.

## Étape 2 — Navigation : Quiz à la place de Profil, avatar en haut à droite

- Barre mobile : Accueil, Planning, Références, Docs, **Quiz**.
- **Avatar rond en haut à droite** (mobile et desktop) : menu déroulant → Profil, Paramètres, bascule mode sombre, Déconnexion.
- La carte profil du bas de la sidebar desktop est allégée (l'avatar en haut devient le point d'entrée principal), lien Quiz ajouté à la sidebar.

## Étape 3 — Docs : documents de cours + indexation

- La page Docs accepte deux catégories : **Normes personnelles** et **Documents de cours** (supports, notes, PDF de formation).
- Chaque document est enregistré en base (titre, catégorie, chemin, statut d'indexation) et son texte est extrait puis découpé en passages vectorisés pour servir de base de connaissances à l'IA (RAG).
- Indicateur d'état par document : en attente / indexé / erreur, avec possibilité de relancer.

## Étape 4 — Page Quiz IA

- Nouvelle page `/quiz` : génération d'entraînements par l'IA à partir de vos documents et du programme (choix du chapitre ISO, du nombre de questions, du format QCM ou question ouverte).
- Correction commentée avec référence à la clause concernée.
- **Analyse du niveau de préparation** : score par chapitre, points faibles, recommandation de révision, historique des sessions.

## Étape 5 — Page Conversation IA

- Nouvelle page `/assistant` : chat en streaming avec l'IA, réponses appuyées sur vos documents indexés et le programme, avec citation des sources utilisées.
- Historique de conversation conservé, possibilité d'ouvrir un nouveau fil.

## Étape 6 — Finitions

- Cohérence visuelle sur toutes les pages avec la nouvelle typographie, vérification du contraste bleu nuit, métadonnées propres pour les deux nouvelles pages.

## Détails techniques

- Base de données : tables `documents` (titre, catégorie, chemin de stockage, statut), `document_chunks` (contenu + embedding pgvector), `quiz_sessions` / `quiz_answers`, `chat_threads` / `chat_messages` — toutes en RLS stricte par utilisateur, avec GRANTs.
- Stockage : le bucket privé `iso-library` accueille aussi les documents de cours (dossier par utilisateur).
- IA : Lovable AI Gateway côté serveur — embeddings pour l'indexation et la recherche sémantique, modèle de chat pour le quiz et l'assistant. Génération de quiz et analyse en sortie structurée.
- Extraction de texte PDF/DOCX faite en compatibilité runtime Worker (bibliothèque JS pure) ; découpage ~1000 caractères avec recouvrement.
- Endpoints : `createServerFn` pour l'indexation, la génération de quiz et l'analyse ; route serveur de streaming pour le chat.
