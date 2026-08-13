/**
 * Modèles de check-lists d'audit (version française).
 *
 * Les exigences sont reformulées avec nos propres mots : aucun extrait
 * littéral des normes protégées n'est reproduit ici.
 */

export interface ChecklistItemTemplate {
  /** Référence de clause (ex. « 6.1.2 »). Vide pour une étape de processus. */
  clause: string;
  /** Intitulé de l'exigence ou de l'étape, reformulé. */
  requirement: string;
  /** Questions d'audit et preuves attendues. */
  guidance: string;
}

export interface ChecklistSectionTemplate {
  chapter: string;
  items: ChecklistItemTemplate[];
}

export interface ChecklistTemplate {
  id: string;
  title: string;
  standard: string;
  description: string;
  sections: ChecklistSectionTemplate[];
}

export const iso45001Checklist: ChecklistTemplate = {
  id: "iso-45001",
  title: "Audit ISO 45001:2018 (+ Amd 1:2024)",
  standard: "ISO 45001:2018 / Amd 1:2024",
  description:
    "Check-list clause par clause du système de management de la S&ST, du contexte à l'amélioration.",
  sections: [
    {
      chapter: "4. Contexte de l'organisme",
      items: [
        {
          clause: "4.1",
          requirement: "Enjeux externes et internes pertinents identifiés et tenus à jour.",
          guidance:
            "Demander comment les enjeux ont été déterminés et à quelle fréquence ils sont revus. Preuves : analyse de contexte, revue de direction.",
        },
        {
          clause: "4.2",
          requirement:
            "Travailleurs et autres parties intéressées identifiés, avec leurs besoins et attentes retenus comme obligations de conformité.",
          guidance:
            "Vérifier le tri entre attentes simples et obligations retenues. Preuves : cartographie des parties intéressées, veille réglementaire.",
        },
        {
          clause: "4.3",
          requirement:
            "Domaine d'application défini, documenté et cohérent avec les activités, lieux et travailleurs concernés.",
          guidance:
            "Chercher les exclusions non justifiées (sous-traitants, sites, télétravail). Preuve : document du domaine d'application.",
        },
        {
          clause: "4.4",
          requirement: "Système de management de la S&ST établi, mis en œuvre et amélioré en continu.",
          guidance:
            "Faire décrire les processus et leurs interactions. Preuves : cartographie des processus, manuel S&ST.",
        },
      ],
    },
    {
      chapter: "5. Leadership et participation des travailleurs",
      items: [
        {
          clause: "5.1",
          requirement:
            "La direction démontre son leadership : responsabilité globale, ressources, culture de prévention, protection contre les représailles.",
          guidance:
            "Entretien direction : arbitrages production / sécurité, temps consacré au terrain. Preuves : décisions, budgets, comptes rendus.",
        },
        {
          clause: "5.2",
          requirement:
            "Politique S&ST appropriée, engageant conditions de travail sûres, élimination des dangers, consultation et amélioration continue.",
          guidance:
            "Vérifier la diffusion et la compréhension par les travailleurs interrogés. Preuve : politique signée et datée.",
        },
        {
          clause: "5.3",
          requirement: "Rôles, responsabilités et autorités attribués, communiqués et compris.",
          guidance:
            "Demander à un travailleur qui décide de l'arrêt d'une tâche dangereuse. Preuves : fiches de poste, organigramme.",
        },
        {
          clause: "5.4",
          requirement:
            "Consultation et participation des travailleurs (et de leurs représentants) organisées à tous les niveaux, obstacles levés.",
          guidance:
            "Distinguer consultation (avant décision) et participation. Preuves : CSE/comité S&ST, boîtes à idées, retours terrain.",
        },
      ],
    },
    {
      chapter: "6. Planification",
      items: [
        {
          clause: "6.1.1",
          requirement: "Risques et opportunités du système déterminés en tenant compte du contexte.",
          guidance:
            "Ne pas confondre risques S&ST et risques du système de management. Preuve : registre risques/opportunités.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Processus continu et proactif d'identification des dangers (organisation du travail, facteurs sociaux, incidents passés, situations d'urgence, personnes concernées).",
          guidance:
            "Vérifier la prise en compte des dangers psychosociaux et des intervenants extérieurs. Preuve : méthode d'identification.",
        },
        {
          clause: "6.1.2.2",
          requirement:
            "Évaluation des risques pour la S&ST et des autres risques du système, selon des méthodes et critères définis.",
          guidance:
            "Faire dérouler une évaluation sur un poste. Preuves : document unique, cotation, critères documentés.",
        },
        {
          clause: "6.1.2.3",
          requirement: "Opportunités d'amélioration de la S&ST et du système évaluées.",
          guidance: "Chercher des exemples concrets (ergonomie, nouvelle technologie, retour d'expérience).",
        },
        {
          clause: "6.1.3",
          requirement:
            "Exigences légales et autres obligations déterminées, accessibles, tenues à jour et prises en compte.",
          guidance:
            "Tester une évolution réglementaire récente. Preuves : veille, tableau de conformité, dates de mise à jour.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Actions planifiées face aux dangers, risques, obligations et situations d'urgence, intégrées au système.",
          guidance:
            "Vérifier la hiérarchie des mesures de maîtrise (élimination avant EPI). Preuve : plan d'actions.",
        },
        {
          clause: "6.2.1",
          requirement:
            "Objectifs S&ST cohérents avec la politique, mesurables ou évaluables, communiqués et mis à jour.",
          guidance: "Demander comment un objectif est mesuré. Preuve : tableau des objectifs.",
        },
        {
          clause: "6.2.2",
          requirement:
            "Planification des objectifs : actions, ressources, responsables, échéances, mode d'évaluation des résultats.",
          guidance: "Vérifier qu'un objectif dispose bien des cinq éléments. Preuve : plan d'actions daté.",
        },
      ],
    },
    {
      chapter: "7. Support",
      items: [
        {
          clause: "7.1",
          requirement: "Ressources nécessaires au système déterminées et fournies.",
          guidance: "Budget prévention, effectifs, temps alloué. Preuves : budget, moyens matériels.",
        },
        {
          clause: "7.2",
          requirement:
            "Compétences nécessaires déterminées, acquises et évaluées, y compris pour identifier les dangers.",
          guidance:
            "Croiser un poste à risque avec les preuves de compétence. Preuves : matrice de compétences, habilitations, attestations.",
        },
        {
          clause: "7.3",
          requirement:
            "Travailleurs sensibilisés à la politique, aux dangers, aux incidents et à leur droit de se retirer d'une situation dangereuse.",
          guidance:
            "Interroger des travailleurs sur le droit de retrait. Preuves : accueil sécurité, causeries, affichage.",
        },
        {
          clause: "7.4",
          requirement: "Communication interne et externe définie (quoi, quand, avec qui, comment).",
          guidance:
            "Vérifier la remontée d'une information S&ST par un travailleur. Preuve : procédure de communication.",
        },
        {
          clause: "7.5",
          requirement:
            "Informations documentées créées, mises à jour et maîtrisées (diffusion, accès, protection, conservation).",
          guidance:
            "Tester la version en vigueur d'un document au poste de travail. Preuves : gestion documentaire, indices de révision.",
        },
      ],
    },
    {
      chapter: "8. Réalisation des activités opérationnelles",
      items: [
        {
          clause: "8.1.1",
          requirement: "Processus opérationnels planifiés, mis en œuvre, maîtrisés et tenus à jour.",
          guidance: "Observer une activité réelle et la comparer au mode opératoire.",
        },
        {
          clause: "8.1.2",
          requirement:
            "Hiérarchie des mesures de maîtrise appliquée : élimination, substitution, mesures techniques, organisationnelles, puis EPI.",
          guidance:
            "Chercher les cas où l'EPI est la seule barrière. Preuves : analyses de risque, plans d'action.",
        },
        {
          clause: "8.1.3",
          requirement: "Conduite du changement : changements permanents et temporaires maîtrisés en amont.",
          guidance:
            "Prendre un changement récent (machine, effectif, procédé) et vérifier l'analyse préalable.",
        },
        {
          clause: "8.1.4",
          requirement:
            "Acquisitions, sous-traitance et externalisation maîtrisées et coordonnées avec les prestataires.",
          guidance:
            "Preuves : plans de prévention, critères S&ST des achats, accueil des entreprises extérieures.",
        },
        {
          clause: "8.2",
          requirement:
            "Préparation et réponse aux situations d'urgence planifiées, testées et communiquées aux parties concernées.",
          guidance:
            "Vérifier la date du dernier exercice et son retour d'expérience. Preuves : plan d'urgence, comptes rendus d'exercices.",
        },
      ],
    },
    {
      chapter: "9. Évaluation des performances",
      items: [
        {
          clause: "9.1.1",
          requirement:
            "Surveillance, mesure, analyse et évaluation des performances S&ST, avec équipements étalonnés si nécessaire.",
          guidance:
            "Vérifier l'équilibre indicateurs proactifs / réactifs. Preuves : tableaux de bord, certificats d'étalonnage.",
        },
        {
          clause: "9.1.2",
          requirement: "Évaluation périodique de la conformité aux exigences légales et autres obligations.",
          guidance: "Preuves : rapport d'évaluation de conformité, plan d'actions associé.",
        },
        {
          clause: "9.2",
          requirement:
            "Programme d'audit interne établi selon l'importance des processus et les résultats antérieurs ; auditeurs objectifs et impartiaux.",
          guidance:
            "Vérifier la couverture des clauses sur le cycle et l'indépendance des auditeurs. Preuves : programme, rapports, compétences.",
        },
        {
          clause: "9.3",
          requirement:
            "Revue de direction couvrant toutes les données d'entrée requises et produisant des décisions tracées.",
          guidance:
            "Contrôler la présence des entrées manquantes fréquentes (consultation des travailleurs, opportunités, ressources). Preuve : compte rendu.",
        },
      ],
    },
    {
      chapter: "10. Amélioration",
      items: [
        {
          clause: "10.1",
          requirement: "Opportunités d'amélioration déterminées et actions mises en œuvre.",
          guidance: "Preuves : suivi des améliorations, indicateurs d'évolution.",
        },
        {
          clause: "10.2",
          requirement:
            "Incidents et non-conformités traités : réaction, analyse des causes, correction, actions correctives, évaluation de l'efficacité.",
          guidance:
            "Suivre un incident de bout en bout et vérifier l'analyse des causes profondes et la participation des travailleurs.",
        },
        {
          clause: "10.3",
          requirement:
            "Amélioration continue du système : performance, culture de prévention, participation des travailleurs.",
          guidance: "Preuves : évolution des indicateurs sur plusieurs années, actions structurantes.",
        },
      ],
    },
  ],
};

