# Nettoyage des filigranes avant indexation IA

## Constat

Le PDF téléversé est une version « preview » qui contient un filigrane répété (« iTeh STANDARD PREVIEW », « standards.iteh.ai », URL du catalogue, référence de la norme). Aujourd'hui l'extraction de texte (`src/lib/rag.server.ts`) prend tout le texte du PDF tel quel : ces lignes parasites se retrouvent dans les segments indexés et polluent les réponses de l'IA (bruit, citations inutiles, extraits pertinents évincés).

Deux limites à savoir :
- On ne modifie pas le fichier PDF stocké (le filigrane restera visible à l'ouverture) ; on nettoie le **texte indexé**, c'est ce que lit l'IA.
- Si le PDF est un extrait de prévisualisation, seules quelques pages contiennent réellement la norme : le nettoyage améliore la qualité mais ne peut pas restituer un contenu absent du fichier.

## Ce qui sera fait

1. **Filtre de filigranes à l'extraction** (`src/lib/rag.server.ts`)
   - Suppression, ligne par ligne, des motifs de filigrane courants : `iTeh`, `STANDARD PREVIEW`, `standards.iteh.ai`, `https://standards.iteh.ai/...`, `(preview)`, ainsi que les répétitions d'URL de catalogue.
   - Détection générique des lignes **récurrentes** : toute ligne courte identique répétée sur une large proportion des pages (en-têtes, pieds de page, mentions « Document preview », numéros de page isolés) est retirée automatiquement — utile pour d'autres éditeurs que iTeh.
   - Normalisation : fusion des césures de fin de ligne, suppression des lignes vides multiples.

2. **Segmentation plus propre** (`chunkText`)
   - Rejet des segments qui, après nettoyage, ne contiennent plus de contenu utile (trop courts ou uniquement du bruit).

3. **Retour utilisateur dans la bibliothèque** (`src/routes/_authenticated/bibliotheque.tsx`)
   - Après analyse, affichage du nombre de segments indexés et mention « filigrane détecté et retiré » quand le filtre a supprimé des lignes récurrentes.
   - Avertissement si le document semble être une prévisualisation (peu de pages exploitables), pour inviter à téléverser la version complète.

4. **Réindexation**
   - Le bouton « Réindexer » existant relance l'analyse avec le nouveau filtre ; les anciens segments sont remplacés (comportement déjà en place).

## Détails techniques

- Nouvelle fonction `stripWatermarks(pages: string[]): string` dans `rag.server.ts`, appliquée avant `chunkText`. Extraction PDF passée en `mergePages: false` pour raisonner page par page et détecter les lignes récurrentes.
- `ingestDocument` (`src/lib/ai.functions.ts`) renvoie en plus `{ removedLines, pageCount }` pour l'affichage.
- Tests unitaires sur `stripWatermarks` (filigrane iTeh, en-tête répété, texte légitime conservé) dans `tests/unit/`.
