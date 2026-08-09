# Refonte visuelle de la page de connexion (skill « admin-login-page »)

Le skill s'appelle **admin-login-page**. On l'applique ici à la page publique `/auth` de PREPA CERTIF (pas de page admin séparée) : même mise en scène visuelle (halo lumineux, icônes flottantes, carte centrée), mais on garde la logique d'authentification existante.

## Ce qui change

1. **Fond animé** : 12 icônes Lucide thématiques « certification / qualité / audit » (ex. ShieldCheck, FileCheck2, ClipboardCheck, BookOpen, Award, BadgeCheck, Scale, Target, Recycle, Leaf, Lock, GraduationCap), positionnées en absolu, opacité 0.12, tailles 38–64 px, rotations variées.
2. **Halo de marque** : deux dégradés radiaux flous empilés derrière la carte, dont un en pulsation douce, couleur dérivée du token de marque (donc automatiquement adaptée à la certification active et au mode sombre bleu nuit).
3. **Carte** : centrée, `max-w-md`, ombre portée, bordure adoucie, au-dessus du décor.
4. **En-tête** : logo BrandLogo agrandi, titre « PREPA CERTIF », sous-titre inchangé.
5. **Boutons sociaux côte à côte** : Google et Apple sur une seule ligne (grille 2 colonnes), chacun avec son logo officiel (SVG Google multicolore, logo Apple monochrome) et un libellé court. Empilés seulement sur très petits écrans si nécessaire.
6. **Œil afficher/masquer** : bouton dans le champ mot de passe (onglets Connexion et Création), icônes Eye / EyeOff, `aria-label` explicite.
7. **Mot de passe oublié** : lien « Mot de passe oublié ? » sous le champ mot de passe en mode Connexion, ouvrant un écran de demande (saisie e-mail + envoi du lien de réinitialisation), avec message de confirmation neutre. Nouvelle page `/reset-password` publique permettant de définir le nouveau mot de passe puis de revenir connecté.
8. **Contenu conservé** : séparateur « ou », onglets Connexion / Créer un compte, message de confirmation d'inscription. Ajout d'un bloc d'erreur inline (message + bouton « Réessayer »).
9. **Responsive** : décor réduit sous 640 px pour éviter la surcharge sur mobile ; halo conservé.

## Détails techniques

- Fichiers : `src/routes/auth.tsx` (refonte visuelle + œil + lien mot de passe oublié), nouveau `src/routes/reset-password.tsx` (route publique, `ssr: false`, `head()` propre), petit composant d'icônes de marque pour les logos Google/Apple.
- Mot de passe oublié : `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" })` ; la page de réinitialisation appelle `supabase.auth.updateUser({ password })` puis redirige vers le tableau de bord.
- Aucune modification de la logique OAuth Lovable existante ni des redirections actuelles.
- Le projet utilise des tokens OKLCH dans `src/styles.css` : le halo utilisera `color-mix(in oklab, var(--primary) X%, transparent)`, et un token `--glow` sera ajouté (clair + sombre) avec repli sur `--primary`.
- Aucune couleur en dur (hors couleurs officielles du logo Google) : tokens sémantiques uniquement.
- Validation Zod des champs e-mail / mot de passe (longueur min. 6, format e-mail) avant appel réseau, erreurs affichées sous les champs.
- Vérification visuelle finale en mode clair et mode sombre.

## Documents légaux

Quatre pages publiques (SSR, indexables, avec `head()` propre : titre, description, og:title, og:description, canonical) :

- `/cgu` — Conditions générales d'utilisation : objet du service, création de compte, usage autorisé, contenus déposés par l'utilisateur (documents de cours), propriété intellectuelle (les textes ISO restent la propriété de l'ISO — usage strictement personnel), limitation de responsabilité (outil de préparation, aucune garantie de réussite ni affiliation avec l'ISO ou IRCA), suspension/résiliation, droit applicable.
- `/confidentialite` — Politique de confidentialité (RGPD) : responsable de traitement, données collectées (compte, profil, documents importés, historique de quiz et de conversations IA), finalités et bases légales, sous-traitants (hébergement/base de données, fournisseur de modèles IA), durées de conservation, droits (accès, rectification, effacement, portabilité, opposition) et adresse de contact, transferts hors UE, sécurité.
- `/cookies` — Politique de cookies : cookies strictement nécessaires (session d'authentification, préférence de thème), absence de traceurs publicitaires.
- `/mentions-legales` — Mentions légales : éditeur, directeur de publication, contact, hébergeur.

Intégration :

- Un fichier partagé `src/lib/legal.ts` centralise les informations de l'éditeur (nom, e-mail de contact, hébergeur, date de dernière mise à jour) pour éviter la duplication.
- Un composant `LegalPage` commun (mise en page lisible `prose`, titre, date de mise à jour, retour à l'accueil) utilisé par les quatre routes.
- Liens vers CGU / Confidentialité sous la carte de connexion, avec mention « En créant un compte, vous acceptez les CGU et la politique de confidentialité ».
- Liens légaux également accessibles depuis la page Paramètres.
- Ajout des quatre URLs au sitemap si un sitemap existe.

Informations à confirmer (des valeurs génériques seront mises en place à défaut) : raison sociale ou nom de l'éditeur, adresse, e-mail de contact RGPD, et nom du directeur de publication.


