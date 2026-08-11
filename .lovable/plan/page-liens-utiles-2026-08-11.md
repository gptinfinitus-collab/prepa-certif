# Page « Liens utiles »

Nouvelle page publique `/liens-utiles` regroupant les ressources externes utiles à la préparation, plus la possibilité pour un utilisateur connecté d'ajouter ses propres liens.

## Contenu curé (visible par tous)

Liens organisés par catégories, chacun avec titre, description courte et bouton d'ouverture dans un nouvel onglet :

- **Normes et textes officiels** — boutique ISO, Online Browsing Platform (ISO/OBP), pages ISO 45001 / 9001 / 14001 / 27001 / 19011, AFNOR.
- **Certification et registres d'auditeurs** — CQI/IRCA (schéma, grades, maintien de certification), PECB, Exemplar Global.
- **Accréditation et règles d'audit** — IAF, ISO/IEC 17021-1, IAF Mandatory Documents.
- **Réglementation S&ST** — OIT, EU-OSHA, INRS, Code du travail (Légifrance).
- **Ressources de préparation** — ISO 45001 Handbook / briefing notes, glossaires, articles de référence.
- **Outils de l'application** — liens internes (Références ISO, Glossaire, Annexes, Journal CPD) pour la navigation.

Chaque lien indique s'il est gratuit ou payant, et un avertissement rappelle que les normes sont sous droit d'auteur.

## Liens personnels (utilisateur connecté)

Section « Mes liens » sous la liste curée :

- Ajouter / modifier / supprimer un lien : titre, URL, catégorie (liste libre parmi les catégories ci-dessus + « Autre »), note facultative.
- Liens strictement privés (visibles uniquement par leur auteur).
- Si l'utilisateur n'est pas connecté : encart invitant à se connecter, sans formulaire.

## Navigation et SEO

- Entrée « Liens utiles » dans la sidebar (après « Annexes ») et dans le menu « Plus » mobile.
- Métadonnées propres à la page (titre, description, Open Graph, canonical `https://prepa-certif.app/liens-utiles`) et ajout au sitemap.

## Détails techniques

- Migration : table `public.user_links` (`user_id`, `title`, `url`, `category`, `note`, timestamps), GRANT `authenticated` + `service_role`, RLS restreignant tout accès à `auth.uid() = user_id`, trigger `set_updated_at()`.
- `src/data/useful-links.ts` : catalogue curé typé (catégorie, titre, url, description, coût).
- `src/lib/useful-links.ts` : hooks TanStack Query (`useUserLinks`, `useUpsertUserLink`, `useDeleteUserLink`) + validation d'URL (http/https uniquement) réutilisable en test.
- `src/components/links/UserLinkDialog.tsx` : formulaire d'ajout/édition (Dialog, sonner pour les retours).
- `src/routes/liens-utiles.tsx` : route publique utilisant `AppShell`, cartes par catégorie, tous les liens externes en `target="_blank" rel="noopener noreferrer"`.
- Mise à jour de `src/components/AppShell.tsx` (navItems + menu mobile) et de `src/routes/sitemap[.]xml.ts`.
- Tests unitaires : validation d'URL et regroupement par catégorie dans `tests/unit/useful-links.test.ts`.
