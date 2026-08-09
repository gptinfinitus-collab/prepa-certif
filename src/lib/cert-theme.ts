/**
 * Couleur d'accent par certification.
 *
 * Aucune couleur n'est écrite en dur : on ne fournit qu'une teinte (hue) qui
 * alimente le token `--cert-accent` défini dans src/styles.css, lequel garde la
 * luminosité et la saturation du thème (clair et bleu nuit).
 */

const HUES: Record<string, number> = {
  "ISO 9001": 248,
  "ISO 14001": 150,
  "ISO 45001": 72,
  "ISO/IEC 27001": 300,
  "ISO 22000": 120,
  "ISO 50001": 95,
  "ISO 13485": 200,
  "ISO 22301": 20,
  "ISO 37001": 330,
  "ISO 19011": 260,
};

/** Teinte stable dérivée du code de la norme (fallback pour les cursus personnalisés). */
export function certificationHue(code: string | null | undefined): number {
  if (!code) return 72;
  const key = Object.keys(HUES).find((k) => code.toUpperCase().startsWith(k.toUpperCase()));
  if (key) return HUES[key] ?? 72;
  let hash = 0;
  for (let i = 0; i < code.length; i += 1) hash = (hash * 31 + code.charCodeAt(i)) % 360;
  return hash;
}

/** Style à appliquer sur un conteneur pour teinter `bg-cert`, `text-cert`, etc. */
export function certificationAccentStyle(code: string | null | undefined) {
  return { "--cert-hue": String(certificationHue(code)) } as React.CSSProperties;
}
