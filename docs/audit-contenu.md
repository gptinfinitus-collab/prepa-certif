# Audit de fiabilité du contenu pédagogique — PREPA CERTIF

**Date :** 9 août 2026
**Périmètre :** l'intégralité du contenu de cours, de quiz, de glossaire et d'annexes embarqué dans l'application, pour les 8 référentiels configurés (ISO 9001:2015, ISO 14001:2015, ISO/IEC 27001:2022, ISO 22000:2018, ISO 45001:2018, ISO 50001:2018, ISO 13485:2016, ISO 22301:2019, ISO 37001:2016) et les parcours Auditeur interne / Lead Auditor.

**Fichiers audités :**

| Fichier | Contenu |
|---|---|
| `src/data/program.json` | 21 modules ISO 45001, 100 questions de quiz, 27 termes de glossaire, annexes (plan d'audit, fiche NC, checklist, fiches de révision, examen blanc 20 QCM) |
| `src/data/standards.ts` | générateur `hlsClauses` (chapitres 4 à 10) + spécifications des 8 normes |
| `src/data/standard-extras.ts` | contenus pédagogiques génériques et surcharges par norme |
| `src/data/lesson-extras.ts` | extras pédagogiques ISO 45001 (exemple, regard de l'auditeur, point examen, mise en situation) |
| `src/data/lead-auditor.ts` | 6 modules de méthodologie Lead Auditor |
| `src/data/curriculum.ts` | assemblage des cursus |

**Référentiels de contrôle :** texte officiel ISO 45001:2018 (version française) indexé dans la base documentaire de l'application — sommaire complet et article 3 « Termes et définitions » ; sommaires officiels des autres normes ; ISO 19011:2018 ; ISO/IEC 17021-1:2015 ; sources publiques vérifiées en ligne.

**Échelle de gravité :**
- **Critique** — fausse une réponse d'examen, inverse une exigence, ou expose au candidat une numérotation de chapitre inexistante.
- **Majeur** — imprécision trompeuse, exigence incomplète ou mal rattachée.
- **Mineur** — vocabulaire normatif, formulation, cohérence éditoriale.

---

## 1. Synthèse générale

| Volet | Éléments contrôlés | Critique | Majeur | Mineur |
|---|---|---|---|---|
| A. Cours ISO 45001 (modules, quiz, glossaire) | 148 | 0 | 4 | 6 |
| B. Squelettes et contenus des autres normes | 29 | 4 | 4 | 6 |
| C. Lead Auditor, ISO 19011 et annexes | 20 | 0 | 5 | 5 |
| D. Cohérence éditoriale et données de structure | 6 | 0 | 2 | 3 |
| **Total** | **203** | **4** | **15** | **20** |

**Conclusion générale.** Le contenu ISO 45001 est **fiable sur le fond** : la numérotation et les intitulés des chapitres 4 à 10 sont conformes au sommaire officiel, la hiérarchie des mesures de prévention est dans le bon ordre, l'usage de « doit » / « devrait » est correct, et aucune réponse de quiz n'est fausse. Les écarts portent sur du vocabulaire non normatif et deux exigences incomplètes ou mal rattachées.

En revanche, **le générateur de chapitres commun aux autres normes (`hlsClauses`) produit des numérotations fausses** pour ISO 9001, ISO/IEC 27001, ISO 22000 et ISO 50001, et il est appliqué à ISO 13485:2016 qui ne suit pas la structure harmonisée. C'est là que se concentrent les 4 écarts critiques : ils sont structurels et se corrigent en un seul point du code.

---

## 2. Volet A — Cours ISO 45001:2018

### 2.1 Points conformes (contrôlés, sans écart)

- **Numérotation et intitulés des chapitres 4 à 10** dans les modules 3 à 11 : conformes au sommaire officiel.
- **Hiérarchie des mesures de prévention** (module 9) : élimination → substitution → mesures d'ingénierie → mesures administratives → EPI, ordre strictement conforme au §8.1.2.
- **Vocabulaire normatif « doit » / « devrait »** : 24 occurrences de « doit », 1 de « devrait ». Aucune inversion : « devrait » n'est employé que pour une recommandation comportementale hors champ normatif.
- **100 questions de quiz** : aucune réponse fausse. Les deux seules réponses erronées découlent des écarts A-3 et A-4 ci-dessous.
- **19 termes de glossaire sur 27** : conformes en substance à l'article 3.

### 2.2 Écarts constatés

| Réf. | Élément | Ce qui est écrit | Ce qui est exact | Source | Gravité |
|---|---|---|---|---|---|
| A-1 | Glossaire, « Risque » | « Combinaison de la probabilité et de la gravité d'un danger qui se réalise. » | ISO 45001 distingue **3.20 risque** = « effet de l'incertitude » (définition harmonisée Annexe SL) et **3.21 risque pour la S&ST** = « combinaison de la probabilité d'occurrence d'événement(s) ou exposition(s) dangereux liés au travail et de la gravité des traumatismes et pathologies pouvant être causés ». La définition donnée est celle de 3.21, présentée comme *la* définition de « risque ». C'est un piège d'examen classique. | ISO 45001:2018 art. 3.20 et 3.21 (texte FR indexé) | **Majeur** |
| A-2 | Glossaire et modules 2, 11, 19 ; 15 occurrences | « Incident » / « Presqu'accident » | La version française officielle emploie **« événement indésirable »** (art. 3.35 ; intitulé officiel de la clause 10.2 « Événement indésirable, non-conformité et actions correctives »). Le terme « incident » n'est pas le terme normatif français. La définition donnée est juste, seule l'étiquette diverge. | ISO 45001:2018 art. 3.35 ; sommaire officiel §10.2 | **Majeur** |
| A-3 | Module 4, « Politique SST » + quiz M4 Q1 et M6 Q4 | « Doit inclure : engagement à éliminer les dangers/réduire les risques, engagement à la consultation/participation, engagement d'amélioration continue. » | La clause 5.2 exige **cinq** engagements : a) fournir des conditions de travail sûres et saines pour la prévention des traumatismes et pathologies liés au travail ; b) satisfaire aux exigences légales et autres exigences ; c) éliminer les dangers et réduire les risques pour la S&ST ; d) l'amélioration continue du système ; e) la consultation et la participation des travailleurs. Trois sur cinq sont cités, présentés comme une liste complète. | ISO 45001:2018 §5.2 | **Majeur** |
| A-4 | Module 5 + quiz M5 Q3 | « Processus pour identifier les textes applicables, **évaluer sa conformité**, et le tenir à jour. » | Le §6.1.3 porte sur l'identification, l'accès, l'applicabilité et la mise à jour des exigences légales. **L'évaluation de la conformité est une exigence distincte du §9.1.2.** Une activité du chapitre 9 est attribuée au chapitre 6. | ISO 45001:2018 §6.1.3 et §9.1.2 | **Majeur** |
| A-5 | Glossaire, « Danger » ; module 2 | « Source potentielle de blessure ou d'atteinte à la santé. » | 3.19 danger = « source susceptible de causer traumatisme et pathologie ». Le vocabulaire normatif est « traumatisme et pathologie », pas « blessure » (terme de l'ère OHSAS 18001). 3 occurrences de « blessure ». | ISO 45001:2018 art. 3.19 | Mineur |
| A-6 | Glossaire, « Hiérarchie des mesures de maîtrise » | « Ordre de priorité des solutions face à un danger (élimination > EPI). » | Intitulé normatif : **hiérarchie des mesures de prévention**. Définition tronquée : les 5 niveaux ne sont pas énumérés, alors qu'ils le sont correctement au module 9. | ISO 45001:2018 §8.1.2 | Mineur |
| A-7 | Glossaire, « Consultation » / « Participation » | « Demander l'avis des travailleurs » / « Impliquer réellement les travailleurs ». | 3.5 consultation = « recherche d'avis **avant une prise de décision** » ; 3.4 participation = « implication **dans la prise de décision** ». Sens correct mais la nuance « avant / dans la décision », qui est le cœur de la distinction attendue en examen, disparaît. | ISO 45001:2018 art. 3.4 et 3.5 | Mineur |
| A-8 | Ensemble du contenu, 38 occurrences | Sigle « SST » | La version française d'ISO 45001:2018 utilise **« S&ST »** (santé et sécurité au travail). Cohérence terminologique à harmoniser. | ISO 45001:2018, titre et art. 3.11 | Mineur |
| A-9 | Ensemble du contenu, 17 occurrences | « procédure(s) » | La structure harmonisée a remplacé « procédures documentées » et « enregistrements » par **« informations documentées »** (art. 3.24). Aucune occurrence d'« enregistrement » (bon point) mais 17 de « procédure ». | ISO 45001:2018 §7.5 | Mineur |
| A-10 | Glossaire | 27 termes | Termes normatifs structurants absents : *événement indésirable*, *traumatismes et pathologies*, *information documentée*, *intervenant extérieur*, *lieu de travail*, *effectivité/efficacité*, *direction*, *performance*. | ISO 45001:2018 art. 3 | Mineur |

