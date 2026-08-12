# Finir la traduction anglaise : zones encore en français

L'ossature bilingue fonctionne, mais plusieurs couches restent figées en français. Voici ce qui a été constaté dans le code et ce qu'il faut corriger.

## Ce qui reste en français aujourd'hui

1. **Titres d'onglet et métadonnées de page** — chaque route déclare son `head()` en dur en français (`src/routes/references.tsx:12-27`, `src/routes/annexes.tsx:15-26`, `src/routes/reset-password.tsx:22-27`, et les autres routes), donc l'onglet du navigateur, le partage social et le SEO restent français même en EN. `og:locale` est figé à `fr_FR` et `<html lang="fr">` (`src/routes/__root.tsx:106-107,166`).

2. **Décalage d'affichage au chargement** — le rendu serveur produit toujours le français, la langue n'est appliquée qu'après hydratation (`src/i18n/index.tsx:41-77`). Résultat : un flash de français en anglais et une erreur d'hydratation React visible en preview (« Certification preparation » vs « Préparation à la certification »).

3. **Listes et libellés métier codés en français**
   - Niveaux de parcours et avertissements d'examen : `src/lib/tracks.ts:17-65`
   - Types d'activité CPD et en-têtes du CSV exporté : `src/lib/cpd.ts:8-10,173`
   - Formatage de dates verrouillé en `fr-FR` : `src/lib/schedule.ts:112,121`, `src/lib/quiz-history.ts:43`, `src/components/PreparationAnalysis.tsx:187`, `src/routes/_authenticated/admin.tsx`, `src/routes/_authenticated/cpd.tsx`

4. **Messages d'erreur et notifications** — tous les `throw new Error("Non connecté")`, « Session expirée. », « Aucune certification sélectionnée », « Accès refusé. », « Limite de requêtes IA atteinte… » viennent des couches données/serveur en français : `src/lib/queries.ts`, `src/lib/certifications.ts`, `src/lib/cpd.ts`, `src/lib/useful-links.ts`, `src/lib/threads.ts`, `src/lib/admin.functions.ts`, `src/lib/rag.server.ts`, `src/lib/chat.server.ts`.

5. **Évaluation IA des flashcards** — le prompt d'évaluation est uniquement en français (`src/lib/flashcards.functions.ts:31-38`), donc les corrections renvoyées à un utilisateur anglophone sont en français.

Vérifié comme déjà bilingue (aucune action) : pages légales CGU / confidentialité / cookies / mentions légales, contenu pédagogique (`src/data/*.en.*`), assistant IA et générateurs de quiz.

## Ce qui sera fait

**Étape 1 — Langue résolue avant le rendu**
Résoudre la langue côté serveur (cookie de langue écrit en même temps que le localStorage) pour que la première peinture soit déjà dans la bonne langue, avec `<html lang>` et `og:locale` cohérents. Supprime le flash de français et l'erreur d'hydratation.

**Étape 2 — Métadonnées de page localisées**
Chaque route reçoit titre, description, `og:title`/`og:description` dans la langue active, plus `og:locale` / `og:locale:alternate` et `hreflang` corrects.

**Étape 3 — Libellés métier**
Parcours (Maîtrise / Auditeur interne / Lead Auditor), avertissements d'examen, types d'activité CPD et en-têtes CSV passent par des variantes FR/EN ; toutes les dates et tris utilisent la locale active au lieu de `fr-FR`.

**Étape 4 — Erreurs et notifications**
Les couches données renvoient des codes d'erreur stables, traduits à l'affichage ; les messages serveur (IA, admin) reçoivent la langue de l'appelant.

**Étape 5 — Corrections IA des flashcards**
Le prompt d'évaluation prend la langue en paramètre, comme l'assistant et le générateur de quiz.

**Étape 6 — Vérification**
Test automatique de parité des clés FR/EN, test anti-régression interdisant `fr-FR` en dur et les chaînes françaises dans l'UI, parcours complet de l'app en anglais (navigation, séance, quiz, CPD, admin, partage) avec relecture visuelle.

## Détails techniques

- Cookie `locale` lu dans le contexte du routeur et injecté dans `i18n` avant le premier rendu ; `useLocale().setLocale` écrit cookie + localStorage + profil.
- `head()` : helper partagé prenant `(locale, key)` et lisant les namespaces `seo` (nouveaux fichiers `src/i18n/locales/{fr,en}/seo.json`).
- Dates : helper `formatDate(date, locale)` centralisé dans `src/lib/utils.ts`, remplaçant tous les `toLocaleDateString("fr-FR", …)`.
- Erreurs : constantes typées (`ERR.NOT_SIGNED_IN`, `ERR.NO_CERTIFICATION`, `ERR.AI_RATE_LIMIT`…) traduites via le namespace `common.errors` au point d'affichage (toasts / boundaries).
- Serveur : `flashcards.functions.ts` reçoit `locale` via son `inputValidator`, sur le modèle de `ai.functions.ts`.
- Identifiants de modules, de chapitres et de types CPD stockés en base restent inchangés : seules les étiquettes affichées sont traduites, aucune migration de données.

## Hors périmètre

- Traduction des documents déjà déposés par les utilisateurs dans la bibliothèque.
- URLs localisées (`/en/...`).
- Autres langues que FR et EN.
