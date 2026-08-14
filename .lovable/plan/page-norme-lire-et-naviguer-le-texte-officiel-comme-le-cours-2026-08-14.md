# Page « Norme » — lire et naviguer le texte officiel comme le cours

Une nouvelle page **Norme** affiche le texte officiel de la certification active (ISO 45001, 9001, 19011…), importé depuis un PDF que vous fournissez, avec la même expérience de lecture que le cours SGS.

## Ce que vous obtenez

- Entrée **Norme** dans la sidebar (groupe « Contenu »), juste après « Cours SGS ».
- Page d'accueil de la norme : titre, référence, progression de lecture, bouton « Commencer » / « Reprendre où j'en étais », sommaire par chapitre (4 à 10, annexes).
- Lecture séquentielle : une page/section à la fois, numéro de page d'origine, boutons Précédent / Suivant, marquage automatique comme lu.
- **Recherche plein texte** avec extraits et surlignage ; un clic ouvre la section au bon endroit avec le terme surligné.
- Bouton « Demander à l'Assistant IA » sur chaque section, qui envoie la section en contexte.
- Bascule automatique de contenu quand vous changez de certification active. Si aucune norme n'est importée pour la certification, la page l'indique et propose l'import.

## Import du texte officiel

- Zone d'import réservée : vous déposez le PDF de la norme, il est extrait page par page (mêmes outils que le cours SGS : `unpdf` + nettoyage des filigranes/en-têtes/pieds), découpé par chapitre à partir des numérotations (4.1, 4.2, …) et enregistré.
- Le contenu importé reste **privé à votre compte** (texte ISO sous droits) : jamais visible par les autres utilisateurs, jamais publié.
- Un rappel de droits d'auteur discret est affiché en bas de chaque page.

Pour la mise en route, fournissez le PDF de la norme à importer (ISO 45001 en premier) ; sans PDF, la page s'affiche avec son état vide et le bouton d'import.

## Découpage

1. Base de données + import (stockage privé, extraction, découpage en sections)
2. Page Norme : sommaire, lecture séquentielle, progression
3. Recherche plein texte + surlignage
4. Lien Assistant IA, indexation RAG, textes FR/EN
5. Tests unitaires (découpage, recherche) et e2e (navigation)

## Détails techniques

- Tables : `standard_documents` (certification_id, owner_id, titre, référence, langue, statut d'import) et `standard_sections` (document_id, order, page, chapter, clause, title, markdown, `search_vector tsvector` en `french`/`english`), plus `user_standard_progress` (section courante, sections lues). GRANT explicites + RLS scopées sur `auth.uid()` sur les trois tables.
- Stockage du PDF source dans un bucket privé `standards` (chemin `{user_id}/{certification_code}.pdf`), politiques limitées au propriétaire.
- Import : serverFn `importStandardDocument` (`src/lib/standard-doc.functions.ts` + `standard-doc.server.ts`) qui lit le PDF depuis le bucket, applique `stripWatermarks`, détecte les titres de chapitre/clause, insère les sections en lot. Pas de seed au chargement de page.
- Recherche : index GIN sur `search_vector`, fonction `search_standard_sections(document_id, query)` en `security definer` filtrée sur le propriétaire, `ts_headline` pour les extraits.
- Routes `src/routes/_authenticated/norme.index.tsx` et `norme.$sectionId.tsx`, calquées sur `cours.index.tsx` / `cours.$sectionId.tsx` (réutilisation de `MarkdownView`, `CourseProgressBar`, `highlightParts`, `Sheet` du sommaire mobile), avec `head()` propre et responsive mobile/tablette.
- Hooks dans `src/lib/standard-doc.ts` (React Query), miroir de `src/lib/manual.ts` ; certification active via `useActiveCertification()`.
- Indexation RAG : les sections importées sont découpées via `chunkText` + `embedTexts` dans `document_chunks` pour que l'Assistant IA cite la norme.
- i18n : nouveau namespace `standardDoc` dans `src/i18n/locales/{fr,en}/`, entrée `nav.standard`, parité vérifiée par `tests/unit/i18n-parity.test.ts`.
