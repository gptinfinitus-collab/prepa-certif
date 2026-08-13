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
    "Check-list exigence par exigence du système de management de la S&ST, du contexte à l'amélioration continue.",
  sections: [
    {
      chapter: "4. Contexte de l'organisme",
      items: [
        {
          clause: "4.1",
          requirement:
            "Enjeux externes et internes pertinents pour la finalité de l'organisme déterminés.",
          guidance:
            "Faire expliquer la méthode (PESTEL, SWOT) et les sources. Preuve : analyse de contexte datée.",
        },
        {
          clause: "4.1",
          requirement:
            "Effets du changement climatique examinés comme enjeu pertinent (Amd 1:2024).",
          guidance:
            "Chaleur, épisodes extrêmes, qualité de l'air pour les postes exposés. Preuve : trace de l'examen, même si conclu non pertinent.",
        },
        {
          clause: "4.1",
          requirement: "Enjeux revus et tenus à jour à une fréquence définie.",
          guidance:
            "Comparer la date de la dernière revue aux changements survenus. Preuve : revue de direction, mise à jour de l'analyse.",
        },
        {
          clause: "4.2",
          requirement: "Travailleurs et autres parties intéressées pertinents identifiés.",
          guidance:
            "Vérifier la présence des sous-traitants, intérimaires, visiteurs, riverains. Preuve : cartographie des parties intéressées.",
        },
        {
          clause: "4.2",
          requirement: "Besoins et attentes de ces parties intéressées déterminés.",
          guidance: "Demander comment les attentes ont été recueillies (enquêtes, CSE, réunions).",
        },
        {
          clause: "4.2",
          requirement:
            "Besoins et attentes retenus comme obligations de conformité identifiés comme tels.",
          guidance:
            "Vérifier le tri entre attente simple et engagement retenu. Preuve : liste des obligations de conformité.",
        },
        {
          clause: "4.2",
          requirement:
            "Attentes des parties intéressées relatives au changement climatique examinées (Amd 1:2024).",
          guidance: "Exigences clients, assureurs, autorités locales. Preuve : trace de l'examen.",
        },
        {
          clause: "4.3",
          requirement:
            "Domaine d'application déterminé en tenant compte des enjeux, des obligations et des activités planifiées.",
          guidance:
            "Faire justifier chaque limite retenue. Preuve : énoncé du domaine d'application.",
        },
        {
          clause: "4.3",
          requirement:
            "Domaine incluant les activités, produits et services sous le contrôle ou l'influence de l'organisme.",
          guidance:
            "Chercher les exclusions non justifiées : télétravail, chantiers, sous-traitants sur site.",
        },
        {
          clause: "4.3",
          requirement: "Domaine d'application disponible sous forme d'information documentée.",
          guidance:
            "Vérifier version, date d'approbation et accessibilité aux parties intéressées.",
        },
        {
          clause: "4.4",
          requirement:
            "Système de management de la S&ST établi, mis en œuvre, tenu à jour et amélioré en continu.",
          guidance: "Chercher les preuves de vie du système sur les 12 derniers mois.",
        },
        {
          clause: "4.4",
          requirement: "Processus nécessaires et leurs interactions déterminés.",
          guidance:
            "Faire dérouler un processus de bout en bout. Preuve : cartographie des processus.",
        },
      ],
    },
    {
      chapter: "5. Leadership et participation des travailleurs",
      items: [
        {
          clause: "5.1",
          requirement:
            "La direction assume la responsabilité globale de la prévention des lésions et pathologies.",
          guidance:
            "Entretien direction : qui répond en cas d'accident grave ? Preuve : délégations, comptes rendus.",
        },
        {
          clause: "5.1",
          requirement: "Politique et objectifs S&ST compatibles avec l'orientation stratégique.",
          guidance: "Croiser le plan stratégique et les objectifs S&ST.",
        },
        {
          clause: "5.1",
          requirement: "Intégration des exigences du système aux processus métier de l'organisme.",
          guidance:
            "Vérifier que la S&ST apparaît dans les projets, achats, RH — pas dans un silo.",
        },
        {
          clause: "5.1",
          requirement: "Ressources nécessaires au système disponibles.",
          guidance:
            "Budget prévention, effectif dédié, temps alloué. Preuve : budget, fiches de poste.",
        },
        {
          clause: "5.1",
          requirement:
            "Importance d'un management efficace et de la conformité aux exigences communiquée.",
          guidance: "Interroger des travailleurs sur les messages reçus de la direction.",
        },
        {
          clause: "5.1",
          requirement: "Atteinte des résultats escomptés du système assurée et suivie.",
          guidance: "Comparer les résultats escomptés annoncés et les indicateurs suivis.",
        },
        {
          clause: "5.1",
          requirement:
            "Développement, pilotage et promotion d'une culture soutenant les résultats du système.",
          guidance:
            "Chercher des signaux : visites terrain de la direction, valorisation des remontées.",
        },
        {
          clause: "5.1",
          requirement:
            "Protection des travailleurs contre les représailles lorsqu'ils signalent incidents, dangers ou risques.",
          guidance:
            "Interroger des travailleurs : que se passe-t-il si on signale un danger ? Preuve : procédure de signalement.",
        },
        {
          clause: "5.1",
          requirement:
            "Processus de consultation et de participation des travailleurs établis et soutenus.",
          guidance: "Vérifier l'existence et la vitalité des instances. Preuve : comptes rendus.",
        },
        {
          clause: "5.1",
          requirement: "Constitution et fonctionnement de comités santé et sécurité soutenus.",
          guidance: "Fréquence des réunions, représentativité, suites données aux demandes.",
        },
        {
          clause: "5.2",
          requirement:
            "Politique S&ST appropriée à la finalité, à la taille et au contexte de l'organisme.",
          guidance:
            "Une politique générique recopiée est un signal faible : chercher la spécificité des risques.",
        },
        {
          clause: "5.2",
          requirement:
            "Engagement à fournir des conditions de travail sûres et saines, formulé au regard des risques.",
          guidance: "Vérifier la cohérence avec les dangers réels identifiés.",
        },
        {
          clause: "5.2",
          requirement: "Engagement à satisfaire aux exigences légales et autres exigences.",
          guidance: "Croiser avec la veille réglementaire.",
        },
        {
          clause: "5.2",
          requirement: "Engagement à éliminer les dangers et à réduire les risques pour la S&ST.",
          guidance: "Chercher des preuves d'élimination, pas seulement d'EPI.",
        },
        {
          clause: "5.2",
          requirement: "Engagement à l'amélioration continue du système.",
          guidance: "Croiser avec les objectifs et le plan d'actions.",
        },
        {
          clause: "5.2",
          requirement:
            "Engagement à la consultation et à la participation des travailleurs et de leurs représentants.",
          guidance: "Croiser avec les preuves du 5.4.",
        },
        {
          clause: "5.2",
          requirement:
            "Politique documentée, communiquée, disponible pour les parties intéressées et revue périodiquement.",
          guidance: "Vérifier la date de signature et l'affichage effectif sur le terrain.",
        },
        {
          clause: "5.3",
          requirement:
            "Rôles, responsabilités et autorités attribués, documentés et communiqués à tous les niveaux.",
          guidance:
            "Demander à un travailleur qui décide de l'arrêt d'une tâche dangereuse. Preuve : fiches de poste, organigramme.",
        },
        {
          clause: "5.3",
          requirement:
            "Chaque travailleur assume la responsabilité des aspects du système dont il a la maîtrise.",
          guidance: "Vérifier la compréhension réelle lors des entretiens terrain.",
        },
        {
          clause: "5.3",
          requirement:
            "Responsabilité et autorité attribuées pour rendre compte de la performance du système à la direction.",
          guidance: "Identifier la personne et les comptes rendus effectifs.",
        },
        {
          clause: "5.4",
          requirement:
            "Mécanismes de consultation des travailleurs non-encadrants établis à tous les niveaux et fonctions.",
          guidance:
            "Distinguer consultation (avant décision) et information. Preuve : comptes rendus d'instances.",
        },
        {
          clause: "5.4",
          requirement:
            "Participation des travailleurs à l'identification des dangers, à l'évaluation des risques et à la détermination des mesures.",
          guidance: "Faire nommer un exemple récent où une remontée terrain a changé une mesure.",
        },
        {
          clause: "5.4",
          requirement:
            "Obstacles à la participation identifiés et supprimés (temps, langue, alphabétisation, crainte de représailles).",
          guidance: "Interroger des travailleurs allophones ou intérimaires.",
        },
        {
          clause: "5.4",
          requirement:
            "Accès fourni à une information claire, compréhensible et pertinente sur le système.",
          guidance: "Vérifier la lisibilité des supports pour les publics concernés.",
        },
      ],
    },
    {
      chapter: "6. Planification",
      items: [
        {
          clause: "6.1.1",
          requirement:
            "Risques et opportunités du système déterminés en tenant compte du contexte, des parties intéressées et du domaine d'application.",
          guidance:
            "Ne pas confondre risques S&ST et risques du système de management. Preuve : registre risques/opportunités.",
        },
        {
          clause: "6.1.1",
          requirement:
            "Prise en compte des dangers, des risques S&ST, des exigences légales et des changements planifiés.",
          guidance: "Vérifier que les entrées de la planification sont tracées.",
        },
        {
          clause: "6.1.1",
          requirement:
            "Informations documentées tenues à jour sur les risques, les opportunités et les processus de planification.",
          guidance:
            "Vérifier la date de dernière mise à jour et le lien avec les changements récents.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Processus d'identification des dangers continu et proactif, et non déclenché seulement après incident.",
          guidance:
            "Chercher la fréquence et les déclencheurs. Preuve : procédure d'identification des dangers.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Prise en compte de l'organisation du travail, des facteurs sociaux, de la charge de travail et du harcèlement.",
          guidance:
            "Les risques psychosociaux sont l'oubli le plus fréquent. Preuve : évaluation RPS.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Prise en compte des activités et situations routinières et non routinières.",
          guidance: "Maintenance, arrêts, interventions d'urgence, travaux exceptionnels.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Prise en compte des incidents passés, internes et externes, et de leurs causes.",
          guidance: "Croiser le registre des incidents et l'évaluation des risques.",
        },
        {
          clause: "6.1.2.1",
          requirement: "Prise en compte des situations d'urgence potentielles.",
          guidance: "Croiser avec le 8.2 : mêmes scénarios des deux côtés ?",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Prise en compte des personnes concernées : travailleurs, sous-traitants, visiteurs, voisinage.",
          guidance: "Vérifier la couverture des intervenants extérieurs.",
        },
        {
          clause: "6.1.2.1",
          requirement:
            "Prise en compte des modifications de l'organisation, des procédés, des activités et des connaissances.",
          guidance: "Croiser avec la conduite du changement (8.1.3).",
        },
        {
          clause: "6.1.2.2",
          requirement:
            "Méthodes et critères d'évaluation des risques définis, documentés et appliqués de manière proactive.",
          guidance: "Faire dérouler la cotation sur un poste réel. Preuve : méthode documentée.",
        },
        {
          clause: "6.1.2.2",
          requirement:
            "Risques pour la S&ST évalués à partir des dangers identifiés, en tenant compte des mesures existantes.",
          guidance:
            "Vérifier la cohérence entre criticité et priorité des actions. Preuve : document unique.",
        },
        {
          clause: "6.1.2.2",
          requirement: "Autres risques du système de management évalués.",
          guidance:
            "Ne pas se limiter aux risques terrain : compétences, sous-traitance, obsolescence documentaire.",
        },
        {
          clause: "6.1.2.3",
          requirement:
            "Opportunités d'amélioration de la S&ST identifiées, y compris l'adaptation du travail aux travailleurs.",
          guidance:
            "Ergonomie, nouvelles technologies, réorganisation. Chercher des exemples concrets.",
        },
        {
          clause: "6.1.2.3",
          requirement:
            "Opportunités d'amélioration du système de management identifiées et évaluées.",
          guidance: "Croiser avec les entrées de la revue de direction.",
        },
        {
          clause: "6.1.3",
          requirement:
            "Exigences légales et autres exigences applicables déterminées et accessibles.",
          guidance: "Tester une évolution réglementaire récente. Preuve : veille réglementaire.",
        },
        {
          clause: "6.1.3",
          requirement:
            "Prise en compte de ces exigences dans l'établissement et la mise en œuvre du système.",
          guidance: "Croiser une exigence légale précise et la procédure correspondante.",
        },
        {
          clause: "6.1.3",
          requirement:
            "Exigences tenues à jour, communiquées et disponibles sous forme d'information documentée.",
          guidance: "Vérifier les dates de mise à jour et la diffusion aux personnes concernées.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Actions planifiées pour traiter les risques, les opportunités, les exigences légales et les situations d'urgence.",
          guidance: "Preuve : plan d'actions avec pilotes et échéances.",
        },
        {
          clause: "6.1.4",
          requirement: "Actions intégrées aux processus du système et leur efficacité évaluée.",
          guidance: "Chercher la revue d'efficacité, pas seulement la clôture de l'action.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Hiérarchie des mesures de maîtrise prise en compte lors de la planification des actions.",
          guidance: "L'EPI en première réponse est une non-conformité fréquente.",
        },
        {
          clause: "6.1.4",
          requirement:
            "Bonnes pratiques, options technologiques et contraintes financières et opérationnelles prises en compte.",
          guidance: "Faire justifier un arbitrage récent.",
        },
        {
          clause: "6.2.1",
          requirement:
            "Objectifs S&ST établis aux fonctions et niveaux pertinents, cohérents avec la politique.",
          guidance: "Chercher des objectifs déclinés au-delà du service HSE.",
        },
        {
          clause: "6.2.1",
          requirement:
            "Objectifs mesurables ou évaluables, tenant compte des exigences, des résultats d'évaluation et de la consultation des travailleurs.",
          guidance: "Demander comment un objectif est mesuré et par qui.",
        },
        {
          clause: "6.2.1",
          requirement: "Objectifs surveillés, communiqués et mis à jour le cas échéant.",
          guidance:
            "Vérifier la communication aux travailleurs, pas seulement au comité de direction.",
        },
        {
          clause: "6.2.2",
          requirement:
            "Planification des objectifs précisant ce qui sera fait et les ressources nécessaires.",
          guidance: "Un objectif sans ressource est un objectif d'affichage.",
        },
        {
          clause: "6.2.2",
          requirement: "Responsable et échéance définis pour chaque objectif.",
          guidance: "Vérifier que le pilote est identifié nommément.",
        },
        {
          clause: "6.2.2",
          requirement:
            "Mode d'évaluation des résultats défini, y compris les indicateurs de surveillance.",
          guidance: "Demander l'indicateur associé et sa source de données.",
        },
        {
          clause: "6.2.2",
          requirement: "Intégration des actions relatives aux objectifs dans les processus métier.",
          guidance: "Chercher la trace dans les plans de service, pas seulement dans le plan HSE.",
        },
        {
          clause: "6.2.2",
          requirement:
            "Informations documentées tenues à jour sur les objectifs et les plans associés.",
          guidance: "Vérifier la version en vigueur et le suivi d'avancement.",
        },
      ],
    },
    {
      chapter: "7. Support",
      items: [
        {
          clause: "7.1",
          requirement:
            "Ressources nécessaires à l'établissement, la mise en œuvre et l'amélioration du système déterminées et fournies.",
          guidance:
            "Budget prévention, effectifs, temps, matériel. Preuve : budget, moyens alloués.",
        },
        {
          clause: "7.2",
          requirement:
            "Compétences nécessaires déterminées pour les travailleurs qui influent sur la performance S&ST.",
          guidance:
            "Y compris la compétence à identifier les dangers. Preuve : matrice de compétences.",
        },
        {
          clause: "7.2",
          requirement:
            "Compétence assurée sur la base d'une formation, d'un enseignement ou d'une expérience appropriés.",
          guidance: "Croiser un poste à risque avec les habilitations en cours de validité.",
        },
        {
          clause: "7.2",
          requirement:
            "Actions engagées pour acquérir et maintenir la compétence, et leur efficacité évaluée.",
          guidance: "Chercher l'évaluation à froid, pas seulement la feuille de présence.",
        },
        {
          clause: "7.2",
          requirement: "Informations documentées conservées comme preuves de compétence.",
          guidance: "Vérifier l'archivage et les dates de recyclage.",
        },
        {
          clause: "7.3",
          requirement: "Travailleurs sensibilisés à la politique et aux objectifs S&ST.",
          guidance: "Interroger trois travailleurs sur le contenu de la politique.",
        },
        {
          clause: "7.3",
          requirement:
            "Sensibilisation à leur contribution à l'efficacité du système et aux bénéfices d'une performance améliorée.",
          guidance: "Chercher une formulation en termes concrets de poste.",
        },
        {
          clause: "7.3",
          requirement:
            "Sensibilisation aux implications d'une non-conformité aux exigences du système.",
          guidance: "Vérifier que le message ne se limite pas à la sanction.",
        },
        {
          clause: "7.3",
          requirement:
            "Sensibilisation aux incidents et aux résultats des investigations les concernant.",
          guidance: "Preuve : flashs sécurité, retours d'expérience diffusés.",
        },
        {
          clause: "7.3",
          requirement:
            "Sensibilisation aux dangers, risques et mesures de maîtrise qui les concernent.",
          guidance: "Interroger un travailleur sur les risques de son poste.",
        },
        {
          clause: "7.3",
          requirement:
            "Travailleurs informés de leur capacité à se retirer d'une situation de danger grave et imminent.",
          guidance: "Question de terrain incontournable. Preuve : accueil sécurité, affichage.",
        },
        {
          clause: "7.3",
          requirement:
            "Travailleurs informés des dispositions les protégeant de conséquences indues après un tel retrait.",
          guidance: "Croiser avec le 5.1 sur les représailles.",
        },
        {
          clause: "7.4.1",
          requirement:
            "Processus de communication interne et externe défini : quoi, quand, avec qui, comment.",
          guidance: "Preuve : matrice ou procédure de communication.",
        },
        {
          clause: "7.4.1",
          requirement:
            "Prise en compte de la diversité des travailleurs : langue, culture, alphabétisation, handicap.",
          guidance: "Vérifier l'existence de supports adaptés sur les sites concernés.",
        },
        {
          clause: "7.4.1",
          requirement:
            "Points de vue des parties intéressées externes pris en compte dans la communication.",
          guidance: "Plaintes de riverains, demandes clients, exigences des donneurs d'ordre.",
        },
        {
          clause: "7.4.2",
          requirement:
            "Communication interne des informations pertinentes à tous les niveaux et fonctions, y compris lors des changements.",
          guidance: "Tester la remontée d'une information S&ST par un travailleur.",
        },
        {
          clause: "7.4.2",
          requirement:
            "Processus de communication permettant aux travailleurs de contribuer à l'amélioration continue.",
          guidance: "Chercher les suites données aux remontées : le silence tue le dispositif.",
        },
        {
          clause: "7.4.3",
          requirement:
            "Communication externe des informations pertinentes conformément aux processus et aux obligations de conformité.",
          guidance: "Déclarations obligatoires, information des sous-traitants et visiteurs.",
        },
        {
          clause: "7.5.1",
          requirement:
            "Système comprenant les informations documentées exigées par la norme et celles jugées nécessaires à son efficacité.",
          guidance: "Vérifier l'inventaire documentaire et les manques.",
        },
        {
          clause: "7.5.2",
          requirement:
            "Création et mise à jour : identification, description, format et support appropriés.",
          guidance: "Contrôler les références, dates et versions sur un échantillon.",
        },
        {
          clause: "7.5.2",
          requirement:
            "Revue et approbation des informations documentées quant à leur pertinence et leur adéquation.",
          guidance: "Vérifier la signature d'approbation sur un document récent.",
        },
        {
          clause: "7.5.3",
          requirement:
            "Informations documentées disponibles et appropriées là où elles sont nécessaires.",
          guidance: "Aller vérifier au poste de travail, pas seulement au bureau qualité.",
        },
        {
          clause: "7.5.3",
          requirement:
            "Informations documentées protégées : confidentialité, usage impropre, perte d'intégrité.",
          guidance:
            "Vérifier les droits d'accès et les sauvegardes, notamment pour les données de santé.",
        },
        {
          clause: "7.5.3",
          requirement:
            "Maîtrise de la distribution, de l'accès, de la récupération et de l'utilisation.",
          guidance: "Chercher des versions périmées encore en circulation sur le terrain.",
        },
        {
          clause: "7.5.3",
          requirement:
            "Maîtrise des modifications, de la conservation et de l'élimination des informations documentées.",
          guidance: "Vérifier la durée de conservation des dossiers réglementaires.",
        },
        {
          clause: "7.5.3",
          requirement: "Informations documentées d'origine extérieure identifiées et maîtrisées.",
          guidance: "Normes, notices fabricant, FDS : vérifier les versions à jour.",
        },
      ],
    },
    {
      chapter: "8. Réalisation des activités opérationnelles",
      items: [
        {
          clause: "8.1.1",
          requirement:
            "Processus opérationnels planifiés, mis en œuvre, maîtrisés et tenus à jour.",
          guidance: "Faire dérouler un processus à risque de bout en bout.",
        },
        {
          clause: "8.1.1",
          requirement: "Critères d'exécution des processus établis.",
          guidance: "Chercher les modes opératoires et les seuils d'arrêt.",
        },
        {
          clause: "8.1.1",
          requirement: "Maîtrise mise en œuvre conformément aux critères établis.",
          guidance: "Comparer la pratique observée au mode opératoire écrit.",
        },
        {
          clause: "8.1.1",
          requirement:
            "Adaptation du travail aux travailleurs prise en compte dans la conception des postes et des procédés.",
          guidance: "Ergonomie, horaires, cadence. Preuve : études de poste.",
        },
        {
          clause: "8.1.1",
          requirement:
            "Coordination des parties pertinentes lorsque plusieurs employeurs interviennent sur un même lieu de travail.",
          guidance: "Preuve : plan de prévention, protocole de sécurité, réunions de coordination.",
        },
        {
          clause: "8.1.2",
          requirement: "Élimination des dangers recherchée en priorité.",
          guidance: "Demander un exemple d'élimination réalisée dans l'année.",
        },
        {
          clause: "8.1.2",
          requirement:
            "Substitution par des procédés, matériels ou matériaux moins dangereux mise en œuvre lorsque possible.",
          guidance: "Chercher les substitutions de produits chimiques.",
        },
        {
          clause: "8.1.2",
          requirement: "Mesures techniques et réorganisation du travail mises en œuvre.",
          guidance: "Protections collectives, automatisation, séparation homme-machine.",
        },
        {
          clause: "8.1.2",
          requirement: "Mesures administratives, dont la formation, mises en œuvre.",
          guidance: "Permis de travail, consignation, rotation des postes.",
        },
        {
          clause: "8.1.2",
          requirement:
            "Équipements de protection individuelle adaptés fournis gratuitement et leur port assuré.",
          guidance:
            "Vérifier la fourniture gratuite, l'adaptation morphologique et le remplacement.",
        },
        {
          clause: "8.1.3",
          requirement:
            "Processus de conduite du changement établi pour les changements temporaires et permanents.",
          guidance: "Preuve : procédure de management du changement.",
        },
        {
          clause: "8.1.3",
          requirement:
            "Prise en compte des nouveaux produits, services, procédés, lieux de travail et équipements.",
          guidance: "Croiser un projet récent et l'analyse de risques associée.",
        },
        {
          clause: "8.1.3",
          requirement:
            "Prise en compte des évolutions des exigences légales et des connaissances sur les dangers.",
          guidance: "Tester une évolution réglementaire récente et son impact opérationnel.",
        },
        {
          clause: "8.1.3",
          requirement:
            "Conséquences non intentionnelles des changements revues et actions engagées si nécessaire.",
          guidance: "Chercher la revue post-changement, souvent absente.",
        },
        {
          clause: "8.1.4.1",
          requirement:
            "Processus d'achat maîtrisé afin d'assurer la conformité des biens et services aux exigences du système.",
          guidance: "Vérifier les clauses S&ST dans les cahiers des charges et commandes.",
        },
        {
          clause: "8.1.4.2",
          requirement:
            "Achats auprès des sous-traitants coordonnés et critères S&ST intégrés à leur sélection.",
          guidance: "Preuve : grille de sélection, évaluation périodique des sous-traitants.",
        },
        {
          clause: "8.1.4.2",
          requirement:
            "Dangers issus des activités des sous-traitants identifiés et risques maîtrisés.",
          guidance: "Croiser plan de prévention et activités réellement réalisées sur site.",
        },
        {
          clause: "8.1.4.3",
          requirement:
            "Fonctions et processus externalisés maîtrisés, avec un type et un degré de maîtrise définis.",
          guidance: "Vérifier ce qui reste sous la responsabilité de l'organisme.",
        },
        {
          clause: "8.1.4.3",
          requirement:
            "Maîtrise de l'externalisation cohérente avec les exigences légales et les résultats escomptés.",
          guidance: "Croiser le contrat et les obligations réglementaires applicables.",
        },
        {
          clause: "8.2",
          requirement:
            "Situations d'urgence potentielles identifiées et réponse planifiée, y compris les premiers secours.",
          guidance: "Croiser la liste des scénarios avec l'analyse des risques (6.1.2.1).",
        },
        {
          clause: "8.2",
          requirement: "Formation à la réponse planifiée dispensée aux personnes concernées.",
          guidance: "Vérifier les effectifs formés par équipe, y compris en horaires décalés.",
        },
        {
          clause: "8.2",
          requirement:
            "Essais périodiques et exercices d'aptitude de la réponse planifiée réalisés.",
          guidance: "Vérifier la fréquence, les scénarios joués et la nuit / le week-end.",
        },
        {
          clause: "8.2",
          requirement:
            "Performance évaluée et réponse révisée après les exercices et après toute urgence réelle.",
          guidance: "Preuve : compte rendu d'exercice avec plan d'actions.",
        },
        {
          clause: "8.2",
          requirement:
            "Informations pertinentes communiquées aux travailleurs, sous-traitants, visiteurs et services de secours.",
          guidance: "Vérifier l'accueil des visiteurs et les consignes affichées.",
        },
        {
          clause: "8.2",
          requirement:
            "Informations documentées tenues à jour sur les processus et les plans de réponse aux urgences.",
          guidance: "Vérifier les plans d'évacuation à jour et les listes de contacts.",
        },
      ],
    },
    {
      chapter: "9. Évaluation des performances",
      items: [
        {
          clause: "9.1.1",
          requirement: "Éléments à surveiller et à mesurer déterminés.",
          guidance: "Chercher l'équilibre entre indicateurs réactifs et proactifs.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Méthodes de surveillance, mesure, analyse et évaluation définies pour assurer des résultats valides.",
          guidance: "Faire expliquer la méthode de calcul d'un indicateur clé.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Critères d'évaluation de la performance S&ST définis, avec des indicateurs appropriés.",
          guidance: "Vérifier la comparaison à une cible, pas seulement le suivi brut.",
        },
        {
          clause: "9.1.1",
          requirement: "Fréquence de la surveillance et moments d'analyse et d'évaluation définis.",
          guidance: "Croiser la fréquence annoncée et les relevés réels.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Équipements de surveillance et de mesure étalonnés ou vérifiés, utilisés et tenus à jour.",
          guidance:
            "Sonomètres, détecteurs de gaz, appareils de mesure : vérifier les certificats.",
        },
        {
          clause: "9.1.1",
          requirement:
            "Informations documentées conservées comme preuves des résultats et de l'entretien des équipements.",
          guidance: "Vérifier la traçabilité des relevés sur douze mois.",
        },
        {
          clause: "9.1.2",
          requirement:
            "Processus d'évaluation de la conformité aux exigences légales et autres exigences établi.",
          guidance: "Preuve : procédure d'évaluation de conformité.",
        },
        {
          clause: "9.1.2",
          requirement: "Fréquence et méthodes d'évaluation de la conformité déterminées.",
          guidance: "Vérifier que la fréquence est adaptée au niveau de risque.",
        },
        {
          clause: "9.1.2",
          requirement: "Conformité évaluée et actions engagées en cas d'écart.",
          guidance: "Croiser une non-conformité réglementaire détectée et son traitement.",
        },
        {
          clause: "9.1.2",
          requirement:
            "Connaissance et compréhension du statut de conformité maintenues, avec informations documentées conservées.",
          guidance: "Demander à la direction où en est la conformité réglementaire aujourd'hui.",
        },
        {
          clause: "9.2.1",
          requirement:
            "Audits internes réalisés à intervalles planifiés pour vérifier la conformité et la mise en œuvre efficace du système.",
          guidance: "Vérifier la couverture de tous les processus sur le cycle.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Programme d'audit planifié : fréquence, méthodes, responsabilités, consultation, exigences de planification et rapport.",
          guidance: "Preuve : programme d'audit annuel approuvé.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Programme tenant compte de l'importance des processus et des résultats des audits précédents.",
          guidance: "Vérifier que les zones à problème sont auditées plus souvent.",
        },
        {
          clause: "9.2.2",
          requirement: "Critères et périmètre définis pour chaque audit.",
          guidance: "Contrôler la lettre de mission ou le plan d'audit.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Auditeurs sélectionnés de manière à assurer l'objectivité et l'impartialité du processus.",
          guidance: "Vérifier qu'aucun auditeur n'audite son propre travail.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Résultats rapportés aux managers concernés, aux travailleurs et à leurs représentants.",
          guidance: "Preuve : diffusion des rapports, compte rendu en instance.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Actions engagées pour traiter les non-conformités et améliorer en continu la performance.",
          guidance: "Croiser les constats d'audit et le plan d'actions.",
        },
        {
          clause: "9.2.2",
          requirement:
            "Informations documentées conservées comme preuves du programme et des résultats d'audit.",
          guidance: "Vérifier l'archivage des rapports et des preuves.",
        },
        {
          clause: "9.3",
          requirement: "Revue de direction réalisée à intervalles planifiés par la direction.",
          guidance: "Vérifier la présence effective des dirigeants, pas seulement du HSE.",
        },
        {
          clause: "9.3",
          requirement:
            "Entrée : état d'avancement des actions décidées lors des revues précédentes.",
          guidance: "Chercher le suivi ligne à ligne des décisions antérieures.",
        },
        {
          clause: "9.3",
          requirement:
            "Entrée : changements des enjeux externes et internes, y compris exigences légales, risques et opportunités.",
          guidance: "Croiser avec le 4.1 et le registre des risques.",
        },
        {
          clause: "9.3",
          requirement: "Entrée : degré de réalisation de la politique et des objectifs S&ST.",
          guidance: "Vérifier la comparaison chiffrée aux cibles.",
        },
        {
          clause: "9.3",
          requirement:
            "Entrée : informations sur la performance — incidents, non-conformités, surveillance, conformité légale, audits, consultation, risques.",
          guidance: "Vérifier l'exhaustivité des rubriques exigées.",
        },
        {
          clause: "9.3",
          requirement: "Entrée : adéquation des ressources pour maintenir un système efficace.",
          guidance: "Chercher une décision d'allocation de ressources issue de la revue.",
        },
        {
          clause: "9.3",
          requirement:
            "Entrée : communications pertinentes des parties intéressées, y compris les plaintes.",
          guidance: "Plaintes de riverains, demandes clients, remarques de l'inspection.",
        },
        {
          clause: "9.3",
          requirement: "Entrée : opportunités d'amélioration continue identifiées.",
          guidance: "Croiser avec le 6.1.2.3 et les suggestions des travailleurs.",
        },
        {
          clause: "9.3",
          requirement:
            "Sortie : conclusions sur la pertinence, l'adéquation et l'efficacité du système.",
          guidance: "Une revue sans conclusion explicite est une non-conformité.",
        },
        {
          clause: "9.3",
          requirement:
            "Sortie : décisions sur les orientations d'amélioration, les changements, les ressources et les actions nécessaires.",
          guidance: "Vérifier que chaque décision a un pilote et une échéance.",
        },
        {
          clause: "9.3",
          requirement:
            "Sortie : opportunités d'intégration au sein des autres processus métier et implications pour l'orientation stratégique.",
          guidance: "Chercher le lien avec le plan stratégique.",
        },
        {
          clause: "9.3",
          requirement:
            "Résultats pertinents de la revue communiqués aux travailleurs et à leurs représentants, et informations documentées conservées.",
          guidance: "Vérifier la diffusion effective au-delà du comité de direction.",
        },
      ],
    },
    {
      chapter: "10. Amélioration",
      items: [
        {
          clause: "10.1",
          requirement:
            "Opportunités d'amélioration déterminées et actions nécessaires mises en œuvre pour atteindre les résultats escomptés.",
          guidance:
            "Croiser les sources d'amélioration (audits, incidents, suggestions) et les actions engagées.",
        },
        {
          clause: "10.2",
          requirement:
            "Réaction en temps utile aux incidents et non-conformités : maîtrise, correction et traitement des conséquences.",
          guidance: "Vérifier les délais entre survenue, déclaration et première action.",
        },
        {
          clause: "10.2",
          requirement:
            "Participation des travailleurs et implication des parties intéressées pertinentes à l'investigation.",
          guidance:
            "Chercher la présence de représentants du personnel dans les analyses d'accident.",
        },
        {
          clause: "10.2",
          requirement:
            "Évaluation du besoin d'actions correctives par une analyse des causes profondes.",
          guidance:
            "Refuser « inattention du salarié » comme cause racine. Preuve : arbre des causes, 5 pourquoi.",
        },
        {
          clause: "10.2",
          requirement:
            "Recherche d'incidents ou de non-conformités similaires existants ou susceptibles de se produire ailleurs.",
          guidance: "Vérifier l'extension des actions aux autres sites ou lignes.",
        },
        {
          clause: "10.2",
          requirement:
            "Évaluation des risques S&ST liés à des dangers nouveaux ou modifiés avant d'engager les actions.",
          guidance: "Croiser avec la mise à jour de l'évaluation des risques.",
        },
        {
          clause: "10.2",
          requirement:
            "Revue des mesures de maîtrise existantes au regard de la hiérarchie des mesures.",
          guidance: "Vérifier qu'on ne se contente pas d'ajouter une consigne.",
        },
        {
          clause: "10.2",
          requirement: "Actions correctives mises en œuvre et leur efficacité revue.",
          guidance: "Chercher la revue d'efficacité à distance, pas la simple clôture.",
        },
        {
          clause: "10.2",
          requirement: "Modification du système de management apportée si nécessaire.",
          guidance: "Procédures, formation, évaluation des risques mises à jour après l'événement.",
        },
        {
          clause: "10.2",
          requirement:
            "Informations documentées conservées sur les incidents, les non-conformités, les actions et les résultats, et communiquées.",
          guidance: "Vérifier le registre des incidents et sa diffusion aux travailleurs.",
        },
        {
          clause: "10.3",
          requirement: "Performance S&ST améliorée en continu.",
          guidance: "Analyser la tendance des indicateurs sur trois ans.",
        },
        {
          clause: "10.3",
          requirement: "Culture soutenant le système de management promue.",
          guidance: "Chercher des actions concrètes, pas seulement des slogans.",
        },
        {
          clause: "10.3",
          requirement:
            "Participation des travailleurs à la mise en œuvre des actions d'amélioration continue promue.",
          guidance: "Croiser avec le 5.4 et le nombre de suggestions traitées.",
        },
        {
          clause: "10.3",
          requirement:
            "Résultats de l'amélioration continue communiqués aux travailleurs et à leurs représentants.",
          guidance: "Vérifier les supports de communication et leur fréquence.",
        },
        {
          clause: "10.3",
          requirement:
            "Informations documentées conservées comme preuves de l'amélioration continue.",
          guidance: "Vérifier la traçabilité des actions clôturées et de leurs gains.",
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
    "Check-list étape par étape du programme d'audit et de la conduite d'un audit, du déclenchement au suivi.",
  sections: [
    {
      chapter: "Programme et déclenchement",
      items: [
        {
          clause: "5.1",
          requirement:
            "Objectifs du programme d'audit établis et cohérents avec les orientations stratégiques du commanditaire.",
          guidance:
            "Faire expliquer ce que le programme doit produire, au-delà du maintien du certificat.",
        },
        {
          clause: "5.2",
          requirement: "Risques et opportunités du programme d'audit déterminés et traités.",
          guidance: "Disponibilité des ressources, compétence, accès aux sites, confidentialité.",
        },
        {
          clause: "5.3",
          requirement:
            "Programme d'audit établi : étendue, calendrier, méthodes, ressources et critères.",
          guidance: "Preuve : programme annuel approuvé et diffusé.",
        },
        {
          clause: "5.4",
          requirement: "Rôles et responsabilités de la personne gérant le programme définis.",
          guidance: "Vérifier la compétence de cette personne, pas seulement sa nomination.",
        },
        {
          clause: "5.4",
          requirement:
            "Ressources du programme déterminées : temps, déplacements, outils, technologies d'audit à distance.",
          guidance: "Un programme non doté est un programme fictif.",
        },
        {
          clause: "6.2",
          requirement:
            "Audit déclenché avec des objectifs, un périmètre et des critères définis et validés.",
          guidance: "Preuve : lettre de mission ou fiche de lancement d'audit.",
        },
        {
          clause: "6.2",
          requirement:
            "Faisabilité de l'audit déterminée : information, coopération, temps et ressources suffisants.",
          guidance: "Chercher la trace de la décision de faisabilité.",
        },
        {
          clause: "6.2",
          requirement:
            "Contact établi avec l'audité : confirmation des modalités, confidentialité, accès et sécurité.",
          guidance: "Vérifier l'accord sur les accompagnateurs et observateurs.",
        },
      ],
    },
    {
      chapter: "Préparation de l'audit",
      items: [
        {
          clause: "6.3.1",
          requirement:
            "Revue des informations documentées pertinentes réalisée avant l'audit sur site.",
          guidance: "Vérifier que l'auditeur connaît le système avant d'arriver.",
        },
        {
          clause: "6.3.1",
          requirement:
            "Adéquation et suffisance des informations documentées évaluées au regard des critères d'audit.",
          guidance: "Une documentation insuffisante peut justifier de reporter l'audit.",
        },
        {
          clause: "6.3.2",
          requirement:
            "Plan d'audit établi : objectifs, périmètre, critères, dates, lieux, horaires et rôles.",
          guidance: "Preuve : plan d'audit diffusé et accepté par l'audité.",
        },
        {
          clause: "6.3.2",
          requirement:
            "Plan d'audit fondé sur les risques et adapté à la taille et à la complexité de l'audité.",
          guidance: "Vérifier que le temps alloué aux processus critiques est suffisant.",
        },
        {
          clause: "6.3.2",
          requirement:
            "Méthodes d'audit sélectionnées : sur site, à distance, interactives ou non interactives.",
          guidance: "Justifier le recours à l'audit à distance et ses limites.",
        },
        {
          clause: "6.3.3",
          requirement:
            "Tâches réparties au sein de l'équipe d'audit selon les compétences et l'impartialité.",
          guidance: "Vérifier la déclaration d'impartialité de chaque auditeur.",
        },
        {
          clause: "6.3.4",
          requirement:
            "Documents de travail préparés : check-lists, plans d'échantillonnage, formulaires de constats.",
          guidance: "Une check-list rigide ne doit pas empêcher de suivre une piste.",
        },
        {
          clause: "6.3.4",
          requirement: "Plan d'échantillonnage défini et justifié.",
          guidance: "Faire expliquer la taille et le choix de l'échantillon.",
        },
      ],
    },
    {
      chapter: "Réalisation sur site",
      items: [
        {
          clause: "6.4.2",
          requirement:
            "Attribution des rôles aux guides et observateurs, et règles de comportement convenues.",
          guidance: "Le guide ne doit pas répondre à la place de l'audité.",
        },
        {
          clause: "6.4.3",
          requirement:
            "Réunion d'ouverture tenue : confirmation du plan, méthodes, canaux de communication, sécurité, confidentialité.",
          guidance: "Preuve : feuille de présence et compte rendu.",
        },
        {
          clause: "6.4.4",
          requirement:
            "Communication au sein de l'équipe et avec l'audité assurée pendant l'audit.",
          guidance: "Points d'étape quotidiens, alerte immédiate en cas de risque imminent.",
        },
        {
          clause: "6.4.5",
          requirement:
            "Disponibilité et accès aux informations gérés, y compris pour les activités à distance.",
          guidance: "Vérifier l'accès effectif aux systèmes et aux zones prévues.",
        },
        {
          clause: "6.4.6",
          requirement:
            "Informations collectées par échantillonnage approprié, puis vérifiées avant d'être retenues comme preuves.",
          guidance: "Une déclaration non vérifiée n'est pas une preuve d'audit.",
        },
        {
          clause: "6.4.6",
          requirement:
            "Preuves d'audit obtenues par entretiens, observation et revue documentaire, et enregistrées.",
          guidance: "Chercher la triangulation des trois sources.",
        },
        {
          clause: "6.4.7",
          requirement:
            "Constats d'audit établis en évaluant les preuves au regard des critères d'audit.",
          guidance: "Un constat sans référence à une exigence n'est pas recevable.",
        },
        {
          clause: "6.4.7",
          requirement:
            "Conformités, non-conformités et opportunités d'amélioration distinguées et qualifiées.",
          guidance: "Vérifier la cohérence du classement majeur / mineur.",
        },
        {
          clause: "6.4.7",
          requirement:
            "Non-conformités revues avec l'audité pour reconnaissance des preuves, avant conclusion.",
          guidance: "L'audité doit reconnaître les faits, pas nécessairement le classement.",
        },
        {
          clause: "6.4.8",
          requirement:
            "Conclusions d'audit préparées par l'équipe : aptitude du système, atteinte des objectifs, capacité à s'améliorer.",
          guidance: "Chercher une conclusion sur l'efficacité, pas un simple décompte de NC.",
        },
        {
          clause: "6.4.9",
          requirement:
            "Réunion de clôture tenue : présentation des constats et conclusions, calendrier des suites, divergences traitées.",
          guidance: "Preuve : compte rendu signé et liste de diffusion.",
        },
      ],
    },
    {
      chapter: "Rapport et suivi",
      items: [
        {
          clause: "6.5",
          requirement:
            "Rapport d'audit complet, exact, concis et clair, incluant objectifs, périmètre, critères, constats et conclusions.",
          guidance: "Vérifier la traçabilité de chaque constat vers une preuve.",
        },
        {
          clause: "6.5",
          requirement:
            "Rapport identifiant l'équipe d'audit, les personnes rencontrées, les dates et les lieux.",
          guidance: "Contrôler la présence des éléments d'identification obligatoires.",
        },
        {
          clause: "6.5",
          requirement:
            "Limites de l'audit, obstacles rencontrés et objectifs non atteints mentionnés.",
          guidance: "Zones non auditées, refus d'accès, indisponibilité de personnes clés.",
        },
        {
          clause: "6.6",
          requirement:
            "Rapport diffusé dans les délais convenus, aux destinataires prévus, en respectant la confidentialité.",
          guidance: "Vérifier la date d'émission par rapport au délai annoncé.",
        },
        {
          clause: "6.6",
          requirement:
            "Audit clôturé formellement lorsque toutes les activités planifiées sont réalisées.",
          guidance: "Preuve : mention de clôture et archivage du dossier d'audit.",
        },
        {
          clause: "6.7",
          requirement:
            "Corrections et actions correctives de l'audité soumises, revues et acceptées dans le délai convenu.",
          guidance: "Vérifier la pertinence de l'analyse des causes proposée.",
        },
        {
          clause: "6.7",
          requirement: "Efficacité des actions vérifiée, le cas échéant lors d'un audit ultérieur.",
          guidance: "Chercher la preuve de vérification, pas seulement la promesse d'action.",
        },
        {
          clause: "7",
          requirement:
            "Compétence des auditeurs évaluée et maintenue, y compris par la formation continue.",
          guidance: "Croiser avec le journal de développement professionnel continu.",
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
          requirement:
            "Contexte, parties intéressées et exigences pertinentes déterminés et surveillés.",
          guidance: "Preuves : analyse de contexte, revue de direction.",
        },
        {
          clause: "4.4",
          requirement:
            "Processus du SMQ déterminés avec entrées, sorties, séquence, critères et indicateurs.",
          guidance: "Preuve : cartographie et fiches processus.",
        },
        {
          clause: "5.1.2",
          requirement:
            "Orientation client démontrée : exigences client et réglementaires satisfaites, risques traités.",
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
          requirement:
            "Exigences relatives aux produits et services déterminées et revues avant engagement.",
          guidance: "Preuves : revue de commande, offres.",
        },
        {
          clause: "8.4",
          requirement: "Prestataires externes évalués, sélectionnés et surveillés.",
          guidance: "Preuves : évaluation fournisseurs, contrôles à réception.",
        },
        {
          clause: "8.5",
          requirement:
            "Production et prestation maîtrisées : identification, traçabilité, préservation, activités après livraison.",
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
          requirement:
            "Audits internes réalisés selon programme et revue de direction complète tenue.",
          guidance: "Preuves : programme d'audit, compte rendu de revue.",
        },
        {
          clause: "10.2",
          requirement:
            "Non-conformités traitées avec analyse des causes et actions correctives efficaces.",
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
          requirement:
            "Enjeux environnementaux, conditions environnementales et parties intéressées déterminés.",
          guidance: "Preuve : analyse environnementale.",
        },
        {
          clause: "5.2",
          requirement:
            "Politique environnementale engageant protection de l'environnement et conformité.",
          guidance: "Vérifier l'engagement de prévention de la pollution.",
        },
      ],
    },
    {
      chapter: "6. Planification",
      items: [
        {
          clause: "6.1.2",
          requirement:
            "Aspects environnementaux identifiés dans une perspective de cycle de vie, aspects significatifs déterminés.",
          guidance: "Preuves : analyse des aspects/impacts, critères de significativité.",
        },
        {
          clause: "6.1.3",
          requirement: "Obligations de conformité déterminées, accessibles et prises en compte.",
          guidance: "Preuve : veille réglementaire à jour.",
        },
        {
          clause: "6.2",
          requirement:
            "Objectifs environnementaux cohérents avec les aspects significatifs et planifiés.",
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
          requirement:
            "Maîtrise opérationnelle établie, y compris pour les processus externalisés et le cycle de vie.",
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
          requirement:
            "Audits internes et revue de direction couvrant les performances environnementales.",
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
          requirement:
            "Processus d'appréciation des risques de sécurité de l'information défini et appliqué.",
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
          requirement:
            "Compétences et sensibilisation à la sécurité assurées pour tous les rôles concernés.",
          guidance: "Preuves : campagnes de sensibilisation, tests de phishing.",
        },
        {
          clause: "8.1",
          requirement:
            "Processus de sécurité planifiés, mis en œuvre et maîtrisés, y compris chez les prestataires.",
          guidance: "Preuves : procédures d'exploitation, clauses contractuelles.",
        },
        {
          clause: "8.2 / 8.3",
          requirement:
            "Appréciations et traitements des risques réalisés aux intervalles planifiés et après changement.",
          guidance: "Preuve : dates des dernières appréciations.",
        },
      ],
    },
    {
      chapter: "Annexe A (mesures)",
      items: [
        {
          clause: "A.5",
          requirement:
            "Mesures organisationnelles en place : politiques, rôles, gestion des fournisseurs, incidents.",
          guidance: "Preuves : politiques signées, registre des incidents.",
        },
        {
          clause: "A.6",
          requirement:
            "Mesures liées aux personnes : sélection, conditions d'emploi, départ, télétravail.",
          guidance: "Preuves : clauses de confidentialité, procédure de départ.",
        },
        {
          clause: "A.7",
          requirement:
            "Mesures physiques : zones sécurisées, contrôle d'accès, protection des équipements.",
          guidance: "Observer les accès et le bureau propre.",
        },
        {
          clause: "A.8",
          requirement:
            "Mesures technologiques : gestion des accès, journalisation, sauvegardes, vulnérabilités, cryptographie.",
          guidance:
            "Preuves : revues d'habilitations, tests de restauration, suivi des correctifs.",
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
