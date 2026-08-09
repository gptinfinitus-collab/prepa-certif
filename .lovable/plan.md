# Corrections post-audit — référentiels arbitrés, puis priorités 2, 3 et 4

## Règles de référence (prévalent sur `docs/audit-contenu.md`)

| Domaine | Référence retenue |
|---|---|
| Exigences S&ST | ISO 45001:2018 + Amd 1:2024 (ISO/DIS 45001 uniquement cité comme révision en cours) |
| Lignes directrices d'audit | ISO 19011:2026 (2018 seulement en mention historique explicite) |
| Certification tierce partie | ISO/IEC 17021-1 (étapes 1 / 2, classification majeure–mineure) |

Aucune exigence de certification ne doit être attribuée à ISO 19011, et aucune ligne directrice ISO 19011 ne doit être présentée comme exigence ISO 45001.

---

## Phase 0 — Socle de traçabilité normative

Avant de toucher au contenu, on ajoute au modèle de données les champs qui permettront de tester et d'afficher la source de chaque affirmation.

- `src/data/program.ts` : étendre les types de module, de quiz et de glossaire avec `standardRef`, `standardEdition`, `clauseRef`, `referenceType`, `verifiedAt`, `reviewStatus` — tous optionnels pour ne pas casser l'existant.
- `referenceType` : `REQUIREMENT` | `GUIDANCE` | `CERTIFICATION_RULE` | `GOOD_PRACTICE` | `PEDAGOGICAL_EXAMPLE`.
- `reviewStatus` : `DRAFT` | `NEEDS_VERIFICATION` | `VERIFIED`.
- Les contenus corrigés dans les phases suivantes sont renseignés en `VERIFIED`; les contenus non repris restent implicitement `DRAFT`.

### Badges de provenance (règle UI)

- `src/components/course/LessonBlocks.tsx` : rendre trois badges distincts selon `referenceType` — « Exigence ISO 45001 », « Ligne directrice ISO 19011 », « Certification tierce partie ». Objectif : que l'apprenant n'enregistre jamais une règle de certification comme une exigence de la norme auditée.

---

## Phase 1 — Vérification préalable des références (bloquante)

Deux points ne peuvent pas être corrigés « au fil de l'eau » :

1. **C-5 — référence de clause dans `lead-auditor.ts`.** La référence actuelle « ISO 19011, § 5.5.2 » concerne la désignation du responsable d'équipe d'audit. On identifie d'abord la recommandation visée, puis on retrouve sa localisation dans **ISO 19011:2026** et on écrit cette référence-là. Aucun remplacement automatique par « §5.5.5 » (numérotation de l'édition 2018, retirée).
2. **B-6 — ISO/IEC 27001.** On confirme l'édition utilisée par le cursus (27001:2022) avant d'écrire la surcharge sur le §6.1.2.

Si une référence 2026 ne peut pas être établie avec certitude, l'affirmation est reformulée sans numéro de clause et marquée `NEEDS_VERIFICATION` plutôt que datée à tort.

---

## Phase 2 — Corrections majeures de contenu

### 2.1 Politique S&ST — cinq engagements (A-3)
`src/data/program.json`, module 4 + corrigés M4 Q1 et M6 Q4. Chaque engagement du §5.2 est **expliqué séparément**, sans recopie de passages normatifs :

1. Conditions de travail sûres et saines → lien avec la prévention des traumatismes et pathologies liés au travail.
2. Exigences légales et autres exigences → disposer d'une liste ne suffit pas, l'organisme doit comprendre ce qui lui est applicable.
3. Élimination des dangers et réduction des risques → lien explicite avec la hiérarchie des mesures de prévention.
4. Amélioration continue du SMS&ST → ne pas réduire à la baisse du nombre d'accidents.
5. Consultation et participation des travailleurs → distinction illustrée par des exemples concrets.

### 2.2 Exigences légales : §6.1.3 ≠ §9.1.2 (A-4)
`src/data/program.json`, module 5 + corrigé M5 Q3.

- **§6.1.3** : déterminer les exigences applicables, pouvoir y accéder, déterminer comment elles s'appliquent, les prendre en compte dans le système, maintenir l'information à jour.
- **§9.1.2** : définir un processus d'évaluation de conformité, en fixer la fréquence et les méthodes, évaluer le statut, traiter les résultats, maintenir la connaissance du statut.
- Avertissement d'examen ajouté : *une veille réglementaire bien tenue ne démontre pas à elle seule la conformité de l'organisme.*

### 2.3 Terminologie ISO 45001 (A-1, A-2, A-5, A-6)
`src/data/program.json` (glossaire global + glossaire du module 2) :

- « Risque » scindé en **Risque** et **Risque pour la S&ST**, avec la distinction explicitée.
- « Incident » → **Événement indésirable** comme terme principal, mention « anciennement appelé incident ».
- « Danger » → défini par **traumatisme et pathologie**, jamais par « blessure » seule.
- « Hiérarchie des mesures de maîtrise » → **Hiérarchie des mesures de prévention**, cinq niveaux : élimination, substitution, mesures techniques, mesures administratives et réorganisation du travail, EPI.

### 2.4 Principe d'intégrité, aligné 2026 (C-1)
`src/data/lead-auditor.ts`, `src/data/curriculum.ts`, `src/data/standard-extras.ts` : « déontologie » → « **intégrité** », et la section des principes d'audit est rattachée à **ISO 19011:2026** (métadonnées et texte), pas à l'édition 2018.

