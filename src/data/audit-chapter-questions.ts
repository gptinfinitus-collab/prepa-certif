/**
 * Exemples de questions d'entretien par chapitre de check-list (version française).
 *
 * Questions rédigées avec nos propres mots : aucun extrait littéral des normes.
 * Clé de premier niveau : identifiant du modèle. Clé de second niveau : libellé
 * exact du chapitre du modèle correspondant.
 */
export type ChapterQuestionMap = Record<string, Record<string, string[]>>;

export const auditChapterQuestions: ChapterQuestionMap = {
  "iso-45001": {
    "4. Contexte de l'organisme": [
      "Comment avez-vous identifié les enjeux internes et externes qui influencent la santé et la sécurité au travail ?",
      "Qui a participé à cette analyse et quand a-t-elle été revue pour la dernière fois ?",
      "Comment les effets du changement climatique ont-ils été examinés dans cette analyse ?",
      "Quelles parties intéressées avez-vous retenues, et lesquelles de leurs attentes sont devenues des obligations pour vous ?",
      "Montrez-moi le domaine d'application du système : qu'avez-vous inclus, qu'avez-vous exclu et pourquoi ?",
    ],
    "5. Leadership et participation des travailleurs": [
      "Comment la direction démontre-t-elle concrètement son engagement en S&ST au quotidien ?",
      "Comment la politique S&ST a-t-elle été communiquée, et que retiennent les travailleurs ?",
      "Qui est responsable de quoi en S&ST ? Montrez-moi comment ces rôles sont formalisés.",
      "Comment les travailleurs non encadrants participent-ils aux décisions qui les concernent ?",
      "Quels obstacles à la participation avez-vous identifiés, et comment les avez-vous levés ?",
    ],
    "6. Planification": [
      "Comment identifiez-vous les dangers, y compris ceux liés à l'organisation du travail et aux situations d'urgence ?",
      "Montrez-moi comment un danger repéré récemment a été évalué puis traité.",
      "Comment tenez-vous à jour la liste de vos obligations de conformité ?",
      "Quels sont vos objectifs S&ST de l'année, et comment sont-ils déclinés en plans d'actions ?",
      "Comment les changements (nouveau procédé, nouvel équipement) sont-ils planifiés du point de vue S&ST ?",
    ],
    "7. Support": [
      "Quelles ressources ont été allouées à la S&ST cette année ? Montrez-moi une décision d'arbitrage.",
      "Comment déterminez-vous les compétences nécessaires par poste, et comment vérifiez-vous qu'elles sont acquises ?",
      "Comment un nouvel arrivant ou un intérimaire est-il sensibilisé avant sa prise de poste ?",
      "Comment circule l'information S&ST, dans les deux sens, avec les sous-traitants ?",
      "Comment maîtrisez-vous les versions et l'accès aux documents du système ?",
    ],
    "8. Réalisation des activités opérationnelles": [
      "Montrez-moi comment la hiérarchie des mesures de prévention est appliquée sur un risque précis.",
      "Comment maîtrisez-vous les activités confiées à des sous-traitants ou à des prestataires ?",
      "Comment la S&ST est-elle prise en compte lors des achats et de la conception ?",
      "Quels scénarios d'urgence avez-vous identifiés, et quand le dernier exercice a-t-il eu lieu ?",
      "Qu'avez-vous appris du dernier exercice et qu'avez-vous modifié ensuite ?",
    ],
    "9. Évaluation des performances": [
      "Quels indicateurs suivez-vous, et pourquoi ceux-là ?",
      "Comment vérifiez-vous périodiquement le respect de vos obligations de conformité ?",
      "Montrez-moi le programme d'audit interne et les compétences des auditeurs.",
      "Comment les résultats d'audit remontent-ils à la direction ?",
      "Quelles décisions concrètes sont sorties de la dernière revue de direction ?",
    ],
    "10. Amélioration": [
      "Racontez-moi le traitement d'un incident récent, de la déclaration jusqu'à la clôture.",
      "Comment recherchez-vous les causes profondes plutôt que les causes immédiates ?",
      "Comment vérifiez-vous l'efficacité des actions correctives dans le temps ?",
      "Quelles améliorations sont issues des propositions des travailleurs ?",
      "Comment mesurez-vous que le système progresse d'une année sur l'autre ?",
    ],
  },
  "iso-19011": {
    "Programme et déclenchement": [
      "Sur quoi vous êtes-vous appuyé pour définir les objectifs du programme d'audit ?",
      "Comment les risques et opportunités du programme ont-ils été pris en compte ?",
      "Comment choisissez-vous l'étendue et la fréquence des audits ?",
      "Comment est établi le premier contact avec l'audité ?",
    ],
    "Préparation de l'audit": [
      "Comment avez-vous constitué l'équipe d'audit et vérifié ses compétences ?",
      "Montrez-moi la revue documentaire réalisée avant l'audit.",
      "Comment le plan d'audit a-t-il été construit et validé avec l'audité ?",
      "Quelle méthode d'échantillonnage avez-vous retenue et pourquoi ?",
    ],
    "Réalisation sur site": [
      "Comment se déroule la réunion d'ouverture et qu'y annoncez-vous ?",
      "Comment collectez-vous et vérifiez-vous les informations recueillies ?",
      "Comment distinguez-vous un constat d'audit d'une simple observation ?",
      "Comment gérez-vous un désaccord avec l'audité pendant l'audit ?",
    ],
    "Rapport et suivi": [
      "Comment les conclusions sont-elles formulées et argumentées ?",
      "Dans quels délais le rapport est-il diffusé, et à qui ?",
      "Comment le suivi des actions issues de l'audit est-il assuré ?",
      "Comment évaluez-vous la performance des auditeurs et du programme ?",
    ],
  },
  "iso-9001": {
    "4-5. Contexte et leadership": [
      "Comment le contexte et les parties intéressées influencent-ils votre système qualité ?",
      "Montrez-moi la cartographie de vos processus et leurs interactions.",
      "Comment la direction démontre-t-elle son leadership sur la qualité ?",
      "Comment l'orientation client se traduit-elle dans vos décisions ?",
    ],
    "6-7. Planification et support": [
      "Comment identifiez-vous et traitez-vous les risques et opportunités ?",
      "Quels sont vos objectifs qualité et comment leur atteinte est-elle suivie ?",
      "Comment gérez-vous les compétences et les habilitations ?",
      "Comment maîtrisez-vous vos moyens de surveillance et de mesure ?",
    ],
    "8. Réalisation": [
      "Comment revoyez-vous les exigences client avant d'accepter une commande ?",
      "Comment maîtrisez-vous vos fournisseurs et prestataires externes ?",
      "Montrez-moi la traçabilité d'un produit ou service récent.",
      "Comment traitez-vous une non-conformité détectée en production ?",
    ],
    "9-10. Performance et amélioration": [
      "Comment mesurez-vous la satisfaction client, et qu'en faites-vous ?",
      "Montrez-moi le programme d'audit interne et ses résultats.",
      "Quelles décisions sont sorties de la dernière revue de direction ?",
      "Comment vérifiez-vous l'efficacité des actions correctives ?",
    ],
  },
  "iso-14001": {
    "4-5. Contexte et leadership": [
      "Quels enjeux environnementaux externes et internes avez-vous retenus ?",
      "Comment les attentes des riverains et des autorités sont-elles prises en compte ?",
      "Comment la direction porte-t-elle la politique environnementale ?",
      "Quel est le domaine d'application retenu, et pourquoi ?",
    ],
    "6. Planification": [
      "Comment identifiez-vous vos aspects environnementaux et leur significativité ?",
      "Montrez-moi la prise en compte du cycle de vie dans cette analyse.",
      "Comment recensez-vous vos obligations de conformité réglementaire ?",
      "Quels objectifs environnementaux avez-vous fixés et avec quels moyens ?",
    ],
    "7-8. Support et opérations": [
      "Comment les personnes dont le travail a un impact environnemental sont-elles formées ?",
      "Comment maîtrisez-vous les opérations à fort impact et les prestataires ?",
      "Quelles situations d'urgence environnementale avez-vous identifiées ?",
      "Quand le dernier exercice a-t-il eu lieu et qu'en avez-vous tiré ?",
    ],
    "9-10. Performance et amélioration": [
      "Quels indicateurs environnementaux suivez-vous et à quelle fréquence ?",
      "Comment évaluez-vous périodiquement votre conformité réglementaire ?",
      "Comment les écarts environnementaux sont-ils traités jusqu'à la clôture ?",
      "Quelles améliorations concrètes ont été obtenues cette année ?",
    ],
  },
  "iso-27001": {
    "4-6. Cadre du SMSI": [
      "Comment le périmètre du système de management de la sécurité a-t-il été défini ?",
      "Comment identifiez-vous et évaluez-vous les risques de sécurité de l'information ?",
      "Montrez-moi la déclaration d'applicabilité et ses justifications.",
      "Comment le plan de traitement des risques est-il validé et suivi ?",
    ],
    "7-8. Support et opérations": [
      "Comment sensibilisez-vous le personnel à la sécurité de l'information ?",
      "Comment les changements sont-ils évalués du point de vue de la sécurité ?",
      "Comment les risques liés aux fournisseurs sont-ils maîtrisés ?",
      "À quelle fréquence les risques sont-ils réévalués ?",
    ],
    "Annexe A (mesures)": [
      "Comment les droits d'accès sont-ils attribués, revus et retirés ?",
      "Montrez-moi comment les sauvegardes sont testées et restaurées.",
      "Comment détectez-vous et journalisez-vous les événements de sécurité ?",
      "Comment la sécurité physique des locaux sensibles est-elle assurée ?",
    ],
    "9-10. Performance et amélioration": [
      "Quels indicateurs de sécurité suivez-vous et comment sont-ils exploités ?",
      "Montrez-moi le programme d'audit interne du système de sécurité.",
      "Comment un incident de sécurité récent a-t-il été traité ?",
      "Quelles améliorations sont issues de la dernière revue de direction ?",
    ],
  },
};