export const iso19011Checklist: ChecklistTemplate = {
  id: "iso-19011",
  title: "Conduite d'audit ISO 19011:2026",
  standard: "ISO 19011:2026",
  description:
    "Check-list de déroulement d'un audit, de la planification au suivi des conclusions.",
  sections: [
    {
      chapter: "Programme et déclenchement",
      items: [
        {
          clause: "5",
          requirement: "Objectifs du programme d'audit définis et risques du programme pris en compte.",
          guidance: "Preuves : programme annuel, analyse des risques du programme.",
        },
        {
          clause: "5.5",
          requirement: "Équipe d'audit constituée avec les compétences nécessaires et l'impartialité requise.",
          guidance: "Preuves : lettre de mission, déclarations d'indépendance, CV/compétences.",
        },
      ],
    },
    {
      chapter: "Préparation de l'audit",
      items: [
        {
          clause: "6.2",
          requirement: "Prise de contact avec l'audité, faisabilité confirmée, objectifs, périmètre et critères arrêtés.",
          guidance: "Preuves : échanges préalables, confirmation écrite du périmètre.",
        },
        {
          clause: "6.3",
          requirement: "Revue documentaire préalable réalisée et exploitée.",
          guidance: "Preuves : notes de revue, points d'attention identifiés.",
        },
        {
          clause: "6.3",
          requirement: "Plan d'audit établi, communiqué et accepté ; répartition des tâches dans l'équipe.",
          guidance: "Preuve : plan d'audit daté, avec horaires, sites et interlocuteurs.",
        },
        {
          clause: "6.3",
          requirement: "Documents de travail préparés (check-lists, plans d'échantillonnage, fiches de constat).",
          guidance: "Vérifier que l'échantillonnage est justifié et non improvisé.",
        },
      ],
    },
    {
      chapter: "Réalisation sur site",
      items: [
        {
          clause: "6.4.2",
          requirement: "Réunion d'ouverture tenue : objectifs, méthode, confidentialité, sécurité, logistique.",
          guidance: "Preuves : ordre du jour, feuille de présence.",
        },
        {
          clause: "6.4.6",
          requirement: "Informations collectées par échantillonnage et vérifiées avant de devenir preuves d'audit.",
          guidance: "Contrôler la traçabilité : source, date, référence de chaque preuve.",
        },
        {
          clause: "6.4.7",
          requirement: "Constats d'audit établis en confrontant les preuves aux critères d'audit.",
          guidance: "Un constat = preuve + critère + écart formulé factuellement, sans jugement de personne.",
        },
        {
          clause: "6.4.8",
          requirement: "Conclusions d'audit préparées par l'équipe avant la clôture.",
          guidance: "Preuves : réunion d'équipe, projet de conclusions.",
        },
        {
          clause: "6.4.9",
          requirement: "Réunion de clôture tenue : constats présentés, compris et acceptés, suites expliquées.",
          guidance: "Preuves : feuille de présence, opinions divergentes consignées.",
        },
      ],
    },
    {
      chapter: "Rapport et suivi",
      items: [
        {
          clause: "6.5",
          requirement: "Rapport d'audit complet, exact, clair et diffusé dans les délais convenus.",
          guidance: "Preuves : rapport signé, date d'envoi.",
        },
        {
          clause: "6.6",
          requirement: "Audit clôturé et informations documentées conservées ou éliminées selon les accords.",
          guidance: "Preuve : trace de clôture.",
        },
        {
          clause: "6.7",
          requirement: "Actions correctives de l'audité suivies et efficacité vérifiée.",
          guidance: "Preuves : plan d'actions de l'audité, vérification de l'efficacité.",
        },
      ],
    },
  ],
};