### 2.3 Observation de périmètre

8 modules sur 21 (12 à 18 et une partie du 20) traitent d'**ISO 19011** et non des exigences d'ISO 45001. Le contenu ISO 19011 est globalement exact (voir volet C), mais le cursus est intitulé « ISO 45001 » : il gagnerait à afficher explicitement le passage au référentiel d'audit.

---

## 3. Volet B — Squelettes des autres normes (`standards.ts`, `standard-extras.ts`)

### 3.1 Écarts critiques — tous issus du même générateur

Le générateur `hlsClauses` insère pour **toutes** les normes deux clauses qui ne sont pas génériques :
- `« 8.1 Maîtrise des processus externalisés et des fournisseurs »` ;
- `« 8.2 Préparation et réponse aux situations d'urgence ou incidents »`.

Or ces deux libellés sont spécifiques à certaines normes seulement. Conséquence : des numéros de chapitre en doublon avec deux significations différentes, et des exigences inexistantes présentées comme normatives.

| Réf. | Norme | Ce que l'application affiche | Ce qui est exact | Gravité |
|---|---|---|---|---|
| B-1 | **ISO 9001:2015** | « 8.1 Maîtrise des processus externalisés » puis « 8.2 Préparation et réponse aux situations d'urgence » | §8.1 = Planification et maîtrise opérationnelles ; §8.2 = Exigences relatives aux produits et services ; la maîtrise des prestataires externes est le §**8.4**. Il n'existe **aucune** clause « situations d'urgence » dans ISO 9001. | **Critique** |
| B-2 | **ISO/IEC 27001:2022** | « 8.2 Préparation et réponse aux situations d'urgence ou incidents » | §8.2 = Appréciation des risques de sécurité de l'information ; §8.3 = Traitement des risques. La gestion des incidents relève de l'Annexe A (mesures 5.24 à 5.28), pas de la clause 8. | **Critique** |
| B-3 | **ISO 22000:2018** | « 8.2 Préparation et réponse aux situations d'urgence » (générique) **et** « 8.2 Programmes prérequis (PRP) » (surcharge) | Structure réelle : 8.1 Planification et maîtrise opérationnelles ; 8.2 PRP ; 8.3 Système de traçabilité ; 8.4 Préparation et réponse aux situations d'urgence ; 8.5 Maîtrise des dangers ; 8.6 Mise à jour ; 8.7 Maîtrise de la surveillance et du mesurage ; 8.8 Vérification ; 8.9 Maîtrise des non-conformités. Numéro 8.2 dupliqué, §8.3 et §8.4 omis. | **Critique** |
| B-4 | **ISO 13485:2016** | Chapitres générés « 4 Contexte de l'organisme », « 5 Leadership », « 6 Planification (risques et opportunités) », « 8.2 Situations d'urgence » | ISO 13485:2016 **ne suit pas la structure harmonisée** : son chapitre 5 est « Responsabilité de la direction », son chapitre 7 « Réalisation du produit », son chapitre 8 « Mesure, analyse et amélioration ». Elle n'a pas de clause 6.1 « risques et opportunités » au sens HLS. L'intégralité du squelette généré pour cette norme est structurellement faux. | **Critique** |
| B-5 | **ISO 50001:2018** | « 8.2 Préparation et réponse aux situations d'urgence » puis « 8.2 Conception intégrant la performance énergétique » | Chapitre 8 réel : 8.1 Planification et maîtrise opérationnelles ; 8.2 Conception ; 8.3 Approvisionnement. Pas de clause « urgence ». Numéro 8.2 dupliqué. | **Critique** |

