# Corrections post-audit — Priorités 2, 3 et 4

## État actuel

La priorité 1 (structure des normes) est appliquée et verrouillée par 3 tests de non-régression : 92 tests unitaires passent. Il reste **15 écarts majeurs**, **20 mineurs** et quelques ajustements éditoriaux.

## Objectif

Appliquer les corrections restantes du rapport `docs/audit-contenu.md` et mettre à jour le rapport pour marquer les écarts corrigés, en conservant la couverture test existante.

---

## Phase 1 — Corrections majeures de contenu (Priorité 2)

### 1.1 ISO 45001 — Politique S&ST (A-3)
- Fichier : `src/data/program.json`
- Action : dans le module 4 et les réponses du quiz M4 Q1 / M6 Q4, remplacer la liste de 3 engagements par les 5 engagements du §5.2 d'ISO 45001:2018.
- Texte cible : conditions de travail sûres et saines pour la prévention des traumatismes et pathologies liés au travail ; satisfaction aux exigences légales et autres exigences ; élimination des dangers et réduction des risques pour la S&ST ; amélioration continue du système de management de la S&ST ; consultation et participation des travailleurs.

### 1.2 ISO 45001 — Exigences légales (A-4)
- Fichier : `src/data/program.json`
- Action : dans le module 5 et la réponse M5 Q3, préciser que le §6.1.3 porte sur l'identification, l'accès, l'applicabilité et la mise à jour des exigences légales, et que l'évaluation de conformité est une exigence distincte du §9.1.2.

### 1.3 Terminologie ISO 45001 (A-1, A-2, A-5, A-6)
- Fichier : `src/data/program.json` (glossaire du module 2 + glossaire global)
- Actions :
  - « Risque » → scinder en deux entrées : *Risque* (art. 3.20) et *Risque pour la S&ST* (art. 3.21).
  - « Incident » → renommer en « Événement indésirable (art. 3.35) » avec note « anciennement appelé incident ».
  - « Danger » → remplacer « blessure » par « traumatisme et pathologie ».
  - « Hiérarchie des mesures de maîtrise » → renommer « Hiérarchie des mesures de prévention » et énumérer les 5 niveaux.

### 1.4 ISO 19011 — Principe d'intégrité (C-1)
- Fichiers : `src/data/lead-auditor.ts`, `src/data/curriculum.ts`, `src/data/standard-extras.ts`
- Action : remplacer les 3 occurrences de « déontologie » par « intégrité » pour aligner sur ISO 19011:2018 et l'examen blanc.

### 1.5 Classification des non-conformités (C-2)
- Fichiers : `src/data/lead-auditor.ts`, `src/data/lesson-extras.ts`, fiche NC
- Action : ajouter une clarification indiquant que la distinction majeure / mineure ne vient pas d'ISO 19011:2018 mais des schémas de certification (ISO/IEC 17021-1).

### 1.6 Audit d'étape 1 (C-3)
- Fichier : `src/data/program.json` (examen blanc)
- Action : enrichir la réponse sur l'étape 1 pour inclure l'évaluation de la préparation de l'audité (compréhension des exigences, périmètre, sites, ressources, exigences légales identifiées) en vue de planifier l'étape 2.

### 1.7 Plan d'audit (C-4)
- Fichier : `src/data/program.json` (annexe `auditPlanTemplate`)
- Action : insérer « Objectifs de l'audit » en 3e position du modèle de plan.

### 1.8 Référence de clause ISO 19011 (C-5)
- Fichier : `src/data/lead-auditor.ts`
- Action : remplacer « ISO 19011, § 5.5.2 » par « ISO 19011:2018, § 5.5.5 ».

