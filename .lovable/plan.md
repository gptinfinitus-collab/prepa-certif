# Navigation complète sur mobile et tablette

## Constat

Dans `src/components/AppShell.tsx`, la barre latérale est masquée en dessous de 768 px (`hidden … md:flex`). En dessous de ce seuil, seule la barre du bas est affichée, et elle ne contient que 5 entrées sur les 11 disponibles.

Entrées aujourd'hui inaccessibles sur mobile et sur tablette en portrait :
Références ISO, Glossaire, Annexes, Mes certifications, Paramètres, et Administration (compte super admin).

## Ce qui va changer

1. **Menu complet accessible partout.** Un bouton menu apparaît dans l'en-tête mobile, à gauche du logo. Il ouvre un panneau latéral coulissant contenant exactement la même liste que la barre latérale du bureau : les 10 entrées, l'entrée Administration pour les super admins, le sélecteur de certification et la carte profil en bas. La navigation ferme le panneau automatiquement.

2. **Barre du bas repensée.** Elle passe à 5 colonnes : Accueil, Planning, Quiz, Assistant, puis un bouton « Plus » qui ouvre le même panneau. « Docs » rejoint le panneau, où toutes les rubriques sont réunies.

3. **Tablette en portrait.** Le seuil d'affichage de la barre latérale passe de `md` (768 px) à `lg` (1024 px), pour éviter une barre latérale étroite et compressée sur iPad portrait ; sur ces largeurs, l'en-tête, le panneau coulissant et la barre du bas prennent le relais avec la totalité des entrées.

4. **Élément actif.** Le panneau met en évidence la rubrique courante avec le même style que la barre latérale, y compris pour les rubriques absentes de la barre du bas.

## Détails techniques

- Fichier concerné : `src/components/AppShell.tsx` uniquement.
- Extraction d'un composant interne `NavLinks` (liste `navItems` + entrée admin conditionnée par `useIsSuperAdmin`) réutilisé par la barre latérale et par le panneau, pour garder une seule source de vérité.
- Panneau via `Sheet` / `SheetContent side="left"` (`@/components/ui/sheet`, déjà utilisé par l'assistant), état local `menuOpen`, fermeture sur changement de `pathname`.
- Bascule des points de rupture : `md:flex` → `lg:flex` pour l'`aside`, `md:hidden` → `lg:hidden` pour l'en-tête et la barre du bas, `md:pb-0` → `lg:pb-0` pour le `main`, `md:flex` → `lg:flex` sur le conteneur racine, et `md:block` → `lg:block` pour le bouton de repli.
- Aucun changement de données, de routes ni de logique métier.

## Vérification

- Contrôle visuel aux largeurs 390 px, 768 px, 1024 px et 1440 px : accès aux 11 rubriques dans chaque cas.
- Contrôle avec un compte super admin : entrée Administration présente dans le panneau.
- Exécution des tests unitaires et e2e existants.