> Note : ISO 14001:2015 est la seule norme pour laquelle l'insertion générique de « 8.2 Préparation et réponse aux situations d'urgence » tombe juste — par coïncidence, puisque c'est bien son §8.2.

### 3.2 Écarts majeurs et mineurs

| Réf. | Élément | Ce qui est écrit | Ce qui est exact | Gravité |
|---|---|---|---|---|
| B-6 | `standard-extras.ts`, générique ch. 6, point examen | « La norme n'impose aucune méthode formelle d'appréciation des risques. » | Vrai pour 9001/14001/45001/22301/37001, **faux pour ISO/IEC 27001:2022** : le §6.1.2 impose un processus défini avec critères d'acceptation du risque, propriétaires de risques et résultats cohérents, valides et comparables. Aucune surcharge ne retire l'affirmation générique. | **Majeur** |
| B-7 | Surcharges ISO 22000, ch. 8 | Uniquement PRP / PRPo / CCP / limites critiques | §8.3 « Système de traçabilité » et §8.4 « Préparation et réponse aux situations d'urgence » jamais mentionnés : le chapitre 8 paraît se limiter au HACCP. | **Majeur** |
| B-8 | ISO 13485, `systemName` et contenus génériques | Texte générique identique à ISO 9001 pour le chapitre 5 « Leadership » | Le chapitre 5 de 13485 est « Responsabilité de la direction » et n'a pas l'exigence HLS de politique adossée aux enjeux stratégiques. | **Majeur** |
| B-9 | `hlsClauses`, ch. 6 | « 6.1 Actions face aux risques et opportunités » **et** « 6.1 Exigences légales et autres exigences applicables » — même numéro deux fois | Les exigences légales relèvent d'un sous-chapitre distinct : 6.1.3 en ISO 14001 (« Obligations de conformité ») et en ISO 45001. | Mineur |
| B-10 | Surcharge ISO 9001, ch. 8 | « La conception et le développement (8.3) peuvent être **exclus** » | Le terme « exclusion » date d'ISO 9001:2008. La version 2015 parle d'exigence **non applicable** (§4.3, note). | Mineur |
| B-11 | Surcharge ISO 13485, ch. 8, point examen | « L'amélioration continue y est moins centrale que dans ISO 9001. » | Défendable (§8.5.1 de 13485 parle de « maintenir l'efficacité » là où 9001 §10.3 exige l'amélioration continue) mais formulé de façon absolue et sans référence de clause. | Mineur |
| B-12 | Générique ch. 8, ISO 22000 | Contenu HLS générique | La spécificité pédagogique majeure d'ISO 22000 — les **deux cycles PDCA** (système de management / processus opérationnels de maîtrise des dangers) — n'est jamais exposée. | Mineur |
| B-13 | Référence ISO/IEC 27001 | `isoUrl("27001")` | Le lien fonctionne, mais c'est le seul appel de `isoUrl` avec un slug au lieu d'un identifiant produit numérique : incohérence de maintenance. | Mineur |
| B-14 | Millésimes et références | 9001:2015, 14001:2015, 27001:2022, 22000:2018, 50001:2018, 13485:2016, 22301:2019, 37001:2016, 19011:2018, 17021-1:2015 ; Annexe A de 27001:2022 à 93 mesures réparties en 37 / 8 / 14 / 34 | **Tous exacts**, identifiants ISO vérifiés. | — Conforme |

