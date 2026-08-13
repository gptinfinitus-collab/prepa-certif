# Cartes blanches sur fond beige

## Contexte

Sur la page check-list d'audit, le fond de page est beige (`--background: oklch(0.977 0.012 88)`) et les cartes (<Card>) apparaissent crème/translucide au lieu de blanches. Le jeton `--card` vaut `oklch(0.995 0.006 90)` — un blanc chaud très légèrement teinté — et `ComplianceSummary` utilise `bg-card/60` (60 % d'opacité), ce qui laisse le beige transparaître.

## Changements

1. **`src/styles.css` — jeton `--card` (mode clair)** : passer de `oklch(0.995 0.006 90)` à blanc pur `oklch(1 0 0)`. Garde le mode sombre inchangé. Le jeton `--popover` suit le même traitement pour cohérence (`oklch(1 0 0)`).

2. **`src/components/audit/ComplianceSummary.tsx` ligne 30** : remplacer `bg-card/60` par `bg-card` (pleinement opaque).

3. Vérifier que la barre sticky (`bg-card/95` + `supports-[backdrop-filter]:bg-card/80`) reste lisible — la garder translucide avec backdrop-blur (c'est un overlay, pas une carte de contenu).

## Validation

- Recharger la page check-list d'audit en mode clair et confirmer que les cartes `<Card>` et le bloc `ComplianceSummary` sont blanc pur sur le fond beige.
- Vérifier que le mode sombre n'a pas régressé (cartes sur fond bleu nuit).
