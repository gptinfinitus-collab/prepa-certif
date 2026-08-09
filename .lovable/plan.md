# Sidebar : bouton de repli déplacé, logo agrandi, sélecteur épuré

Portée : vue desktop pour le bouton de repli et le logo ; le sélecteur de certification est nettoyé sur desktop et mobile.

## Ce qui change

### 1. Bouton de repli hors de la sidebar
- L'icône de repli disparaît de l'en-tête de la sidebar (à droite de PREPA ISO).
- Elle est placée en haut à gauche de la zone de contenu principale, juste à droite de la sidebar — comme dans le projet de référence.
- Elle reste visible et cliquable que la sidebar soit repliée ou dépliée, avec une icône « panneau » (ouvert/fermé) selon l'état.
- Uniquement en desktop ; l'en-tête mobile ne change pas.

### 2. Logo et libellé
- Logo PREPA ISO agrandi dans l'en-tête de la sidebar.
- Le texte « Préparation à la certification » tient sur **une seule ligne** (pas de retour à la ligne, troncature si nécessaire).
- Le bloc logo + textes est aligné comme sur la référence fournie.

### 3. Sélecteur de certification
- Suppression de l'icône (chapeau de diplômé) devant le nom de la norme.
- Le nom de la norme et sa famille restent, ainsi que le chevron d'ouverture du menu.

## Détails techniques
- `src/components/AppShell.tsx` :
  - retrait du `<Button>` de collapse de l'en-tête de sidebar ; ajout d'un bouton flottant en haut à gauche du conteneur principal (`hidden md:flex`), avec `PanelLeft` / `PanelLeftClose`.
  - agrandissement de `BrandLogo` (`size-7` → `size-9`/`size-10`) et ajustement des largeurs pour laisser la place ; sous-titre en `truncate whitespace-nowrap`.
  - `CertificationSwitcher` : suppression de l'icône `GraduationCap` du déclencheur (l'import reste utilisé par la nav).
- Le padding haut du `<main>` desktop est ajusté pour ne pas passer sous le bouton flottant.
