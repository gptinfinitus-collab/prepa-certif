/**
 * Couleur d'accent par certification.
 *
 * Aucune couleur n'est écrite en dur : on ne fournit qu'une teinte (hue) qui
 * alimente le token `--cert-accent` défini dans src/styles.css, lequel garde la
 * luminosité et la saturation du thème (clair et bleu nuit).
 */

const HUES: Record<string, number> = {
  "9001": 248,
  "14001": 150,
  "45001": 72,
  "27001": 300,
  "22000": 128,
  "50001": 95,
  "13485": 200,
  "22301": 25,
  "37001": 330,
  "19011": 260,
};

/** Teinte stable dérivée du code de la norme (fallback pour les cursus personnalisés). */
export function certificationHue(code: string | null | undefined): number {
  if (!code) return 72;
  const key = Object.keys(HUES).find((k) => code.includes(k));
  if (key) return HUES[key] ?? 72;
  let hash = 0;
  for (let i = 0; i < code.length; i += 1) hash = (hash * 31 + code.charCodeAt(i)) % 360;
  return hash;
}

/** Style à appliquer sur un conteneur pour teinter `bg-cert`, `text-cert`, etc. */
export function certificationAccentStyle(code: string | null | undefined) {
  return { "--cert-hue": String(certificationHue(code)) } as React.CSSProperties;
}
