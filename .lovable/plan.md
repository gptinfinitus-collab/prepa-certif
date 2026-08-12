# PREPA CERTIF en anglais — application bilingue FR / EN

Objectif : rendre toute l'application disponible en anglais, avec un sélecteur de langue FR/EN, et aligner le contenu ISO 45001 sur la terminologie officielle de la version anglaise (ISO 45001:2018 EN que vous venez de téléverser).

## Ce que vous verrez

- Un sélecteur de langue (FR / EN) dans la barre latérale et sur la page de connexion, mémorisé sur votre profil : la langue vous suit sur tous vos appareils.
- Toute l'interface traduite : navigation, tableau de bord, quiz, flashcards, planning, journal CPD, liens utiles, paramètres, administration.
- Le cours traduit : séances ISO 45001 et squelettes des autres référentiels (9001, 14001, 27001, 19011…), blocs pédagogiques (Understand / Example / Auditor's eye / Exam point / Scenario / Key takeaway / Quiz), quiz, flashcards, glossaire, annexes et résumés de chapitre.
- La terminologie anglaise officielle : « OH&S management system », « injury and ill health », « worker », « interested party », « nonconformity », « documented information », etc.
- Les pages légales (CGU, confidentialité, cookies, mentions légales) et les e-mails d'authentification en version anglaise.
- L'assistant IA qui répond dans votre langue et cite les chapitres avec les intitulés anglais quand vous êtes en EN.
- Le PDF ISO 45001:2018 (EN) ajouté à votre bibliothèque de documents comme source pour l'assistant (usage privé, pas de reproduction du texte normatif dans les pages du site).

## Découpage en étapes

**Étape 1 — Socle d'internationalisation**
Mise en place du système de langue : détection (profil > localStorage > navigateur), provider React, attribut `lang` du document, persistance dans le profil utilisateur, sélecteur FR/EN. Aucun texte encore traduit à ce stade.

**Étape 2 — Interface**
Extraction de toutes les chaînes de l'interface vers des dictionnaires FR et EN : navigation, écrans authentifiés, onboarding, quiz, CPD, liens utiles, paramètres, admin, messages d'erreur et toasts.

**Étape 3 — Contenu pédagogique**
Version anglaise des données de cours : ISO 45001 rédigé, squelettes HLS des autres normes, méthodologie d'audit, module Lead Auditor, glossaire, annexes, examen blanc. Terminologie alignée sur ISO 45001:2018 EN et ISO 19011.

**Étape 4 — Légal, e-mails, SEO**
Pages légales bilingues, modèles d'e-mails d'authentification en anglais (langue choisie par l'utilisateur), métadonnées de page localisées, balises `hreflang`, sitemap mis à jour.

**Étape 5 — Assistant IA et document ISO EN**
Prompt système et réponses dans la langue active, historique inchangé. Téléversement du PDF ISO 45001:2018 EN dans la bibliothèque pour l'assistant.

**Étape 6 — Vérification**
Tests unitaires de complétude des dictionnaires (aucune clé manquante dans une langue), tests de terminologie anglaise, parcours end-to-end en EN, relecture visuelle des écrans clés.

## Détails techniques

- **Librairie** : `i18next` + `react-i18next`, initialisée dans `src/router.tsx` avec la locale résolue côté serveur pour éviter tout décalage d'hydratation. Namespaces : `common`, `nav`, `auth`, `course`, `quiz`, `cpd`, `legal`, `admin`.
- **Fichiers** : `src/i18n/index.ts` (init), `src/i18n/locales/fr/*.json`, `src/i18n/locales/en/*.json`. Un test Vitest compare les jeux de clés FR/EN.
- **Persistance** : colonne `locale` (`text`, défaut `'fr'`) ajoutée à la table de profils par migration ; fallback `localStorage` avant authentification.
- **Contenu de cours** : les modules `src/data/*.ts` deviennent des fabriques prenant la locale. Structure `src/data/content/fr/*` et `src/data/content/en/*` avec des types partagés inchangés (`ClauseSpec`, `ProgramModule`, `GlossaryEntry`), `src/lib/curriculum.ts` sélectionnant la variante. Les identifiants de module et de chapitre restent stables pour ne pas casser la progression, l'historique de quiz ni les flashcards existants.
- **Terminologie EN** : source d'autorité = ISO 45001:2018 (EN) pour les intitulés de chapitres et les termes définis, ISO 19011 pour l'audit, ISO/IEC 17021-1 pour la certification tierce partie. Aucune reproduction verbatim du texte normatif ; uniquement intitulés, termes définis et reformulations pédagogiques. Un test étend `tests/unit/terminology.test.ts` au vocabulaire anglais.
- **E-mails** : `src/lib/email-templates/*` paramétrés par locale, langue lue depuis les métadonnées utilisateur dans `src/routes/lovable/email/auth/webhook.ts`, `lang`/`dir` du `<Html>` adaptés, aperçu bilingue.
- **SEO** : `head()` de chaque route génère titre et description dans la langue active, `og:locale` / `og:locale:alternate`, `hreflang` FR/EN pointant sur la même URL canonique (une seule arborescence d'URL, pas de préfixe `/en`). Si vous préférez des URLs distinctes `/en/...`, c'est une évolution séparée.
- **Assistant IA** : `src/lib/chat.server.ts` reçoit la locale, le prompt système impose la langue de réponse ; le RAG reste multilingue (documents FR et EN interrogeables ensemble).
- **Document ISO EN** : stocké dans le bucket documents existant via l'outil d'upload, indexé comme les autres documents de bibliothèque.

## Hors périmètre

- Autres langues que FR et EN.
- URLs localisées (`/en/...`).
- Traduction automatique des documents que vous avez déjà déposés dans la bibliothèque.