export const iso9001Checklist: ChecklistTemplate = {
  id: "iso-9001",
  title: "Audit ISO 9001:2015",
  standard: "ISO 9001:2015",
  description: "Check-list synthétique du système de management de la qualité.",
  sections: [
    {
      chapter: "4-5. Contexte et leadership",
      items: [
        {
          clause: "4.1 / 4.2",
          requirement: "Contexte, parties intéressées et exigences pertinentes déterminés et surveillés.",
          guidance: "Preuves : analyse de contexte, revue de direction.",
        },
        {
          clause: "4.4",
          requirement: "Processus du SMQ déterminés avec entrées, sorties, séquence, critères et indicateurs.",
          guidance: "Preuve : cartographie et fiches processus.",
        },
        {
          clause: "5.1.2",
          requirement: "Orientation client démontrée : exigences client et réglementaires satisfaites, risques traités.",
          guidance: "Preuves : satisfaction client, réclamations, indicateurs de conformité.",
        },
        {
          clause: "5.2 / 5.3",
          requirement: "Politique qualité diffusée ; rôles et responsabilités attribués.",
          guidance: "Preuves : politique, organigramme, fiches de fonction.",
        },
      ],
    },
    {
      chapter: "6-7. Planification et support",
      items: [
        {
          clause: "6.1",
          requirement: "Risques et opportunités identifiés et actions intégrées aux processus.",
          guidance: "Preuve : registre des risques avec suivi d'efficacité.",
        },
        {
          clause: "6.2 / 6.3",
          requirement: "Objectifs qualité planifiés et changements du SMQ maîtrisés.",
          guidance: "Preuves : plan d'actions, gestion des modifications.",
        },
        {
          clause: "7.1.5",
          requirement: "Ressources de surveillance et de mesure adaptées, vérifiées ou étalonnées.",
          guidance: "Preuve : suivi métrologique.",
        },
        {
          clause: "7.2 / 7.3 / 7.5",
          requirement: "Compétences, sensibilisation et informations documentées maîtrisées.",
          guidance: "Preuves : plan de formation, gestion documentaire.",
        },
      ],
    },
    {
      chapter: "8. Réalisation",
      items: [
        {
          clause: "8.2",
          requirement: "Exigences relatives aux produits et services déterminées et revues avant engagement.",
          guidance: "Preuves : revue de commande, offres.",
        },
        {
          clause: "8.4",
          requirement: "Prestataires externes évalués, sélectionnés et surveillés.",
          guidance: "Preuves : évaluation fournisseurs, contrôles à réception.",
        },
        {
          clause: "8.5",
          requirement: "Production et prestation maîtrisées : identification, traçabilité, préservation, activités après livraison.",
          guidance: "Observer une opération et sa traçabilité.",
        },
        {
          clause: "8.7",
          requirement: "Éléments de sortie non conformes identifiés et maîtrisés.",
          guidance: "Preuve : registre des non-conformités produit.",
        },
      ],
    },
    {
      chapter: "9-10. Performance et amélioration",
      items: [
        {
          clause: "9.1.2",
          requirement: "Satisfaction du client surveillée et exploitée.",
          guidance: "Preuves : enquêtes, analyse des réclamations.",
        },
        {
          clause: "9.2 / 9.3",
          requirement: "Audits internes réalisés selon programme et revue de direction complète tenue.",
          guidance: "Preuves : programme d'audit, compte rendu de revue.",
        },
        {
          clause: "10.2",
          requirement: "Non-conformités traitées avec analyse des causes et actions correctives efficaces.",
          guidance: "Suivre une non-conformité de bout en bout.",
        },
      ],
    },
  ],
};

