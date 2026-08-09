# Sidebar compacte, profil en bas, typographie Inter (vue desktop)

Portée : ces changements concernent uniquement l'affichage desktop. La vue mobile (en-tête compact + barre de navigation basse) reste inchangée, sauf la police qui devient Inter partout.

## Ce qui change

### 1. Suppression du header desktop
- La barre d'en-tête desktop (titre de page + avatar) disparaît.
- Le contenu de chaque page commence directement en haut de la zone principale, à droite de la sidebar.


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

### 5. Typographie (toutes les vues)
- Passage à **Inter** pour tout le texte (corps et titres), sur desktop **et** mobile, chargée via `<link>` dans la racine.
- IBM Plex Serif / Sans retirés.

### 6. En-tête mobile
- L'en-tête mobile affiche toujours le nom de l'application (**PREPA ISO**), jamais le titre de la page en cours.
- Le reste de l'en-tête mobile (avatar profil, sélecteur de certification) et la barre de navigation basse ne changent pas.

## Détails techniques
- `src/components/AppShell.tsx` : suppression du `<header>` desktop uniquement (l'en-tête mobile et la bottom-nav restent), ajout du bloc profil en pied de sidebar (réutilisation du menu de `UserMenu` via un déclencheur « carte »), déplacement du toggle collapse dans l'en-tête de sidebar, retrait de `border-l-4 border-l-cert` sur `CertificationSwitcher`, en-tête mobile figé sur « PREPA ISO ».
- `src/components/UserMenu.tsx` : ajout d'une variante « carte sidebar » (avatar + nom + e-mail) en plus de la variante avatar seul, sans changer les entrées du menu.
- `src/routes/__root.tsx` : remplacement des `<link>` IBM Plex par Inter.
- `src/styles.css` : `--font-display` et `--font-body` pointent sur `"Inter"`.
- La prop `title` de `AppShell` n'est plus rendue nulle part ; conservée pour ne pas toucher chaque route.
