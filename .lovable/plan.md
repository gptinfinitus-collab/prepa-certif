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

