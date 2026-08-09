/**
 * Contenu pédagogique complémentaire du cursus ISO 45001, structuré par séance.
 *
 * Ces données ne sont pas rédigées dans les composants React : elles alimentent
 * le lecteur de cours séquencé (`src/lib/lesson-sections.ts`), qui les assemble
 * dans l'ordre pédagogique imposé.
 *
 * Toutes les formulations sont originales : aucune reproduction du texte
 * protégé des normes ISO.
 */

export interface LessonScenario {
  prompt: string;
  correction: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface LessonExtras {
  /** 3 à 6 compétences visées. */
  objectives?: string[];
  /** Situations concrètes, secteurs variés. */
  examples?: { sector: string; text: string }[];
  /** Ce qu'un auditeur cherche à comprendre ou vérifier. */
  auditorView?: string[];
  /** Preuves possibles : documents, entretiens, observations, données. */
  evidence?: string[];
  /** Notions à forte probabilité de confusion à l'examen. */
  examFocus?: string[];
  /** Interprétations incorrectes fréquentes. */
  commonMistakes?: string[];
  /** Cas pratique court avec correction dépliable. */
  scenario?: LessonScenario;
  /** Idées essentielles (4 à 8). */
  keyPoints?: string[];
  /** Cartes de révision. */
  flashcards?: Flashcard[];
}

export const lessonExtras: Record<number, LessonExtras> = {
  1: {
    objectives: [
      "Expliquer la finalité d'un système de management de la S&ST",
      "Situer ISO 45001 par rapport aux règles techniques de sécurité",
      "Restituer la logique du cycle PDCA et son lien avec les chapitres 4 à 10",
      "Distinguer prévention réactive et prévention proactive",
      "Différencier certification d'un organisme et certification d'une personne",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Une usine remplace ses gants après chaque accident, sans jamais analyser pourquoi les coupures se répètent : de la réaction, pas un système.",
      },
      {
        sector: "BTP",
        text: "Une entreprise analyse les risques de travail en hauteur dès la phase de conception du chantier et adapte le mode opératoire : de la prévention proactive.",
      },
      {
        sector: "Santé",
        text: "Un hôpital traite au même niveau les risques biologiques et la charge psychosociale des soignants, parce que les deux affectent la santé au travail.",
      },
    ],
    auditorView: [
      "L'auditeur cherche à comprendre si la S&ST est pilotée dans la durée ou gérée au coup par coup.",
      "Il observe si la boucle d'amélioration est réellement bouclée : les constats débouchent-ils sur des décisions ?",
    ],
    evidence: [
      "Politique S&ST signée et diffusée",
      "Objectifs S&ST avec échéances et responsables",
      "Comptes rendus de revue de direction",
      "Indicateurs suivis dans le temps, pas seulement le nombre d'accidents",
    ],
    examFocus: [
      "Le PDCA n'est pas une procédure documentée : c'est une logique de fonctionnement.",
      "ISO 45001 est une norme d'exigences ; ISO 45002 et ISO 45003 sont des lignes directrices, non auditables en tant qu'exigences.",
    ],
    commonMistakes: [
      "Croire qu'ISO 45001 ne traite que des accidents, en oubliant les maladies professionnelles et les atteintes à la santé.",
      "Penser qu'un responsable HSE compétent suffit à constituer un système de management.",
      "Confondre la certification de l'organisme et la qualification personnelle d'un auditeur.",
    ],
    scenario: {
      prompt:
        "Une PME affiche un taux d'accidents en baisse depuis trois ans, mais n'a ni objectifs S&ST écrits, ni revue de direction. Le dirigeant estime qu'un système de management serait « de la paperasse ». Que répondez-vous, en vous appuyant sur la logique de la norme ?",
      correction:
        "La baisse observée n'est pas démontrable comme un résultat piloté : sans objectifs ni revue, rien ne prouve que la performance est maîtrisée plutôt que due au hasard ou à une baisse d'activité. La norme n'impose pas de la paperasse mais une boucle : planifier des objectifs, allouer des moyens, mesurer, puis décider. L'enjeu n'est pas le document, c'est la capacité à démontrer et à reproduire le résultat.",
    },
    flashcards: [
      { front: "Que signifie PDCA ?", back: "Plan – Do – Check – Act : planifier, mettre en œuvre, vérifier, agir pour améliorer." },
      { front: "Quels chapitres constituent le cœur auditable d'ISO 45001 ?", back: "Les chapitres 4 à 10. Les chapitres 1 à 3 sont introductifs." },
      { front: "Quelle norme précédait ISO 45001 ?", back: "OHSAS 18001, référentiel britannique, remplacé par ISO 45001 publiée en 2018." },
      { front: "Prévention réactive ou proactive ?", back: "Réactive : agir après l'événement. Proactive : identifier et traiter le danger avant l'événement." },
      { front: "Norme d'exigences ou lignes directrices ?", back: "ISO 45001 = exigences certifiables. ISO 45002 / 45003 = lignes directrices d'aide à la mise en œuvre." },
    ],
  },