### 2.5 Classification des non-conformités (C-2)
`src/data/lead-auditor.ts`, `src/data/lesson-extras.ts`, fiche NC : la distinction majeure / mineure est présentée comme une **règle du processus de certification tierce partie** (ISO/IEC 17021-1), explicitement pas comme une classification générale imposée par ISO 19011. Contenus marqués `referenceType: CERTIFICATION_RULE`.

### 2.6 Audit d'étape 1 (C-3)
`src/data/program.json`, examen blanc : le contenu pédagogique est conservé mais rattaché à ISO/IEC 17021-1. L'étape 1 couvre la revue documentaire **et** l'évaluation de la préparation de l'audité (compréhension des exigences, périmètre, sites, ressources, exigences légales identifiées) en vue de planifier l'étape 2. Aucune formulation ne laisse entendre qu'ISO 19011 crée les étapes 1 et 2.

### 2.7 Plan d'audit (C-4)
`src/data/program.json`, `auditPlanTemplate` : ajout du champ « Objectifs de l'audit », distinct du périmètre et des critères.

### 2.8 ISO/IEC 27001 — appréciation des risques (B-6)
`src/data/standard-extras.ts` : surcharge du chapitre 6 neutralisant le point examen générique — le §6.1.2 impose un processus défini (critères d'acceptation du risque, critères de réalisation, propriétaires de risques, résultats cohérents, valides et comparables), après confirmation de l'édition en Phase 1.

### 2.9 ISO 22000 — chapitre 8 (B-7)
`src/data/standard-extras.ts` : ajout du §8.3 Système de traçabilité et du §8.4 Préparation et réponse aux situations d'urgence dans la surcharge pédagogique.

### 2.10 ISO 13485 — chapitre 5 (B-8)
`src/data/standard-extras.ts` : contenu du chapitre 5 réécrit en « Responsabilité de la direction », sans exigence HLS de politique adossée aux enjeux stratégiques.

---

## Phase 3 — Structure éditoriale

- **`dayLabel` (D-1)** — `src/data/program.json` : les 21 dates calendaires figées deviennent « Séance N », cohérent avec les autres cursus et la durée de préparation configurable.
- **Métadonnées (D-2, D-3)** — suppression de `candidateExample` et `trainingExample` du JSON et du type `ProgramMeta`; titre du cursus : « Préparation ISO 45001:2018 — Audit du système de management de la S&ST ».

### Base documentaire : remplacement de la correction D-6

L'ancienne proposition (retrait des filigranes) est **abandonnée**. À la place :

- Aucune fonctionnalité de suppression ou de masquage des filigranes et mentions de copyright ISO / iTeh.
- Aucune indexation automatique du texte intégral de normes protégées sans vérification que la licence de l'utilisateur autorise cet usage.
- Priorité d'indexation RAG donnée aux **contenus pédagogiques originaux de PREPA CERTIF** : cours, résumés, explications, glossaire, exemples, quiz, cas pratiques, annexes.
- Conservation et affichage des informations de provenance, version, pagination et statut des documents de référence autorisés.
- Badge « **Document partiel** » dans la bibliothèque lorsqu'une source autorisée n'est qu'un extrait.

Fichiers concernés : `src/lib/rag.server.ts`, `src/routes/_authenticated/bibliotheque.tsx`.

---

## Phase 4 — Vocabulaire et finitions

- « SST » → « **S&ST** » (38 occurrences), « blessure » → « traumatisme et pathologie » (3), « procédure » → « information documentée » quand il s'agit d'une exigence normative (17 occurrences triées une à une).
- Glossaire complété par les 8 termes normatifs manquants : événement indésirable, traumatismes et pathologies, information documentée, intervenant extérieur, lieu de travail, effectivité/efficacité, direction, performance.
- Examen blanc : les 2 réponses réduites à un numéro de chapitre reçoivent un libellé complet; les 5 questions dupliquées sont marquées comme questions de révision pour ne pas fausser les statistiques de maîtrise.
- Les questions normatives sont enrichies de `standardRef` / `clauseRef` / `referenceType`, et au moins une question par bloc teste la **source** de l'exigence, pas seulement son contenu.

---

## Phase 5 — Tests

Tous les tests de non-régression existants sont conservés (92 unitaires, 14 E2E). Nouveaux tests dans `tests/unit/` :

1. Aucune occurrence pédagogique active d'« ISO 19011:2018 » présentée comme l'édition en vigueur.
2. Les étapes 1 et 2 ne sont jamais attribuées à ISO 19011.
3. Aucune définition de « danger » reposant uniquement sur « blessure ».
4. « Risque » et « Risque pour la S&ST » restent deux entrées distinctes.
5. Aucune confusion §6.1.3 / §9.1.2 : l'évaluation de conformité n'est jamais rattachée au chapitre 6.
6. Les cinq engagements de la politique S&ST sont tous couverts par le module 4.
7. Aucun code de suppression automatique de filigranes de documents normatifs.
8. Chaque question marquée normative porte `standardRef`, `clauseRef` et `referenceType` valides.

---

## Phase 6 — Livrable

Mise à jour de `docs/audit-contenu.md` : écarts corrigés marqués, compteurs ajustés, section dédiée expliquant les arbitrages de référentiel (ISO 19011:2026, Amd 1:2024, ISO/IEC 17021-1) et le remplacement de la correction D-6. Récapitulatif final des corrections appliquées et de celles restées en `NEEDS_VERIFICATION`.

---

## Note technique

Les changements sont concentrés dans les données (`src/data/*`), avec deux extensions légères côté présentation (badges de provenance dans le lecteur de cours, badge « Document partiel » dans la bibliothèque) et une révision de la politique d'indexation RAG. Aucune migration de base de données n'est nécessaire : les nouveaux champs de traçabilité vivent dans le contenu embarqué.
