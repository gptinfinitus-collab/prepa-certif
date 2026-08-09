# E-mails d'authentification en français, à la charte PREPA CERTIF

Aujourd'hui les e-mails (réinitialisation de mot de passe, confirmation d'inscription…) partent d'un expéditeur générique `no-reply@auth.lovable.cloud`, avec le nom « PREPA-45001 » et un contenu en anglais — d'où le classement en spam constaté.

## Ce qui sera fait

1. **Domaine d'envoi**
   Configuration de l'envoi depuis le domaine du projet `prepa-certif.app` (sous-domaine d'envoi dédié, ex. `notify.prepa-certif.app`). Cette étape passe par l'assistant de configuration d'e-mail : je l'affiche à la fin de ce plan, tu le valides, et la vérification DNS se fait automatiquement. Résultat : expéditeur du type « PREPA CERTIF <no-reply@prepa-certif.app> », meilleure délivrabilité, moins de spam.

2. **Modèles d'e-mails personnalisés (6 types)**
   Création des gabarits pour : confirmation d'inscription, lien magique, réinitialisation de mot de passe, invitation, changement d'adresse e-mail, ré-authentification.

3. **Rédaction 100 % française**
   Objets et contenus réécrits en français, ton sobre et professionnel. Exemple pour la réinitialisation :
   - Objet : « Réinitialisation de votre mot de passe — PREPA CERTIF »
   - Corps : « Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau. Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. »
   - Bouton : « Choisir un nouveau mot de passe »

4. **Charte graphique**
   Reprise de l'identité de l'app : logo PREPA CERTIF en en-tête, couleur d'accent bleu nuit du thème, typographie proche d'Inter (polices sûres en e-mail), bouton arrondi à la couleur primaire, pied de page avec le nom de l'éditeur et les liens vers les mentions légales / politique de confidentialité (contenus déjà présents dans l'app).

5. **Nom d'expéditeur**
   Remplacement de « PREPA-45001 » par « PREPA CERTIF » partout.

## Détails techniques

- Génération des gabarits React Email dans `src/lib/email-templates/` + route webhook d'authentification, via l'outil de scaffolding Lovable.
- Styles inline dérivés des jetons OKLCH de `src/styles.css` (fond du corps blanc, accents à la couleur primaire).
- Informations éditeur reprises de `src/lib/legal.ts` (nom, e-mail de contact, URL du site).
- Aucune migration de base de données, aucune file d'attente : l'envoi est géré par l'infrastructure e-mail Lovable.

## Prérequis à valider par toi

La configuration du domaine d'envoi (étape 1) nécessite ta validation dans l'assistant. Les e-mails deviennent actifs une fois la vérification DNS terminée (jusqu'à quelques heures) ; les gabarits peuvent être créés en attendant.