---

## 4. Volet C — Lead Auditor, ISO 19011 et annexes

| Réf. | Élément | Ce qui est écrit | Ce qui est exact | Gravité |
|---|---|---|---|---|
| C-1 | `lead-auditor.ts` module 6, `curriculum.ts`, `standard-extras.ts` (3 occurrences) | 1er principe d'audit : « **déontologie** » | ISO 19011:**2018** nomme ce principe « **intégrité** » ; « déontologie » est le terme de l'édition 2011, abrogée. **Incohérence interne** : l'examen blanc de `program.json` emploie déjà correctement « intégrité ». | **Majeur** |
| C-2 | `lead-auditor.ts` module 4 ; `lesson-extras.ts` module 18 ; fiche NC | Classification « majeure / mineure » présentée dans un contexte ISO 19011 | ISO 19011:2018 ne définit **aucune** hiérarchie de gravité des non-conformités : elle ne connaît que le « constat d'audit ». La classification majeure/mineure vient des schémas de certification (ISO/IEC 17021-1). Piège d'examen fréquent. | **Majeur** |
| C-3 | Examen blanc, question sur les étapes de certification | « Étape 1 = revue documentaire ; étape 2 = audit sur site. » | L'audit d'étape 1 (ISO/IEC 17021-1 §9.3.1.2) évalue aussi la préparation de l'audité : compréhension des exigences, périmètre, site, ressources, exigences légales identifiées, et planification de l'étape 2. | **Majeur** |
| C-4 | `program.json`, `auditPlanTemplate` (8 champs) | Organisme, dates, type d'audit, critères, périmètre, équipe, personnes, horaires | Le champ **« Objectifs de l'audit »** manque, alors que le §6.3.2 a) d'ISO 19011:2018 en fait le premier élément du plan d'audit, distinct du périmètre et des critères. | **Majeur** |
| C-5 | `lead-auditor.ts` module 1 | « Le responsable d'équipe d'audit (ISO 19011, § 5.5.2) » | Référence fausse : §5.5.2 = « Définition des objectifs, du champ et des critères d'un audit individuel ». La désignation du responsable d'équipe est le §**5.5.5** (« Attribution de la responsabilité d'un audit individuel au responsable de l'équipe d'audit »). *Vérifié sur le sommaire officiel d'ISO 19011:2018 — corrige au passage une proposition erronée (§5.5.3) issue de l'analyse automatisée.* | **Majeur** |
| C-6 | `lead-auditor.ts`, ensemble | Aucune mention de PECB ni de CQI/IRCA | Les 6 modules « Lead Auditor » ne contiennent **aucune** information sur les schémas d'examen. C'est prudent (rien de faux à corriger), mais l'intitulé du parcours crée une attente non satisfaite. | Mineur |
| C-7 | `program.json`, examen blanc, 7 principes de l'audit | « Intégrité, présentation impartiale, conscience professionnelle, confidentialité, indépendance, approche fondée sur la preuve, approche fondée sur le risque » | **Exact**, conforme à l'édition 2018. | — Conforme |
| C-8 | `program.json`, `ncTemplate` | Preuve objective / exigence de référence / écart / classification | Conforme au §6.4.7-6.4.8 d'ISO 19011:2018 (constat = confrontation preuves / critères). | — Conforme |
| C-9 | `lesson-extras.ts` | Aucun extra pour les séances 6, 7 et 14 | **Pas un écart** : les modules 6 et 14 sont des séances de révision et le 7 une séance de pause (`type: "review"` / `"rest"`), qui n'ont pas vocation à porter des extras de cours. Signalé pour mémoire après vérification dans `program.json`. | — Conforme |
| C-10 | Identifiants Lead Auditor | `LEAD_AUDITOR_START_ID = 9001` vs modules 1-21 | Aucune collision d'identifiants. | — Conforme |

---

## 5. Volet D — Cohérence éditoriale et données de structure

| Réf. | Élément | Constat | Gravité |
|---|---|---|---|
| D-1 | `program.json`, `dayLabel` des 21 modules | Dates calendaires figées : « Lundi 20/07 », « Mardi 21/07 »… affichées telles quelles sur la page de séance (`seance.$moduleId.tsx`). Les autres cursus utilisent « Séance N ». Contredit le principe de durée de préparation configurable et affiche des dates périmées. | **Majeur** |
| D-2 | `program.json`, `meta` | `candidateExample` = « Hector Ablam Kabu OCCANSEY — Clinicaa » et `trainingExample` = « Formation SGS : 10–14 août 2026, Douala » : données nominatives d'un utilisateur unique, héritées de la version initiale. Champs typés et exportés mais non affichés aujourd'hui — donc sans fuite visible, mais à retirer. | **Majeur** |
| D-3 | `program.json`, `meta.title` | « Préparation IRCA ISO 45001:2018 — Responsable d'Audit SMSST » : mention d'un schéma de certification commercial (IRCA) comme titre du cursus, dans une application désormais multi-normes. | Mineur |
| D-4 | `program.json`, quiz | 5 questions posées deux fois à l'identique dans les modules de révision (domaine d'application, 4 composantes du chapitre 9, méthode des 5 pourquoi, 7 principes de l'audit, conséquence d'une NC majeure). Volontaire dans une logique de révision, mais fausse les statistiques de maîtrise par sujet. | Mineur |
| D-5 | `program.json`, module 20, examen blanc | 2 questions n'ont qu'un numéro de chapitre en réponse (« 6 », « 9.3 »), sans libellé : rend la correction ambiguë pour l'apprenant. | Mineur |
| D-6 | Base documentaire RAG | Le PDF « ISO-45001-2018.pdf » indexé (34 fragments) est un **extrait de prévisualisation** : il ne contient que la page de garde, le sommaire, l'avant-propos, l'introduction, le domaine d'application et les définitions 3.1 à 3.21. Le texte normatif des chapitres 4 à 10 est absent. L'IA ne peut donc pas citer les exigences elles-mêmes, et chaque fragment est pollué par le filigrane « iTeh STANDARD PREVIEW » (non retiré par le nettoyage à l'indexation). | **Majeur** |

---

## 6. Corrections proposées

Aucune modification n'a été appliquée à ce stade. Les corrections sont classées par ordre de priorité.

### Priorité 1 — Écarts critiques (structure des normes) — ✅ CORRIGÉ le 9 août 2026

> Générateur `hlsClauses` rendu neutre (chapitre 8 réduit au seul 8.1, retrait des exigences légales et de la planification des modifications génériques) ; chapitres 8 réels déclarés par norme (9001, 14001, 27001, 22000, 50001, 22301, 37001) ; ISO 13485:2016 dotée de son squelette propre en 5 chapitres normatifs (4 à 8) avec surcharges pédagogiques réalignées. Trois tests de non-régression ajoutés (`tests/unit/standard-extras.test.ts`) : aucun numéro de sous-chapitre en doublon, pas de clause « urgence » hors normes concernées, structure 13485 non harmonisée.

**C1. Rendre `hlsClauses` neutre.** Retirer du générateur les deux libellés non génériques `« 8.1 Maîtrise des processus externalisés et des fournisseurs »` et `« 8.2 Préparation et réponse aux situations d'urgence ou incidents »`, et ne conserver au chapitre 8 que « 8.1 Planification et maîtrise opérationnelles ». Chaque norme déclare ensuite ses propres sous-chapitres via sa surcharge. Corrige B-1, B-2, B-3, B-5 en un point unique.

**C2. Déclarer les chapitres 8 réels par norme :**
- ISO 9001 : 8.1 Planification et maîtrise opérationnelles ; 8.2 Exigences relatives aux produits et services ; 8.3 Conception et développement ; 8.4 Maîtrise des processus, produits et services fournis par des prestataires externes ; 8.5 Production et prestation de service ; 8.6 Libération des produits et services ; 8.7 Maîtrise des éléments de sortie non conformes.
- ISO/IEC 27001 : 8.1 Planification et maîtrise opérationnelles ; 8.2 Appréciation des risques de sécurité de l'information ; 8.3 Traitement des risques de sécurité de l'information.
- ISO 22000 : 8.1 à 8.9 selon la liste du § 3.1 ci-dessus, en ajoutant 8.3 Traçabilité et 8.4 Situations d'urgence.
- ISO 50001 : 8.1 Planification et maîtrise opérationnelles ; 8.2 Conception ; 8.3 Approvisionnement en énergie.

**C3. Traiter ISO 13485:2016 hors structure harmonisée.** Deux options : soit lui écrire un squelette propre (4 Système de management de la qualité, 5 Responsabilité de la direction, 6 Management des ressources, 7 Réalisation du produit, 8 Mesure, analyse et amélioration), soit la retirer temporairement du catalogue. La laisser sur `hlsClauses` est la seule situation où l'application affiche une architecture de norme entièrement fausse.

### Priorité 2 — Écarts majeurs de contenu

**C4. ISO 45001, politique S&ST (A-3).** Remplacer, dans le module 4 et dans les corrigés de quiz M4 Q1 et M6 Q4, par les cinq engagements du §5.2 : conditions de travail sûres et saines pour la prévention des traumatismes et pathologies liés au travail ; satisfaction aux exigences légales et autres exigences ; élimination des dangers et réduction des risques pour la S&ST ; amélioration continue du système de management de la S&ST ; consultation et participation des travailleurs.

**C5. ISO 45001, exigences légales (A-4).** Module 5 et corrigé M5 Q3 : « Le §6.1.3 exige d'identifier les exigences légales et autres exigences applicables, d'y avoir accès, d'en déterminer l'applicabilité et de les tenir à jour. **L'évaluation de la conformité à ces exigences est une exigence distincte, traitée au §9.1.2.** »

**C6. Terminologie ISO 45001 (A-1, A-2, A-5, A-6).**
- Glossaire « Risque » → deux entrées : *Risque* = « effet de l'incertitude (art. 3.20) » ; *Risque pour la S&ST* = « combinaison de la probabilité d'occurrence d'un événement ou d'une exposition dangereux liés au travail et de la gravité des traumatismes et pathologies pouvant en résulter (art. 3.21) ».
- « Incident » → « **Événement indésirable** (art. 3.35) », avec mention « anciennement appelé incident ».
- « Danger » → « source susceptible de causer traumatisme et pathologie (art. 3.19) ».
- « Hiérarchie des mesures de maîtrise » → « **Hiérarchie des mesures de prévention** (§8.1.2) : élimination, substitution, mesures d'ingénierie et réorganisation du travail, mesures administratives dont la formation, équipements de protection individuelle. »

**C7. ISO 19011, principe d'intégrité (C-1).** Remplacer les 3 occurrences de « déontologie » par « **intégrité** » dans `lead-auditor.ts`, `curriculum.ts` et `standard-extras.ts`, pour aligner sur l'examen blanc déjà correct.

**C8. Classification des non-conformités (C-2).** Ajouter, avant les définitions majeure/mineure : « ISO 19011:2018 ne définit pas de hiérarchie de gravité des non-conformités — elle ne connaît que le constat d'audit. La distinction majeure / mineure provient des règles des schémas de certification (ISO/IEC 17021-1) appliquées lors des audits de tierce partie. »

**C9. Audit d'étape 1 (C-3).** Nouvelle réponse : « Étape 1 : revue documentaire **et** évaluation de la préparation de l'audité — compréhension des exigences, périmètre, sites, ressources, exigences légales identifiées — en vue de planifier l'étape 2. Étape 2 : audit sur site de la mise en œuvre et de l'efficacité du système, aboutissant au rapport et à la recommandation de certification. »

**C10. Plan d'audit (C-4).** Insérer « Objectifs de l'audit » en 3ᵉ position de `auditPlanTemplate`.

**C11. Référence de clause (C-5).** `lead-auditor.ts` module 1 : remplacer « ISO 19011, § 5.5.2 » par « ISO 19011:2018, § 5.5.5 ».

**C12. Appréciation des risques en ISO 27001 (B-6).** Ajouter une surcharge au chapitre 6 d'ISO/IEC 27001 qui neutralise le point examen générique : « Contrairement aux autres normes de management, ISO/IEC 27001 §6.1.2 impose un processus d'appréciation des risques défini : critères d'acceptation du risque, critères de réalisation des appréciations, identification des propriétaires de risques, et résultats cohérents, valides et comparables. »

**C13. Chapitre 8 d'ISO 22000 (B-7).** Compléter la surcharge avec le §8.3 Traçabilité et le §8.4 Situations d'urgence.

**C14. Chapitre 5 d'ISO 13485 (B-8).** À traiter avec C3.

### Priorité 3 — Structure éditoriale

**C15. `dayLabel` (D-1).** Remplacer les 21 dates calendaires par « Séance N », comme dans les autres cursus.

**C16. Métadonnées (D-2, D-3).** Supprimer `candidateExample` et `trainingExample` du JSON et du type `ProgramMeta`. Retitrer le cursus « Préparation ISO 45001:2018 — Audit du système de management de la S&ST » (sans mention d'un schéma commercial).

**C17. Base documentaire (D-6).** Signaler dans l'interface qu'un document indexé est un extrait partiel (comparaison nombre de pages / fragments), et compléter le filtre de nettoyage à l'indexation pour retirer les filigranes de type `iTeh STANDARD PREVIEW`, `standards.iteh.ai`, `© ISO 2018 – Tous droits réservés`, qui polluent aujourd'hui la quasi-totalité des fragments et dégradent la pertinence de la recherche vectorielle.

### Priorité 4 — Vocabulaire et finitions

**C18.** Harmoniser « SST » → « S&ST » (38 occurrences), « blessure » → « traumatisme et pathologie » (3), « procédure » → « information documentée » quand il s'agit d'une exigence normative (17 occurrences à trier).
**C19.** Compléter le glossaire ISO 45001 avec les 8 termes normatifs manquants (A-10).
**C20.** Compléter les 2 réponses de l'examen blanc réduites à un numéro de chapitre (D-5), et marquer les 5 questions dupliquées comme questions de révision pour qu'elles ne faussent pas les statistiques de maîtrise (D-4).

---

## 7. Réserve méthodologique

Le texte intégral d'ISO 45001:2018 (chapitres 4 à 10) n'est pas disponible dans la base documentaire : seuls le sommaire officiel et les définitions 3.1 à 3.21 ont pu être confrontés mot à mot. Les contrôles portant sur le corps des exigences (§5.2, §6.1.3, §8.1.2, §9.1.2) et sur les autres normes s'appuient sur les sommaires officiels publics et des sources secondaires vérifiées. Les corrections de priorité 1 et 2 sont sûres ; en cas de doute résiduel sur une formulation, la confrontation au texte acheté auprès de l'ISO ou de l'AFNOR reste la référence.