### 1.9 ISO/IEC 27001 — Appréciation des risques (B-6)
- Fichier : `src/data/standard-extras.ts`
- Action : ajouter une surcharge au chapitre 6 d'ISO/IEC 27001 pour préciser que §6.1.2 impose un processus d'appréciation des risques défini (critères d'acceptation, propriétaires, résultats cohérents/valides/comparables).

### 1.10 ISO 22000 — Chapitre 8 (B-7)
- Fichier : `src/data/standard-extras.ts`
- Action : compléter la surcharge du chapitre 8 d'ISO 22000 avec les §8.3 Traçabilité et §8.4 Préparation et réponse aux situations d'urgence.

### 1.11 ISO 13485 — Chapitre 5 (B-8)
- Fichier : `src/data/standard-extras.ts`
- Action : adapter le contenu pédagogique du chapitre 5 pour refléter « Responsabilité de la direction » et l'absence d'exigence HLS de politique stratégique.

---

## Phase 2 — Structure éditoriale (Priorité 3)

### 2.1 `dayLabel` des modules ISO 45001 (D-1)
- Fichier : `src/data/program.json`
- Action : remplacer les 21 dates calendaires figées (« Lundi 20/07 », etc.) par « Séance N » pour cohérence avec les autres cursus et la durée configurable.

### 2.2 Métadonnées du cursus (D-2, D-3)
- Fichier : `src/data/program.json` + `src/data/program.ts`
- Actions :
  - Supprimer `candidateExample` et `trainingExample` du JSON et du type `ProgramMeta`.
  - Retitrer le cursus : « Préparation ISO 45001:2018 — Audit du système de management de la S&ST » (sans mention IRCA).

### 2.3 Base documentaire RAG (D-6)
- Fichiers : `src/lib/rag.server.ts`, interface bibliothèque
- Action : améliorer le filtre de nettoyage à l'indexation pour retirer les filigranes `iTeh STANDARD PREVIEW`, `standards.iteh.ai`, `© ISO 2018 – Tous droits réservés`. Ajouter un indicateur visuel dans la bibliothèque signalant qu'un document indexé est un extrait partiel (comparaison fragments/pages).
- Note : le remplacement du PDF ISO 45001 par la version complète nécessite un téléversement utilisateur ; cette tâche est documentée mais ne dépend pas du code.

---

## Phase 3 — Vocabulaire et finitions (Priorité 4)

### 3.1 Harmonisation terminologique (C18)
- Fichier : `src/data/program.json` principalement
- Actions :
  - Remplacer « SST » par « S&ST » (38 occurrences).
  - Remplacer « blessure » par « traumatisme et pathologie » (3 occurrences).
  - Remplacer « procédure » par « information documentée » lorsqu'il s'agit d'une exigence normative (17 occurrences à trier).

### 3.2 Glossaire ISO 45001 (C19)
- Fichier : `src/data/program.json`
- Action : ajouter les 8 termes normatifs manquants : événement indésirable, traumatismes et pathologies, information documentée, intervenant extérieur, lieu de travail, effectivité/efficacité, direction, performance.

### 3.3 Examen blanc et questions dupliquées (C20)
- Fichier : `src/data/program.json`
- Actions :
  - Compléter les 2 réponses de l'examen blanc réduites à un simple numéro de chapitre.
  - Marquer les 5 questions dupliquées dans les modules de révision comme questions de révision pour ne pas fausser les statistiques de maîtrise.

---

## Phase 4 — Vérification et livrable

1. Exécuter la suite de tests unitaires et E2E.
2. Corriger les régressions immédiatement.
3. Mettre à jour `docs/audit-contenu.md` pour marquer les écarts corrigés et ajuster les compteurs.
4. Livrer un récapitulatif des corrections appliquées.

---

## Livrables

- `src/data/program.json` corrigé
- `src/data/lead-auditor.ts` corrigé
- `src/data/standard-extras.ts` corrigé
- `src/data/curriculum.ts` corrigé si nécessaire
- `src/data/program.ts` corrigé si nécessaire
- `src/lib/rag.server.ts` amélioré
- `docs/audit-contenu.md` mis à jour
- Tests unitaires et E2E verts
