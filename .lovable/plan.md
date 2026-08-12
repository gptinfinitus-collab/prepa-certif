# Cours SGS ISO 45001 — lecteur intégral et recherche

Le guide stagiaire SGS (244 pages, CQI/IRCA 1910 – PR 357, FR) devient une section « Cours » navigable dans l'app, fidèle au document, avec recherche par mots-clés.

## Ce que vous obtenez

- Une nouvelle page **Cours (SGS)** dans la navigation.
- Le sommaire réel du document à gauche : Administration, Première séance, Deuxième séance, … chaque séance dépliable vers ses pages/titres.
- Lecture page par page, exactement dans l'ordre du PDF, avec numéro de page d'origine affiché, boutons Précédent / Suivant et « Reprendre où j'en étais ».
- **Recherche** en haut : mots-clés ou expression exacte, résultats classés avec extrait et surlignage, clic = ouverture à la bonne page avec le terme surligné.
- Sur chaque page : bouton « Demander à l'Assistant IA » qui envoie le contenu de la page en contexte, plus favori et note personnelle (mêmes mécaniques que les séances existantes).
- Le contenu reste privé à votre compte (matériel SGS sous droits) : visible seulement pour l'utilisateur propriétaire, pas publié aux autres comptes.

## Fidélité au document

L'extraction reprend le texte page par page, retire les habillages répétés (en-tête « ISO 45001:2018 OH&S MS A/LA TC », pied « LG 17-02-2022 », numéros de page) et conserve titres, listes à puces et tableaux. Les pages issues de diapositives gardent leur mise en forme en listes. Rien n'est réécrit ni résumé.

## Découpage

1. Extraction et structuration du PDF (séances, titres, pages) + import en base
2. Page Cours : sommaire, lecture séquentielle, progression
3. Recherche plein texte avec surlignage et navigation vers le résultat
4. Notes, favoris, lien vers l'Assistant IA, indexation RAG du cours
5. Tests unitaires (structure, recherche) et e2e (navigation, recherche)

## Détails techniques

- Tables `course_manuals` (source, titre, éditeur, langue, propriétaire) et `course_manual_sections` (numéro d'ordre, page d'origine, séance, titre, markdown, `search_vector tsvector` en `french`), plus `user_manual_progress` (section courante, sections lues) et réutilisation des notes/favoris existants. GRANT + RLS scopées sur `auth.uid()` pour chaque table.
- Import : script d'extraction via `unpdf` (déjà utilisé par `src/lib/rag.server.ts`), réutilisant `stripWatermarks`, produisant un JSON de sections inséré par migration/serverFn admin — pas de seed au chargement de page.
- Recherche : index GIN sur `search_vector`, fonction `search_manual_sections(query, manual_id)` en `security definer` respectant le propriétaire, `ts_headline` pour les extraits surlignés.
- Route `src/routes/_authenticated/cours.$sectionId.tsx` + `cours.index.tsx`, composants réutilisés de `src/components/course/` (`SectionNav`, `CourseProgressBar`, `MarkdownView`).
- Indexation RAG : les sections sont aussi découpées via `chunkText` + `embedTexts` dans `document_chunks`, de sorte que l'Assistant IA cite le cours SGS.
- Textes d'interface ajoutés dans `src/i18n/locales/{fr,en}/course.json` ; le contenu du cours reste en français (langue du document).