export const iso14001Checklist: ChecklistTemplate = {
  id: "iso-14001",
  title: "Audit ISO 14001:2015",
  standard: "ISO 14001:2015",
  description: "Check-list synthétique du système de management environnemental.",
  sections: [
    {
      chapter: "4-5. Contexte et leadership",
      items: [
        {
          clause: "4.1 / 4.2",
          requirement: "Enjeux environnementaux, conditions environnementales et parties intéressées déterminés.",
          guidance: "Preuve : analyse environnementale.",
        },
        {
          clause: "5.2",
          requirement: "Politique environnementale engageant protection de l'environnement et conformité.",
          guidance: "Vérifier l'engagement de prévention de la pollution.",
        },
      ],
    },
    {
      chapter: "6. Planification",
      items: [
        {
          clause: "6.1.2",
          requirement: "Aspects environnementaux identifiés dans une perspective de cycle de vie, aspects significatifs déterminés.",
          guidance: "Preuves : analyse des aspects/impacts, critères de significativité.",
        },
        {
          clause: "6.1.3",
          requirement: "Obligations de conformité déterminées, accessibles et prises en compte.",
          guidance: "Preuve : veille réglementaire à jour.",
        },
        {
          clause: "6.2",
          requirement: "Objectifs environnementaux cohérents avec les aspects significatifs et planifiés.",
          guidance: "Preuve : programme environnemental.",
        },
      ],
    },
    {
      chapter: "7-8. Support et opérations",
      items: [
        {
          clause: "7.2 / 7.3",
          requirement: "Compétences et sensibilisation environnementales assurées.",
          guidance: "Interroger un opérateur sur les gestes de tri et de prévention.",
        },
        {
          clause: "8.1",
          requirement: "Maîtrise opérationnelle établie, y compris pour les processus externalisés et le cycle de vie.",
          guidance: "Preuves : consignes, exigences transmises aux prestataires.",
        },
        {
          clause: "8.2",
          requirement: "Préparation et réponse aux situations d'urgence environnementales testées.",
          guidance: "Preuves : scénarios (déversement, incendie), comptes rendus d'exercices.",
        },
      ],
    },
    {
      chapter: "9-10. Performance et amélioration",
      items: [
        {
          clause: "9.1.2",
          requirement: "Évaluation périodique de la conformité aux obligations réalisée.",
          guidance: "Preuve : bilan de conformité et suites données.",
        },
        {
          clause: "9.2 / 9.3",
          requirement: "Audits internes et revue de direction couvrant les performances environnementales.",
          guidance: "Preuves : rapports, compte rendu de revue.",
        },
        {
          clause: "10.2",
          requirement: "Non-conformités environnementales traitées et impacts atténués.",
          guidance: "Suivre un écart réel jusqu'à la vérification d'efficacité.",
        },
      ],
    },
  ],
};

