# Refonte visuelle de la page de connexion (skill « admin-login-page »)

Le skill s'appelle **admin-login-page**. On l'applique ici à la page publique `/auth` de PREPA CERTIF (pas de page admin séparée) : même mise en scène visuelle (halo lumineux, icônes flottantes, carte centrée), mais on garde la logique d'authentification existante.

## Ce qui change

1. **Fond animé** : 12 icônes Lucide thématiques « certification / qualité / audit » (ex. ShieldCheck, FileCheck2, ClipboardCheck, BookOpen, Award, BadgeCheck, Scale, Target, Recycle, Leaf, Lock, GraduationCap), positionnées en absolu, opacité 0.12, tailles 38–64 px, rotations variées.
2. **Halo de marque** : deux dégradés radiaux flous empilés derrière la carte, dont un en pulsation douce, couleur dérivée du token de marque (donc automatiquement adaptée à la certification active et au mode sombre bleu nuit).
3. **Carte** : centrée, `max-w-md`, ombre portée, bordure adoucie, au-dessus du décor.
4. **En-tête** : logo BrandLogo agrandi, titre « PREPA CERTIF », sous-titre inchangé.
5. **Contenu conservé** : boutons Google et Apple, séparateur « ou », onglets Connexion / Créer un compte, message de confirmation e-mail. Ajout d'un bloc d'erreur inline (message + bouton « Réessayer ») et d'un œil afficher/masquer le mot de passe, comme prévu par le skill.
6. **Responsive** : décor masqué ou réduit sous 640 px pour éviter la surcharge sur mobile ; halo conservé.

## Détails techniques

- Fichier modifié : `src/routes/auth.tsx` uniquement (aucune modification de la logique Supabase / Lovable OAuth, du `head()` SEO ni des redirections).
- Le projet utilise des tokens OKLCH dans `src/styles.css` (pas de HSL) : le halo utilisera `color-mix(in oklab, var(--primary) X%, transparent)` au lieu de `hsl(var(--glow) / X)`, et un token `--glow` sera ajouté (clair + sombre) avec repli sur `--primary`.
- Aucune couleur en dur : uniquement `text-primary`, `bg-background`, `bg-card`, tokens sémantiques.
- Validation Zod des champs e-mail / mot de passe avant appel réseau, erreurs affichées sous les champs.
- Vérification visuelle finale en mode clair et mode sombre.
