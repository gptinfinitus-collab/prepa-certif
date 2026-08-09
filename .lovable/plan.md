# Prochaines étapes — Audit de finition PREPA CERTIF

## Ce qui est déjà en place

- Authentification : e-mail/mot de passe, Google, Apple ; récupération de mot de passe ; e-mails en français avec la charte PREPA CERTIF.
- Catalogue multi-certifications : ISO 9001, 14001, 45001, 27001, 22000, 50001… avec sélection à la connexion.
- Cursus ISO 45001 complet : cours séquencés (Comprendre → Exemples → Regard de l'auditeur → Preuves → Point examen → Erreurs → Mise en situation → À retenir → Flashcards → Quiz).
- Parcours à niveaux : Maîtrise / Auditeur interne / Lead Auditor (verrouillé).
- Bibliothèque et RAG : upload PDF/texte/MD, nettoyage de filigranes, indexation vectorielle, Assistant IA en streaming avec sources.
- Entraînement IA : QCM et questions ouvertes générées, correction par IA, suivi de la maîtrise par thème.
- Planning configurable : date d'examen, jours de révision, rythme compressé.
- UI responsive : sidebar desktop avec profil en bas, navigation mobile, mode sombre « bleu nuit », typographie Inter, logo ISO-inspired.
- PWA : manifeste, favicon, icônes, invite d'installation.
- Pages légales : CGU, confidentialité, cookies, mentions légales.

## Ce qui reste à implémenter ou à polir

### 1. Finition typographique et cohérence visuelle

Partout dans le code, la classe `font-serif` est encore utilisée alors que la police globale est Inter. Cela fonctionne grâce à un alias CSS, mais c'est sémantiquement faux et source de confusion pour les futures évolutions.

- Remplacer `font-serif` par `font-sans` (ou supprimer la classe quand elle est redondante) dans les composants et routes.
- Vérifier que les titres gardent le même rendu visuel.

### 2. Enrichissement des cursus non-ISO 45001

Les certifications autres qu'ISO 45001 reposent actuellement sur des squelettes HLS. Le lecteur séquencé fonctionne, mais il n'y a pas encore de contenus pédagogiques originaux (objectifs, exemples, regard auditeur, preuves, points examen, erreurs, cas pratiques, flashcards).

- Ajouter des `lesson-extras` pour ISO 9001, 14001, 27001, 22000 et 50001.
- Compléter les quiz et fiches de révision de chaque cursus.
- Adapter les exemples sectoriels à chaque norme.

### 3. Déverrouillage du parcours Lead Auditor

Le niveau Lead Auditor est actuellement verrouillé avec un avertissement. Il faut un mécanisme qui permette à l'utilisateur de choisir son organisme d'examen (PECB, CQI/IRCA, autre) et d'adapter le contenu / les questions.

- Ajouter un profil d'examen dans `profiles` ou une table dédiée.
- Adapter le sélecteur de parcours pour proposer le déverrouillage.
- Ajuster les questions d'entraînement et les mises en situation au format de l'organisme choisi.

### 4. Page de revue des sessions d'entraînement

Les réponses aux quiz sont enregistrées (`quiz_answers`), mais il n'existe pas encore de page pour les relire, filtrer par chapitre ou refaire ses erreurs.

- Créer `/quiz/historique` ou un onglet dans `/quiz`.
- Afficher les questions, la réponse donnée, la réponse attendue et l'explication.
- Ajouter un bouton « Réentraîner mes erreurs » qui génère un nouveau quiz ciblé sur les sujets faibles.

### 5. Onboarding et première expérience

Un nouvel utilisateur arrive directement sur `/auth`, puis `/dashboard`. Le choix de la certification est possible, mais le parcours n'est pas explicitement guidé.

- Ajouter un écran de bienvenue post-première connexion qui invite à choisir la certification, la date d'examen et le niveau de parcours.
- Pré-remplir le planning à partir de ces choix.

### 6. Vérification build, tests et ajustements responsive

- Lancer le build de production pour détecter les erreurs Worker/edge.
- Exécuter les tests unitaires et e2e existants.
- Corriger les éventuelles régressions responsive sur tablette.

## Ordre de priorité proposé

1. **Finition typographique** — rapide, sans risque, améliore la maintenabilité.
2. **Vérification build + tests** — sécurise la base avant d'ajouter du contenu.
3. **Enrichissement des cursus 9001 / 14001 / 27001** — apporte de la valeur aux utilisateurs non-45001.
4. **Revue des sessions d'entraînement** — valorise les données déjà collectées.
5. **Déverrouillage Lead Auditor** — fonctionnalité avancée, demande le plus de réflexion métier.
6. **Onboarding guidé** — améliore la conversion des nouveaux utilisateurs.

## Questions avant de commencer

- Souhaitez-vous que je démarre automatiquement les étapes 1 et 2, puis que je vous présente un plan détaillé pour les suivantes ?
- Quelles certifications souhaitez-vous prioriser pour l'enrichissement de contenu (9001, 14001, 27001, 22000, 50001) ?
- Le parcours Lead Auditor doit-il rester verrouillé pour l'instant, ou souhaitez-vous l'ouvrir avec un choix d'organisme d'examen ?