export const iso27001Checklist: ChecklistTemplate = {
  id: "iso-27001",
  title: "Audit ISO/IEC 27001:2022",
  standard: "ISO/IEC 27001:2022",
  description: "Check-list synthétique du système de management de la sécurité de l'information.",
  sections: [
    {
      chapter: "4-6. Cadre du SMSI",
      items: [
        {
          clause: "4.3",
          requirement: "Domaine d'application du SMSI défini, incluant interfaces et dépendances.",
          guidance: "Preuve : document de périmètre, exclusions justifiées.",
        },
        {
          clause: "6.1.2",
          requirement: "Processus d'appréciation des risques de sécurité de l'information défini et appliqué.",
          guidance: "Preuves : méthode, critères d'acceptation, résultats.",
        },
        {
          clause: "6.1.3",
          requirement: "Traitement des risques défini avec déclaration d'applicabilité justifiée.",
          guidance: "Vérifier les mesures exclues et leur justification.",
        },
        {
          clause: "6.2",
          requirement: "Objectifs de sécurité de l'information établis et suivis.",
          guidance: "Preuve : indicateurs de sécurité.",
        },
      ],
    },
    {
      chapter: "7-8. Support et opérations",
      items: [
        {
          clause: "7.2 / 7.3",
          requirement: "Compétences et sensibilisation à la sécurité assurées pour tous les rôles concernés.",
          guidance: "Preuves : campagnes de sensibilisation, tests de phishing.",
        },
        {
          clause: "8.1",
          requirement: "Processus de sécurité planifiés, mis en œuvre et maîtrisés, y compris chez les prestataires.",
          guidance: "Preuves : procédures d'exploitation, clauses contractuelles.",
        },
        {
          clause: "8.2 / 8.3",
          requirement: "Appréciations et traitements des risques réalisés aux intervalles planifiés et après changement.",
          guidance: "Preuve : dates des dernières appréciations.",
        },
      ],
    },
    {
      chapter: "Annexe A (mesures)",
      items: [
        {
          clause: "A.5",
          requirement: "Mesures organisationnelles en place : politiques, rôles, gestion des fournisseurs, incidents.",
          guidance: "Preuves : politiques signées, registre des incidents.",
        },
        {
          clause: "A.6",
          requirement: "Mesures liées aux personnes : sélection, conditions d'emploi, départ, télétravail.",
          guidance: "Preuves : clauses de confidentialité, procédure de départ.",
        },
        {
          clause: "A.7",
          requirement: "Mesures physiques : zones sécurisées, contrôle d'accès, protection des équipements.",
          guidance: "Observer les accès et le bureau propre.",
        },
        {
          clause: "A.8",
          requirement: "Mesures technologiques : gestion des accès, journalisation, sauvegardes, vulnérabilités, cryptographie.",
          guidance: "Preuves : revues d'habilitations, tests de restauration, suivi des correctifs.",
        },
      ],
    },
    {
      chapter: "9-10. Performance et amélioration",
      items: [
        {
          clause: "9.2 / 9.3",
          requirement: "Audits internes et revue de direction du SMSI réalisés.",
          guidance: "Preuves : programme d'audit, compte rendu.",
        },
        {
          clause: "10.2",
          requirement: "Non-conformités traitées, causes analysées, efficacité vérifiée.",
          guidance: "Suivre un incident de sécurité jusqu'à sa clôture.",
        },
      ],
    },
  ],
};

export const auditChecklistTemplates: ChecklistTemplate[] = [
  iso45001Checklist,
  iso19011Checklist,
  iso9001Checklist,
  iso14001Checklist,
  iso27001Checklist,
];