  2: {
    objectives: [
      "Distinguer danger et risque S&ST",
      "Différencier incident, accident et presqu'accident",
      "Différencier consultation et participation des travailleurs",
      "Différencier correction et action corrective",
      "Employer correctement les notions de performance et d'efficacité",
    ],
    examples: [
      {
        sector: "Logistique",
        text: "Sol recouvert d'huile (danger) → un cariste traverse la zone (exposition) → glissade (événement) → fracture (conséquence) → le risque s'évalue par probabilité × gravité.",
      },
      {
        sector: "Bureaux",
        text: "Une charge de travail durablement excessive est un danger psychosocial : elle n'entraîne pas d'accident visible, mais bien une atteinte à la santé.",
      },
      {
        sector: "Transport",
        text: "Un chauffeur évite de justesse une collision : aucun dommage, donc presqu'accident — un signal à traiter comme une source d'apprentissage.",
      },
    ],
    auditorView: [
      "L'auditeur teste la maîtrise du vocabulaire par les personnes rencontrées, pas seulement par le responsable HSE.",
      "Il vérifie que l'organisme traite les presqu'accidents et pas uniquement les accidents avec arrêt.",
    ],
    evidence: [
      "Registre des incidents incluant les presqu'accidents",
      "Analyse d'un événement montrant la distinction correction / action corrective",
      "Comptes rendus de consultation des travailleurs et traces de leur participation aux décisions",
    ],
    examFocus: [
      "Un événement indésirable n'implique pas nécessairement un traumatisme ou une pathologie : il peut n'avoir aucune conséquence (presqu'accident).",
      "La consultation recueille un avis ; la participation associe à la décision. Les deux sont exigées, sur des sujets différents.",
      "Une formation ne prouve pas une compétence : la compétence est l'aptitude démontrée à obtenir le résultat attendu.",
    ],
    commonMistakes: [
      "Employer « danger » et « risque » comme synonymes.",
      "Réduire un incident à un accident avec dommage corporel.",
      "Considérer la correction (nettoyer l'huile) comme une action corrective (supprimer la fuite).",
    ],
    scenario: {
      prompt:
        "Après une chute due à une flaque d'huile, l'entreprise a nettoyé le sol, formé l'opérateur et clos le dossier. Le responsable parle d'« action corrective ». Est-ce exact ?",
      correction:
        "Non. Nettoyer la flaque est une correction : le traitement de la conséquence immédiate. Une action corrective supposerait d'identifier la cause de la présence d'huile — fuite de machine, absence de contrôle, procédure de maintenance inadaptée — et d'agir pour empêcher la réapparition. La formation seule ne supprime pas la cause.",
    },
    flashcards: [
      { front: "Danger", back: "Source ayant le potentiel de causer un dommage ou une atteinte à la santé." },
      { front: "Risque S&ST", back: "Combinaison de la probabilité d'un événement dangereux et de la gravité des conséquences." },
      { front: "Presqu'accident", back: "Incident sans dommage effectif, mais qui aurait pu en causer." },
      { front: "Consultation vs participation", back: "Consultation : recueillir un avis avant décision. Participation : associer les travailleurs à la décision." },
      { front: "Correction vs action corrective", back: "Correction : traiter l'effet. Action corrective : supprimer la cause pour éviter la récurrence." },
      { front: "Performance vs efficacité", back: "Performance : résultat mesurable. Efficacité : degré de réalisation des résultats prévus." },
      { front: "Information documentée", back: "Information que l'organisme doit maîtriser et tenir à jour, quel que soit son support." },
    ],
  },

