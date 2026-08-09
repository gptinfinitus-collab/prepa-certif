# Sidebar compacte, profil en bas, typographie Inter

## Ce qui change

### 1. Suppression du header
- Les barres d'en-tête desktop et mobile (titre + avatar) disparaissent.
- Le contenu de chaque page commence directement sous la sidebar / en haut de l'écran.
- Sur mobile, le sélecteur de certification et l'avatar profil restent accessibles : le sélecteur passe en haut du contenu, le profil dans la barre de navigation basse.

### 2. Profil utilisateur en bas de la sidebar
- Carte profil en bas de la sidebar, dans un **cadre carré** au même style que le bloc certification du haut (même bordure, même arrondi, même fond).
- Contenu : photo ronde, prénom + nom, e-mail en dessous, chevron.
- Au clic : menu Profil, Paramètres, bascule mode sombre, Se déconnecter (même menu qu'aujourd'hui).
- En mode replié : seule la photo est visible, centrée.

### 3. Cadre certification (haut)
- Retrait de la bordure gauche colorée (orange/accent) du bloc ISO 45001 ; bordure neutre uniforme, comme le cadre profil. La pastille de couleur de la norme reste via l'icône.

### 4. Bouton replier
- Le bouton « Replier » en bas de sidebar est supprimé.
- Une icône discrète prend sa place **en haut à droite**, sur la ligne du logo PREPA ISO ; elle reste visible et cliquable en mode replié.

### 5. Typographie
- Passage à **Inter** pour tout le texte (corps et titres), chargée via `<link>` dans la racine.
- IBM Plex Serif / Sans retirés.

## Détails techniques
- `src/components/AppShell.tsx` : suppression des deux `<header>`, ajout du bloc profil en pied de sidebar (réutilisation du menu de `UserMenu` transformé pour accepter un déclencheur « carte »), déplacement du toggle collapse dans l'en-tête de sidebar, retrait de `border-l-4 border-l-cert` sur `CertificationSwitcher`.
- `src/components/UserMenu.tsx` : ajout d'une variante « carte sidebar » (avatar + nom + e-mail) en plus de la variante avatar seul, sans changer les entrées du menu.
- `src/routes/__root.tsx` : remplacement des `<link>` IBM Plex par Inter.
- `src/styles.css` : `--font-display` et `--font-body` pointent sur `"Inter"`.
- La prop `title` de `AppShell` devient inutilisée pour l'affichage ; conservée sans rendu pour ne pas toucher chaque route.