  3: {
    objectives: [
      "Identifier des enjeux internes et externes pertinents pour la S&ST",
      "Déterminer les parties intéressées et leurs exigences applicables",
      "Justifier un domaine d'application cohérent",
      "Relier le contexte aux risques S&ST et aux processus du système",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Un site en zone Seveso retient comme enjeu externe la pression réglementaire et le voisinage ; comme enjeu interne, le vieillissement de ses installations.",
      },
      {
        sector: "Services",
        text: "Une société d'ingénierie identifie le télétravail comme enjeu interne : il modifie l'exposition aux risques et la façon de consulter les travailleurs.",
      },
    ],
    auditorView: [
      "L'auditeur vérifie la cohérence : les enjeux déclarés se retrouvent-ils dans les risques, les objectifs et les décisions ?",
      "Il examine l'exclusion éventuelle d'une activité du domaine d'application et sa justification.",
    ],
    evidence: [
      "Analyse de contexte tenue à jour et datée",
      "Tableau des parties intéressées et de leurs exigences retenues",
      "Déclaration du domaine d'application accessible",
      "Cartographie des processus du système et de leurs interactions",
    ],
    examFocus: [
      "La norme n'impose aucun outil : SWOT, PESTEL ou tableau simple sont acceptables si le résultat est démontré.",
      "Toutes les attentes des parties intéressées ne deviennent pas des obligations : l'organisme décide lesquelles il retient.",
      "Le domaine d'application ne peut pas exclure une activité qui influe sur la S&ST des travailleurs.",
    ],
    commonMistakes: [
      "Confondre parties intéressées et clients.",
      "Rédiger une analyse de contexte générique, sans lien avec les risques réels.",
      "Réduire le domaine d'application à une adresse géographique.",
    ],
    scenario: {
      prompt:
        "Un site exclut de son domaine d'application l'atelier de maintenance, sous-traité à une entreprise extérieure travaillant dans ses murs. Cette exclusion est-elle recevable ?",
      correction:
        "Non. Les sous-traitants intervenant sur le lieu de travail sont sous le contrôle ou l'influence de l'organisme et leur activité affecte la S&ST. Le domaine d'application peut décrire des limites, mais ne peut pas écarter des travailleurs exposés dont l'organisme maîtrise ou influence les conditions de travail.",
    },
    flashcards: [
      { front: "Enjeu interne", back: "Élément propre à l'organisme influant sur sa capacité à atteindre les résultats S&ST : culture, moyens, âge des équipements." },
      { front: "Enjeu externe", back: "Élément de l'environnement de l'organisme : réglementation, marché, climat, voisinage, technologies." },
      { front: "Partie intéressée pertinente", back: "Personne ou organisme pouvant affecter ou être affecté par les décisions S&ST de l'organisme." },
      { front: "Domaine d'application", back: "Périmètre documenté du système : sites, activités, produits et services couverts." },
    ],
  },

  4: {
    objectives: [
      "Décrire les preuves attendues du leadership de la direction",
      "Analyser une politique S&ST au regard des exigences",
      "Distinguer consultation et participation dans les cas prévus par la norme",
      "Vérifier l'attribution des rôles, responsabilités et autorités",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Le directeur de site consacre une heure hebdomadaire à une visite terrain S&ST et arbitre lui-même les investissements de sécurité.",
      },
      {
        sector: "BTP",
        text: "Les compagnons participent à l'élaboration des modes opératoires des travaux en hauteur : ce sont eux qui identifient les contraintes réelles.",
      },
      {
        sector: "Santé",
        text: "Les représentants du personnel sont associés au choix des dispositifs de protection contre les piqûres avant l'achat, pas après.",
      },
    ],
    auditorView: [
      "L'auditeur interroge la direction elle-même : sait-elle citer les risques majeurs et les objectifs du système ?",
      "Il cherche des traces de participation réelle des travailleurs, pas une simple information descendante.",
      "Il vérifie que les travailleurs peuvent signaler un danger sans crainte de représailles.",
    ],
    evidence: [
      "Politique S&ST datée, signée, communiquée et disponible",
      "Comptes rendus de réunions où des décisions S&ST ont été arbitrées par la direction",
      "Fiches de rôles et délégations d'autorité",
      "Comptes rendus de consultation et de participation des travailleurs",
    ],
    examFocus: [
      "Le leadership ne peut pas être délégué : le responsable HSE anime, la direction reste responsable.",
      "La norme distingue explicitement les sujets soumis à consultation de ceux soumis à participation.",
      "L'absence de représailles face au signalement est une exigence, pas une bonne pratique.",
    ],
    commonMistakes: [
      "Considérer la nomination d'un responsable HSE comme la preuve du leadership.",
      "Assimiler l'affichage de la politique à sa communication et à sa compréhension.",
      "Traiter la participation comme une simple réunion d'information.",
    ],
    scenario: {
      prompt:
        "La politique S&ST est affichée dans le hall, mais trois opérateurs interrogés en ignorent le contenu et n'ont jamais été consultés sur l'analyse des risques de leur poste. Quels constats formulez-vous ?",
      correction:
        "Deux pistes de non-conformité distinctes. D'une part, la politique doit être communiquée et comprise au sein de l'organisme : un affichage sans appropriation ne le démontre pas. D'autre part, la participation des travailleurs à l'identification des dangers et à l'appréciation des risques est explicitement exigée ; son absence est un écart structurant, à formuler séparément.",
    },
    flashcards: [
      { front: "Qui porte le leadership S&ST ?", back: "La direction. Elle peut déléguer des tâches, jamais la responsabilité du système." },
      { front: "Trois engagements attendus d'une politique S&ST", back: "Fournir des conditions de travail sûres, éliminer les dangers et réduire les risques, améliorer en continu — avec consultation et participation des travailleurs." },
      { front: "Protection du signalement", back: "Les travailleurs doivent pouvoir signaler dangers et incidents sans crainte de représailles." },
    ],
  },

  5: {
    objectives: [
      "Appliquer la chaîne danger → événement → conséquence → niveau de risque",
      "Appliquer la hiérarchie des mesures de prévention",
      "Distinguer risques S&ST et risques pour le système de management",
      "Formuler des objectifs S&ST mesurables et planifiés",
      "Identifier les exigences légales et autres exigences applicables",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Remplacer un solvant dangereux par un produit moins nocif relève de la substitution, bien plus haut dans la hiérarchie que la distribution de masques.",
      },
      {
        sector: "Logistique",
        text: "Séparer physiquement les flux piétons et chariots est une mesure d'ingénierie ; le marquage au sol seul reste une mesure administrative.",
      },
      {
        sector: "Bureaux",
        text: "Réduire une charge de travail excessive relève de l'organisation, pas d'une formation à la gestion du stress.",
      },
    ],
    auditorView: [
      "L'auditeur vérifie que la hiérarchie des mesures a été réellement examinée avant de retenir l'EPI.",
      "Il contrôle que l'appréciation des risques a été mise à jour après un changement : nouvelle machine, nouveau procédé, nouvelle organisation.",
      "Il vérifie que les objectifs sont assortis de moyens, de responsables et d'échéances.",
    ],
    evidence: [
      "Document d'appréciation des risques daté, avec méthode explicitée",
      "Traces de mise à jour après un changement significatif",
      "Veille réglementaire et évaluation de conformité",
      "Plan d'actions liant objectifs, moyens, responsables et échéances",
    ],
    examFocus: [
      "Ordre de la hiérarchie : élimination, substitution, mesures d'ingénierie, mesures administratives, équipements de protection individuelle.",
      "Les opportunités S&ST ne sont pas des « avantages business » : ce sont des occasions d'améliorer la performance S&ST.",
      "Les risques pour le système (perte de compétence clé, obsolescence de la veille) sont distincts des risques S&ST pour les personnes.",
    ],
    commonMistakes: [
      "Commencer par l'EPI, qui est le dernier niveau de la hiérarchie.",
      "Fixer des objectifs non mesurables du type « améliorer la sécurité ».",
      "Confondre veille réglementaire et évaluation de conformité.",
    ],
    scenario: {
      prompt:
        "Face à un poste bruyant à 92 dB(A), l'entreprise distribue des bouchons d'oreille et forme les opérateurs. Est-ce conforme à la logique de la norme ?",
      correction:
        "Insuffisant en l'état. Rien ne montre que les niveaux supérieurs de la hiérarchie ont été examinés : suppression de la source, remplacement de la machine, encoffrement, traitement acoustique, réduction du temps d'exposition. L'EPI reste acceptable en complément ou en attente, mais la démarche doit démontrer l'examen des mesures plus efficaces en amont.",
    },
    flashcards: [
      { front: "Hiérarchie des mesures", back: "Élimination → substitution → mesures d'ingénierie → mesures administratives → EPI." },
      { front: "Opportunité S&ST", back: "Circonstance pouvant conduire à une amélioration de la performance S&ST." },
      { front: "Objectif S&ST conforme", back: "Cohérent avec la politique, mesurable, suivi, communiqué, avec moyens, responsable et échéance." },
      { front: "Autres exigences", back: "Engagements non réglementaires que l'organisme choisit de respecter : accords, exigences clients, normes internes." },
    ],
  },

  8: {
    objectives: [
      "Distinguer formation, sensibilisation et compétence",
      "Identifier les besoins de communication interne et externe",
      "Appliquer les exigences de maîtrise des informations documentées",
      "Évaluer l'adéquation des ressources allouées au système",
    ],
    examples: [
      {
        sector: "BTP",
        text: "Un opérateur détient une habilitation à jour mais ne sait pas appliquer le mode opératoire du chantier : la compétence n'est pas démontrée.",
      },
      {
        sector: "Santé",
        text: "L'affichage des consignes en français seulement, dans une équipe multilingue, fait échouer la communication interne.",
      },
    ],
    auditorView: [
      "L'auditeur vérifie la compétence sur le terrain, en interrogeant l'opérateur, et pas seulement le certificat en classeur.",
      "Il contrôle la maîtrise documentaire : version en vigueur au poste, périmés retirés.",
    ],
    evidence: [
      "Matrice de compétences et évaluations post-formation",
      "Plan de communication interne et externe",
      "Liste des informations documentées, avec version et diffusion",
      "Budget ou moyens affectés à la S&ST",
    ],
    examFocus: [
      "La compétence est une aptitude démontrée, la formation n'en est qu'un moyen parmi d'autres.",
      "La sensibilisation vise tous les travailleurs ; la compétence vise les fonctions ayant un impact sur la S&ST.",
      "La norme n'impose pas de procédures papier : elle impose la maîtrise des informations documentées nécessaires.",
    ],
    commonMistakes: [
      "Assimiler attestation de formation et compétence.",
      "Multiplier les procédures pour « faire ISO » plutôt que documenter ce qui est nécessaire.",
      "Oublier la communication externe : sous-traitants, visiteurs, autorités.",
    ],
    scenario: {
      prompt:
        "Une entreprise présente un plan de formation complet mais aucun intérimaire n'a reçu d'accueil sécurité, faute de temps. Quelle est votre analyse ?",
      correction:
        "Les intérimaires sont des travailleurs au sens de la norme. L'absence d'accueil sécurité touche à la fois la sensibilisation et la compétence des personnes exposées, et souvent la maîtrise opérationnelle. L'existence d'un plan de formation pour les permanents n'y répond pas : l'écart porte sur la population réellement exposée.",
    },
    flashcards: [
      { front: "Compétence", back: "Aptitude à appliquer connaissances et savoir-faire pour obtenir les résultats attendus." },
      { front: "Sensibilisation", back: "Conscience de la politique, des risques, de sa contribution et des conséquences d'un écart." },
      { front: "Information documentée", back: "Information et son support, que l'organisme doit tenir à jour et maîtriser." },
    ],
  },

  9: {
    objectives: [
      "Décrire les exigences de planification et de maîtrise opérationnelles",
      "Appliquer la hiérarchie des mesures dans la maîtrise des opérations",
      "Maîtriser les changements, la sous-traitance et les achats",
      "Bâtir un dispositif de préparation et de réponse aux situations d'urgence",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Avant l'installation d'une nouvelle ligne, une analyse de risques du changement est conduite et les modes opératoires sont mis à jour.",
      },
      {
        sector: "Logistique",
        text: "Les critères S&ST sont intégrés au cahier des charges de sélection des transporteurs, et vérifiés lors des audits fournisseurs.",
      },
    ],
    auditorView: [
      "L'auditeur suit un changement récent de bout en bout : a-t-il été anticipé ou subi ?",
      "Il vérifie que les exercices d'urgence sont réalisés, évalués et améliorés, y compris avec les sous-traitants présents.",
    ],
    evidence: [
      "Analyses de risques de changement",
      "Contrats et cahiers des charges intégrant des exigences S&ST",
      "Plans d'urgence, comptes rendus d'exercices et actions issues du retour d'expérience",
      "Permis de travail, consignations, modes opératoires",
    ],
    examFocus: [
      "La maîtrise des activités externalisées reste sous la responsabilité de l'organisme.",
      "La gestion du changement inclut les changements temporaires et les changements d'organisation, pas seulement techniques.",
      "Les exercices d'urgence doivent impliquer les parties intéressées pertinentes présentes sur le lieu de travail.",
    ],
    commonMistakes: [
      "Croire qu'externaliser une activité transfère la responsabilité S&ST.",
      "Limiter la gestion du changement aux nouveaux équipements.",
      "Se contenter d'un plan d'urgence écrit, jamais testé.",
    ],
    scenario: {
      prompt:
        "Un exercice d'évacuation annuel est réalisé, mais les prestataires de nettoyage travaillant la nuit n'y ont jamais participé. Quel constat ?",
      correction:
        "Le dispositif d'urgence doit couvrir toutes les personnes présentes sur le lieu de travail, y compris les prestataires et les équipes en horaires décalés. Un exercice qui exclut structurellement une population exposée ne démontre pas la capacité de réponse de l'organisme.",
    },
    flashcards: [
      { front: "Maîtrise opérationnelle", back: "Ensemble des dispositions garantissant que les activités sont réalisées dans les conditions S&ST prévues." },
      { front: "Gestion du changement", back: "Analyse préalable des conséquences S&ST des changements permanents ou temporaires." },
      { front: "Externalisation", back: "L'organisme conserve la responsabilité de la S&ST des activités qu'il externalise et doit en définir la maîtrise." },
    ],
  },

  10: {
    objectives: [
      "Construire un dispositif de surveillance et de mesure pertinent",
      "Distinguer indicateurs réactifs et indicateurs proactifs",
      "Décrire l'évaluation de conformité aux exigences légales",
      "Situer le rôle de l'audit interne et de la revue de direction",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Suivre le taux de réalisation des visites terrain (proactif) en plus du taux de fréquence des accidents (réactif).",
      },
      {
        sector: "Services",
        text: "Mesurer le délai moyen de traitement des signalements de danger : un indicateur simple et très parlant en audit.",
      },
    ],
    auditorView: [
      "L'auditeur regarde si les données mesurées servent à décider, ou seulement à alimenter un tableau.",
      "Il vérifie l'étalonnage ou la vérification des équipements de mesure lorsque la fiabilité des données en dépend.",
      "Il consulte les entrées et sorties de revue de direction pour vérifier la boucle décisionnelle.",
    ],
    evidence: [
      "Tableau de bord S&ST avec périodicité et responsables",
      "Évaluation de conformité réglementaire datée",
      "Programme et rapports d'audit interne",
      "Compte rendu de revue de direction avec décisions et ressources",
    ],
    examFocus: [
      "L'évaluation de conformité est une exigence distincte de la veille réglementaire.",
      "Un indicateur uniquement réactif ne permet pas de démontrer une prévention proactive.",
      "L'audit interne doit être conduit avec objectivité et impartialité : l'auditeur n'audite pas son propre travail.",
    ],
    commonMistakes: [
      "Réduire l'évaluation des performances au taux de fréquence.",
      "Confondre revue de direction et réunion d'équipe HSE.",
      "Faire auditer un processus par son propre pilote.",
    ],
    scenario: {
      prompt:
        "La revue de direction se tient chaque année et son compte rendu liste les indicateurs, sans aucune décision ni allocation de ressources. Est-ce suffisant ?",
      correction:
        "Non. La revue de direction doit produire des sorties : décisions sur les opportunités d'amélioration, les besoins de changement du système et les ressources nécessaires. Un compte rendu purement descriptif ne démontre pas que la direction pilote le système.",
    },
    flashcards: [
      { front: "Indicateur réactif", back: "Mesure d'un événement déjà survenu : accidents, jours d'arrêt, maladies déclarées." },
      { front: "Indicateur proactif", back: "Mesure d'une action de prévention menée en amont : visites, causeries, actions soldées, presqu'accidents traités." },
      { front: "Évaluation de conformité", back: "Vérification périodique et documentée du respect des exigences légales et autres exigences." },
      { front: "Impartialité de l'audit interne", back: "L'auditeur ne doit pas auditer ses propres activités." },
    ],
  },

  11: {
    objectives: [
      "Traiter un incident ou une non-conformité selon la logique de la norme",
      "Conduire une analyse de cause profonde",
      "Distinguer correction, action corrective et amélioration continue",
      "Démontrer l'efficacité d'une action corrective",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Cinq « pourquoi » successifs montrent qu'un carter manquant vient d'un mode opératoire de maintenance sans étape de remontage contrôlée.",
      },
      {
        sector: "BTP",
        text: "La répétition de chutes de plain-pied conduit à revoir l'organisation du stockage, pas seulement à rappeler la consigne de rangement.",
      },
    ],
    auditorView: [
      "L'auditeur suit une non-conformité de bout en bout : détection, correction, analyse de cause, action, vérification de l'efficacité.",
      "Il repère les actions correctives répétitives, signe que la cause réelle n'a pas été traitée.",
    ],
    evidence: [
      "Fiches d'incident et de non-conformité",
      "Analyses de cause (5 pourquoi, arbre des causes, Ishikawa)",
      "Plans d'action avec vérification d'efficacité",
      "Preuve de mise à jour de l'appréciation des risques après l'événement",
    ],
    examFocus: [
      "Une action corrective sans vérification d'efficacité reste incomplète.",
      "L'amélioration continue ne se limite pas au traitement des écarts : elle inclut la recherche proactive de progrès.",
      "Un incident sans dommage doit aussi déclencher l'examen des causes.",
    ],
    commonMistakes: [
      "Clore une non-conformité dès que la correction est faite.",
      "Désigner « l'erreur humaine » comme cause profonde.",
      "Oublier de mettre à jour l'appréciation des risques après l'événement.",
    ],
    scenario: {
      prompt:
        "Une même non-conformité sur le port des EPI est ouverte, traitée et clôturée trois fois en un an, avec à chaque fois « rappel de la consigne » comme action. Quel constat ?",
      correction:
        "La récurrence démontre que l'analyse de cause n'a pas abouti : le rappel de consigne est une correction, pas une action corrective. Il faut explorer les causes organisationnelles — EPI inconfortable, indisponible, incompatible avec la tâche, contrôle inexistant. L'écart porte sur l'efficacité du processus d'action corrective, pas seulement sur le port des EPI.",
    },
    flashcards: [
      { front: "Non-conformité", back: "Non-satisfaction d'une exigence." },
      { front: "Cause profonde", back: "Cause organisationnelle ou systémique dont la suppression empêche la récurrence." },
      { front: "Efficacité d'une action corrective", back: "Vérifiée quand la cause a disparu et que l'écart ne se reproduit plus sur une période pertinente." },
    ],
  },

  12: {
    objectives: [
      "Situer ISO 19011 par rapport à ISO 45001",
      "Restituer les principes de l'audit",
      "Distinguer programme d'audit et audit individuel",
      "Comprendre l'approche par les risques appliquée à l'audit",
    ],
    examples: [
      {
        sector: "Multi-secteurs",
        text: "Un programme d'audit annuel planifie six audits internes ; chacun d'eux constitue un audit distinct avec son propre plan.",
      },
    ],
    auditorView: [
      "L'auditeur applique l'approche fondée sur des preuves : un constat non étayé ne tient pas.",
      "L'indépendance se démontre par l'organisation du programme, pas par une déclaration.",
    ],
    evidence: [
      "Programme d'audit annuel avec périmètres et échéances",
      "Plans d'audit individuels",
      "Rapports d'audit et preuves collectées",
    ],
    examFocus: [
      "ISO 19011:2026 est un guide de lignes directrices, non une norme d'exigences certifiable.",
      "Les principes : intégrité, présentation impartiale, conscience professionnelle, confidentialité, indépendance, approche fondée sur des preuves, approche par les risques.",
      "Les audits de certification étape 1 et étape 2 et la classification majeure / mineure des non-conformités relèvent d'ISO/IEC 17021-1, pas d'ISO 19011.",
    ],

    commonMistakes: [
      "Traiter ISO 19011 comme une norme auditable en exigences.",
      "Confondre programme d'audit (le pilotage global) et audit (l'intervention).",
    ],
    scenario: {
      prompt:
        "Un responsable qualité affirme que son audit interne est conforme parce qu'il suit « les exigences d'ISO 19011 ». Que corrigez-vous ?",
      correction:
        "ISO 19011 fournit des lignes directrices, pas des exigences certifiables. L'exigence d'audit interne provient d'ISO 45001, chapitre 9.2 ; ISO 19011 aide à la mettre en œuvre. La formulation est à corriger, même si la pratique peut être bonne.",
    },
    flashcards: [
      { front: "ISO 19011:2026", back: "Lignes directrices pour l'audit des systèmes de management. Pas une norme d'exigences certifiable." },

      { front: "Programme d'audit", back: "Ensemble des audits planifiés sur une période donnée pour un objectif défini." },
      { front: "Approche fondée sur des preuves", back: "Les conclusions d'audit reposent sur des preuves vérifiables, obtenues par échantillonnage." },
    ],
  },

  13: {
    objectives: [
      "Distinguer audits de première, deuxième et tierce partie",
      "Choisir les méthodes de collecte adaptées à l'objectif",
      "Construire un échantillonnage défendable",
      "Adapter la méthode à l'audit à distance",
    ],
    examples: [
      {
        sector: "Multi-secteurs",
        text: "Audit interne (1re partie), audit d'un fournisseur (2e partie), audit de certification par un organisme accrédité (3e partie).",
      },
      {
        sector: "Services",
        text: "Un audit à distance par visioconférence convient à la revue documentaire, beaucoup moins à l'observation d'un poste de travail.",
      },
    ],
    auditorView: [
      "Croiser les méthodes : un entretien seul ne suffit jamais à établir un constat solide.",
      "Documenter l'échantillon retenu pour rendre le constat reproductible.",
    ],
    evidence: [
      "Notes d'audit horodatées",
      "Documents consultés, avec référence et version",
      "Observations terrain datées et localisées",
    ],
    examFocus: [
      "L'audit de certification est un audit de tierce partie, jamais de deuxième partie.",
      "L'échantillonnage implique un risque résiduel assumé : l'audit ne garantit pas l'absence totale d'écart.",
    ],
    commonMistakes: [
      "Appeler « audit » une simple visite d'inspection.",
      "Fonder un constat sur une seule source déclarative.",
    ],
    scenario: {
      prompt:
        "Lors d'un audit à distance, l'auditeur conclut à la maîtrise du port des EPI sur la base des photos envoyées par l'audité. Est-ce acceptable ?",
      correction:
        "Fragile. Les preuves fournies par l'audité, non horodatées ni contextualisées, ne permettent pas de conclure sur une pratique quotidienne. Il faut croiser : entretiens avec des opérateurs, enregistrements de contrôles, visite en direct par caméra, ou reporter cette partie à un audit sur site.",
    },
    flashcards: [
      { front: "Audit de 1re partie", back: "Audit interne, réalisé par ou pour l'organisme lui-même." },
      { front: "Audit de 2e partie", back: "Audit réalisé par une partie ayant un intérêt : client, donneur d'ordre, chez un fournisseur." },
      { front: "Audit de 3e partie", back: "Audit par un organisme externe indépendant, notamment pour la certification." },
      { front: "Méthodes de collecte", back: "Entretiens, observation, examen documentaire, analyse de données." },
    ],
  },

  15: {
    objectives: [
      "Identifier les qualités personnelles attendues d'un auditeur",
      "Adopter une posture professionnelle en situation difficile",
      "Formuler des questions ouvertes efficaces",
      "Gérer la confidentialité et les conflits d'intérêts",
    ],
    examples: [
      {
        sector: "Multi-secteurs",
        text: "Face à un audité sur la défensive, reformuler et revenir au fait observé désamorce mieux qu'insister sur l'écart.",
      },
      {
        sector: "Santé",
        text: "Un auditeur confronté à une information médicale nominative doit s'abstenir de la consigner dans son rapport.",
      },
    ],
    auditorView: [
      "L'auditeur écoute plus qu'il ne parle : l'objectif est de comprendre le fonctionnement réel.",
      "Il sépare le fait constaté de l'interprétation et de la personne.",
    ],
    evidence: [
      "Déclarations d'indépendance et d'absence de conflit d'intérêts",
      "Engagements de confidentialité",
      "Évaluations d'auditeurs et maintien de compétence",
    ],
    examFocus: [
      "L'auditeur constate des écarts par rapport à des exigences ; il ne propose pas les solutions, sauf mandat explicite de conseil.",
      "L'impartialité impose de ne pas auditer une activité dont on a été responsable récemment.",
    ],
    commonMistakes: [
      "Adopter une posture de contrôleur ou de policier.",
      "Rédiger un constat visant une personne plutôt qu'un processus.",
      "Donner des solutions pendant un audit de certification.",
    ],
    scenario: {
      prompt:
        "Un audité vous confie une tension interne entre deux services et vous demande de ne pas en parler. L'information éclaire un dysfonctionnement du système. Que faites-vous ?",
      correction:
        "La confidentialité protège la source, pas le dysfonctionnement. On ne consigne ni le nom ni le propos, mais on cherche une preuve objective indépendante — comptes rendus, retards de traitement, écarts constatés — permettant, si elle existe, de formuler un constat fondé sur des faits vérifiables.",
    },
    flashcards: [
      { front: "Posture d'auditeur", back: "Écoute active, questions ouvertes, factualité, absence de jugement sur les personnes." },
      { front: "Conflit d'intérêts", back: "Situation compromettant l'impartialité : auditer son propre travail, son service, un proche." },
      { front: "Confidentialité", back: "Les informations recueillies ne sont utilisées que pour les besoins de l'audit." },
    ],
  },

  16: {
    objectives: [
      "Définir objectif, périmètre et critères d'un audit",
      "Construire un plan d'audit réaliste",
      "Préparer une revue documentaire utile",
      "Bâtir une checklist orientée preuves plutôt que clauses",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "Le plan prévoit d'auditer l'atelier au moment du changement d'équipe, précisément parce que c'est un moment critique.",
      },
      {
        sector: "BTP",
        text: "La revue documentaire préalable révèle une analyse des risques non mise à jour depuis deux ans : la piste d'audit est identifiée avant d'arriver sur site.",
      },
    ],
    auditorView: [
      "Une bonne préparation transforme la checklist en fil conducteur, pas en questionnaire fermé.",
      "Le plan doit prévoir des marges : les pistes intéressantes apparaissent en cours d'audit.",
    ],
    evidence: [
      "Plan d'audit diffusé et accepté",
      "Critères d'audit explicités",
      "Checklist ou fil conducteur préparé",
      "Analyse documentaire préalable",
    ],
    examFocus: [
      "Critères d'audit ≠ objectifs d'audit : les critères sont les référentiels de comparaison.",
      "Le périmètre doit préciser sites, activités, processus et période couverts.",
    ],
    commonMistakes: [
      "Construire une checklist qui recopie les clauses.",
      "Planifier un audit sans tenir compte des horaires réels d'activité.",
      "Oublier de faire valider le plan par l'audité.",
    ],
    scenario: {
      prompt:
        "Le plan d'audit prévoit deux heures pour auditer trois ateliers, la maintenance et les achats. Quel risque identifiez-vous ?",
      correction:
        "Le temps alloué ne permet pas de collecter des preuves suffisantes : l'échantillonnage devient trop faible pour fonder des conclusions. Il faut soit réduire le périmètre, soit augmenter la durée, soit renforcer l'équipe d'audit. Un audit non réalisable dans le temps imparti compromet la fiabilité de ses conclusions.",
    },
    flashcards: [
      { front: "Objectif d'audit", back: "Ce que l'audit cherche à établir : conformité, efficacité, aptitude à atteindre les résultats." },
      { front: "Critères d'audit", back: "Référentiels de comparaison : norme, exigences légales, procédures internes, contrat." },
      { front: "Périmètre d'audit", back: "Étendue et limites : sites, activités, processus, période." },
    ],
  },

  17: {
    objectives: [
      "Conduire une réunion d'ouverture efficace",
      "Collecter des preuves par entretien, observation et documents",
      "Gérer le temps et les imprévus pendant l'audit",
      "Préparer et animer la réunion de clôture",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "En suivant un opérateur sur son poste, l'auditeur constate un écart entre le mode opératoire écrit et la pratique réelle.",
      },
      {
        sector: "Logistique",
        text: "Un document présenté comme « à jour » porte une date de révision dépassée : la preuve documentaire se vérifie, elle ne se croit pas.",
      },
    ],
    auditorView: [
      "Auditer le flux réel plutôt que l'organigramme : suivre un produit, un incident, une personne.",
      "Annoncer les constats en clôture sans surprise : ils ont été confirmés au fil de l'audit.",
    ],
    evidence: [
      "Feuille de présence des réunions d'ouverture et de clôture",
      "Notes de terrain datées",
      "Références précises des documents examinés",
    ],
    examFocus: [
      "La réunion de clôture présente les constats et les conclusions, pas une négociation des écarts.",
      "Tout constat doit avoir été confirmé auprès de l'audité avant la clôture.",
    ],
    commonMistakes: [
      "Découvrir un écart majeur en clôture sans l'avoir vérifié avec l'audité.",
      "Passer l'audit en salle, sans observation terrain.",
      "Négocier la gravité d'un constat pour éviter un conflit.",
    ],
    scenario: {
      prompt:
        "En réunion de clôture, l'audité conteste un écart en produisant un document jamais présenté pendant l'audit. Que faites-vous ?",
      correction:
        "On examine la preuve : si elle est recevable, datée et cohérente avec la période auditée, le constat est retiré ou reformulé. Sinon, il est maintenu. Le principe d'approche fondée sur des preuves prévaut : ni entêtement, ni complaisance, mais analyse factuelle tracée dans le rapport.",
    },
    flashcards: [
      { front: "Réunion d'ouverture", back: "Confirme le plan, les critères, la logistique, les règles de confidentialité et de sécurité." },
      { front: "Réunion de clôture", back: "Présente constats et conclusions, précise les suites et les délais de réponse." },
      { front: "Audit du flux réel", back: "Suivre une activité, un incident ou un produit de bout en bout plutôt que clause par clause." },
    ],
  },

  18: {
    objectives: [
      "Rédiger un constat factuel, précis et vérifiable",
      "Classer un écart en non-conformité majeure ou mineure",
      "Distinguer non-conformité, observation et point sensible",
      "Rédiger un rapport d'audit exploitable",
    ],
    examples: [
      {
        sector: "Industrie",
        text: "« Sur les 8 fiches d'analyse d'incident examinées, 5 ne comportent aucune analyse de cause » : fait, échantillon, exigence.",
      },
      {
        sector: "Services",
        text: "« Le personnel semble peu impliqué » n'est pas un constat : c'est une impression, non vérifiable.",
      },
    ],
    auditorView: [
      "Un bon constat contient le fait observé, la preuve, l'exigence non satisfaite, et rien d'autre.",
      "La gravité se juge sur l'effet systémique et le risque, pas sur l'agacement ressenti.",
    ],
    evidence: [
      "Fiches d'écart complètes",
      "Rapport d'audit diffusé dans les délais",
      "Suivi des réponses de l'audité et des plans d'action",
    ],
    examFocus: [
      "Majeure : défaillance systémique, absence totale d'un processus exigé, ou risque grave immédiat.",
      "Mineure : écart isolé n'entraînant pas la défaillance du système.",
      "Une observation n'est pas un écart : elle ne peut pas exiger d'action corrective.",
    ],
    commonMistakes: [
      "Écrire un constat sous forme de solution : « il faudrait former les opérateurs ».",
      "Citer la clause sans décrire le fait observé.",
      "Transformer une accumulation de mineures en majeure sans le justifier.",
    ],
    scenario: {
      prompt:
        "Formulez correctement ce constat : « Les nouveaux arrivants ne sont pas bien accueillis, la sécurité n'est pas prise au sérieux. »",
      correction:
        "Exemple de reformulation : « Sur 6 intérimaires arrivés depuis 3 mois, aucun enregistrement d'accueil sécurité n'a pu être présenté (échantillon du 12/03, registre du personnel). L'exigence de sensibilisation des travailleurs n'est pas satisfaite. » Le constat cite le fait, l'échantillon, la preuve et l'exigence, sans jugement de valeur ni solution.",
    },
    flashcards: [
      { front: "Structure d'un constat", back: "Fait observé + preuve/échantillon + exigence non satisfaite." },
      { front: "Non-conformité majeure", back: "Défaillance systémique, absence d'un processus exigé, ou risque grave pour la santé et la sécurité." },
      { front: "Non-conformité mineure", back: "Écart ponctuel n'affectant pas la capacité globale du système." },
      { front: "Observation", back: "Point d'attention ou piste d'amélioration ; n'appelle pas d'action corrective obligatoire." },
    ],
  },

  19: {
    objectives: [
      "Mobiliser l'ensemble du parcours sur un cas réaliste",
      "Collecter et hiérarchiser des preuves",
      "Rédiger des constats classés et défendables",
    ],
    auditorView: [
      "Traiter le cas comme un audit réel : périmètre, échantillon, preuves, puis rédaction.",
      "Se relire en se demandant : un tiers pourrait-il rejouer ce constat avec les mêmes preuves ?",
    ],
    examFocus: [
      "Les épreuves pratiques valorisent la qualité de rédaction du constat autant que sa détection.",
    ],
  },
};

export function getLessonExtras(moduleId: number): LessonExtras {
  return lessonExtras[moduleId] ?? {};
}
